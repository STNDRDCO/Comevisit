import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const base={apikey:KEY,'Content-Type':'application/json'};
const allowedCategories=new Set(['COMER','MÚSICA','SALIR','CULTURA','EXPERIENCIAS']);
const allowedDestinations=new Set(['instagram','whatsapp','web','checkout']);

async function userFor(token:string){
  const res=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`},cache:'no-store'});
  if(!res.ok)return null;
  const user=await res.json();
  return user?.id?user:null;
}

function destinationType(raw?:string){return(raw||'web').toLowerCase().replace('checkout / entradas','checkout')}

export async function PATCH(req:NextRequest,{params}:{params:Promise<{slug:string}>}){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(!token)return NextResponse.json({error:'auth_required'},{status:401});
  const user=await userFor(token);if(!user)return NextResponse.json({error:'invalid_session'},{status:401});
  const {slug}=await params;
  const body=await req.json().catch(()=>null) as null|{title?:string;category?:string;date?:string;time?:string;neighborhood?:string;venue?:string;price?:string;description?:string;destinationType?:string;destination?:string;action?:string};
  if(!body)return NextResponse.json({error:'invalid_body'},{status:400});

  if(body.action==='cancel'){
    const patch=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings?slug=eq.${encodeURIComponent(slug)}&owner_id=eq.${user.id}`,{method:'PATCH',headers:{...base,Authorization:`Bearer ${token}`,Prefer:'return=representation'},body:JSON.stringify({status:'cancelled',updated_at:new Date().toISOString()}),cache:'no-store'});
    if(!patch.ok)return NextResponse.json({error:'cancel_failed'},{status:patch.status});
    const rows=await patch.json();if(!rows.length)return NextResponse.json({error:'not_found_or_forbidden'},{status:404});
    return NextResponse.json({data:rows[0]});
  }

  if(!body.title||!body.category||!body.date||!body.time||!body.neighborhood||!body.destination)return NextResponse.json({error:'missing_fields'},{status:400});
  const category=body.category.toUpperCase();if(!allowedCategories.has(category))return NextResponse.json({error:'invalid_category'},{status:400});
  const destType=destinationType(body.destinationType);if(!allowedDestinations.has(destType))return NextResponse.json({error:'invalid_destination'},{status:400});
  let destUrl:string;try{destUrl=new globalThis.URL(body.destination).toString()}catch{return NextResponse.json({error:'invalid_url'},{status:400})}
  const start=new Date(`${body.date}T${body.time}:00-03:00`);if(Number.isNaN(start.getTime())||start.getTime()<Date.now()-15*60*1000)return NextResponse.json({error:'invalid_date'},{status:400});
  const expires=new Date(start.getTime()+12*60*60*1000);
  const update={title:body.title.trim(),category,neighborhood:body.neighborhood.toUpperCase(),venue:body.venue?.trim()||null,starts_at:start.toISOString(),expires_at:expires.toISOString(),price_label:body.price?.trim()||null,description:body.description?.trim()||null,destination_type:destType,destination_url:destUrl,updated_at:new Date().toISOString()};
  const patch=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings?slug=eq.${encodeURIComponent(slug)}&owner_id=eq.${user.id}`,{method:'PATCH',headers:{...base,Authorization:`Bearer ${token}`,Prefer:'return=representation'},body:JSON.stringify(update),cache:'no-store'});
  if(!patch.ok)return NextResponse.json({error:'update_failed'},{status:patch.status});
  const rows=await patch.json();if(!rows.length)return NextResponse.json({error:'not_found_or_forbidden'},{status:404});
  return NextResponse.json({data:rows[0]});
}
