'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import './style.css';

type SavedItem={id:string;title:string;starts_at:string;expires_at:string;date:string;place:string;venue:string|null;category:string;price:string;description:string|null;destination_url:string};
type RemoteListing={slug:string;title:string;category:string;neighborhood:string;venue:string|null;starts_at:string;expires_at:string;price_label:string|null;description:string|null;destination_url:string};
const aliases:Record<string,string>={cata:'cata-vinos-naturales',dj:'dj-set-vinilos',parrilla:'menu-parrilla-pasos',standup:'standup-en-vivo',pasta:'taller-pasta-fresca',feria:'feria-diseno-independiente',jazz:'jazz-en-un-living',brunch:'brunch-de-autor',festival:'festival-japones',rooftop:'sunset-rooftop'};
const BA='America/Argentina/Buenos_Aires';
const formatDate=(iso:string)=>new Intl.DateTimeFormat('es-AR',{timeZone:BA,weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso)).replace(',',' ·').toUpperCase();
const dayKey=(iso:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:BA,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));
const dayLabel=(iso:string)=>{const today=dayKey(new Date().toISOString());const tomorrow=dayKey(new Date(Date.now()+86400000).toISOString());const key=dayKey(iso);if(key===today)return'HOY';if(key===tomorrow)return'MAÑANA';return new Intl.DateTimeFormat('es-AR',{timeZone:BA,weekday:'long',day:'numeric',month:'long'}).format(new Date(iso)).toUpperCase()};
const countdown=(iso:string)=>{const ms=new Date(iso).getTime()-Date.now();if(ms<=0)return'Ya empezó';const h=Math.floor(ms/3600000);if(h<1)return'Empieza en menos de 1 h';if(h<24)return`Empieza en ${h} h`;const d=Math.floor(h/24);return`Faltan ${d} día${d===1?'':'s'}`};
const googleCalendar=(x:SavedItem)=>{const fmt=(d:string)=>new Date(d).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const end=new Date(new Date(x.starts_at).getTime()+2*3600000).toISOString();const q=new URLSearchParams({action:'TEMPLATE',text:x.title,dates:`${fmt(x.starts_at)}/${fmt(end)}`,details:x.description||'',location:[x.venue,x.place].filter(Boolean).join(', ')});return`https://calendar.google.com/calendar/render?${q.toString()}`};

export default function Guardados(){
  const [ids,setIds]=useState<string[]>([]);const [catalog,setCatalog]=useState<Record<string,SavedItem>>({});const [message,setMessage]=useState('');
  useEffect(()=>{const stored=JSON.parse(localStorage.getItem('cm5_saved')||'[]') as string[];setIds(stored);fetch('/api/cm/listings').then(r=>r.ok?r.json():Promise.reject()).then(({data}:{data:RemoteListing[]})=>{const next:Record<string,SavedItem>={};for(const x of data){next[x.slug]={id:x.slug,title:x.title,starts_at:x.starts_at,expires_at:x.expires_at,date:formatDate(x.starts_at),place:x.neighborhood,venue:x.venue,category:x.category,price:x.price_label||'Consultar',description:x.description,destination_url:x.destination_url}}setCatalog(next)}).catch(()=>{})},[]);
  const remove=(id:string)=>{const next=ids.filter(x=>x!==id&&!Object.entries(aliases).some(([old,current])=>old===x&&current===id));setIds(next);localStorage.setItem('cm5_saved',JSON.stringify(next))};
  const share=async(x:SavedItem)=>{const url=`${window.location.origin}/che-mira-v5/p/${x.id}?from=saved`;if(navigator.share){await navigator.share({title:x.title,url}).catch(()=>{})}else{await navigator.clipboard?.writeText(url);setMessage('Link copiado.')}};
  const saved=ids.map(original=>{const id=aliases[original]||original;return catalog[id]}).filter(Boolean).sort((a,b)=>new Date(a.starts_at).getTime()-new Date(b.starts_at).getTime());
  const groups=useMemo(()=>{const out:Record<string,SavedItem[]>={};saved.forEach(x=>{const key=dayLabel(x.starts_at);(out[key]||=[]).push(x)});return out},[saved]);

  return <main className="savedPage">
    <header className="savedTop"><Link href="/che-mira-v5" className="savedLogo">CHE, MIRÁ</Link><div><Link href="/che-mira-v5/explorar">Explorar</Link><Link className="publish" href="/che-mira-v5/publicar">+ Publicar</Link></div></header>
    <section className="savedHero"><span>MIS PLANES</span><h1>Lo que guardaste.</h1><p>Volvé, compartí y mandalo al calendario. Guardar no cambia ningún ranking.</p></section>
    {message&&<div className="savedNotice">{message}</div>}
    <section className="savedList">
      {Object.entries(groups).map(([label,items])=><section className="planGroup" key={label}><div className="planDay"><span>{label}</span><b>{items.length} plan{items.length===1?'':'es'}</b></div>{items.map(x=><article key={x.id}><div className="savedWhen"><strong>{x.date}</strong><span>{x.category}</span><em>{countdown(x.starts_at)}</em></div><div><h2><Link href={`/che-mira-v5/p/${x.id}`}>{x.title}</Link></h2><p>{x.place}{x.venue?` · ${x.venue}`:''}</p>{x.description&&<small>{x.description}</small>}</div><div className="savedActions"><b>{x.price}</b><a href={googleCalendar(x)} target="_blank" rel="noreferrer">+ Calendario</a><button onClick={()=>share(x)}>Compartir</button><button onClick={()=>remove(x.id)}>Quitar</button><Link href={`/che-mira-v5/p/${x.id}`}>Abrir ↗</Link></div></article>)}</section>)}
      {saved.length===0&&<div className="savedEmpty"><h2>Todavía no guardaste nada.</h2><p>Usá ♡ cuando algo te interese y armá acá tus próximos planes.</p><Link href="/che-mira-v5/explorar">Explorar →</Link></div>}
      {ids.length>0&&saved.length===0&&<div className="savedEmpty"><h2>Cargando tus planes…</h2></div>}
    </section>
  </main>
}
