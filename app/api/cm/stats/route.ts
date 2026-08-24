import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const headers={apikey:KEY,Authorization:`Bearer ${KEY}`};

type Stat={listing_id:string;views:number;seen:number;shares:number};

export async function GET(req:NextRequest){
  const raw=(req.nextUrl.searchParams.get('slugs')||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,40);
  if(!raw.length)return NextResponse.json({data:{}});
  const inFilter=`in.(${raw.map(x=>`"${x.replaceAll('"','')}"`).join(',')})`;
  const listingRes=await fetch(`${URL}/rest/v1/cm_listings?select=id,slug&slug=${encodeURIComponent(inFilter)}`,{headers,cache:'no-store'});
  if(!listingRes.ok)return NextResponse.json({error:'stats_unavailable'},{status:502});
  const listings=await listingRes.json() as Array<{id:string;slug:string}>;
  if(!listings.length)return NextResponse.json({data:{}});
  const ids=`in.(${listings.map(x=>x.id).join(',')})`;
  const statsRes=await fetch(`${URL}/rest/v1/cm_listing_public_stats?select=listing_id,views,seen,shares&listing_id=${encodeURIComponent(ids)}`,{headers,cache:'no-store'});
  if(!statsRes.ok)return NextResponse.json({error:'stats_unavailable'},{status:502});
  const stats=await statsRes.json() as Stat[];
  const byId=new Map(stats.map(x=>[x.listing_id,x]));
  const data=Object.fromEntries(listings.map(x=>{const s=byId.get(x.id);return[x.slug,{views:Number(s?.views||0),seen:Number(s?.seen||0),shares:Number(s?.shares||0)}]}));
  return NextResponse.json({data},{headers:{'Cache-Control':'no-store'}});
}
