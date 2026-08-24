import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const allowed=new Set(['HOY','ESTA NOCHE','MAÑANA','FINDE','PRÓXIMOS','TODAY']);
const BA='America/Argentina/Buenos_Aires';
const parts=(d:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:BA,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hour12:false}).formatToParts(d).reduce<Record<string,string>>((a,p)=>{a[p.type]=p.value;return a},{});
function todayBounds(now=new Date()){const p=parts(now);const base=new Date(`${p.year}-${p.month}-${p.day}T06:00:00-03:00`);const start=Number(p.hour)<6?new Date(base.getTime()-86400000):base;return{start,end:new Date(start.getTime()+86400000)}}

export async function GET(req:NextRequest){
  const market=req.nextUrl.searchParams.get('market')||'HOY';
  if(!allowed.has(market))return NextResponse.json({error:'invalid_market'},{status:400});
  const select='id,market_key,amount_minor,currency,window_starts_at,window_ends_at,listing:cm_listings(slug,title,category,neighborhood,starts_at,published_at,price_label,description,destination_type,destination_url)';
  const params=new URLSearchParams({select,status:'eq.active',order:'amount_minor.desc'});
  if(market!=='TODAY')params.set('market_key',`eq.${market}`);
  const url=`${SUPABASE_URL}/rest/v1/cm_ojo_bids?${params.toString()}`;
  const res=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});
  if(!res.ok)return NextResponse.json({error:'ojo_unavailable',status:res.status},{status:502});
  let data=await res.json();
  if(market==='TODAY'){
    const{start,end}=todayBounds();const bySlug=new Map<string,any>();
    for(const row of data){const listing=row?.listing;if(!listing?.slug)continue;const when=new Date(listing.starts_at);if(when<start||when>=end)continue;const prev=bySlug.get(listing.slug);if(!prev||Number(row.amount_minor)>Number(prev.amount_minor))bySlug.set(listing.slug,row)}
    data=Array.from(bySlug.values()).sort((a:any,b:any)=>Number(b.amount_minor)-Number(a.amount_minor));
  }
  return NextResponse.json({data},{headers:{'Cache-Control':'no-store'}});
}
