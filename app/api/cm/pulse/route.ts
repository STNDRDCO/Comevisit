import {NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

export async function GET(){
  const res=await fetch(`${SUPABASE_URL}/rest/v1/rpc/cm_public_pulse`,{
    method:'POST',
    headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'},
    body:'{}',
    cache:'no-store'
  });
  if(!res.ok)return NextResponse.json({error:'pulse_unavailable'},{status:502});
  const raw=await res.json();
  const row=Array.isArray(raw)?raw[0]:raw;
  return NextResponse.json({data:row||null},{headers:{'Cache-Control':'no-store'}});
}
