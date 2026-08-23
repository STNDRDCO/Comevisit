import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

export async function GET(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(!token)return NextResponse.json({error:'auth_required'},{status:401});
  const res=await fetch(`${URL}/rest/v1/rpc/cm_pricing_status`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:'{}',cache:'no-store'});
  if(res.status===401)return NextResponse.json({error:'invalid_session'},{status:401});
  if(!res.ok)return NextResponse.json({error:'pricing_unavailable',detail:(await res.text()).slice(0,240)},{status:502});
  const raw=await res.json();
  const row=Array.isArray(raw)?raw[0]:raw;
  const labels:Record<string,string>={ONE_FREE:'1 publicación gratis',THREE_FREE:'3 publicaciones gratis',ACTIVE_LIMIT:'Hasta 2 activas gratis'};
  return NextResponse.json({data:{...row,label:labels[row?.cohort]||row?.cohort,fee_minor:Number(row?.fee_minor||1500)}});
}
