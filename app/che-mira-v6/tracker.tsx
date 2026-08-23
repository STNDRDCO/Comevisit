'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export default function V6Tracker(){const path=usePathname();useEffect(()=>{const event=path==='/che-mira-v6'?'home_view':path==='/che-mira-v6/explorar'?'explore_view':null;if(!event)return;fetch('/api/cm/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,properties:{path,version:'v6'}})}).catch(()=>{})},[path]);return null}
