import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const reasons=new Set(['duplicate','wrong_info','spam','expired','unsafe','other']);
const base={apikey:KEY,'Content-Type':'application/json'};

export async function POST(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(!token)return NextResponse.json({error:'auth_required'},{status:401});
  const userRes=await fetch(`${URL}/auth/v1/user`,{headers:{...base,Authorization:`Bearer ${token}`},cache:'no-store'});
  if(!userRes.ok)return NextResponse.json({error:'invalid_session'},{status:401});
  const user=await userRes.json();
  const body=await req.json().catch(()=>null) as {slug?:string;reason?:string;detail?:string}|null;
  if(!body?.slug||!body.reason||!reasons.has(body.reason))return NextResponse.json({error:'invalid_fields'},{status:400});
  const lookup=await fetch(`${URL}/rest/v1/cm_listings?select=id&slug=eq.${encodeURIComponent(body.slug)}&status=eq.active&limit=1`,{headers:{...base,Authorization:`Bearer ${KEY}`},cache:'no-store'});
  const rows=lookup.ok?await lookup.json():[];if(!rows[0])return NextResponse.json({error:'not_found'},{status:404});
  const write=await fetch(`${URL}/rest/v1/cm_reports`,{method:'POST',headers:{...base,Authorization:`Bearer ${token}`,Prefer:'return=representation'},body:JSON.stringify({listing_id:rows[0].id,reporter_id:user.id,reason:body.reason,detail:body.detail?.slice(0,500)||null}),cache:'no-store'});
  if(!write.ok)return NextResponse.json({error:'report_failed'},{status:write.status});
  const data=await write.json();return NextResponse.json({data:data[0]},{status:201});
}
