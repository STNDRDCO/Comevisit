import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const base={apikey:KEY,'Content-Type':'application/json'};
async function userFor(token:string){const r=await fetch(`${URL}/auth/v1/user`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`},cache:'no-store'});if(!r.ok)return null;const u=await r.json();return u?.id?u:null}
function cleanUrl(raw?:string){if(!raw)return null;try{const u=new globalThis.URL(raw);return /^https?:$/.test(u.protocol)?u.toString():null}catch{return null}}

export async function GET(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return NextResponse.json({error:'auth_required'},{status:401});const user=await userFor(token);if(!user)return NextResponse.json({error:'invalid_session'},{status:401});
  const p=new URLSearchParams({select:'user_id,slug,display_name,bio,instagram_url,website_url',user_id:`eq.${user.id}`});
  const r=await fetch(`${URL}/rest/v1/cm_profiles?${p.toString()}`,{headers:{...base,Authorization:`Bearer ${token}`},cache:'no-store'});if(!r.ok)return NextResponse.json({error:'profile_failed'},{status:502});const rows=await r.json();
  return NextResponse.json({data:rows[0]||null,email:user.email||null});
}

export async function PUT(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return NextResponse.json({error:'auth_required'},{status:401});const user=await userFor(token);if(!user)return NextResponse.json({error:'invalid_session'},{status:401});
  const body=await req.json().catch(()=>null) as null|{slug?:string;displayName?:string;bio?:string;instagram?:string;website?:string};if(!body)return NextResponse.json({error:'invalid_body'},{status:400});
  const slug=(body.slug||'').trim().toLowerCase().replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-').replace(/(^-|-$)/g,'').slice(0,40);if(slug.length<3)return NextResponse.json({error:'invalid_slug'},{status:400});
  const row={user_id:user.id,slug,display_name:(body.displayName||'').trim().slice(0,80)||null,bio:(body.bio||'').trim().slice(0,240)||null,instagram_url:cleanUrl(body.instagram),website_url:cleanUrl(body.website),updated_at:new Date().toISOString()};
  const r=await fetch(`${URL}/rest/v1/cm_profiles?on_conflict=user_id`,{method:'POST',headers:{...base,Authorization:`Bearer ${token}`,Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(row),cache:'no-store'});
  if(!r.ok){const t=await r.text();if(t.includes('cm_profiles_slug_key'))return NextResponse.json({error:'slug_taken'},{status:409});return NextResponse.json({error:'profile_save_failed'},{status:r.status})}
  const rows=await r.json();return NextResponse.json({data:rows[0]});
}
