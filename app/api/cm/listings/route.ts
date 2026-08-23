import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const select='id,slug,title,category,city,neighborhood,venue,starts_at,ends_at,expires_at,price_label,description,destination_type,destination_url,published_at,claimed,source_type,status';

export async function GET(req:NextRequest){
  const slug=req.nextUrl.searchParams.get('slug');
  const params=new URLSearchParams({select,status:'eq.active',order:'published_at.desc'});
  if(slug)params.set('slug',`eq.${slug}`);
  const url=`${SUPABASE_URL}/rest/v1/cm_listings?${params.toString()}`;
  const res=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});
  if(!res.ok)return NextResponse.json({error:'listings_unavailable',status:res.status},{status:502});
  const data=await res.json();
  return NextResponse.json({data:slug?(data[0]||null):data},{headers:{'Cache-Control':'no-store'}});
}
