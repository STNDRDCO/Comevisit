import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const base={apikey:KEY,'Content-Type':'application/json'};
async function userFor(token:string){const r=await fetch(`${URL}/auth/v1/user`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`},cache:'no-store'});if(!r.ok)return null;const u=await r.json();return u?.id?u:null}
async function adminContext(req:NextRequest){const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return{error:'auth_required',status:401} as const;const user=await userFor(token);if(!user)return{error:'invalid_session',status:401} as const;const service=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!service)return{error:'admin_backend_not_configured',status:503} as const;const h={apikey:service,Authorization:`Bearer ${service}`,'Content-Type':'application/json'};const r=await fetch(`${URL}/rest/v1/cm_admins?select=user_id&user_id=eq.${user.id}&limit=1`,{headers:h,cache:'no-store'});const rows=r.ok?await r.json():[];if(!rows[0])return{error:'forbidden',status:403} as const;return{user,headers:h} as const}

export async function GET(req:NextRequest){
  const ctx=await adminContext(req);if('error'in ctx)return NextResponse.json({error:ctx.error},{status:ctx.status});
  const [reports,claims,metrics]=await Promise.all([
    fetch(`${URL}/rest/v1/cm_reports?select=id,listing_id,reporter_id,reason,detail,status,created_at,listing:cm_listings(slug,title,neighborhood,starts_at)&status=eq.open&order=created_at.asc`,{headers:ctx.headers,cache:'no-store'}),
    fetch(`${URL}/rest/v1/cm_claims?select=id,listing_id,claimant_id,note,status,created_at,listing:cm_listings(slug,title,neighborhood,starts_at)&status=eq.pending&order=created_at.asc`,{headers:ctx.headers,cache:'no-store'}),
    fetch(`${URL}/rest/v1/rpc/cm_alpha_metrics_admin`,{method:'POST',headers:ctx.headers,body:'{}',cache:'no-store'})
  ]);
  return NextResponse.json({data:{reports:reports.ok?await reports.json():[],claims:claims.ok?await claims.json():[],metrics:metrics.ok?await metrics.json():null}},{headers:{'Cache-Control':'no-store'}});
}

export async function POST(req:NextRequest){
  const ctx=await adminContext(req);if('error'in ctx)return NextResponse.json({error:ctx.error},{status:ctx.status});const body=await req.json().catch(()=>null) as null|{kind?:'report'|'claim';id?:string;action?:string};if(!body?.kind||!body.id||!body.action)return NextResponse.json({error:'invalid_request'},{status:400});
  const fn=body.kind==='report'?'cm_resolve_report_admin':'cm_resolve_claim_admin';const payload=body.kind==='report'?{p_report_id:body.id,p_action:body.action}:{p_claim_id:body.id,p_action:body.action};
  const r=await fetch(`${URL}/rest/v1/rpc/${fn}`,{method:'POST',headers:ctx.headers,body:JSON.stringify(payload),cache:'no-store'});if(!r.ok)return NextResponse.json({error:'action_failed',detail:(await r.text()).slice(0,250)},{status:400});return NextResponse.json({ok:true});
}
