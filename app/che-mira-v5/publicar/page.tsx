'use client';

import Link from 'next/link';
import {FormEvent,useEffect,useState} from 'react';
import './style.css';

type FormState={title:string;category:string;date:string;time:string;neighborhood:string;venue:string;price:string;description:string;destinationType:string;destination:string};
const initial:FormState={title:'',category:'',date:'',time:'',neighborhood:'',venue:'',price:'',description:'',destinationType:'Instagram',destination:''};
const categories=['Comer','Música','Salir','Cultura','Experiencias'];
const neighborhoods=['Palermo','Chacarita','Villa Crespo','Almagro','Caballito','Colegiales','San Telmo','Recoleta','Núñez','Otro'];
const destinations=['Instagram','WhatsApp','Web','Checkout / entradas'];

function prettyDate(date:string,time:string){if(!date&&!time)return'CUÁNDO PASA';const d=date?new Date(`${date}T12:00:00`):null;const day=d?new Intl.DateTimeFormat('es-AR',{weekday:'short',day:'numeric',month:'short'}).format(d).toUpperCase():'';return[day,time].filter(Boolean).join(' · ')}

export default function Publicar(){
  const [form,setForm]=useState<FormState>(initial);
  const [published,setPublished]=useState(false);
  const [createdSlug,setCreatedSlug]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState('');
  const set=(key:keyof FormState,value:string)=>setForm(prev=>({...prev,[key]:value}));

  useEffect(()=>{const raw=localStorage.getItem('cm_publish_draft');if(raw){try{setForm({...initial,...JSON.parse(raw)})}catch{}}},[]);
  const valid=Boolean(form.title&&form.category&&form.date&&form.time&&form.neighborhood&&form.destination);

  const submit=async(e:FormEvent)=>{
    e.preventDefault();if(!valid||submitting)return;setError('');
    const token=localStorage.getItem('cm_access_token');
    if(!token){localStorage.setItem('cm_publish_draft',JSON.stringify(form));window.location.href='/che-mira-v5/acceso?next=/che-mira-v5/publicar';return}
    setSubmitting(true);
    const res=await fetch('/api/cm/listings',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(form)});
    const data=await res.json().catch(()=>({}));setSubmitting(false);
    if(res.status===401){localStorage.setItem('cm_publish_draft',JSON.stringify(form));localStorage.removeItem('cm_access_token');window.location.href='/che-mira-v5/acceso?next=/che-mira-v5/publicar';return}
    if(!res.ok){setError(data?.error==='invalid_date'?'La fecha tiene que estar en el futuro.':'No pudimos publicar. Revisá los datos e intentá de nuevo.');return}
    localStorage.removeItem('cm_publish_draft');setCreatedSlug(data.data.slug);setPublished(true);
  };

  const copy=async()=>{if(!createdSlug)return;await navigator.clipboard?.writeText(`${window.location.origin}/che-mira-v5/p/${createdSlug}`)};

  if(published){return <main className="pub pubSuccess"><header className="pubTop"><Link href="/che-mira-v5" className="pubLogo">CHE, MIRÁ</Link><span>PUBLICAR</span></header><section className="successCard"><div className="successMark">✓</div><span>PUBLICACIÓN LISTA</span><h1>Ya está arriba.</h1><p><b>{form.title}</b> entró al feed abierto con su hora real de publicación.</p><div className="shareUrl"><small>TU LINK</small><strong>comevisit.vercel.app/che-mira-v5/p/{createdSlug}</strong><button onClick={copy}>Copiar link</button></div><div className="successActions"><Link href={`/che-mira-v5/p/${createdSlug}`}>Ver publicación</Link><Link className="promote" href={`/che-mira-v5/ojo?listing=${encodeURIComponent(createdSlug)}`}>Entrar a Ojo Acá →</Link></div><p className="successNote">La exposición orgánica nace al publicar. La atención adicional se disputa aparte en Ojo Acá.</p></section></main>}

  return <main className="pub">
    <header className="pubTop"><Link href="/che-mira-v5" className="pubLogo">CHE, MIRÁ</Link><span>PUBLICAR</span><Link href="/che-mira-v5" className="close">Cerrar</Link></header>
    <section className="pubIntro"><div><span>SUBÍ ALGO</span><h1>¿Qué querés<br/>mostrar?</h1></div><p>Una publicación simple. Sin armar una página, sin cargar un catálogo. Poné lo necesario y mandá a la gente adonde quieras.</p></section>
    <div className="pubLayout"><form onSubmit={submit} className="pubForm">
      <section className="formSection"><span className="step">01 · LO BÁSICO</span><label><b>¿Qué pasa?</b><input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Ej. Cata de vinos naturales" autoFocus/></label><div className="twoCols"><label><b>Categoría</b><select value={form.category} onChange={e=>set('category',e.target.value)}><option value="">Elegí una</option>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label><b>Barrio</b><select value={form.neighborhood} onChange={e=>set('neighborhood',e.target.value)}><option value="">Elegí uno</option>{neighborhoods.map(x=><option key={x}>{x}</option>)}</select></label></div><label><b>Lugar <small>opcional</small></b><input value={form.venue} onChange={e=>set('venue',e.target.value)} placeholder="Nombre del lugar o dirección"/></label></section>
      <section className="formSection"><span className="step">02 · CUÁNDO</span><div className="twoCols"><label><b>Fecha</b><input type="date" value={form.date} onChange={e=>set('date',e.target.value)}/></label><label><b>Hora</b><input type="time" value={form.time} onChange={e=>set('time',e.target.value)}/></label></div></section>
      <section className="formSection"><span className="step">03 · INFO</span><label><b>Una línea para entenderlo</b><textarea maxLength={140} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Qué incluye, qué tiene de especial, qué debería saber alguien antes de entrar."/><small className="counter">{form.description.length}/140</small></label><label><b>Precio <small>opcional</small></b><input value={form.price} onChange={e=>set('price',e.target.value)} placeholder="Ej. $35.000, Gratis, Desde $12.000"/></label></section>
      <section className="formSection destinationSection"><span className="step">04 · ¿A DÓNDE LOS MANDÁS?</span><div className="destinations">{destinations.map(x=><button type="button" key={x} onClick={()=>set('destinationType',x)} className={form.destinationType===x?'active':''}>{x}</button>)}</div><label><b>Link</b><input type="url" value={form.destination} onChange={e=>set('destination',e.target.value)} placeholder="https://..."/></label><p>Che, Mirá no necesita cerrar la venta. Vos elegís dónde termina la acción.</p></section>
      {error&&<div className="publishError">{error}</div>}
      <div className="publishBottom"><div><span>PRIMERA PUBLICACIÓN</span><strong>Gratis</strong><small>El microcargo anti-spam todavía no está activo.</small></div><button type="submit" disabled={!valid||submitting}>{submitting?'Publicando…':'Publicar ahora →'}</button></div>
    </form>
    <aside className="previewWrap"><span>ASÍ SE VA A VER</span><article className="previewCard"><div className="previewPosted"><b>AHORA</b><small>PUBLICADO</small></div><div className="previewMain"><span>{prettyDate(form.date,form.time)}</span><small>{form.category||'CATEGORÍA'}</small><h2>{form.title||'Tu publicación'}</h2><p><b>{form.neighborhood||'BARRIO'}</b>{form.description?` · ${form.description}`:' · Una línea clara para contar qué pasa.'}</p></div><div className="previewAction"><strong>{form.price||'PRECIO'}</strong><button type="button">{form.destinationType==='WhatsApp'?'Abrir WhatsApp ↗':form.destinationType==='Instagram'?'Ver Instagram ↗':form.destinationType==='Checkout / entradas'?'Comprar entrada ↗':'Ir a la web ↗'}</button></div></article><div className="previewRules"><p><b>Sin imagen también funciona.</b> La estructura hace el trabajo.</p><p>Editar después no vuelve a subirte en el feed.</p></div></aside></div>
  </main>
}
