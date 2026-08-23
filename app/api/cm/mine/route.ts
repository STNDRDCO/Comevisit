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
  if(!ids.length)return NextResponse.json({data:[],summary:{views:0,clicks:0,publisher_views:0,share_views:0}});
  const inFilter=`in.(${ids.join(',')})`;
  const [vRes,cRes,bRes,allBidsRes]=await Promise.all([
    fetch(`${URL}/rest/v1/cm_listing_views?select=listing_id,referrer_kind&listing_id=${encodeURIComponent(inFilter)}`,{headers:auth,cache:'no-store'}),
    fetch(`${URL}/rest/v1/cm_outbound_clicks?select=listing_id&listing_id=${encodeURIComponent(inFilter)}`,{headers:auth,cache:'no-store'}),
    fetch(`${URL}/rest/v1/cm_ojo_bids?select=listing_id,status,market_key,amount_minor&listing_id=${encodeURIComponent(inFilter)}&status=eq.active`,{headers:auth,cache:'no-store'}),
    fetch(`${URL}/rest/v1/cm_ojo_bids?select=listing_id,status,market_key,amount_minor&status=eq.active&order=amount_minor.desc`,{headers:{...base,Authorization:`Bearer ${KEY}`},cache:'no-store'})
  ]);
  const views=vRes.ok?await vRes.json():[];const clicks=cRes.ok?await cRes.json():[];const bids=bRes.ok?await bRes.json():[];const allBids=allBidsRes.ok?await allBidsRes.json():[];
  const count=(rows:{listing_id:string}[],id:string)=>rows.reduce((n,x)=>n+(x.listing_id===id?1:0),0);
  const countRef=(id:string,ref:string)=>views.reduce((n:number,x:{listing_id:string;referrer_kind:string})=>n+(x.listing_id===id&&x.referrer_kind===ref?1:0),0);
  const data=listings.map((x:{id:string})=>{const ojo=bids.find((b:{listing_id:string})=>b.listing_id===x.id)||null;let rank:null|number=null;if(ojo){const market=allBids.filter((b:{market_key:string})=>b.market_key===ojo.market_key).sort((a:{amount_minor:number},b:{amount_minor:number})=>b.amount_minor-a.amount_minor);const i=market.findIndex((b:{listing_id:string})=>b.listing_id===x.id);rank=i>=0?i+1:null}return{...x,views:count(views,x.id),clicks:count(clicks,x.id),publisher_views:countRef(x.id,'publisher'),share_views:countRef(x.id,'share'),ojo:ojo?{...ojo,rank}:null}});
  return NextResponse.json({data,summary:{views:views.length,clicks:clicks.length,publisher_views:views.filter((x:{referrer_kind:string})=>x.referrer_kind==='publisher').length,share_views:views.filter((x:{referrer_kind:string})=>x.referrer_kind==='share').length}},{headers:{'Cache-Control':'no-store'}});
}
