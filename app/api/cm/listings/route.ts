import {NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

export async function GET(){
  const select='id,slug,title,category,neighborhood,venue,starts_at,ends_at,price_label,description,destination_type,destination_url,published_at,claimed,source_type';
  const url=`${SUPABASE_URL}/rest/v1/cm_listings?select=${encodeURIComponent(select)}&status=eq.active&order=published_at.desc`;
  const res=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});
  if(!res.ok)return NextResponse.json({error:'listings_unavailable',status:res.status},{status:502});
  const data=await res.json();
  return NextResponse.json({data},{headers:{'Cache-Control':'no-store'}});
}
