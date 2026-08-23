import Link from 'next/link';
import '../v6/v6.css';
import './brand.css';

const moments=[['AHORA','12'],['HOY','34'],['ESTA NOCHE','21'],['MAÑANA','18'],['FINDE','49']];
const sponsored=[
  {rank:1,title:'Rooftop Sunset',place:'Palermo',meta:'Hoy · 18:30',price:'$28.000',bid:'US$47',take:'US$48',tag:'TOMAR ALGO'},
  {rank:2,title:'Stand up en Chacarita',place:'Chacarita',meta:'Hoy · 22:00',price:'$18.000',bid:'US$39',take:'US$9 para pasar',tag:'CULTURA'},
  {rank:3,title:'Cata de vinos',place:'Villa Crespo',meta:'Hoy · 20:30',price:'$35.000',bid:'US$32',take:'US$16 para pasar',tag:'EXPERIENCIA'},
  {rank:4,title:'Cena en 6 pasos',place:'Palermo',meta:'Hoy · 21:00',price:'$65.000',bid:'US$24',take:'US$24 para pasar',tag:'COMER'},
];
const feed=[
  {title:'Taller de pasta fresca',place:'San Telmo',meta:'Hoy · 19:00',tag:'APRENDER',price:'$32.000',note:'Dos horas, grupo chico y cena incluida.',signal:'ARRANCA EN 4H'},
  {title:'Jazz en un living',place:'Colegiales',meta:'Hoy · 21:30',tag:'MÚSICA',price:'$14.000',note:'Formato íntimo. Pocas sillas. Sin escenario.',signal:'HOY'},
  {title:'Sauna + inmersión fría',place:'Palermo',meta:'Hoy · 20:00',tag:'BIENESTAR',price:'$25.000',note:'Turno abierto esta noche.',signal:'ÚLTIMOS TURNOS'},
  {title:'Navegación por el Delta',place:'Tigre',meta:'Mañana · 11:00',tag:'AIRE LIBRE',price:'$55.000',note:'Salida chica. Regreso después de almorzar.',signal:'MAÑANA'},
  {title:'Mesa comunal de cocina coreana',place:'Almagro',meta:'Hoy · 20:45',tag:'COMER',price:'$42.000',note:'Una sola mesa, menú fijo y sobremesa larga.',signal:'HOY'},
  {title:'DJ set + vinilos',place:'Villa Crespo',meta:'Hoy · 23:30',tag:'MÚSICA',price:'Gratis',note:'Bar chico, selector invitado, entrada libre.',signal:'ESTA NOCHE'},
];
const pulse=[['11:34','Rooftop Sunset subió al #1 de ESTA NOCHE'],['11:21','Cata de vinos entró al mercado con US$32'],['10:58','Se publicó “Jazz en un living”'],['10:44','Stand up defendió el #2']];

export default function OjoAca(){return <main className="v6 ojoAca">
  <div className="marquee"><span>OJO ACÁ</span><b>·</b><span>BUENOS AIRES AHORA</span><b>·</b><span>PUBLICAR ES GRATIS</span><b>·</b><span>LO QUE MERECE ATENCIÓN, ACÁ</span></div>
  <header className="topbar"><Link href="/ojo-aca" className="brandmark"><span>OJO</span><b>ACÁ</b></Link><nav><a href="#feed">MIRÁ QUÉ HAY</a><a href="#como">CÓMO FUNCIONA</a><button>PUBLICÁ ALGO</button></nav></header>
  <section className="hero"><div className="heroText"><div className="eyebrow">BUENOS AIRES · EN VIVO</div><h1>Ojo.<br/><em>Esto pasa acá.</em></h1><p>Planes, aperturas, experiencias, mesas, shows y cosas que merecen atención ahora. Lo relevante entra. Lo viejo vence.</p><div className="heroActions"><button>MIRÁ QUÉ PASA HOY</button><button className="ghost">PUBLICÁ LO TUYO</button></div></div><aside className="supplyBox"><span>PARA QUIEN TIENE ALGO QUE MOVER</span><h2>¿Tenés algo que merece atención?</h2><p>Ponelo acá. Publicar es gratis. Si querés más ojos encima, competí por una posición patrocinada.</p><div><b>OJO</b><small>LA ATENCIÓN ES EL PRODUCTO</small></div></aside></section>
  <section className="momentStrip">{moments.map((m,i)=><button className={i===1?'active':''} key={m[0]}><span>{m[0]}</span><b>{m[1]}</b></button>)}</section>
  <section className="attentionMarket"><div className="sectionHead"><span>ATENCIÓN PATROCINADA · HOY</span><h2>¿Querés que te miren? Subí.</h2><p>No dice qué es mejor. Dice quién eligió pagar por más atención durante esta ventana.</p></div><div className="marketGrid"><div className="board">{sponsored.map(x=><article className={x.rank===1?'top':''} key={x.rank}><div className="rank">#{x.rank}</div><div className="identity"><small>{x.tag}</small><strong>{x.title}</strong><span>{x.place} · {x.meta} · {x.price}</span></div><div className="bid"><small>PUJA</small><b>{x.bid}</b><span>{x.take}</span></div></article>)}</div><aside className="marketCard"><span>MÁS MIRADO · PATROCINADO</span><h3>Rooftop Sunset</h3><p>Hoy · Palermo · 18:30</p><strong>US$47</strong><button>QUEDATE ARRIBA POR US$48</button><small>PUJA DEMO · TODO A LA VISTA</small></aside></div></section>
  <section id="feed" className="liveFeed"><div className="sectionHead"><span>TODO LO DEMÁS · ORGÁNICO</span><h2>Ojo con esto.</h2><p>Lo que está pasando, sin pagar por reputación.</p></div><div className="feedGrid">{feed.map((x,i)=><article key={x.title}><div className="feedTop"><span>{x.signal}</span><b>0{i+1}</b></div><small>{x.tag}</small><h3>{x.title}</h3><p>{x.note}</p><div className="feedMeta"><span>{x.place} · {x.meta}</span><strong>{x.price}</strong></div><button>VER MÁS ↗</button></article>)}</div></section>
  <section className="livePulse"><div><span>PULSO</span><h2>Está pasando acá.</h2></div><div className="pulseList">{pulse.map(([t,x])=><div key={t+x}><b>{t}</b><span>{x}</span></div>)}</div></section>
  <section id="como" className="how"><div className="sectionHead"><span>EL MODELO</span><h2>Mirar. Publicar. Mover.</h2></div><div className="steps"><article><b>01</b><h3>Posteá lo que importa ahora.</h3><p>Qué, dónde, cuándo, precio y link.</p></article><article><b>02</b><h3>Vence solo.</h3><p>Cuando deja de importar, sale del feed.</p></article><article><b>03</b><h3>Querés más ojos.</h3><p>Pujás públicamente por atención extra.</p></article><article><b>04</b><h3>Después queda historial.</h3><p>Boards, crowns y prestigio acumulado.</p></article></div></section>
  <section className="manifesto"><div><span>OJO ACÁ</span><h2>Lo importante no dura para siempre.</h2></div><div><p>Por eso el producto empieza por lo que importa ahora, cerca tuyo.</p><p><b>Pagar compra atención. No compra prestigio.</b></p></div></section>
  <section className="cta"><span>OJO ACÁ · PUBLICÁ</span><h2>¿Tenés algo que merece atención hoy?</h2><p>Ponelo acá.</p><button>PUBLICÁ ALGO</button></section>
  <footer><Link href="/che-mira">VER CHE, MIRÁ →</Link><span>PROTOTIPO DE MARCA · SIN PAGOS REALES</span></footer>
</main>}
