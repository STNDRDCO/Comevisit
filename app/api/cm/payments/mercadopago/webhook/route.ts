import {createHmac,timingSafeEqual} from 'crypto';
import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const MP='https://api.mercadopago.com';

function validSignature(req:NextRequest,dataId:string,secret:string){
  const sig=req.headers.get('x-signature')||'';const requestId=req.headers.get('x-request-id')||'';
  const parts=Object.fromEntries(sig.split(',').map(p=>p.trim().split('=',2)).filter(x=>x.length===2));const ts=parts.ts;const v1=parts.v1;if(!ts||!v1)return false;
  const manifest=[dataId&&`id:${dataId};`,requestId&&`request-id:${requestId};`,ts&&`ts:${ts};`].filter(Boolean).join('');
  const digest=createHmac('sha256',secret).update(manifest).digest('hex');
  try{return timingSafeEqual(Buffer.from(digest,'hex'),Buffer.from(v1,'hex'))}catch{return false}
}

export async function POST(req:NextRequest){
  const secret=process.env.MERCADOPAGO_WEBHOOK_SECRET;const mpToken=process.env.MERCADOPAGO_ACCESS_TOKEN;const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!secret||!mpToken||!service)return NextResponse.json({error:'payments_not_configured'},{status:503});
  const body=await req.json().catch(()=>({})) as {type?:string;data?:{id?:string|number};action?:string};
  const dataId=String(req.nextUrl.searchParams.get('data.id')||body?.data?.id||'');
  if(!dataId)return NextResponse.json({ok:true,ignored:'no_data_id'});
  if(!validSignature(req,dataId,secret))return NextResponse.json({error:'invalid_signature'},{status:401});
  if(body.type&&body.type!=='payment')return NextResponse.json({ok:true,ignored:'not_payment'});

  const payRes=await fetch(`${MP}/v1/payments/${encodeURIComponent(dataId)}`,{headers:{Authorization:`Bearer ${mpToken}`},cache:'no-store'});
  if(!payRes.ok)return NextResponse.json({error:'payment_lookup_failed'},{status:502});
  const payment=await payRes.json();
  const topupId=String(payment.external_reference||payment.metadata?.cm_topup_id||'');
  if(!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(topupId))return NextResponse.json({ok:true,ignored:'not_cm_topup'});
  const adminHeaders={apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json'};
  const topRes=await fetch(`${SUPABASE_URL}/rest/v1/cm_payment_topups?select=id,user_id,amount_minor,currency,status,payment_id&id=eq.${encodeURIComponent(topupId)}&limit=1`,{headers:adminHeaders,cache:'no-store'});
  const topups=topRes.ok?await topRes.json():[];const topup=topups[0];if(!topup)return NextResponse.json({ok:true,ignored:'topup_not_found'});
  if(payment.currency_id!=='ARS'||Math.round(Number(payment.transaction_amount||0))!==Number(topup.amount_minor))return NextResponse.json({error:'payment_amount_mismatch'},{status:409});

  if(payment.status==='approved'){
    const approve=await fetch(`${SUPABASE_URL}/rest/v1/rpc/cm_approve_topup`,{method:'POST',headers:adminHeaders,body:JSON.stringify({p_topup_id:topupId,p_payment_id:String(payment.id),p_live_mode:Boolean(payment.live_mode)}),cache:'no-store'});
    if(!approve.ok)return NextResponse.json({error:'wallet_credit_failed',detail:(await approve.text()).slice(0,250)},{status:502});
  }else if(['rejected','cancelled'].includes(payment.status)){
    await fetch(`${SUPABASE_URL}/rest/v1/cm_payment_topups?id=eq.${encodeURIComponent(topupId)}&status=eq.pending`,{method:'PATCH',headers:{...adminHeaders,Prefer:'return=minimal'},body:JSON.stringify({status:payment.status==='cancelled'?'cancelled':'rejected',payment_id:String(payment.id),live_mode:Boolean(payment.live_mode),updated_at:new Date().toISOString()}),cache:'no-store'});
  }
  return NextResponse.json({ok:true,status:payment.status});
}
