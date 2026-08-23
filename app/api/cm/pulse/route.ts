import {NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

export async function GET(){
  const res=await fetch(`${SUPABASE_URL}/rest/v1/cm_public_pulse_state?select=*&id=eq.1&limit=1`,{
    headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'
  });
  if(!res.ok)return NextResponse.json({error:'pulse_unavailable'},{status:502});
  const rows=await res.json();const row=rows?.[0]||null;
  if(row&&Date.now()-new Date(row.refreshed_at).getTime()>180000)row.viewers_now=0;
  return NextResponse.json({data:row},{headers:{'Cache-Control':'no-store'}});
}
