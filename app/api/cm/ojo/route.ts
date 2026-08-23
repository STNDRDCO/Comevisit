import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const allowed=new Set(['HOY','ESTA NOCHE','MAÑANA','FINDE','PRÓXIMOS']);

export async function GET(req:NextRequest){
  const market=req.nextUrl.searchParams.get('market')||'HOY';
  if(!allowed.has(market))return NextResponse.json({error:'invalid_market'},{status:400});
  const select='id,market_key,amount_minor,currency,window_starts_at,window_ends_at,listing:cm_listings(slug,title,neighborhood,starts_at)';
  const params=new URLSearchParams({select,market_key:`eq.${market}`,status:'eq.active',order:'amount_minor.desc'});
  const url=`${SUPABASE_URL}/rest/v1/cm_ojo_bids?${params.toString()}`;
  const res=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});
  if(!res.ok)return NextResponse.json({error:'ojo_unavailable',status:res.status},{status:502});
  const data=await res.json();
  return NextResponse.json({data},{headers:{'Cache-Control':'no-store'}});
}
