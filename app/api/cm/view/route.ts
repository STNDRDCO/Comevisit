import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const allowed=new Set(['direct','share','feed','explore','ojo','external']);
const headers={apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'};

export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>null) as {slug?:string;ref?:string}|null;
  if(!body?.slug)return NextResponse.json({error:'missing_slug'},{status:400});
  const lookup=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings?select=id&slug=eq.${encodeURIComponent(body.slug)}&status=eq.active&limit=1`,{headers,cache:'no-store'});
  if(!lookup.ok)return NextResponse.json({error:'lookup_failed'},{status:502});
  const rows=await lookup.json();
  if(!rows[0])return NextResponse.json({error:'not_found'},{status:404});
  const ref=body.ref&&allowed.has(body.ref)?body.ref:'direct';
  const write=await fetch(`${SUPABASE_URL}/rest/v1/cm_listing_views`,{method:'POST',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({listing_id:rows[0].id,referrer_kind:ref}),cache:'no-store'});
  if(!write.ok)return NextResponse.json({error:'write_failed'},{status:502});
  return NextResponse.json({ok:true});
}
