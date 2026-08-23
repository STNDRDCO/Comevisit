'use client';

import Link from 'next/link';
import {useEffect,useMemo,useRef,useState} from 'react';
import './style.css';

type Listing={id:string;slug:string;title:string;category:string;neighborhood:string;venue:string|null;starts_at:string;expires_at:string;price_label:string|null;description:string|null;destination_type:string;destination_url:string;latitude:number|null;longitude:number|null};
type When='TODOS'|'AHORA'|'HOY'|'ESTA NOCHE'|'MAÑANA'|'FINDE'|'PRÓXIMOS';
type View='LISTA'|'MAPA';
const whens:When[]=['TODOS','AHORA','HOY','ESTA NOCHE','MAÑANA','FINDE','PRÓXIMOS'];
const BA='America/Argentina/Buenos_Aires';
const dayKey=(d:Date)=>new Intl.DateTimeFormat('en-CA',{timeZone:BA,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const localHour=(d:Date)=>Number(new Intl.DateTimeFormat('en-GB',{timeZone:BA,hour:'2-digit',hour12:false}).format(d));
const isWeekend=(d:Date)=>['sábado','domingo'].includes(new Intl.DateTimeFormat('es-AR',{timeZone:BA,weekday:'long'}).format(d).toLowerCase());
const formatDate=(iso:string)=>new Intl.DateTimeFormat('es-AR',{timeZone:BA,weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso)).replace(',',' ·').toUpperCase();
const distanceKm=(a:{lat:number;lon:number},b:{lat:number;lon:number})=>{const R=6371;const dLat=(b.lat-a.lat)*Math.PI/180;const dLon=(b.lon-a.lon)*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
const cta=(type:string)=>type==='instagram'?'Ver Instagram ↗':type==='whatsapp'?'Abrir WhatsApp ↗':type==='checkout'?'Comprar ↗':'Ir a la web ↗';

function matchWhen(x:Listing,when:When){
  if(when==='TODOS')return true;
  const now=new Date();const start=new Date(x.starts_at);const today=dayKey(now);const eventDay=dayKey(start);const tomorrow=dayKey(new Date(now.getTime()+86400000));
  if(when==='AHORA')return new Date(x.expires_at)>now&&start.getTime()<=now.getTime()+4*3600000;
  if(when==='HOY')return eventDay===today;
  if(when==='ESTA NOCHE')return eventDay===today&&localHour(start)>=20;
  if(when==='MAÑANA')return eventDay===tomorrow;
  if(when==='FINDE')return isWeekend(start)&&start.getTime()<now.getTime()+8*86400000;
  return start.getTime()>now.getTime()+86400000;
}

function EventMap({items,user}:{items:Listing[];user:null|{lat:number;lon:number}}){
  const ref=useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    let map:any;let cancelled=false;
    const boot=()=>{
      if(cancelled||!ref.current)return;
      const L=(window as any).L;if(!L)return;
      if((ref.current as any)._leaflet_id)return;
      map=L.map(ref.current,{scrollWheelZoom:false}).setView([-34.595,-58.43],12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
      const pts:arrayLike<any>=[] as any;
      items.filter(x=>x.latitude!=null&&x.longitude!=null).forEach(x=>{const marker=L.marker([x.latitude,x.longitude]).addTo(map).bindPopup(`<b>${x.title.replace(/[<>]/g,'')}</b><br>${x.neighborhood.replace(/[<>]/g,'')}`);(pts as any).push(marker.getLatLng())});
      if(user){L.circleMarker([user.lat,user.lon],{radius:7}).addTo(map).bindPopup('Estás acá');(pts as any).push(L.latLng(user.lat,user.lon))}
      if((pts as any).length>1)map.fitBounds(L.latLngBounds(pts as any).pad(.18));
    };
    const existing=(window as any).L;
    if(existing)boot();
    else{
      if(!document.querySelector('link[data-cm-leaflet]')){const link=document.createElement('link');link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';link.setAttribute('data-cm-leaflet','1');document.head.appendChild(link)}
      const script=document.querySelector('script[data-cm-leaflet]') as HTMLScriptElement|null;
      if(script)script.addEventListener('load',boot,{once:true});
      else{const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.setAttribute('data-cm-leaflet','1');s.onload=boot;document.body.appendChild(s)}
    }
    return()=>{cancelled=true;if(map)map.remove()};
  },[items,user]);
  return <div ref={ref} className="eventMap"/>;
}

type arrayLike<T>=T[];

export default function Explorar(){
  const [all,setAll]=useState<Listing[]>([]);const [loading,setLoading]=useState(true);const [query,setQuery]=useState('');const [when,setWhen]=useState<When>('TODOS');const [category,setCategory]=useState('TODAS');const [zone,setZone]=useState('TODOS');const [price,setPrice]=useState('TODOS');const [radius,setRadius]=useState(0);const [user,setUser]=useState<null|{lat:number;lon:number}>(null);const [geoMessage,setGeoMessage]=useState('');const [view,setView]=useState<View>('LISTA');const [saved,setSaved]=useState<string[]>([]);
  useEffect(()=>{setSaved(JSON.parse(localStorage.getItem('cm5_saved')||'[]'));fetch('/api/cm/listings').then(r=>r.json()).then(x=>setAll(Array.isArray(x?.data)?x.data:[])).catch(()=>{}).finally(()=>setLoading(false))},[]);
  const categories=useMemo(()=>['TODAS',...Array.from(new Set(all.map(x=>x.category)))],[all]);const zones=useMemo(()=>['TODOS',...Array.from(new Set(all.map(x=>x.neighborhood)))],[all]);
  const askLocation=()=>{setGeoMessage('Buscando tu ubicación…');navigator.geolocation?.getCurrentPosition(p=>{setUser({lat:p.coords.latitude,lon:p.coords.longitude});setRadius(3);setGeoMessage('')},()=>setGeoMessage('No pudimos usar tu ubicación. Podés seguir filtrando por barrio.'),{enableHighAccuracy:false,timeout:8000})};
  const filtered=useMemo(()=>all.filter(x=>{const hay=`${x.title} ${x.description||''} ${x.venue||''} ${x.neighborhood}`.toLowerCase();if(query&&!hay.includes(query.toLowerCase()))return false;if(!matchWhen(x,when))return false;if(category!=='TODAS'&&x.category!==category)return false;if(zone!=='TODOS'&&x.neighborhood!==zone)return false;if(price==='GRATIS'&&!/gratis/i.test(x.price_label||''))return false;if(price==='PAGO'&&/gratis/i.test(x.price_label||''))return false;if(radius&&user&&x.latitude!=null&&x.longitude!=null&&distanceKm(user,{lat:x.latitude,lon:x.longitude})>radius)return false;return true}).sort((a,b)=>new Date(a.starts_at).getTime()-new Date(b.starts_at).getTime()),[all,query,when,category,zone,price,radius,user]);
  const toggleSave=(slug:string)=>setSaved(prev=>{const next=prev.includes(slug)?prev.filter(x=>x!==slug):[...prev,slug];localStorage.setItem('cm5_saved',JSON.stringify(next));return next});
  return <main className="explorePage">
    <header className="exploreTop"><Link href="/che-mira-v5" className="exploreLogo">CHE, MIRÁ</Link><nav><Link href="/che-mira-v5#ojo">Ojo Acá</Link><Link href="/che-mira-v5/guardados">Mis planes</Link><Link className="newListing" href="/che-mira-v5/publicar">+ Publicar</Link></nav></header>
    <section className="exploreHero"><div><span>BUENOS AIRES</span><h1>Explorar.</h1><p>Buscá lo que querés sin que Che, Mirá decida qué es “mejor”.</p></div><div className="searchBox"><label>BUSCAR</label><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="jazz, pasta, feria, Chacarita…" autoFocus/></div></section>
    <section className="exploreControls">
      <div className="filterGroup wide"><label>CUÁNDO</label><div className="chips">{whens.map(x=><button key={x} className={when===x?'active':''} onClick={()=>setWhen(x)}>{x}</button>)}</div></div>
      <div className="filterGroup"><label>QUÉ</label><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="filterGroup"><label>DÓNDE</label><select value={zone} onChange={e=>setZone(e.target.value)}>{zones.map(x=><option key={x}>{x}</option>)}</select></div>
      <div className="filterGroup"><label>PRECIO</label><div className="chips small">{['TODOS','GRATIS','PAGO'].map(x=><button key={x} className={price===x?'active':''} onClick={()=>setPrice(x)}>{x}</button>)}</div></div>
      <div className="filterGroup near"><label>CERCA MÍO</label>{!user?<button className="locationBtn" onClick={askLocation}>Usar ubicación</button>:<div className="chips small">{[0,1,3,5].map(x=><button key={x} className={radius===x?'active':''} onClick={()=>setRadius(x)}>{x===0?'TODO':`${x} KM`}</button>)}</div>}{geoMessage&&<small>{geoMessage}</small>}</div>
    </section>
    <section className="resultBar"><div><b>{loading?'…':filtered.length}</b> resultados <span>· ordenados por fecha y hora</span></div><div className="viewToggle"><button className={view==='LISTA'?'active':''} onClick={()=>setView('LISTA')}>Lista</button><button className={view==='MAPA'?'active':''} onClick={()=>setView('MAPA')}>Mapa</button></div></section>
    {view==='MAPA'?<section className="mapLayout"><EventMap items={filtered} user={user}/><div className="mapSide">{filtered.slice(0,8).map(x=><Link href={`/che-mira-v5/p/${x.slug}`} key={x.slug}><small>{formatDate(x.starts_at)} · {x.neighborhood}</small><b>{x.title}</b><span>{x.price_label||'Consultar'}</span></Link>)}</div></section>:<section className="resultsList">{loading&&<div className="exploreEmpty">Cargando oferta…</div>}{!loading&&filtered.map(x=><article key={x.slug}><div className="resultWhen"><strong>{formatDate(x.starts_at)}</strong><span>{x.category}</span></div><div className="resultMain"><h2><Link href={`/che-mira-v5/p/${x.slug}`}>{x.title}</Link></h2><p><b>{x.neighborhood}</b>{x.venue?` · ${x.venue}`:''}</p><small>{x.description}</small>{user&&x.latitude!=null&&x.longitude!=null&&<em>{distanceKm(user,{lat:x.latitude,lon:x.longitude}).toFixed(1)} km de vos</em>}</div><div className="resultActions"><strong>{x.price_label||'Consultar'}</strong><button className={saved.includes(x.slug)?'save saved':'save'} onClick={()=>toggleSave(x.slug)}>{saved.includes(x.slug)?'♥':'♡'}</button><a href={x.destination_url} target="_blank" rel="noreferrer">{cta(x.destination_type)}</a></div></article>)}{!loading&&filtered.length===0&&<div className="exploreEmpty"><b>No hay nada con esos filtros.</b><p>Probá abrir la búsqueda o mirar otra ventana.</p></div>}</section>}
  </main>
}
