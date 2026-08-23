'use client';

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import './style.css';

type TimeKey='HOY'|'ESTA NOCHE'|'MAÑANA'|'FINDE'|'PRÓXIMOS';
type Category='TODO'|'COMER'|'MÚSICA'|'SALIR'|'CULTURA'|'EXPERIENCIAS';
type Zone='TODOS'|'PALERMO'|'CHACARITA'|'VILLA CRESPO'|'ALMAGRO'|'CABALLITO'|'COLEGIALES';
type Price='TODOS'|'GRATIS'|'$'|'$$'|'$$$';

type Item={
  id:string;
  posted:string;
  time:TimeKey;
  eventDate:string;
  sort:number;
  title:string;
  place:string;
  category:Exclude<Category,'TODO'>;
  price:string;
  tier:Exclude<Price,'TODOS'>;
  detail:string;
  cta:string;
};

const timeTabs:TimeKey[]=['HOY','ESTA NOCHE','MAÑANA','FINDE','PRÓXIMOS'];
const categories:Category[]=['TODO','COMER','MÚSICA','SALIR','CULTURA','EXPERIENCIAS'];
const zones:Zone[]=['TODOS','PALERMO','CHACARITA','VILLA CRESPO','ALMAGRO','CABALLITO','COLEGIALES'];
const prices:Price[]=['TODOS','GRATIS','$','$$','$$$'];

const items:Item[]=[
  {id:'cata',posted:'HACE 1 MIN',time:'HOY',eventDate:'HOY · 20:30',sort:2030,title:'Cata de vinos naturales',place:'VILLA CRESPO',category:'EXPERIENCIAS',price:'$35.000',tier:'$$',detail:'6 etiquetas + picada. Cupos limitados.',cta:'Reservar ↗'},
  {id:'dj',posted:'HACE 3 MIN',time:'ESTA NOCHE',eventDate:'HOY · 23:45',sort:2345,title:'DJ set + vinilos',place:'CHACARITA',category:'MÚSICA',price:'GRATIS',tier:'GRATIS',detail:'Selector invitado, patio abierto y birra tirada.',cta:'Ver Instagram ↗'},
  {id:'parrilla',posted:'HACE 6 MIN',time:'HOY',eventDate:'HOY · 21:00',sort:2100,title:'Menú de parrilla por pasos',place:'PALERMO',category:'COMER',price:'$52.000',tier:'$$$',detail:'Una sola mesa, menú fijo y sobremesa larga.',cta:'Ir a la web ↗'},
  {id:'standup',posted:'HACE 9 MIN',time:'ESTA NOCHE',eventDate:'HOY · 21:30',sort:2130,title:'Stand up en vivo',place:'ALMAGRO',category:'CULTURA',price:'$7.000',tier:'$',detail:'4 comediantes, barra y una hora de show.',cta:'Comprar entrada ↗'},
  {id:'pasta',posted:'HACE 13 MIN',time:'MAÑANA',eventDate:'LUN 24 AGO · 19:00',sort:1900,title:'Taller de pasta fresca',place:'CABALLITO',category:'EXPERIENCIAS',price:'$28.000',tier:'$$',detail:'Amasás, cocinás y cenás lo que hiciste.',cta:'Abrir checkout ↗'},
  {id:'feria',posted:'HACE 17 MIN',time:'FINDE',eventDate:'SÁB 29 AGO · 12:00',sort:1200,title:'Feria de diseño independiente',place:'PALERMO',category:'CULTURA',price:'GRATIS',tier:'GRATIS',detail:'Diseño local, libros, objetos y música.',cta:'Ver más ↗'},
  {id:'jazz',posted:'HACE 22 MIN',time:'HOY',eventDate:'HOY · 22:00',sort:2200,title:'Jazz en un living',place:'COLEGIALES',category:'MÚSICA',price:'$14.000',tier:'$',detail:'Trío acústico, pocas sillas y vino.',cta:'Ver Instagram ↗'},
  {id:'brunch',posted:'HACE 31 MIN',time:'FINDE',eventDate:'DOM 30 AGO · 11:30',sort:1130,title:'Brunch de autor',place:'COLEGIALES',category:'COMER',price:'$22.000',tier:'$$',detail:'Mesa larga, café y platos de estación.',cta:'Reservar ↗'},
  {id:'festival',posted:'HACE 38 MIN',time:'PRÓXIMOS',eventDate:'SÁB 5 SEP · 14:00',sort:1400,title:'Festival japonés',place:'CHACARITA',category:'CULTURA',price:'$18.000',tier:'$',detail:'Comida, música, feria y talleres.',cta:'Ver Instagram ↗'},
  {id:'rooftop',posted:'HACE 44 MIN',time:'MAÑANA',eventDate:'LUN 24 AGO · 18:30',sort:1830,title:'Sunset en rooftop',place:'PALERMO',category:'SALIR',price:'$12.000',tier:'$',detail:'Atardecer, DJ suave y carta corta de tragos.',cta:'Reservar ↗'},
];

const markets:Record<TimeKey,{title:string;place:string;when:string;bid:string;delta:string}[]>={
  'HOY':[
    {title:'Noche de Pizzas',place:'VILLA CRESPO',when:'21:00',bid:'$31.500',delta:'+$1.000 para pasar'},
    {title:'Cata de vinos naturales',place:'VILLA CRESPO',when:'20:30',bid:'$30.500',delta:'+$8.700 desde #3'},
    {title:'Jazz en un living',place:'COLEGIALES',when:'22:00',bid:'$21.800',delta:'+$4.200 desde #4'},
    {title:'Mesa coreana',place:'ALMAGRO',when:'20:45',bid:'$17.600',delta:'Entrá con $17.700'},
  ],
  'ESTA NOCHE':[
    {title:'Fiesta Bohemia',place:'CHACARITA',when:'23:30',bid:'$42.100',delta:'+$1.000 para pasar'},
    {title:'DJ set + vinilos',place:'CHACARITA',when:'23:45',bid:'$33.900',delta:'+$9.200 desde #3'},
    {title:'Stand up en vivo',place:'ALMAGRO',when:'21:30',bid:'$24.700',delta:'+$6.300 desde #4'},
    {title:'Cócteles de autor',place:'PALERMO',when:'00:30',bid:'$18.400',delta:'Entrá con $18.500'},
  ],
  'MAÑANA':[
    {title:'Taller de pasta fresca',place:'CABALLITO',when:'19:00',bid:'$18.900',delta:'+$1.000 para pasar'},
    {title:'Sunset en rooftop',place:'PALERMO',when:'18:30',bid:'$15.400',delta:'+$4.500 desde #3'},
    {title:'Sauna nocturno',place:'PALERMO',when:'20:00',bid:'$10.900',delta:'Entrá con $11.000'},
  ],
  'FINDE':[
    {title:'Feria de diseño',place:'PALERMO',when:'SÁB 12:00',bid:'$36.400',delta:'+$1.000 para pasar'},
    {title:'Brunch de autor',place:'COLEGIALES',when:'DOM 11:30',bid:'$29.100',delta:'+$8.200 desde #3'},
    {title:'Fiesta Patio Sur',place:'CHACARITA',when:'SÁB 23:00',bid:'$20.900',delta:'Entrá con $21.000'},
  ],
  'PRÓXIMOS':[
    {title:'Festival japonés',place:'CHACARITA',when:'5 SEP',bid:'$28.600',delta:'+$1.000 para pasar'},
    {title:'Cena en seis pasos',place:'PALERMO',when:'4 SEP',bid:'$21.300',delta:'+$8.100 desde #3'},
    {title:'Muestra inmersiva',place:'ALMAGRO',when:'6 SEP',bid:'$13.200',delta:'Entrá con $13.300'},
  ],
};

export default function CheMiraV5(){
  const [time,setTime]=useState<TimeKey>('HOY');
  const [category,setCategory]=useState<Category>('TODO');
  const [zone,setZone]=useState<Zone>('TODOS');
  const [price,setPrice]=useState<Price>('TODOS');
  const [saved,setSaved]=useState<string[]>([]);

  useEffect(()=>{
    setSaved(JSON.parse(localStorage.getItem('cm5_saved')||'[]'));
  },[]);

  const recent=useMemo(()=>items.filter(x=>x.time===time).slice(0,5),[time]);
  const explore=useMemo(()=>items.filter(x=>
    x.time===time &&
    (category==='TODO'||x.category===category) &&
    (zone==='TODOS'||x.place===zone) &&
    (price==='TODOS'||x.tier===price)
  ).sort((a,b)=>a.sort-b.sort),[time,category,zone,price]);

  const toggleSave=(id:string)=>setSaved(prev=>{
    const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id];
    localStorage.setItem('cm5_saved',JSON.stringify(next));
    return next;
  });
  const market=markets[time];

  return <main className="cm5">
    <header className="topbar">
      <Link href="/che-mira-v5" className="logo">CHE, MIRÁ</Link>
      <nav><a href="#ojo">Ojo Acá</a><a href="#recien">Recién publicado</a><a href="#explorar">Explorar</a></nav>
      <div className="topActions"><Link href="/che-mira-v5/guardados" className="savedBtn">♡ Guardados <b>{saved.length}</b></Link><Link className="publish" href="/che-mira-v5/publicar">+ Publicar</Link></div>
    </header>

    <section className="hero">
      <div><span>BUENOS AIRES · EN VIVO</span><h1>Qué hay.</h1></div>
      <p>Elegí cuándo. Mirá quién está peleando por atención. Después explorá todo lo demás.</p>
    </section>

    <section className="timeTabs" aria-label="Cuándo">
      {timeTabs.map(x=><button key={x} onClick={()=>setTime(x)} className={time===x?'active':''}>{x}</button>)}
    </section>

    <section id="ojo" className="ojoHero">
      <div className="ojoIntro">
        <div className="ojoLabel"><span>●</span> ATENCIÓN PATROCINADA</div>
        <h2>OJO ACÁ</h2>
        <p>Ranking en vivo · <b>{time}</b></p>
        <small>Más paga, más arriba. Todo a la vista.</small>
      </div>
      <div className="ojoRanking">
        {market.map((x,i)=><article key={x.title} className={i===0?'winner':''}>
          <div className="rank">#{i+1}</div>
          <div className="rankMain"><span>{x.place} · {x.when}</span><h3>{x.title}</h3>{i===0&&<p>Está comprando más atención en esta ventana.</p>}</div>
          <div className="bid"><small>PUJA ACTUAL</small><strong>{x.bid}</strong><span>{x.delta}</span></div>
        </article>)}
      </div>
      <div className="ojoCta"><button>Entrá a Ojo Acá</button><span>La reputación no se compra. Sólo esta posición.</span></div>
    </section>

    <section id="recien" className="recentSection">
      <div className="sectionTitle"><div><span>FEED ABIERTO · SIN ALGORITMO</span><h2>Recién publicado.</h2></div><p>Lo último que se cargó para <b>{time.toLowerCase()}</b>, arriba.</p></div>
      <div className="recentList">
        {recent.map(x=><article key={x.id}>
          <div className="posted"><b>{x.posted}</b><span>PUBLICADO</span></div>
          <div className="event"><span className="date">{x.eventDate}</span><small>{x.category}</small><h3><Link href={`/che-mira-v5/p/${x.id}`}>{x.title}</Link></h3><p>{x.place} · {x.detail}</p></div>
          <div className="eventAction"><strong>{x.price}</strong><button onClick={()=>toggleSave(x.id)} className={saved.includes(x.id)?'heart saved':'heart'}>{saved.includes(x.id)?'♥':'♡'}</button><button className="external">{x.cta}</button></div>
        </article>)}
        {recent.length===0&&<div className="empty">Todavía no se publicó nada para esta ventana.</div>}
      </div>
    </section>

    <section id="explorar" className="exploreSection">
      <div className="sectionTitle exploreTitle"><div><span>BUSCÁ SIN QUE TE RECOMENDEMOS</span><h2>Explorar.</h2></div><p>Filtrá la oferta. Los resultados se ordenan por horario del evento.</p></div>

      <div className="filterPanel">
        <div><label>CUÁNDO</label><div className="chipRow">{timeTabs.map(x=><button key={x} onClick={()=>setTime(x)} className={time===x?'active':''}>{x}</button>)}</div></div>
        <div><label>QUÉ</label><div className="chipRow">{categories.map(x=><button key={x} onClick={()=>setCategory(x)} className={category===x?'active':''}>{x}</button>)}</div></div>
        <div><label>DÓNDE</label><select value={zone} onChange={e=>setZone(e.target.value as Zone)}>{zones.map(x=><option key={x}>{x}</option>)}</select></div>
        <div><label>PRECIO</label><div className="chipRow compact">{prices.map(x=><button key={x} onClick={()=>setPrice(x)} className={price===x?'active':''}>{x}</button>)}</div></div>
      </div>

      <div className="exploreMeta"><b>{explore.length} RESULTADO{explore.length===1?'':'S'}</b><button onClick={()=>{setCategory('TODO');setZone('TODOS');setPrice('TODOS')}}>Limpiar filtros</button></div>
      <div className="exploreList">
        {explore.map(x=><article key={x.id}>
          <div className="timeBlock"><strong>{x.eventDate}</strong><span>{x.category}</span></div>
          <div className="exploreMain"><h3><Link href={`/che-mira-v5/p/${x.id}`}>{x.title}</Link></h3><p>{x.place} · {x.detail}</p></div>
          <div className="exploreRight"><strong>{x.price}</strong><button onClick={()=>toggleSave(x.id)} className={saved.includes(x.id)?'heart saved':'heart'}>{saved.includes(x.id)?'♥':'♡'}</button><button className="external">{x.cta}</button></div>
        </article>)}
        {explore.length===0&&<div className="empty">No hay resultados con esos filtros. Probá abrir un poco la búsqueda.</div>}
      </div>
    </section>

    <section className="publishStrip">
      <div><span>¿TENÉS ALGO PARA MOSTRAR?</span><h2>Publicalo.</h2><p>Primera publicación gratis. Después, un microcargo para evitar spam.</p></div>
      <Link className="publishStripLink" href="/che-mira-v5/publicar">+ Subir algo</Link>
    </section>

    <footer><Link href="/che-mira-v4">← V4</Link><span>CHE, MIRÁ · V5</span><b>ENTRAR CUESTA POCO. LA ATENCIÓN SE DISPUTA.</b></footer>
  </main>
}