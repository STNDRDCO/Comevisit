'use client';

import {useEffect,useState} from 'react';

type Props={slug:string;title:string;startsAt:string;venue:string;neighborhood:string};
type Stat={views:number;seen:number;shares:number};
const zero:Stat={views:0,seen:0,shares:0};

export default function DetailActions({slug,title}:Props){
 const[saved,setSaved]=useState(false);const[didSee,setDidSee]=useState(false);const[copied,setCopied]=useState(false);const[stat,setStat]=useState<Stat>(zero);
 const sessionId=()=>{try{const current=localStorage.getItem('cm_session_id')||crypto.randomUUID();localStorage.setItem('cm_session_id',current);return current}catch{return''}};
 const loadStats=()=>fetch(`/api/cm/stats?slugs=${encodeURIComponent(slug)}`).then(r=>r.ok?r.json():Promise.reject()).then(x=>setStat(x.data?.[slug]||zero)).catch(()=>{});
 useEffect(()=>{try{const ids=JSON.parse(localStorage.getItem('cm5_saved')||'[]') as string[];setSaved(ids.includes(slug));const seen=JSON.parse(localStorage.getItem('cm6_seen')||'[]') as string[];setDidSee(seen.includes(slug))}catch{}const src=new URLSearchParams(location.search).get('src')||'direct';fetch('/api/cm/view',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug,ref:src})}).finally(()=>setTimeout(loadStats,250));const timer=setInterval(loadStats,20000);return()=>clearInterval(timer)},[slug]);
 const track=(event:string)=>fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,sessionId:sessionId(),listing:slug,properties:{path:`/che-mira-v6/p/${slug}`}})}).catch(()=>{});
 const toggle=()=>{let ids:string[]=[];try{ids=JSON.parse(localStorage.getItem('cm5_saved')||'[]')}catch{}const next=ids.includes(slug)?ids.filter(x=>x!==slug):[...ids,slug];localStorage.setItem('cm5_saved',JSON.stringify(next));setSaved(next.includes(slug));track(next.includes(slug)?'save':'unsave')};
 const seen=async()=>{if(didSee)return;let ids:string[]=[];try{ids=JSON.parse(localStorage.getItem('cm6_seen')||'[]')}catch{}const next=Array.from(new Set([...ids,slug]));localStorage.setItem('cm6_seen',JSON.stringify(next));setDidSee(true);setStat(s=>({...s,seen:s.seen+1}));const r=await fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'seen',sessionId:sessionId(),listing:slug,properties:{surface:'detail'}})}).catch(()=>null);if(!r?.ok){setDidSee(false);setStat(s=>({...s,seen:Math.max(0,s.seen-1)}));localStorage.setItem('cm6_seen',JSON.stringify(ids))}};
 const share=async()=>{const url=`${location.origin}/che-mira-v6/p/${slug}?src=share`;let completed=false;try{if(navigator.share){await navigator.share({title,text:`CHE, MIRÁ · ${title}`,url});completed=true}else{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),1200);completed=true}}catch{}if(completed){setStat(s=>({...s,shares:s.shares+1}));track('share')}};
 return <><div className="detail6Attention"><span>◉ <b>{stat.views}</b> miradas</span><button className={didSee?'seen':''} onClick={seen}>{didSee?'LO VI ✓':'LO VI'}{stat.seen>0?` · ${stat.seen}`:''}</button><button onClick={share}>{copied?'COPIADO ✓':`COMPARTIR ↗${stat.shares>0?` · ${stat.shares}`:''}`}</button></div><div className="detail6Actions"><button onClick={toggle}>{saved?'♥ Guardado':'♡ Guardar'}</button></div></>
}
