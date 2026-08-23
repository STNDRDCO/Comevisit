'use client';

import Link from 'next/link';
import {useMemo,useState} from 'react';
import './style.css';

type Market='HOY'|'ESTA NOCHE'|'MAÑANA'|'FINDE'|'PRÓXIMOS';
type Listing={id:string;title:string;eligible:Market[]};
type Bid={title:string;amount:number};

const listings:Listing[]=[
  {id:'cata',title:'Cata de vinos naturales',eligible:['HOY']},
  {id:'dj',title:'DJ set + vinilos',eligible:['ESTA NOCHE']},
  {id:'pasta',title:'Taller de pasta fresca',eligible:['MAÑANA']},
  {id:'festival',title:'Festival japonés',eligible:['PRÓXIMOS']},
];

const marketBids:Record<Market,Bid[]>={
  'HOY':[{title:'Noche de Pizzas',amount:31500},{title:'Jazz en un living',amount:21800},{title:'Mesa coreana',amount:17600}],
  'ESTA NOCHE':[{title:'Fiesta Bohemia',amount:42100},{title:'Stand up en vivo',amount:24700},{title:'Cócteles de autor',amount:18400}],
  'MAÑANA':[{title:'Sunset en rooftop',amount:15400},{title:'Sauna nocturno',amount:10900}],
  'FINDE':[{title:'Feria de diseño',amount:36400},{title:'Brunch de autor',amount:29100},{title:'Fiesta Patio Sur',amount:20900}],
  'PRÓXIMOS':[{title:'Cena en seis pasos',amount:21300},{title:'Muestra inmersiva',amount:13200}],
};

const money=(n:number)=>'$'+new Intl.NumberFormat('es-AR').format(n);

export default function OjoFlow(){
  const [listingId,setListingId]=useState('cata');
  const listing=listings.find(x=>x.id===listingId)!;
  const [market,setMarket]=useState<Market>(listing.eligible[0]);
  const [amount,setAmount]=useState(32000);
  const [confirmed,setConfirmed]=useState(false);

  const chooseListing=(id:string)=>{const next=listings.find(x=>x.id===id)!;setListingId(id);setMarket(next.eligible[0]);setConfirmed(false)};
  const existing=marketBids[market];
  const ranked=useMemo(()=>[...existing,{title:listing.title,amount}].sort((a,b)=>b.amount-a.amount),[existing,listing.title,amount]);
  const position=ranked.findIndex(x=>x.title===listing.title)+1;
  const leader=existing[0]?.amount||0;
  const toFirst=Math.max(0,leader+100-amount);

  if(confirmed)return <main className="ojoFlow"><header className="ojoTop"><Link href="/che-mira-v5" className="ojoLogo">CHE, MIRÁ</Link><span>OJO ACÁ</span></header><section className="ojoConfirmed"><span>DEMO · SIN COBRO REAL</span><h1>Entraste al ranking.</h1><p><b>{listing.title}</b> quedaría #{position} en <b>{market}</b> con una puja de <b>{money(amount)}</b>.</p><div className="confirmRank">{ranked.map((x,i)=><div key={x.title} className={x.title===listing.title?'you':''}><b>#{i+1}</b><span>{x.title}</span><strong>{money(x.amount)}</strong></div>)}</div><div className="confirmActions"><Link href="/che-mira-v5">Ver Ojo Acá</Link><Link href="/che-mira-v5/mis-publicaciones">Mis publicaciones</Link></div></section></main>;

  return <main className="ojoFlow">
    <header className="ojoTop"><Link href="/che-mira-v5" className="ojoLogo">CHE, MIRÁ</Link><span>OJO ACÁ</span><Link href="/che-mira-v5/mis-publicaciones">Mis publicaciones</Link></header>

    <section className="ojoTitle"><div><span>COMPRÁ ATENCIÓN</span><h1>Entrá a<br/>Ojo Acá.</h1></div><p>No comprás reputación ni una recomendación. Comprás una posición visible en un ranking público.</p></section>

    <div className="ojoLayout">
      <section className="ojoControls">
        <div className="flowBlock"><span>01 · QUÉ QUERÉS EMPUJAR</span><select value={listingId} onChange={e=>chooseListing(e.target.value)}>{listings.map(x=><option value={x.id} key={x.id}>{x.title}</option>)}</select></div>

        <div className="flowBlock"><span>02 · EN QUÉ VENTANA</span><div className="marketChoices">{listing.eligible.map(x=><button className={market===x?'active':''} onClick={()=>setMarket(x)} key={x}>{x}</button>)}</div><small>Sólo aparecen mercados compatibles con la fecha de tu publicación.</small></div>

        <div className="flowBlock moneyBlock"><span>03 · CUÁNTA ATENCIÓN</span><label><small>TU PUJA</small><div><b>$</b><input type="number" min="100" step="100" value={amount} onChange={e=>setAmount(Math.max(0,Number(e.target.value)))}/></div></label>
        <div className="quickMoney"><button onClick={()=>setAmount((existing.at(-1)?.amount||0)+100)}>Entrar al ranking</button><button onClick={()=>setAmount(leader+100)}>Ir al #1 · {money(leader+100)}</button></div></div>

        <div className="flowSummary"><div><span>RESULTADO AHORA</span><strong>#{position}</strong><p>{position===1?'Quedarías arriba de todos.':toFirst?`Te faltan ${money(toFirst)} para quedar #1.`:'Estás #1.'}</p></div><button onClick={()=>setConfirmed(true)}>Confirmar puja demo →</button><small>No se procesa ningún pago en este prototipo.</small></div>
      </section>

      <aside className="liveMarket">
        <div className="liveHead"><span>RANKING EN VIVO</span><h2>{market}</h2><p>Cambia mientras cambiás tu puja.</p></div>
        <div className="liveRanks">{ranked.map((x,i)=><article key={x.title} className={x.title===listing.title?'you':''}><b>#{i+1}</b><div><strong>{x.title}</strong>{x.title===listing.title&&<span>VOS · PREVIEW</span>}</div><strong>{money(x.amount)}</strong></article>)}</div>
        <div className="marketRule"><b>La regla completa:</b><p>Más plata acumulada en esta ventana = posición más alta. Sin score oculto.</p></div>
      </aside>
    </div>
  </main>
}
