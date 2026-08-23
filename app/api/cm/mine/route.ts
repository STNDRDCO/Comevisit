import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const base={apikey:KEY,'Content-Type':'application/json'};

export async function GET(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(!token)return NextResponse.json({error:'auth_required'},{status:401});
  const userRes=await fetch(`${URL}/auth/v1/user`,{headers:{...base,Authorization:`Bearer ${token}`},cache:'no-store'});
  if(!userRes.ok)return NextResponse.json({error:'invalid_session'},{status:401});
  const user=await userRes.json();
  const auth={...base,Authorization:`Bearer ${token}`};
  const listingParams=new URLSearchParams({select:'id,slug,title,starts_at,expires_at,neighborhood,price_label,published_at,status',owner_id:`eq.${user.id}`,order:'published_at.desc'});
  const lRes=await fetch(`${URL}/rest/v1/cm_listings?${listingParams.toString()}`,{headers:auth,cache:'no-store'});
  if(!lRes.ok)return NextResponse.json({error:'listings_failed'},{status:502});
  const listings=await lRes.json();
  const ids=listings.map((x:{id:string})=>x.id);
  if(!ids.length)return NextResponse.json({data:[]});
  const inFilter=`in.(${ids.join(',')})`;
  const [vRes,cRes,bRes]=await Promise.all([
    fetch(`${URL}/rest/v1/cm_listing_views?select=listing_id&listing_id=${encodeURIComponent(inFilter)}`,{headers:auth,cache:'no-store'}),
    fetch(`${URL}/rest/v1/cm_outbound_clicks?select=listing_id&listing_id=${encodeURIComponent(inFilter)}`,{headers:auth,cache:'no-store'}),
    fetch(`${URL}/rest/v1/cm_ojo_bids?select=listing_id,status,market_key,amount_minor&listing_id=${encodeURIComponent(inFilter)}&status=eq.active`,{headers:auth,cache:'no-store'})
  ]);
  const views=vRes.ok?await vRes.json():[];const clicks=cRes.ok?await cRes.json():[];const bids=bRes.ok?await bRes.json():[];
  const count=(rows:{listing_id:string}[],id:string)=>rows.reduce((n,x)=>n+(x.listing_id===id?1:0),0);
  const data=listings.map((x:{id:string})=>({...x,views:count(views,x.id),clicks:count(clicks,x.id),ojo:bids.find((b:{listing_id:string})=>b.listing_id===x.id)||null}));
  return NextResponse.json({data},{headers:{'Cache-Control':'no-store'}});
}
