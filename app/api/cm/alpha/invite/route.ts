import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

export async function POST(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(!token)return NextResponse.json({error:'auth_required'},{status:401});
  const userRes=await fetch(`${URL}/auth/v1/user`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`},cache:'no-store'});
  if(!userRes.ok)return NextResponse.json({error:'invalid_session'},{status:401});
  const user=await userRes.json();if(!user?.id)return NextResponse.json({error:'invalid_session'},{status:401});
  const body=await req.json().catch(()=>null) as null|{code?:string};
  const code=(body?.code||'').trim().toUpperCase();if(!code)return NextResponse.json({error:'missing_code'},{status:400});
  const service=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return NextResponse.json({error:'alpha_backend_not_configured'},{status:503});
  const r=await fetch(`${URL}/rest/v1/rpc/cm_redeem_alpha_invite_server`,{method:'POST',headers:{apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json'},body:JSON.stringify({p_user_id:user.id,p_code:code}),cache:'no-store'});
  if(!r.ok){const text=await r.text();return NextResponse.json({error:text.includes('invalid_invite')?'invalid_invite':'redeem_failed'},{status:400})}
  const raw=await r.json();const row=Array.isArray(raw)?raw[0]:raw;return NextResponse.json({data:row});
}
