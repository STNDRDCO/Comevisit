'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import './style.css';

type Market='HOY'|'ESTA NOCHE'|'MAÑANA'|'FINDE'|'PRÓXIMOS';
type Listing={id:string;title:string;startsAt:string;eligible:Market[]};
type Bid={slug?:string;title:string;amount:number};
type Mine={slug:string;title:string;starts_at:string;expires_at:string;status:string};
type RemoteBid={amount_minor:number;listing:null|{slug:string;title:string;neighborhood:string;starts_at:string}};
type Wallet={account:{balance_minor:number};paymentsConfigured:boolean};
const fallbackListings:Listing[]=[{id:'cata-vinos-naturales',title:'Cata de vinos naturales',startsAt:new Date().toISOString(),eligible:['HOY']},{id:'dj-set-vinilos',title:'DJ set + vinilos',startsAt:new Date().toISOString(),eligible:['ESTA NOCHE']}];
const fallbackBids:Record<Market,Bid[]>={'HOY':[{title:'Noche de Pizzas',amount:31500},{title:'Jazz en un living',amount:21800}], 'ESTA NOCHE':[{title:'Fiesta Bohemia',amount:42100},{title:'Stand up en vivo',amount:24700}], 'MAÑANA':[{title:'Sunset en rooftop',amount:15400}], 'FINDE':[{title:'Feria de diseño',amount:36400},{title:'Brunch de autor',amount:29100}], 'PRÓXIMOS':[{title:'Festival japonés',amount:28600},{title:'Cena en seis pasos',amount:21300}]};
const money=(n:number)=>'$'+new Intl.NumberFormat('es-AR').format(n);
const BA='America/Argentina/Buenos_Aires';
const parts=(d:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:BA,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',weekday:'short',hour12:false}).formatToParts(d).reduce<Record<string,string>>((a,p)=>{a[p.type]=p.value;return a},{});
const dayKey=(d:Date)=>{const p=parts(d);return`${p.year}-${p.month}-${p.day}`};
function eligibleMarkets(iso:string):Market[]{
  const event=new Date(iso);const now=new Date();const e=parts(event);const today=dayKey(now);const tomorrow=dayKey(new Date(now.getTime()+86400000));const key=dayKey(event);const out:Market[]=[];
  if(key===today){out.push('HOY');if(Number(e.hour)>=20||Number(e.hour)<6)out.push('ESTA NOCHE')}
  if(key===tomorrow)out.push('MAÑANA');
  if((e.weekday==='Sat'||e.weekday==='Sun')&&event.getTime()<now.getTime()+8*86400000)out.push('FINDE');
  if(event.getTime()>new Date(tomorrow+'T23:59:59-03:00').getTime())out.push('PRÓXIMOS');
  return [...new Set(out)];
}

export default function OjoFlow(){
  const [listings,setListings]=useState<Listing[]>(fallbackListings);const [listingId,setListingId]=useState(fallbackListings[0].id);const [market,setMarket]=useState<Market>('HOY');const [amount,setAmount]=useState(32000);const [liveBids,setLiveBids]=useState<Bid[]|null>(null);const [auth,setAuth]=useState(false);const [balance,setBalance]=useState(0);const [paymentsConfigured,setPaymentsConfigured]=useState(false);const [loadingBid,setLoadingBid]=useState(false);const [message,setMessage]=useState('');const [success,setSuccess]=useState(false);
  const listing=listings.find(x=>x.id===listingId)||listings[0];

  const loadWallet=()=>{const token=localStorage.getItem('cm_access_token');if(!token)return;fetch('/api/cm/wallet',{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.ok?r.json():Promise.reject()).then(({data}:{data:Wallet})=>{setBalance(data.account?.balance_minor||0);setPaymentsConfigured(Boolean(data.paymentsConfigured))}).catch(()=>{})};
  useEffect(()=>{const requested=new URLSearchParams(window.location.search).get('listing');const token=localStorage.getItem('cm_access_token');if(!token){if(requested&&fallbackListings.some(x=>x.id===requested))setListingId(requested);return}setAuth(true);loadWallet();fetch('/api/cm/mine',{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.ok?r.json():Promise.reject()).then(({data}:{data:Mine[]})=>{const owned=data.filter(x=>x.status==='active'&&new Date(x.expires_at)>new Date()).map(x=>({id:x.slug,title:x.title,startsAt:x.starts_at,eligible:eligibleMarkets(x.starts_at)})).filter(x=>x.eligible.length);if(owned.length){setListings(owned);const selected=owned.find(x=>x.id===requested)||owned[0];setListingId(selected.id);setMarket(selected.eligible[0])}else setListings([])}).catch(()=>{})},[]);
  useEffect(()=>{setSuccess(false);setMessage('');setLiveBids(null);fetch(`/api/cm/ojo?market=${encodeURIComponent(market)}`).then(r=>r.ok?r.json():Promise.reject()).then(({data}:{data:RemoteBid[]})=>{const rows=data.filter(x=>x.listing).map(x=>({slug:x.listing!.slug,title:x.listing!.title,amount:x.amount_minor}));setLiveBids(rows);const mine=rows.find(x=>x.slug===listingId);const others=rows.filter(x=>x.slug!==listingId);const floor=others.at(-1)?.amount||0;setAmount(mine?mine.amount+100:Math.max(100,floor+100))}).catch(()=>setLiveBids([]))},[market,listingId]);

  if(auth&&!listings.length)return <main className="ojoFlow"><header className="ojoTop"><Link href="/che-mira-v5" className="ojoLogo">CHE, MIRÁ</Link><span>OJO ACÁ</span><Link href="/che-mira-v5/wallet">Saldo {money(balance)}</Link></header><section className="ojoConfirmed"><span>NECESITÁS UNA PUBLICACIÓN VIGENTE</span><h1>Primero, algo para mostrar.</h1><p>Ojo Acá empuja publicaciones reales. Creá una o repetí una fecha anterior y después volvé.</p><div className="confirmActions"><Link href="/che-mira-v5/publicar">+ Publicar</Link><Link href="/che-mira-v5/mis-publicaciones">Mis publicaciones</Link></div></section></main>;

  const chooseListing=(id:string)=>{const next=listings.find(x=>x.id===id)!;setListingId(id);setMarket(next.eligible[0]);setMessage('');setSuccess(false)};
  const allLive=liveBids||fallbackBids[market];const current=allLive.find(x=>x.slug===listing.id)?.amount||0;const existing=allLive.filter(x=>x.slug!==listing.id&&x.title!==listing.title);
  const ranked=useMemo(()=>[...existing,{slug:listing.id,title:listing.title,amount}].sort((a,b)=>b.amount-a.amount),[existing,listing.id,listing.title,amount]);
  const position=ranked.findIndex(x=>x.slug===listing.id)+1;const leader=existing[0]?.amount||0;const floor=existing.at(-1)?.amount||0;const delta=Math.max(0,amount-current);const toFirst=Math.max(0,leader+100-amount);

  const confirm=async()=>{
    if(!auth){window.location.href=`/che-mira-v5/acceso?next=${encodeURIComponent('/che-mira-v5/ojo?listing='+listing.id)}`;return}
    if(amount<=current){setMessage(`Tu puja activa ya es ${money(current)}. Para subir, elegí un monto mayor.`);return}
    if(delta>balance){setMessage(`Te faltan ${money(delta-balance)} de saldo para confirmar esta puja.`);return}
    const token=localStorage.getItem('cm_access_token');if(!token)return;setLoadingBid(true);setMessage('');
    const r=await fetch('/api/cm/ojo/bid',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({listing:listing.id,market,targetAmount:amount})});const x=await r.json().catch(()=>({}));setLoadingBid(false);
    if(!r.ok){if(x?.error==='insufficient_balance')setMessage('No alcanza tu saldo. Cargá saldo y volvé a confirmar.');else if(x?.error==='listing_not_eligible')setMessage('La fecha del evento ya no es compatible con esta ventana.');else setMessage('No pudimos guardar la puja. Actualizá el ranking e intentá de nuevo.');return}
    setBalance(x.data.balance_minor);setSuccess(true);setMessage(`Puja confirmada. Se descontaron ${money(x.data.delta_minor)} de tu saldo.`);
    const fresh=await fetch(`/api/cm/ojo?market=${encodeURIComponent(market)}`).then(r=>r.json()).catch(()=>({data:[]}));if(Array.isArray(fresh?.data)){setLiveBids(fresh.data.filter((b:RemoteBid)=>b.listing).map((b:RemoteBid)=>({slug:b.listing!.slug,title:b.listing!.title,amount:b.amount_minor})))}
  };

  return <main className="ojoFlow"><header className="ojoTop"><Link href="/che-mira-v5" className="ojoLogo">CHE, MIRÁ</Link><span>OJO ACÁ</span><Link href="/che-mira-v5/wallet">Saldo · {auth?money(balance):'Entrar'}</Link></header><section className="ojoTitle"><div><span>COMPRÁ ATENCIÓN</span><h1>Entrá a<br/>Ojo Acá.</h1></div><p>No comprás reputación ni una recomendación. Comprás una posición visible en un ranking público.</p></section><div className="ojoLayout"><section className="ojoControls">
    <div className="flowBlock"><span>01 · QUÉ QUERÉS EMPUJAR</span><select value={listingId} onChange={e=>chooseListing(e.target.value)}>{listings.map(x=><option value={x.id} key={x.id}>{x.title}</option>)}</select>{!auth&&<small><Link href="/che-mira-v5/acceso?next=/che-mira-v5/ojo">Entrá a tu cuenta</Link> para competir con tus publicaciones reales.</small>}</div>
    <div className="flowBlock"><span>02 · EN QUÉ VENTANA</span><div className="marketChoices">{listing.eligible.map(x=><button className={market===x?'active':''} onClick={()=>setMarket(x)} key={x}>{x}</button>)}</div><small>Las ventanas compatibles salen de la fecha del evento.</small></div>
    <div className="flowBlock moneyBlock"><span>03 · CUÁNTA ATENCIÓN</span>{current>0&&<small className="currentBid">Tu puja activa: <b>{money(current)}</b>. Sólo pagás la diferencia al subir.</small>}<label><small>TU NUEVA PUJA</small><div><b>$</b><input type="number" min={Math.max(100,current+100)} step="100" value={amount} onChange={e=>setAmount(Math.max(0,Number(e.target.value)))}/></div></label><div className="quickMoney"><button onClick={()=>setAmount(Math.max(current+100,floor+100))}>Entrar/subir · {money(Math.max(current+100,floor+100))}</button><button onClick={()=>setAmount(Math.max(current+100,leader+100))}>Ir al #1 · {money(Math.max(current+100,leader+100))}</button></div></div>
    <div className="flowSummary"><div><span>RESULTADO AHORA</span><strong>#{position}</strong><p>{position===1?'Quedarías arriba de todos.':`Te faltan ${money(toFirst)} para quedar #1.`}</p><p className="debit">Se debitan ahora: <b>{money(delta)}</b></p></div><button onClick={confirm} disabled={loadingBid}>{loadingBid?'Confirmando…':auth?'Confirmar puja →':'Entrar para confirmar →'}</button><small>Saldo disponible: {money(balance)}. {paymentsConfigured?'Podés recargar con Mercado Pago.':'Mercado Pago queda habilitado al cargar las credenciales privadas.'}</small></div>
    {message&&<div className={success?'bidMessage success':'bidMessage'}>{message}{!success&&auth&&delta>balance&&<Link href="/che-mira-v5/wallet">Cargar saldo →</Link>}</div>}
  </section><aside className="liveMarket"><div className="liveHead"><span>RANKING EN VIVO</span><h2>{market}</h2><p>La vista previa cambia antes de confirmar.</p></div><div className="liveRanks">{ranked.map((x,i)=><article key={`${x.slug||x.title}-${i}`} className={x.slug===listing.id||x.title===listing.title?'you':''}><b>#{i+1}</b><div><strong>{x.title}</strong>{(x.slug===listing.id||x.title===listing.title)&&<span>VOS · {success?'ACTIVO':'PREVIEW'}</span>}</div><strong>{money(x.amount)}</strong></article>)}</div><div className="marketRule"><b>La regla completa:</b><p>Más plata acumulada en esta ventana = posición más alta. Sin score oculto.</p></div></aside></div></main>
}
