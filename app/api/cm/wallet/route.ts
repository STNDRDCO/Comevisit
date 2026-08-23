import {NextRequest,NextResponse} from 'next/server';

const URL=process.env.SUPABASE_URL||'https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';
const base={apikey:KEY,'Content-Type':'application/json'};
async function userFor(token:string){const r=await fetch(`${URL}/auth/v1/user`,{headers:{apikey:KEY,Authorization:`Bearer ${token}`},cache:'no-store'});if(!r.ok)return null;const u=await r.json();return u?.id?u:null}

export async function GET(req:NextRequest){
  const token=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');if(!token)return NextResponse.json({error:'auth_required'},{status:401});const user=await userFor(token);if(!user)return NextResponse.json({error:'invalid_session'},{status:401});const headers={...base,Authorization:`Bearer ${token}`};
  const [a,e,t]=await Promise.all([
    fetch(`${URL}/rest/v1/cm_wallet_accounts?select=user_id,currency,balance_minor,updated_at&user_id=eq.${user.id}`,{headers,cache:'no-store'}),
    fetch(`${URL}/rest/v1/cm_wallet_entries?select=id,delta_minor,balance_after_minor,kind,reference_type,reference_id,metadata,created_at&user_id=eq.${user.id}&order=created_at.desc&limit=50`,{headers,cache:'no-store'}),
    fetch(`${URL}/rest/v1/cm_payment_topups?select=id,amount_minor,status,preference_id,payment_id,init_point,live_mode,created_at,updated_at&user_id=eq.${user.id}&order=created_at.desc&limit=20`,{headers,cache:'no-store'})
  ]);
  const account=a.ok?(await a.json())[0]||{currency:'ARS',balance_minor:0}: {currency:'ARS',balance_minor:0};
  return NextResponse.json({data:{account,entries:e.ok?await e.json():[],topups:t.ok?await t.json():[],paymentsConfigured:Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN&&process.env.MERCADOPAGO_WEBHOOK_SECRET&&process.env.SUPABASE_SERVICE_ROLE_KEY)}},{headers:{'Cache-Control':'no-store'}});
}
