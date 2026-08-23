'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {WINDOWS,WindowKey,eventLabel,money} from '../lib';
import '../style.css';
import './style.css';

type Bid={amount_minor:number;listing:null|{slug:string;title:string;neighborhood:string;starts_at:string}};
export default function OjoV6(){
 const[market,setMarket]=useState<WindowKey>('HOY');const[rows,setRows]=useState<Bid[]>([]);const[loading,setLoading]=useState(true);
 useEffect(()=>{const q=new URLSearchParams(window.location.search).get('cuando') as WindowKey|null;if(q&&WINDOWS.includes(q))setMarket(q)},[]);
 useEffect(()=>{setLoading(true);fetch(`/api/cm/ojo?market=${encodeURIComponent(market)}`).then(r=>r.ok?r.json():Promise.reject()).then(x=>setRows(Array.isArray(x.data)?x.data:[])).catch(()=>setRows([])).finally(()=>setLoading(false))},[market]);
 const visible=rows.filter(x=>x.listing);
 return <main className="cm6 ojo6"><header className="cm6Top"><Link href="/che-mira-v6" className="cm6Logo">CHE, MIRÁ</Link><nav><Link href="/che-mira-v6/explorar">Explorar</Link><Link href="/che-mira-v5/wallet">Saldo</Link><Link href="/che-mira-v5/ojo" className="cm6Publish">Llamar más la atención</Link></nav></header><section className="ojo6Hero"><span>OJO ACÁ</span><h1>Quieren tu atención.</h1><p>Estas personas están pagando para llamar tu atención. Más paga, más arriba.</p></section><section className="ojo6Tabs">{WINDOWS.map(x=><button key={x} className={market===x?'active':''} onClick={()=>setMarket(x)}>{x}</button>)}</section><section className="ojo6Board"><div className="ojo6Head"><span>{visible.length} {visible.length===1?'PERSONA':'PERSONAS'} PAGANDO · {market}</span><span>ATENCIÓN</span></div>{loading&&<div className="ojo6Empty">Actualizando…</div>}{!loading&&visible.map((x,i)=><Link href={`/che-mira-v6/p/${x.listing!.slug}?src=ojo`} key={x.listing!.slug}><b>#{i+1}</b><div><small>{x.listing!.neighborhood} · {eventLabel(x.listing!.starts_at)}</small><h2>{x.listing!.title}</h2></div><strong>{money(x.amount_minor)}</strong></Link>)}{!loading&&!visible.length&&<div className="ojo6Empty"><b>Nadie está pagando para llamar tu atención acá todavía.</b><span>El feed abierto sigue funcionando igual.</span></div>}</section><section className="ojo6Explain"><div><span>SI TENÉS ALGO PARA MOSTRAR</span><h2>¿Querés llamar más la atención?</h2><p>Tu publicación sigue teniendo su lugar natural en el feed. Ojo Acá es aparte: elegís cuánto poner y tu posición queda a la vista.</p></div><Link href="/che-mira-v5/ojo">Entrar a Ojo Acá →</Link></section></main>
}
