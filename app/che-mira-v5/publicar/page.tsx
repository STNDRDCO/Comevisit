'use client';

import Link from 'next/link';
import {FormEvent,useMemo,useState} from 'react';
import './style.css';

type FormState={
  title:string;
  category:string;
  date:string;
  time:string;
  neighborhood:string;
  venue:string;
  price:string;
  description:string;
  destinationType:string;
  destination:string;
};

const initial:FormState={
  title:'',category:'',date:'',time:'',neighborhood:'',venue:'',price:'',description:'',destinationType:'Instagram',destination:''
};

const categories=['Comer','Música','Salir','Cultura','Experiencias'];
const neighborhoods=['Palermo','Chacarita','Villa Crespo','Almagro','Caballito','Colegiales','San Telmo','Recoleta','Núñez','Otro'];
const destinations=['Instagram','WhatsApp','Web','Checkout / entradas'];

function prettyDate(date:string,time:string){
  if(!date&&!time)return 'CUÁNDO PASA';
  const d=date?new Date(`${date}T12:00:00`):null;
  const day=d?new Intl.DateTimeFormat('es-AR',{weekday:'short',day:'numeric',month:'short'}).format(d).toUpperCase():'';
  return [day,time].filter(Boolean).join(' · ');
}

export default function Publicar(){
  const [form,setForm]=useState<FormState>(initial);
  const [published,setPublished]=useState(false);
  const set=(key:keyof FormState,value:string)=>setForm(prev=>({...prev,[key]:value}));
  const slug=useMemo(()=>form.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')||'tu-publicacion',[form.title]);

  const valid=form.title&&form.category&&form.date&&form.time&&form.neighborhood&&form.destination;
  const submit=(e:FormEvent)=>{e.preventDefault();if(valid)setPublished(true)};

  if(published){
    return <main className="pub pubSuccess">
      <header className="pubTop"><Link href="/che-mira-v5" className="pubLogo">CHE, MIRÁ</Link><span>PUBLICAR</span></header>
      <section className="successCard">
        <div className="successMark">✓</div>
        <span>PUBLICACIÓN LISTA · DEMO</span>
        <h1>Ya está arriba.</h1>
        <p><b>{form.title}</b> entraría ahora al feed abierto según su hora de publicación.</p>
        <div className="shareUrl"><small>TU LINK</small><strong>che-mira.vercel.app/p/{slug}</strong><button>Copiar link</button></div>
        <div className="successActions"><Link href="/che-mira-v5">Ver en el feed</Link><button className="promote">Entrar a Ojo Acá →</button></div>
        <p className="successNote">Publicar te da exposición orgánica inicial. Si querés sostener o aumentar atención, competís en Ojo Acá.</p>
      </section>
    </main>
  }

  return <main className="pub">
    <header className="pubTop"><Link href="/che-mira-v5" className="pubLogo">CHE, MIRÁ</Link><span>PUBLICAR</span><Link href="/che-mira-v5" className="close">Cerrar</Link></header>

    <section className="pubIntro">
      <div><span>SUBÍ ALGO</span><h1>¿Qué querés<br/>mostrar?</h1></div>
      <p>Una publicación simple. Sin armar una página, sin cargar un catálogo. Poné lo necesario y mandá a la gente adonde quieras.</p>
    </section>

    <div className="pubLayout">
      <form onSubmit={submit} className="pubForm">
        <section className="formSection">
          <span className="step">01 · LO BÁSICO</span>
          <label><b>¿Qué pasa?</b><input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Ej. Cata de vinos naturales" autoFocus/></label>
          <div className="twoCols">
            <label><b>Categoría</b><select value={form.category} onChange={e=>set('category',e.target.value)}><option value="">Elegí una</option>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
            <label><b>Barrio</b><select value={form.neighborhood} onChange={e=>set('neighborhood',e.target.value)}><option value="">Elegí uno</option>{neighborhoods.map(x=><option key={x}>{x}</option>)}</select></label>
          </div>
          <label><b>Lugar <small>opcional</small></b><input value={form.venue} onChange={e=>set('venue',e.target.value)} placeholder="Nombre del lugar o dirección"/></label>
        </section>

        <section className="formSection">
          <span className="step">02 · CUÁNDO</span>
          <div className="twoCols"><label><b>Fecha</b><input type="date" value={form.date} onChange={e=>set('date',e.target.value)}/></label><label><b>Hora</b><input type="time" value={form.time} onChange={e=>set('time',e.target.value)}/></label></div>
        </section>

        <section className="formSection">
          <span className="step">03 · INFO</span>
          <label><b>Una línea para entenderlo</b><textarea maxLength={140} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Qué incluye, qué tiene de especial, qué debería saber alguien antes de entrar."/><small className="counter">{form.description.length}/140</small></label>
          <label><b>Precio <small>opcional</small></b><input value={form.price} onChange={e=>set('price',e.target.value)} placeholder="Ej. $35.000, Gratis, Desde $12.000"/></label>
        </section>

        <section className="formSection destinationSection">
          <span className="step">04 · ¿A DÓNDE LOS MANDÁS?</span>
          <div className="destinations">{destinations.map(x=><button type="button" key={x} onClick={()=>set('destinationType',x)} className={form.destinationType===x?'active':''}>{x}</button>)}</div>
          <label><b>Link</b><input type="url" value={form.destination} onChange={e=>set('destination',e.target.value)} placeholder="https://..."/></label>
          <p>Che, Mirá no necesita cerrar la venta. Vos elegís dónde termina la acción.</p>
        </section>

        <div className="publishBottom">
          <div><span>PRIMERA PUBLICACIÓN</span><strong>Gratis</strong><small>Después probaremos un microcargo anti-spam.</small></div>
          <button type="submit" disabled={!valid}>Publicar ahora →</button>
        </div>
      </form>

      <aside className="previewWrap">
        <span>ASÍ SE VA A VER</span>
        <article className="previewCard">
          <div className="previewPosted"><b>AHORA</b><small>PUBLICADO</small></div>
          <div className="previewMain"><span>{prettyDate(form.date,form.time)}</span><small>{form.category||'CATEGORÍA'}</small><h2>{form.title||'Tu publicación'}</h2><p><b>{form.neighborhood||'BARRIO'}</b>{form.description?` · ${form.description}`:' · Una línea clara para contar qué pasa.'}</p></div>
          <div className="previewAction"><strong>{form.price||'PRECIO'}</strong><button type="button">{form.destinationType==='WhatsApp'?'Abrir WhatsApp ↗':form.destinationType==='Instagram'?'Ver Instagram ↗':form.destinationType==='Checkout / entradas'?'Comprar entrada ↗':'Ir a la web ↗'}</button></div>
        </article>
        <div className="previewRules"><p><b>Sin imagen también funciona.</b> La estructura hace el trabajo.</p><p>Editar después no vuelve a subirte en el feed.</p></div>
      </aside>
    </div>
  </main>
}
