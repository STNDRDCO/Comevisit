import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

export async function POST(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(!token)return NextResponse.json({error:'auth_required'},{status:401});
  const body=await req.json().catch(()=>null) as null|{code?:string};
  const code=(body?.code||'').trim().toUpperCase();
  if(!code)return NextResponse.json({error:'missing_code'},{status:400});
  const r=await fetch(`${URL}/rest/v1/rpc/cm_redeem_alpha_invite`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({p_code:code}),cache:'no-store'});
  if(r.status===401)return NextResponse.json({error:'invalid_session'},{status:401});
  if(!r.ok){const text=await r.text();return NextResponse.json({error:text.includes('invalid_invite')?'invalid_invite':'redeem_failed'},{status:400})}
  const raw=await r.json();const row=Array.isArray(raw)?raw[0]:raw;
  return NextResponse.json({data:row});
}
