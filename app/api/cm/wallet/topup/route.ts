import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const MP='https://api.mercadopago.com';
const base={apikey:SUPABASE_KEY,'Content-Type':'application/json'};
async function userFor(token:string){const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`},cache:'no-store'});if(!r.ok)return null;const u=await r.json();return u?.id?u:null}

export async function POST(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return NextResponse.json({error:'auth_required'},{status:401});const user=await userFor(token);if(!user)return NextResponse.json({error:'invalid_session'},{status:401});
  const body=await req.json().catch(()=>null) as null|{amount?:number};const amount=Math.round(Number(body?.amount||0));if(amount<1000||amount>2000000)return NextResponse.json({error:'invalid_amount'},{status:400});
  const mpToken=process.env.MERCADOPAGO_ACCESS_TOKEN;const webhookSecret=process.env.MERCADOPAGO_WEBHOOK_SECRET;const serviceRole=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!mpToken||!webhookSecret||!serviceRole)return NextResponse.json({error:'payments_not_configured',missing:[!mpToken&&'MERCADOPAGO_ACCESS_TOKEN',!webhookSecret&&'MERCADOPAGO_WEBHOOK_SECRET',!serviceRole&&'SUPABASE_SERVICE_ROLE_KEY'].filter(Boolean)},{status:503});
  const adminHeaders={apikey:serviceRole,Authorization:`Bearer ${serviceRole}`,'Content-Type':'application/json'};
  const create=await fetch(`${SUPABASE_URL}/rest/v1/rpc/cm_create_topup_admin`,{method:'POST',headers:adminHeaders,body:JSON.stringify({p_user_id:user.id,p_amount_minor:amount}),cache:'no-store'});
  if(!create.ok)return NextResponse.json({error:'topup_create_failed',detail:(await create.text()).slice(0,250)},{status:502});
  const topup=await create.json();
  const appUrl=(process.env.NEXT_PUBLIC_APP_URL||'https://comevisit.vercel.app').replace(/\/$/,'');
  const preference={items:[{id:'cm_ojo_balance',title:'Saldo CHE, MIRÁ · Ojo Acá',description:'Saldo para competir por atención patrocinada en Ojo Acá',quantity:1,currency_id:'ARS',unit_price:amount}],payer:user.email?{email:user.email}:undefined,external_reference:topup.id,metadata:{cm_topup_id:topup.id},back_urls:{success:`${appUrl}/che-mira-v5/wallet?payment=success`,pending:`${appUrl}/che-mira-v5/wallet?payment=pending`,failure:`${appUrl}/che-mira-v5/wallet?payment=failure`},auto_return:'approved',notification_url:`${appUrl}/api/cm/payments/mercadopago/webhook`};
  const mpRes=await fetch(`${MP}/checkout/preferences`,{method:'POST',headers:{Authorization:`Bearer ${mpToken}`,'Content-Type':'application/json','X-Idempotency-Key':topup.id},body:JSON.stringify(preference),cache:'no-store'});
  const mpData=await mpRes.json().catch(()=>({}));if(!mpRes.ok)return NextResponse.json({error:'mercadopago_preference_failed',detail:mpData},{status:502});
  const checkout=mpData.init_point||mpData.sandbox_init_point;if(!checkout)return NextResponse.json({error:'mercadopago_missing_checkout'},{status:502});
  const attach=await fetch(`${SUPABASE_URL}/rest/v1/rpc/cm_attach_topup_preference_admin`,{method:'POST',headers:adminHeaders,body:JSON.stringify({p_user_id:user.id,p_topup_id:topup.id,p_preference_id:mpData.id,p_init_point:checkout}),cache:'no-store'});
  if(!attach.ok)return NextResponse.json({error:'topup_attach_failed'},{status:502});
  return NextResponse.json({data:{topupId:topup.id,preferenceId:mpData.id,checkoutUrl:checkout,mode:mpData.sandbox_init_point&&checkout===mpData.sandbox_init_point?'sandbox':'production'}});
}
