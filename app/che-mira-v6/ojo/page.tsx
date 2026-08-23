'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {eventLabel,money,isCheToday} from '../lib';
import '../style.css';
import './style.css';

type Bid={amount_minor:number;listing:null|{slug:string;title:string;neighborhood:string;starts_at:string}};
export default function OjoV6(){
 const[rows,setRows]=useState<Bid[]>([]);const[loading,setLoading]=useState(true);
 useEffect(()=>{setLoading(true);fetch('/api/cm/ojo?market=TODAY').then(r=>r.ok?r.json():Promise.reject()).then(x=>setRows(Array.isArray(x.data)?x.data:[])).catch(()=>setRows([])).finally(()=>setLoading(false))},[]);
 const visible=rows.filter(x=>x.listing&&isCheToday(x.listing.starts_at));
 return <main className="cm6 ojo6"><header className="cm6Top"><Link href="/che-mira-v6" className="cm6Logo">CHE, MIRÁ</Link><nav><Link href="/che-mira-v6/explorar">Explorar hoy</Link><Link href="/che-mira-v5/wallet">Saldo</Link><Link href="/che-mira-v5/ojo" className="cm6Publish">Llamar más la atención</Link></nav></header><section className="ojo6Hero"><span>OJO ACÁ · HOY</span><h1>Quieren tu atención.</h1><p>Estas personas están pagando para llamar tu atención hoy. Más paga, más arriba.</p></section><section className="ojo6Board"><div className="ojo6Head"><span>{visible.length} {visible.length===1?'PERSONA':'PERSONAS'} PAGANDO HOY</span><span>ATENCIÓN</span></div>{loading&&<div className="ojo6Empty">Actualizando…</div>}{!loading&&visible.map((x,i)=><Link href={`/che-mira-v6/p/${x.listing!.slug}?src=ojo`} key={x.listing!.slug}><b>#{i+1}</b><div><small>{x.listing!.neighborhood} · {eventLabel(x.listing!.starts_at)}</small><h2>{x.listing!.title}</h2></div><strong>{money(x.amount_minor)}</strong></Link>)}{!loading&&!visible.length&&<div className="ojo6Empty"><b>Nadie está pagando para llamar tu atención hoy.</b><span>El feed abierto sigue vivo abajo.</span></div>}</section><section className="ojo6Explain"><div><span>SI TENÉS ALGO PARA MOSTRAR HOY</span><h2>¿Querés llamar más la atención?</h2><p>Tu publicación mantiene su lugar natural en el feed. Ojo Acá es aparte: hoy competís por atención y mañana el tablero vuelve a empezar.</p></div><Link href="/che-mira-v5/ojo">Entrar a Ojo Acá →</Link></section></main>
}
