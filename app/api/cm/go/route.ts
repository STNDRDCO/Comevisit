import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const headers={apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`,'Content-Type':'application/json'};

export async function GET(req:NextRequest){
  const slug=req.nextUrl.searchParams.get('slug');
  if(!slug)return NextResponse.json({error:'missing_slug'},{status:400});
  const lookup=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings?select=id,destination_type,destination_url&slug=eq.${encodeURIComponent(slug)}&status=eq.active&limit=1`,{headers,cache:'no-store'});
  if(!lookup.ok)return NextResponse.json({error:'lookup_failed'},{status:502});
  const rows=await lookup.json();
  const listing=rows[0];
  if(!listing)return NextResponse.json({error:'not_found'},{status:404});
  await fetch(`${SUPABASE_URL}/rest/v1/cm_outbound_clicks`,{method:'POST',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({listing_id:listing.id,destination_type:listing.destination_type}),cache:'no-store'}).catch(()=>null);
  return NextResponse.redirect(listing.destination_url,302);
}
