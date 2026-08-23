'use client';

import Link from 'next/link';
import {FormEvent,useEffect,useState} from 'react';
import './style.css';

type FormState={title:string;category:string;date:string;time:string;neighborhood:string;venue:string;price:string;description:string;destinationType:string;destination:string};
type ApiListing={slug:string;title:string;category:string;starts_at:string;neighborhood:string;venue:string|null;price_label:string|null;description:string|null;destination_type:string;destination_url:string};
const initial:FormState={title:'',category:'',date:'',time:'',neighborhood:'',venue:'',price:'',description:'',destinationType:'Instagram',destination:''};
const categories=['Comer','Música','Salir','Cultura','Experiencias'];
const neighborhoods=['Palermo','Chacarita','Villa Crespo','Almagro','Caballito','Colegiales','San Telmo','Recoleta','Núñez','Otro'];
const destinations=['Instagram','WhatsApp','Web','Checkout / entradas'];
const BA='America/Argentina/Buenos_Aires';

function prettyDate(date:string,time:string){if(!date&&!time)return'CUÁNDO PASA';const d=date?new Date(`${date}T12:00:00`):null;const day=d?new Intl.DateTimeFormat('es-AR',{weekday:'short',day:'numeric',month:'short'}).format(d).toUpperCase():'';return[day,time].filter(Boolean).join(' · ')}
function localParts(iso:string,plusDays=0){const d=new Date(new Date(iso).getTime()+plusDays*86400000);const parts=new Intl.DateTimeFormat('en-CA',{timeZone:BA,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(d);const get=(t:string)=>parts.find(x=>x.type===t)?.value||'';return{date:`${get('year')}-${get('month')}-${get('day')}`,time:`${get('hour')}:${get('minute')}`}}
function destLabel(type:string){return type==='whatsapp'?'WhatsApp':type==='instagram'?'Instagram':type==='checkout'?'Checkout / entradas':'Web'}

export default function Publicar(){
  const [form,setForm]=useState<FormState>(initial);
  const [published,setPublished]=useState(false);
  const [createdSlug,setCreatedSlug]=useState('');
  const [submitting,setSubmitting]=useState(false);
  const [loadingSource,setLoadingSource]=useState(false);
  const [error,setError]=useState('');
  const [mode,setMode]=useState<'create'|'edit'>('create');
  const [editSlug,setEditSlug]=useState('');
  const [duplicating,setDuplicating]=useState(false);
  const set=(key:keyof FormState,value:string)=>setForm(prev=>({...prev,[key]:value}));

  useEffect(()=>{
    const q=new URLSearchParams(window.location.search);
    const edit=q.get('edit');const duplicate=q.get('duplicate');
    if(!edit&&!duplicate){const raw=localStorage.getItem('cm_publish_draft');if(raw){try{setForm({...initial,...JSON.parse(raw)})}catch{}}return}
    const slug=edit||duplicate||'';setLoadingSource(true);setDuplicating(Boolean(duplicate));
    fetch(`/api/cm/listings?slug=${encodeURIComponent(slug)}`).then(r=>r.json()).then(x=>{
      const item=x?.data as ApiListing|null;if(!item){setError('No encontramos esa publicación.');return}
      const p=localParts(item.starts_at,duplicate?7:0);
      setForm({title:item.title,category:item.category.charAt(0)+item.category.slice(1).toLowerCase(),date:p.date,time:p.time,neighborhood:item.neighborhood.charAt(0)+item.neighborhood.slice(1).toLowerCase(),venue:item.venue||'',price:item.price_label||'',description:item.description||'',destinationType:destLabel(item.destination_type),destination:item.destination_url});
      if(edit){setMode('edit');setEditSlug(item.slug)}
    }).catch(()=>setError('No pudimos cargar esa publicación.')).finally(()=>setLoadingSource(false));
  },[]);

  const valid=Boolean(form.title&&form.category&&form.date&&form.time&&form.neighborhood&&form.destination);

  const submit=async(e:FormEvent)=>{
    e.preventDefault();if(!valid||submitting)return;setError('');
    const token=localStorage.getItem('cm_access_token');
    if(!token){localStorage.setItem('cm_publish_draft',JSON.stringify(form));window.location.href=`/che-mira-v5/acceso?next=${encodeURIComponent(window.location.pathname+window.location.search)}`;return}
    setSubmitting(true);
    const endpoint=mode==='edit'?`/api/cm/listings/${encodeURIComponent(editSlug)}`:'/api/cm/listings';
    const method=mode==='edit'?'PATCH':'POST';
    const res=await fetch(endpoint,{method,headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(form)});
    const data=await res.json().catch(()=>({}));setSubmitting(false);
    if(res.status===401){localStorage.setItem('cm_publish_draft',JSON.stringify(form));localStorage.removeItem('cm_access_token');window.location.href=`/che-mira-v5/acceso?next=${encodeURIComponent(window.location.pathname+window.location.search)}`;return}
    if(!res.ok){setError(data?.error==='invalid_date'?'La fecha tiene que estar en el futuro.':data?.error==='possible_duplicate'?'Parece que ese mismo evento ya está publicado para ese día y barrio.':'No pudimos guardar. Revisá los datos e intentá de nuevo.');return}
    localStorage.removeItem('cm_publish_draft');setCreatedSlug(mode==='edit'?editSlug:data.data.slug);setPublished(true);
  };

  const copy=async()=>{if(!createdSlug)return;await navigator.clipboard?.writeText(`${window.location.origin}/che-mira-v5/p/${createdSlug}`)};
  const heading=mode==='edit'?'Editá lo necesario.':duplicating?'Repetilo rápido.':'¿Qué querés\nmostrar?';

  if(published){return <main className="pub pubSuccess"><header className="pubTop"><Link href="/che-mira-v5" className="pubLogo">CHE, MIRÁ</Link><span>{mode==='edit'?'EDITAR':'PUBLICAR'}</span></header><section className="successCard"><div className="successMark">✓</div><span>{mode==='edit'?'CAMBIOS GUARDADOS':'PUBLICACIÓN LISTA'}</span><h1>{mode==='edit'?'Quedó actualizado.':'Ya está arriba.'}</h1><p><b>{form.title}</b>{mode==='edit'?' mantiene su antigüedad original en el feed.':' entró al feed abierto con su hora real de publicación.'}</p><div className="shareUrl"><small>TU LINK</small><strong>comevisit.vercel.app/che-mira-v5/p/{createdSlug}</strong><button onClick={copy}>Copiar link</button></div><div className="successActions"><Link href={`/che-mira-v5/p/${createdSlug}`}>Ver publicación</Link><Link className="promote" href={`/che-mira-v5/ojo?listing=${encodeURIComponent(createdSlug)}`}>Entrar a Ojo Acá →</Link></div><p className="successNote">Editar nunca vuelve a subir una publicación. La atención adicional se disputa aparte en Ojo Acá.</p></section></main>}

  return <main className="pub">
    <header className="pubTop"><Link href="/che-mira-v5" className="pubLogo">CHE, MIRÁ</Link><span>{mode==='edit'?'EDITAR':duplicating?'REPETIR':'PUBLICAR'}</span><Link href="/che-mira-v5/mis-publicaciones" className="close">Cerrar</Link></header>
    <section className="pubIntro"><div><span>{mode==='edit'?'CORREGÍ SIN RESETEAR':duplicating?'COPIA + NUEVA FECHA':'SUBÍ ALGO'}</span><h1>{heading.split('\n').map((x,i)=><span key={x}>{x}{i===0&&heading.includes('\n')&&<br/>}</span>)}</h1></div><p>{mode==='edit'?'Podés cambiar información, horario, precio o link. La fecha de publicación original no cambia.':duplicating?'Copiamos el evento y movimos la fecha una semana. Ajustá lo que quieras y publicalo como una nueva entrada.':'Una publicación simple. Poné lo necesario y mandá a la gente adonde quieras.'}</p></section>
    {loadingSource?<div className="pubLayout"><div className="pubForm">Cargando publicación…</div></div>:<div className="pubLayout"><form onSubmit={submit} className="pubForm">
      <section className="formSection"><span className="step">01 · LO BÁSICO</span><label><b>¿Qué pasa?</b><input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Ej. Cata de vinos naturales" autoFocus/></label><div className="twoCols"><label><b>Categoría</b><select value={form.category} onChange={e=>set('category',e.target.value)}><option value="">Elegí una</option>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label><b>Barrio</b><select value={form.neighborhood} onChange={e=>set('neighborhood',e.target.value)}><option value="">Elegí uno</option>{neighborhoods.map(x=><option key={x}>{x}</option>)}</select></label></div><label><b>Lugar <small>opcional</small></b><input value={form.venue} onChange={e=>set('venue',e.target.value)} placeholder="Nombre del lugar o dirección"/></label></section>
      <section className="formSection"><span className="step">02 · CUÁNDO</span><div className="twoCols"><label><b>Fecha</b><input type="date" value={form.date} onChange={e=>set('date',e.target.value)}/></label><label><b>Hora</b><input type="time" value={form.time} onChange={e=>set('time',e.target.value)}/></label></div></section>
      <section className="formSection"><span className="step">03 · INFO</span><label><b>Una línea para entenderlo</b><textarea maxLength={140} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Qué incluye, qué tiene de especial, qué debería saber alguien antes de entrar."/><small className="counter">{form.description.length}/140</small></label><label><b>Precio <small>opcional</small></b><input value={form.price} onChange={e=>set('price',e.target.value)} placeholder="Ej. $35.000, Gratis, Desde $12.000"/></label></section>
      <section className="formSection destinationSection"><span className="step">04 · ¿A DÓNDE LOS MANDÁS?</span><div className="destinations">{destinations.map(x=><button type="button" key={x} onClick={()=>set('destinationType',x)} className={form.destinationType===x?'active':''}>{x}</button>)}</div><label><b>Link</b><input type="url" value={form.destination} onChange={e=>set('destination',e.target.value)} placeholder="https://..."/></label><p>Che, Mirá no necesita cerrar la venta. Vos elegís dónde termina la acción.</p></section>
      {error&&<div className="publishError">{error}</div>}
      <div className="publishBottom"><div><span>{mode==='edit'?'ORDEN DEL FEED':'PUBLICACIÓN'}</span><strong>{mode==='edit'?'No cambia':'Gratis ahora'}</strong><small>{mode==='edit'?'Editar no resetea published_at.':'El microcargo anti-spam todavía no está activo.'}</small></div><button type="submit" disabled={!valid||submitting}>{submitting?'Guardando…':mode==='edit'?'Guardar cambios →':'Publicar ahora →'}</button></div>
    </form>
    <aside className="previewWrap"><span>ASÍ SE VA A VER</span><article className="previewCard"><div className="previewPosted"><b>{mode==='edit'?'MISMO ORDEN':'AHORA'}</b><small>PUBLICADO</small></div><div className="previewMain"><span>{prettyDate(form.date,form.time)}</span><small>{form.category||'CATEGORÍA'}</small><h2>{form.title||'Tu publicación'}</h2><p><b>{form.neighborhood||'BARRIO'}</b>{form.description?` · ${form.description}`:' · Una línea clara para contar qué pasa.'}</p></div><div className="previewAction"><strong>{form.price||'PRECIO'}</strong><button type="button">{form.destinationType==='WhatsApp'?'Abrir WhatsApp ↗':form.destinationType==='Instagram'?'Ver Instagram ↗':form.destinationType==='Checkout / entradas'?'Comprar entrada ↗':'Ir a la web ↗'}</button></div></article><div className="previewRules"><p><b>Sin imagen también funciona.</b> La estructura hace el trabajo.</p><p>Editar después no vuelve a subirte en el feed.</p></div></aside></div>}
  </main>
}
