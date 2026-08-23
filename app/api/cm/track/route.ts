import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const allowed=new Set(['home_view','explore_view','publish_start','publish_blocked','save','unsave','share','ojo_view','ojo_bid_attempt','alpha_invite_view','alpha_invite_redeemed','presence']);

export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>null) as null|{event?:string;sessionId?:string;listing?:string;properties?:Record<string,unknown>};
  if(!body?.event||!allowed.has(body.event))return NextResponse.json({error:'invalid_event'},{status:400});
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  let userId:string|null=null;
  if(token){
    const u=await fetch(`${URL}/auth/v1/user`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`},cache:'no-store'});
    if(u.ok){const x=await u.json();userId=x?.id||null}
  }
  let listingId:string|null=null;
  if(body.listing){
    const r=await fetch(`${URL}/rest/v1/cm_listings?select=id&slug=eq.${encodeURIComponent(body.listing)}&limit=1`,{headers:{apikey:KEY,Authorization:`Bearer ${token||KEY}`},cache:'no-store'});
    if(r.ok){const rows=await r.json();listingId=rows?.[0]?.id||null}
  }
  const row={user_id:userId,session_id:(body.sessionId||'').slice(0,96)||null,event_name:body.event,listing_id:listingId,properties:body.properties||{}};
  const write=await fetch(`${URL}/rest/v1/cm_product_events`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${token||KEY}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(row),cache:'no-store'});
  if(!write.ok)return NextResponse.json({error:'track_failed'},{status:502});
  return NextResponse.json({ok:true});
}
