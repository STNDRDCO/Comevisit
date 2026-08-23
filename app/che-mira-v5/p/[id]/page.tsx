'use client';

import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect,useState} from 'react';
import './style.css';

type Detail={id:string;title:string;date:string;place:string;venue:string;category:string;price:string;detail:string;cta:string;destination:string;claimed:boolean;organizer:string};

const details:Record<string,Detail>={
  cata:{id:'cata',title:'Cata de vinos naturales',date:'HOY · 20:30',place:'Villa Crespo',venue:'La Gruta · Thames 1440',category:'EXPERIENCIAS',price:'$35.000',detail:'Seis etiquetas, picada y una mesa chica para probar sin apuro. Cupos limitados.',cta:'Reservar por WhatsApp ↗',destination:'https://wa.me/',claimed:true,organizer:'@vinosdelagruta'},
  dj:{id:'dj',title:'DJ set + vinilos',date:'HOY · 23:45',place:'Chacarita',venue:'Patio 55 · Charlone 1555',category:'MÚSICA',price:'GRATIS',detail:'Selector invitado, patio abierto y birra tirada. Entrada libre hasta completar capacidad.',cta:'Ver Instagram ↗',destination:'https://instagram.com/',claimed:true,organizer:'@patio55'},
  parrilla:{id:'parrilla',title:'Menú de parrilla por pasos',date:'HOY · 21:00',place:'Palermo',venue:'Mesa Sur · Guatemala 4810',category:'COMER',price:'$52.000',detail:'Una sola mesa, menú fijo y sobremesa larga.',cta:'Ir a la web ↗',destination:'https://example.com/',claimed:true,organizer:'Mesa Sur'},
  standup:{id:'standup',title:'Stand up en vivo',date:'HOY · 21:30',place:'Almagro',venue:'Sala 8 · Medrano 880',category:'CULTURA',price:'$7.000',detail:'Cuatro comediantes, barra y una hora de show.',cta:'Comprar entrada ↗',destination:'https://example.com/',claimed:false,organizer:'Subido por @soficruz'},
  pasta:{id:'pasta',title:'Taller de pasta fresca',date:'LUN 24 AGO · 19:00',place:'Caballito',venue:'Pasta Club · Valle 720',category:'EXPERIENCIAS',price:'$28.000',detail:'Amasás, cocinás y cenás lo que hiciste.',cta:'Abrir checkout ↗',destination:'https://example.com/',claimed:true,organizer:'Pasta Club'},
  feria:{id:'feria',title:'Feria de diseño independiente',date:'SÁB 29 AGO · 12:00',place:'Palermo',venue:'Plaza Armenia',category:'CULTURA',price:'GRATIS',detail:'Diseño local, libros, objetos y música.',cta:'Ver más ↗',destination:'https://example.com/',claimed:false,organizer:'Subido por @luchoba'},
  jazz:{id:'jazz',title:'Jazz en un living',date:'HOY · 22:00',place:'Colegiales',venue:'Dirección al reservar',category:'MÚSICA',price:'$14.000',detail:'Trío acústico, pocas sillas y vino.',cta:'Ver Instagram ↗',destination:'https://instagram.com/',claimed:true,organizer:'Living Jazz'},
  brunch:{id:'brunch',title:'Brunch de autor',date:'DOM 30 AGO · 11:30',place:'Colegiales',venue:'Mesa 11 · Freire 1110',category:'COMER',price:'$22.000',detail:'Mesa larga, café y platos de estación.',cta:'Reservar ↗',destination:'https://example.com/',claimed:true,organizer:'Mesa 11'},
  festival:{id:'festival',title:'Festival japonés',date:'SÁB 5 SEP · 14:00',place:'Chacarita',venue:'Galpón 4 · Santos Dumont 4040',category:'CULTURA',price:'$18.000',detail:'Comida, música, feria y talleres. Una fecha única.',cta:'Ver Instagram ↗',destination:'https://instagram.com/',claimed:false,organizer:'Subido por @marianita'},
  rooftop:{id:'rooftop',title:'Sunset en rooftop',date:'LUN 24 AGO · 18:30',place:'Palermo',venue:'Piso 10 · Humboldt 1910',category:'SALIR',price:'$12.000',detail:'Atardecer, DJ suave y carta corta de tragos.',cta:'Reservar ↗',destination:'https://example.com/',claimed:true,organizer:'Piso 10'},
};

export default function ListingDetail(){
  const params=useParams<{id:string}>();
  const item=details[params.id];
  const [saved,setSaved]=useState(false);
  const [copied,setCopied]=useState(false);

  useEffect(()=>{
    const ids=JSON.parse(localStorage.getItem('cm5_saved')||'[]') as string[];
    setSaved(ids.includes(params.id));
  },[params.id]);

  const toggleSave=()=>{
    const ids=JSON.parse(localStorage.getItem('cm5_saved')||'[]') as string[];
    const next=ids.includes(params.id)?ids.filter(x=>x!==params.id):[...ids,params.id];
    localStorage.setItem('cm5_saved',JSON.stringify(next));
    setSaved(next.includes(params.id));
  };

  const share=async()=>{
    const url=window.location.href;
    if(navigator.share){await navigator.share({title:item?.title||'Che, Mirá',url});return;}
    await navigator.clipboard?.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1400);
  };

  if(!item)return <main className="detail"><header className="detailTop"><Link href="/che-mira-v5" className="detailLogo">CHE, MIRÁ</Link></header><section className="notFound"><h1>No encontramos eso.</h1><Link href="/che-mira-v5#explorar">Volver a explorar</Link></section></main>;

  return <main className="detail">
    <header className="detailTop"><Link href="/che-mira-v5" className="detailLogo">CHE, MIRÁ</Link><div><Link href="/che-mira-v5#explorar">Explorar</Link><Link href="/che-mira-v5/guardados">Guardados</Link><Link className="detailPublish" href="/che-mira-v5/publicar">+ Publicar</Link></div></header>

    <section className="detailHero">
      <div className="detailMain">
        <div className="detailMeta"><span>{item.date}</span><b>{item.category}</b></div>
        <h1>{item.title}</h1>
        <p className="lead">{item.detail}</p>
        <div className="facts"><div><small>DÓNDE</small><strong>{item.place}</strong><span>{item.venue}</span></div><div><small>PRECIO</small><strong>{item.price}</strong></div></div>
        <a className="primaryCta" href={item.destination} target="_blank" rel="noreferrer">{item.cta}</a>
        <div className="utility"><button onClick={toggleSave}>{saved?'♥ Guardado':'♡ Guardar'}</button><button onClick={share}>{copied?'Link copiado ✓':'Compartir ↗'}</button><button>Agregar al calendario</button></div>
      </div>

      <aside className="detailSide">
        <span>PUBLICACIÓN</span>
        <div className={item.claimed?'claim claimed':'claim'}><b>{item.claimed?'✓ RECLAMADA':'SIN RECLAMAR'}</b><p>{item.organizer}</p></div>
        {!item.claimed&&<button className="claimBtn">¿Esto es tuyo? Reclamar</button>}
        <div className="neutral"><b>Che, Mirá no recomienda.</b><p>Esta ficha existe para ordenar la información y llevarte al destino que eligió quien publicó.</p></div>
        <button className="report">Reportar publicación</button>
      </aside>
    </section>

    <section className="more">
      <div><span>YA QUE ESTÁS ACÁ</span><h2>Che, mirá qué más hay.</h2></div>
      <div className="moreLinks"><Link href="/che-mira-v5#ojo">Ojo Acá →</Link><Link href="/che-mira-v5#recien">Recién publicado →</Link><Link href="/che-mira-v5#explorar">Explorar todo →</Link></div>
    </section>
  </main>
}
