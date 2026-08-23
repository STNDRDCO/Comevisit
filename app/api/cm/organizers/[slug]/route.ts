import {NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const headers={apikey:KEY,Authorization:`Bearer ${KEY}`,'Content-Type':'application/json'};

export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const profileParams=new URLSearchParams({select:'user_id,slug,display_name,bio,instagram_url,website_url',slug:`eq.${slug}`});
  const pr=await fetch(`${URL}/rest/v1/cm_profiles?${profileParams.toString()}`,{headers,cache:'no-store'});if(!pr.ok)return NextResponse.json({error:'profile_failed'},{status:502});const profiles=await pr.json();const profile=profiles[0];if(!profile)return NextResponse.json({error:'not_found'},{status:404});
  const listingParams=new URLSearchParams({select:'slug,title,category,neighborhood,venue,starts_at,expires_at,price_label,description,destination_type,destination_url',owner_id:`eq.${profile.user_id}`,status:'eq.active',expires_at:`gt.${new Date().toISOString()}`,order:'starts_at.asc'});
  const lr=await fetch(`${URL}/rest/v1/cm_listings?${listingParams.toString()}`,{headers,cache:'no-store'});const listings=lr.ok?await lr.json():[];
  return NextResponse.json({data:{profile,listings}},{headers:{'Cache-Control':'no-store'}});
}
