import {NextRequest,NextResponse} from 'next/server';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const coords:Record<string,[number,number]>={'PALERMO':[-34.5875,-58.43],'CHACARITA':[-34.5888,-58.454],'VILLA CRESPO':[-34.598,-58.442],'ALMAGRO':[-34.606,-58.421],'CABALLITO':[-34.618,-58.4425],'COLEGIALES':[-34.5745,-58.449],'SAN TELMO':[-34.621,-58.373],'RECOLETA':[-34.5895,-58.397],'NÚÑEZ':[-34.543,-58.464]};
type AlphaListing={id:string;slug:string;title:string;category:string;neighborhood:string;starts_at:string;source_type:string;claimed:boolean;status:string;expires_at:string};
type ProductEvent={event_name:string;occurred_at:string};

async function userFor(token:string){const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`},cache:'no-store'});if(!r.ok)return null;const u=await r.json();return u?.id?u:null}
async function admin(req:NextRequest){const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return{error:'auth_required',status:401} as const;const u=await userFor(token);if(!u)return{error:'invalid_session',status:401} as const;const service=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return{error:'admin_backend_not_configured',status:503} as const;const h={apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json'};const r=await fetch(`${SUPABASE_URL}/rest/v1/cm_admins?select=user_id&user_id=eq.${u.id}&limit=1`,{headers:h,cache:'no-store'});const rows=r.ok?await r.json():[];if(!rows[0])return{error:'forbidden',status:403} as const;return{headers:h} as const}
const day=(d:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const bucket=(iso:string)=>{const d=new Date(iso),today=day(new Date()),tomorrow=day(new Date(Date.now()+86400000)),key=day(d);const p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Argentina/Buenos_Aires',weekday:'short',hour:'2-digit',hour12:false}).formatToParts(d).reduce((a:Record<string,string>,x)=>{a[x.type]=x.value;return a},{});if(key===today)return Number(p.hour)>=18?'ESTA NOCHE':'HOY';if(key===tomorrow)return'MAÑANA';if(p.weekday==='Sat'||p.weekday==='Sun')return'FINDE';return'PRÓXIMOS'};
const slugify=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,55)||'evento';

export async function GET(req:NextRequest){
 const ctx=await admin(req);if('error'in ctx)return NextResponse.json({error:ctx.error},{status:ctx.status});
 const [listingsR,invitesR,eventsR,outreachR]=await Promise.all([
   fetch(`${SUPABASE_URL}/rest/v1/cm_listings?select=id,slug,title,category,neighborhood,starts_at,source_type,claimed,status,expires_at&status=eq.active&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&order=starts_at.asc`,{headers:ctx.headers,cache:'no-store'}),
   fetch(`${SUPABASE_URL}/rest/v1/cm_alpha_invites?select=code,label,bonus_free_posts,max_uses,uses,active,created_at,expires_at&order=created_at.desc&limit=30`,{headers:ctx.headers,cache:'no-store'}),
   fetch(`${SUPABASE_URL}/rest/v1/cm_product_events?select=event_name,occurred_at&occurred_at=gt.${encodeURIComponent(new Date(Date.now()-7*86400000).toISOString())}`,{headers:ctx.headers,cache:'no-store'}),
   fetch(`${SUPABASE_URL}/rest/v1/cm_outreach_targets?select=id,name,contact_email,contact_channel,source_url,invite_code,status,priority,notes,updated_at&order=priority.desc,name.asc`,{headers:ctx.headers,cache:'no-store'})
 ]);
 const listings:AlphaListing[]=listingsR.ok?await listingsR.json():[];const invites=invitesR.ok?await invitesR.json():[];const events:ProductEvent[]=eventsR.ok?await eventsR.json():[];const outreach=outreachR.ok?await outreachR.json():[];
 const targets:Record<string,number>={'HOY':12,'ESTA NOCHE':8,'MAÑANA':8,'FINDE':15,'PRÓXIMOS':20};
 const windows=Object.keys(targets).map(k=>{const count=listings.filter(x=>bucket(x.starts_at)===k).length;return{key:k,count,target:targets[k],status:count>=targets[k]?'green':count>=Math.ceil(targets[k]*.55)?'yellow':'red'}});
 const hoodCounts:Record<string,number>={};for(const x of listings)hoodCounts[x.neighborhood]=(hoodCounts[x.neighborhood]||0)+1;
 const categoryCounts:Record<string,number>={};for(const x of listings)categoryCounts[x.category]=(categoryCounts[x.category]||0)+1;
 const neighborhoods=Object.entries(hoodCounts).sort((a,b)=>b[1]-a[1]).slice(0,8);const categories=Object.entries(categoryCounts).sort((a,b)=>b[1]-a[1]);
 const funnel:Record<string,number>={};for(const x of events)funnel[x.event_name]=(funnel[x.event_name]||0)+1;
 return NextResponse.json({data:{windows,neighborhoods,categories,funnel,invites,outreach,communitySeed:listings.filter(x=>x.source_type==='community').length,total:listings.length}},{headers:{'Cache-Control':'no-store'}});
}

export async function POST(req:NextRequest){
 const ctx=await admin(req);if('error'in ctx)return NextResponse.json({error:ctx.error},{status:ctx.status});
 const body=await req.json().catch(()=>null) as any;if(!body?.action)return NextResponse.json({error:'invalid_request'},{status:400});
 if(body.action==='create_invite'){
   const code=('CM'+Math.random().toString(36).slice(2,8)).toUpperCase();const row={code,label:String(body.label||'Alpha organizer').slice(0,80),bonus_free_posts:Math.min(20,Math.max(1,Number(body.bonus||5))),max_uses:Math.min(100,Math.max(1,Number(body.maxUses||1))),active:true};
   const r=await fetch(`${SUPABASE_URL}/rest/v1/cm_alpha_invites`,{method:'POST',headers:{...ctx.headers,Prefer:'return=representation'},body:JSON.stringify(row),cache:'no-store'});if(!r.ok)return NextResponse.json({error:'invite_create_failed',detail:(await r.text()).slice(0,200)},{status:400});const data=await r.json();return NextResponse.json({data:data[0]});
 }
 if(body.action==='seed_listing'){
   if(!body.title||!body.category||!body.neighborhood||!body.startsAt||!body.destination)return NextResponse.json({error:'missing_fields'},{status:400});
   const start=new Date(body.startsAt);if(Number.isNaN(start.getTime())||start.getTime()<Date.now()-900000)return NextResponse.json({error:'invalid_date'},{status:400});const hood=String(body.neighborhood).toUpperCase();const xy=coords[hood];
   let destination:string;try{destination=new URL(String(body.destination)).toString()}catch{return NextResponse.json({error:'invalid_url'},{status:400})}
   const row={owner_id:null,slug:`${slugify(body.title)}-${Math.random().toString(36).slice(2,7)}`,title:String(body.title).trim(),category:String(body.category).toUpperCase(),city:'Buenos Aires',neighborhood:hood,venue:body.venue||null,starts_at:start.toISOString(),expires_at:new Date(start.getTime()+12*3600000).toISOString(),price_label:body.price||null,description:body.description||null,destination_type:body.destinationType||'web',destination_url:destination,source_type:'community',claimed:false,status:'active',latitude:xy?.[0]||null,longitude:xy?.[1]||null};
   const r=await fetch(`${SUPABASE_URL}/rest/v1/cm_listings`,{method:'POST',headers:{...ctx.headers,Prefer:'return=representation'},body:JSON.stringify(row),cache:'no-store'});if(!r.ok)return NextResponse.json({error:'seed_failed',detail:(await r.text()).slice(0,250)},{status:400});const data=await r.json();return NextResponse.json({data:data[0]});
 }
 if(body.action==='outreach_status'){
   const allowed=new Set(['new','contacted','replied','converted','closed']);if(!body.id||!allowed.has(body.status))return NextResponse.json({error:'invalid_status'},{status:400});
   const r=await fetch(`${SUPABASE_URL}/rest/v1/cm_outreach_targets?id=eq.${encodeURIComponent(body.id)}`,{method:'PATCH',headers:{...ctx.headers,Prefer:'return=representation'},body:JSON.stringify({status:body.status,updated_at:new Date().toISOString()}),cache:'no-store'});if(!r.ok)return NextResponse.json({error:'update_failed'},{status:400});const data=await r.json();return NextResponse.json({data:data[0]});
 }
 return NextResponse.json({error:'invalid_action'},{status:400});
}
