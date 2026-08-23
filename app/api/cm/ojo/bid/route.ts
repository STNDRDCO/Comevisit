import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const allowed=new Set(['HOY','ESTA NOCHE','MAÑANA','FINDE','PRÓXIMOS']);

async function userFor(token:string){const r=await fetch(`${URL}/auth/v1/user`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`},cache:'no-store'});if(!r.ok)return null;const u=await r.json();return u?.id?u:null}

export async function POST(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return NextResponse.json({error:'auth_required'},{status:401});
  const user=await userFor(token);if(!user)return NextResponse.json({error:'invalid_session'},{status:401});
  const service=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return NextResponse.json({error:'finance_backend_not_configured'},{status:503});
  const body=await req.json().catch(()=>null) as null|{listing?:string;market?:string;targetAmount?:number};if(!body?.listing||!body.market||!allowed.has(body.market))return NextResponse.json({error:'invalid_request'},{status:400});const target=Math.round(Number(body.targetAmount||0));if(target<100)return NextResponse.json({error:'invalid_amount'},{status:400});
  const userHeaders={apikey:KEY,Authorization:`Bearer ${token}`,'Content-Type':'application/json'};
  const lookup=await fetch(`${URL}/rest/v1/cm_listings?select=id,slug,title,owner_id&slug=eq.${encodeURIComponent(body.listing)}&owner_id=eq.${user.id}&limit=1`,{headers:userHeaders,cache:'no-store'});const rows=lookup.ok?await lookup.json():[];if(!rows[0])return NextResponse.json({error:'listing_not_owned_or_inactive'},{status:404});
  const adminHeaders={apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json'};
  const rpc=await fetch(`${URL}/rest/v1/rpc/cm_place_ojo_bid_admin`,{method:'POST',headers:adminHeaders,body:JSON.stringify({p_user_id:user.id,p_listing_id:rows[0].id,p_market_key:body.market,p_target_amount:target}),cache:'no-store'});
  if(!rpc.ok){const raw=await rpc.text();const map=['insufficient_balance','listing_not_eligible','bid_must_increase','listing_not_owned_or_inactive','invalid_market'];const code=map.find(x=>raw.includes(x))||'bid_failed';return NextResponse.json({error:code,detail:raw.slice(0,240)},{status:code==='insufficient_balance'?402:400})}
  const data=await rpc.json();return NextResponse.json({data:Array.isArray(data)?data[0]:data});
}
