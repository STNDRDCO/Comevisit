'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {WINDOWS,WindowKey,eventLabel,money} from '../lib';
import '../style.css';
import './style.css';

type Bid={amount_minor:number;listing:null|{slug:string;title:string;neighborhood:string;starts_at:string}};
export default function OjoV6(){
 const[market,setMarket]=useState<WindowKey>('HOY');const[rows,setRows]=useState<Bid[]>([]);const[loading,setLoading]=useState(true);
 useEffect(()=>{setLoading(true);fetch(`/api/cm/ojo?market=${encodeURIComponent(market)}`).then(r=>r.ok?r.json():Promise.reject()).then(x=>setRows(Array.isArray(x.data)?x.data:[])).catch(()=>setRows([])).finally(()=>setLoading(false))},[market]);
 const visible=rows.filter(x=>x.listing);
 return <main className="cm6 ojo6"><header className="cm6Top"><Link href="/che-mira-v6" className="cm6Logo">CHE, MIRÁ</Link><nav><Link href="/che-mira-v6/explorar">Explorar</Link><Link href="/che-mira-v5/wallet">Saldo</Link><Link href="/che-mira-v5/ojo" className="cm6Publish">Gestionar inversión</Link></nav></header><section className="ojo6Hero"><span>ATENCIÓN PATROCINADA</span><h1>OJO ACÁ.</h1><p>La regla completa: más inversión, más arriba.</p></section><section className="ojo6Tabs">{WINDOWS.map(x=><button key={x} className={market===x?'active':''} onClick={()=>setMarket(x)}>{x}</button>)}</section><section className="ojo6Board"><div className="ojo6Head"><span>RANKING · {market}</span><span>INVERSIÓN VISIBLE</span></div>{loading&&<div className="ojo6Empty">Actualizando…</div>}{!loading&&visible.map((x,i)=><Link href={`/che-mira-v6/p/${x.listing!.slug}`} key={x.listing!.slug}><b>#{i+1}</b><div><small>{x.listing!.neighborhood} · {eventLabel(x.listing!.starts_at)}</small><h2>{x.listing!.title}</h2></div><strong>{money(x.amount_minor)}</strong></Link>)}{!loading&&!visible.length&&<div className="ojo6Empty"><b>Nadie está comprando esta posición todavía.</b><span>Eso también es información.</span></div>}</section><section className="ojo6Explain"><div><span>SI PUBLICÁS</span><h2>No necesitás entender una subasta.</h2><p>Ves tu inversión actual, tu posición y cuánto necesitás agregar para pasar a la publicación de arriba. El motor financiero existente sigue usando saldo y ledger; la UI habla en lenguaje humano.</p></div><Link href="/che-mira-v5/ojo">Dar más atención →</Link></section></main>
}
