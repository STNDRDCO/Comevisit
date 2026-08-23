import Link from 'next/link';
import './v5.css';

const leaders=[
  {rank:1,name:'Don Julio',area:'Palermo',kind:'Parrilla',total:'US$188',delta:'US$1 para pasar',moves:'8 movimientos'},
  {rank:2,name:'El Preferido',area:'Palermo',kind:'Bodegón',total:'US$163',delta:'US$26 para el #1',moves:'7 movimientos'},
  {rank:3,name:'Julia',area:'Villa Crespo',kind:'Cocina de autor',total:'US$121',delta:'US$68 para el #1',moves:'4 movimientos'},
  {rank:4,name:'Atte. Pizzeria',area:'Chacarita',kind:'Pizza',total:'US$96',delta:'US$93 para el #1',moves:'5 movimientos'},
  {rank:5,name:'Naranjo Bar',area:'Chacarita',kind:'Vino',total:'US$71',delta:'US$118 para el #1',moves:'3 movimientos'},
];

const organic=[
  {name:'El Preferido',area:'Palermo',kind:'Bodegón',note:'Clásicos porteños, vermut, milanesa y una sala que tiene personalidad propia.',why:['Milanesa','Vermut','Salón histórico']},
  {name:'Atte. Pizzeria',area:'Chacarita',kind:'Pizza',note:'Pizza porteña contemporánea. Crujiente, filosa y sin disfrazarse de Nápoles.',why:['Pizza al molde','Chacarita','Noche']},
  {name:'Naranjo Bar',area:'Chacarita',kind:'Vino',note:'Vino natural, platos chicos y energía de barrio.',why:['Vino natural','Platos chicos','Barra']},
  {name:'Julia',area:'Villa Crespo',kind:'Autor',note:'Pocas mesas, cocina seria y esa sensación de que te mandó alguien que sabe.',why:['Pocas mesas','Menú corto','Reservá']},
  {name:'Don Julio',area:'Palermo',kind:'Parrilla',note:'El peso pesado. No necesita ComeVisit. Por eso todos quieren sacarle la corona.',why:['Carne','Carta de vinos','Ícono']},
  {name:'La Mezzetta',area:'Villa Ortúzar',kind:'Pizza',note:'Fugazzeta, mostrador y Buenos Aires sin filtro.',why:['Fugazzeta','Parado','Clásico']},
  {name:'El Ferroviario',area:'Liniers',kind:'Parrilla',note:'Parrilla enorme, mesas largas y otra Buenos Aires muy lejos del circuito obvio.',why:['Achuras','Porciones grandes','Liniers']},
  {name:'Café Paulín',area:'Centro',kind:'Bodegón',note:'Barra, sánguches y centro porteño en estado puro.',why:['Sánguches','Barra','Microcentro']},
];

const markets=[
  {name:'ARGENTINA',price:'US$188',fighters:'17',heat:'MUY CALIENTE'},
  {name:'PARRILLA',price:'US$124',fighters:'9',heat:'CALIENTE'},
  {name:'PIZZA',price:'US$79',fighters:'7',heat:'SUBIENDO'},
  {name:'BODEGÓN',price:'US$64',fighters:'5',heat:'ACTIVO'},
  {name:'PALERMO',price:'US$53',fighters:'6',heat:'ACTIVO'},
  {name:'CHACARITA',price:'US$31',fighters:'4',heat:'NUEVO'}
];

const activity=[
  ['Hace 4 min','El Preferido','subió a US$163','Argentina'],
  ['Hace 11 min','Atte. Pizzeria','recuperó el #1','Pizza'],
  ['Hace 22 min','Don Julio','defendió la corona','Parrilla'],
  ['Hace 37 min','Naranjo Bar','entró al mercado','Chacarita'],
];

export default function V5(){
  return <main className="v5">
    <div className="marquee"><span>COME VISIT ARGENTINA</span><b>·</b><span>PUJAS PÚBLICAS</span><b>·</b><span>RANKING EN VIVO</span><b>·</b><span>LA COMIDA NO SE DISCUTE. LA PUNTA SÍ.</span></div>

    <header className="topbar"><Link href="/" className="logo">COME<span>VISIT</span></Link><div className="topactions"><span>ARGENTINA · EN VIVO</span><button>RECLAMÁ TU RESTAURANTE</button></div></header>

    <section className="hero">
      <div className="heroCopy"><div className="eyebrow">EL MERCADO PÚBLICO DE RESTAURANTES DE ARGENTINA</div><h1>Acá se come.<br/><em>Acá se compite.</em></h1><p>Encontrá dónde comer y mirá quién se está matando por la atención. Las posiciones patrocinadas se compran en público. El ranking orgánico no se toca.</p><div className="heroStamp">PAGAR COMPRA ATENCIÓN.<br/>NO COMPRA PRESTIGIO.</div></div>
      <div className="ticker"><span>● MERCADO DEMO · EN VIVO</span><strong>ARGENTINA</strong><div><b>US$639</b><small>PUJADOS ESTA SEMANA</small></div><div><b>17</b><small>RESTAURANTES COMPITIENDO</small></div><div><b>05:42:17</b><small>CIERRA LA RONDA</small></div></div>
    </section>

    <section className="marketTitle"><span>MERCADOS ABIERTOS</span><p>Elegí la pelea.</p></section>
    <section className="marketNav">{markets.map((m,i)=><button className={i===0?'active':''} key={m.name}><span>{m.name}</span><b>{m.price}</b><small>{m.fighters} compitiendo · {m.heat}</small></button>)}</section>

    <section className="crown">
      <div className="crownTitle"><span>♛ CORONA ARGENTINA · PATROCINADO · PUJA PÚBLICA</span><h2>#1 Don Julio</h2><p>Palermo · Parrilla · ocho movimientos públicos esta semana</p><div className="crownMeta"><span>48 h en la punta</span><span>3 defensas</span><span>+US$67 desde que entró</span></div></div>
      <div className="crownPrice"><small>PRECIO DE LA CORONA</small><b>US$188</b><button>QUEDATE CON EL #1 POR US$189 ↗</button><em>Pagás sólo la diferencia necesaria para pasar.</em></div>
    </section>

    <section className="fightStrip">
      <div><span>PELEA DE LA SEMANA</span><strong>DON JULIO</strong><b>188</b></div>
      <div className="versus">VS</div>
      <div><span>A 26 DÓLARES</span><strong>EL PREFERIDO</strong><b>163</b></div>
      <p>Dos restaurantes. Una sola punta. Todo el historial queda público.</p>
    </section>

    <section className="split">
      <div className="boardWrap">
        <div className="sectionHead"><span>LA TABLA</span><h2>Que se maten por el #1.</h2><p>Sin estrellas. Sin algoritmo secreto. El ranking patrocinado es un mercado de atención transparente.</p></div>
        <div className="board">{leaders.map(x=><div className={`leader ${x.rank===1?'winner':''}`} key={x.rank}><div className="rank">#{x.rank}</div><div className="identity"><strong>{x.name}</strong><span>{x.area} · {x.kind}</span></div><div className="move"><small>{x.moves}</small><span>{x.delta}</span></div><div className="money">{x.total}</div></div>)}</div>
      </div>
      <aside className="rules"><span>CÓMO SE JUEGA</span><h3>Tu ficha es gratis.<br/>La punta, no.</h3><p>Cualquier restaurante puede aparecer y reclamar su lugar gratis. Si quiere más atención, entra a un mercado y puja en público.</p><ol><li>Reclamá tu restaurante gratis.</li><li>Elegí una pelea: Argentina, Parrilla, Pizza o barrio.</li><li>Sumá sólo lo necesario para pasar al de arriba.</li><li>Defendé la corona hasta que alguien te la saque.</li></ol><div className="clean">EL ORGÁNICO NO SE MUEVE POR PLATA.</div></aside>
    </section>

    <section className="activity"><div className="sectionHead"><span>SE ESTÁ MOVIENDO</span><h2>La ciudad deja rastro.</h2><p>Cada puja, entrada y cambio de punta queda visible. Si el mercado se mueve, se siente.</p></div><div className="activityFeed">{activity.map(a=><div className="activityRow" key={a.join('-')}><small>{a[0]}</small><strong>{a[1]}</strong><span>{a[2]}</span><b>{a[3]}</b></div>)}</div></section>

    <section className="viral"><div><span>EL LOOP</span><h2>Hasta perder te da distribución.</h2><p>Cada cambio de punta es contenido. El ganador lo comparte. El que perdió lo ve. Los foodies discuten. Los medios capturan la pelea. Y el siguiente restaurante tiene una razón para entrar.</p></div><div className="sharecard"><small>COME<span>VISIT</span> · ARGENTINA</small><div className="shareKicker">CAMBIÓ LA PUNTA</div><h3>EL PREFERIDO LE SACÓ<br/>EL #1 A DON JULIO.</h3><div><b>US$189</b><span>NUEVO #1 · PUJA PÚBLICA</span></div></div></section>

    <section className="organic">
      <div className="sectionHead"><span>EL MAPA QUE HAY ABAJO</span><h2>Lugares que valen la pena, paguen o no.</h2><p>Acá vive la utilidad real. La competencia genera espectáculo; estas fichas te ayudan a decidir dónde comer.</p></div>
      <div className="organicGrid">{organic.map((x,i)=><article key={x.name}><div className="num">0{i+1}</div><div className="tag">{x.kind}</div><h3>{x.name}</h3><p>{x.note}</p><div className="why">{x.why.map(w=><span key={w}>{w}</span>)}</div><div className="placeFoot"><span>{x.area}</span><button>VER FICHA ↗</button></div></article>)}</div>
    </section>

    <section className="proof">
      <div><span>TRANSPARENCIA</span><h2>El usuario siempre sabe qué está mirando.</h2></div>
      <div className="proofGrid"><article><b>PATROCINADO</b><p>La posición se compra y el monto es público.</p></article><article><b>ORGÁNICO</b><p>La aparición no depende de pagar.</p></article><article><b>HISTORIAL</b><p>Cada cambio de punta deja registro.</p></article></div>
    </section>

    <section className="manifesto"><div className="manifestoLeft"><span>COME VISIT ARGENTINA</span><h2>No queremos decirte cuál es “el mejor”.</h2></div><div className="manifestoRight"><p>Queremos mostrarte lugares que importan y, cuando alguien paga por atención, que lo veas.</p><p><b>Sin humo. Sin ranking disfrazado. Sin misterio.</b></p></div></section>

    <section className="cta"><span>SI TENÉS UN RESTAURANTE</span><h2>Entrar es gratis.<br/>La atención se disputa.</h2><div><button>BUSCÁ Y RECLAMÁ TU RESTAURANTE</button><button className="ghost">MIRÁ LAS PELEAS</button></div></section>

    <footer><Link href="/lab">← LAB DE PRODUCTO</Link><span>V5.2 ARGENTINA · PUJAS DEMO · SIN PAGOS REALES</span></footer>
  </main>
}
