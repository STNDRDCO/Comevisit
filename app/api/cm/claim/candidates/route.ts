import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const base={apikey:KEY,'Content-Type':'application/json'};

async function userFor(token:string){const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{...base,Authorization:`Bearer ${token}`},cache:'no-store'});if(!r.ok)return null;const u=await r.json();return u?.id?u:null}

export async function GET(req:NextRequest){
 const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return NextResponse.json({error:'auth_required'},{status:401});
 const user=await userFor(token);if(!user)return NextResponse.json({error:'invalid_session'},{status:401});
 const q=(new URL(req.url).searchParams.get('q')||'').trim().toLowerCase();
 const r=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings?select=id,slug,title,category,neighborhood,venue,starts_at,destination_url,source_type,claimed,status&source_type=eq.community&claimed=eq.false&status=eq.active&order=starts_at.asc&limit=120`,{headers:{...base,Authorization:`Bearer ${KEY}`},cache:'no-store'});
 if(!r.ok)return NextResponse.json({error:'candidates_failed'},{status:502});
 const rows=await r.json();
 const filtered=q?rows.filter((x:any)=>[x.title,x.venue,x.neighborhood,x.destination_url].some((v)=>String(v||'').toLowerCase().includes(q))):rows;
 return NextResponse.json({data:filtered.slice(0,60)},{headers:{'Cache-Control':'no-store'}});
}

export async function POST(req:NextRequest){
 const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return NextResponse.json({error:'auth_required'},{status:401});
 const user=await userFor(token);if(!user)return NextResponse.json({error:'invalid_session'},{status:401});
 const body=await req.json().catch(()=>null) as null|{slugs?:string[];note?:string};
 const slugs=[...new Set((body?.slugs||[]).map(x=>String(x).trim()).filter(Boolean))].slice(0,20);if(!slugs.length)return NextResponse.json({error:'missing_slugs'},{status:400});
 const auth={...base,Authorization:`Bearer ${token}`};
 const results=[] as any[];
 for(const slug of slugs){
   const lookup=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings?select=id,claimed,source_type&slug=eq.${encodeURIComponent(slug)}&status=eq.active&limit=1`,{headers:{...base,Authorization:`Bearer ${KEY}`},cache:'no-store'});
   const listing=(lookup.ok?await lookup.json():[])[0];
   if(!listing||listing.claimed||listing.source_type!=='community'){results.push({slug,status:'skipped'});continue}
   const existing=await fetch(`${SUPABASE_URL}/rest/v1/cm_claims?select=id,status&listing_id=eq.${listing.id}&claimant_id=eq.${user.id}&status=eq.pending&limit=1`,{headers:auth,cache:'no-store'});
   const ex=existing.ok?await existing.json():[];if(ex[0]){results.push({slug,status:'already_pending'});continue}
   const write=await fetch(`${SUPABASE_URL}/rest/v1/cm_claims`,{method:'POST',headers:{...auth,Prefer:'return=representation'},body:JSON.stringify({listing_id:listing.id,claimant_id:user.id,note:(body?.note||'Claim múltiple asistido').slice(0,500)}),cache:'no-store'});
   results.push({slug,status:write.ok?'created':'failed'});
 }
 return NextResponse.json({data:results,created:results.filter(x=>x.status==='created').length},{status:201});
}
