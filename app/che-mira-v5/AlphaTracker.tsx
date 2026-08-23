'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from 'react';

const eventFor=(path:string)=>path==='/che-mira-v5'?'home_view':path.startsWith('/che-mira-v5/explorar')?'explore_view':path.startsWith('/che-mira-v5/publicar')?'publish_start':path.startsWith('/che-mira-v5/ojo')?'ojo_view':null;

export default function AlphaTracker(){
 const path=usePathname();
 useEffect(()=>{const event=eventFor(path);if(!event)return;let id=localStorage.getItem('cm_session_id');if(!id){id=crypto.randomUUID();localStorage.setItem('cm_session_id',id)}const token=localStorage.getItem('cm_access_token');fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify({event,sessionId:id,properties:{path}})}).catch(()=>{})},[path]);
 return null;
}
