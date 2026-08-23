import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const select='id,slug,title,category,city,neighborhood,venue,starts_at,ends_at,expires_at,price_label,description,destination_type,destination_url,published_at,claimed,source_type,status,latitude,longitude';
const baseHeaders={apikey:SUPABASE_KEY,'Content-Type':'application/json'};
const allowedCategories=new Set(['COMER','MÚSICA','SALIR','CULTURA','EXPERIENCIAS']);
const allowedDestinations=new Set(['instagram','whatsapp','web','checkout']);
const neighborhoodCoords:Record<string,[number,number]>={
  'PALERMO':[-34.5875,-58.4300],'CHACARITA':[-34.5888,-58.4540],'VILLA CRESPO':[-34.5980,-58.4420],
  'ALMAGRO':[-34.6060,-58.4210],'CABALLITO':[-34.6180,-58.4425],'COLEGIALES':[-34.5745,-58.4490],
  'SAN TELMO':[-34.6210,-58.3730],'RECOLETA':[-34.5895,-58.3970],'NÚÑEZ':[-34.5430,-58.4640]
};

export async function GET(req:NextRequest){
  const slug=req.nextUrl.searchParams.get('slug');
  const includeEnded=req.nextUrl.searchParams.get('includeEnded')==='1';
  const params=new URLSearchParams({select,order:'published_at.desc'});
  if(slug)params.set('slug',`eq.${slug}`);
  else{
    params.set('status','eq.active');
    if(!includeEnded)params.set('expires_at',`gt.${new Date().toISOString()}`);
  }
  const url=`${SUPABASE_URL}/rest/v1/cm_listings?${params.toString()}`;
  const res=await fetch(url,{headers:{...baseHeaders,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});
  if(!res.ok)return NextResponse.json({error:'listings_unavailable',status:res.status},{status:502});
  const data=await res.json();
  return NextResponse.json({data:slug?(data[0]||null):data},{headers:{'Cache-Control':'no-store'}});
}

export async function POST(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
  if(!token)return NextResponse.json({error:'auth_required'},{status:401});
  const userRes=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`},cache:'no-store'});
  if(!userRes.ok)return NextResponse.json({error:'invalid_session'},{status:401});
  const user=await userRes.json();
  if(!user?.id)return NextResponse.json({error:'invalid_session'},{status:401});

  const body=await req.json().catch(()=>null) as null|{title?:string;category?:string;date?:string;time?:string;neighborhood?:string;venue?:string;price?:string;description?:string;destinationType?:string;destination?:string};
  if(!body?.title||!body.category||!body.date||!body.time||!body.neighborhood||!body.destination)return NextResponse.json({error:'missing_fields'},{status:400});
  const category=body.category.toUpperCase();
  if(!allowedCategories.has(category))return NextResponse.json({error:'invalid_category'},{status:400});
  const destinationType=(body.destinationType||'web').toLowerCase().replace('checkout / entradas','checkout');
  const normalizedDestination=destinationType==='checkout'?'checkout':destinationType;
  if(!allowedDestinations.has(normalizedDestination))return NextResponse.json({error:'invalid_destination'},{status:400});
  let destinationUrl:string;
  try{destinationUrl=new URL(body.destination).toString();}catch{return NextResponse.json({error:'invalid_url'},{status:400})}
  if(!/^https?:/.test(destinationUrl))return NextResponse.json({error:'invalid_url'},{status:400});

  const start=new Date(`${body.date}T${body.time}:00-03:00`);
  if(Number.isNaN(start.getTime())||start.getTime()<Date.now()-15*60*1000)return NextResponse.json({error:'invalid_date'},{status:400});
  const dayStart=new Date(`${body.date}T00:00:00-03:00`);const dayEnd=new Date(dayStart.getTime()+24*60*60*1000);
  const neighborhood=body.neighborhood.toUpperCase();
  const duplicateParams=new URLSearchParams({select:'slug,title,starts_at,neighborhood',status:'eq.active',title:`ilike.${body.title.trim()}`,neighborhood:`eq.${neighborhood}`,starts_at:`gte.${dayStart.toISOString()}`});
  duplicateParams.append('starts_at',`lt.${dayEnd.toISOString()}`);
  const duplicateRes=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings?${duplicateParams.toString()}`,{headers:{...baseHeaders,Authorization:`Bearer ${SUPABASE_KEY}`},cache:'no-store'});
  if(duplicateRes.ok){const duplicates=await duplicateRes.json();if(duplicates.length)return NextResponse.json({error:'possible_duplicate',duplicate:duplicates[0]},{status:409})}

  const expires=new Date(start.getTime()+12*60*60*1000);
  const baseSlug=body.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,60)||'publicacion';
  const slug=`${baseSlug}-${Math.random().toString(36).slice(2,7)}`;
  const coords=neighborhoodCoords[neighborhood];
  const row={owner_id:user.id,slug,title:body.title.trim(),category,city:'Buenos Aires',neighborhood,venue:body.venue?.trim()||null,starts_at:start.toISOString(),expires_at:expires.toISOString(),price_label:body.price?.trim()||null,description:body.description?.trim()||null,destination_type:normalizedDestination,destination_url:destinationUrl,source_type:'organizer',claimed:true,status:'active',latitude:coords?.[0]||null,longitude:coords?.[1]||null};
  const write=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings`,{method:'POST',headers:{...baseHeaders,Authorization:`Bearer ${token}`,Prefer:'return=representation'},body:JSON.stringify(row),cache:'no-store'});
  if(!write.ok){const text=await write.text();return NextResponse.json({error:'create_failed',detail:text.slice(0,300)},{status:write.status})}
  const created=await write.json();
  return NextResponse.json({data:created[0]},{status:201});
}
