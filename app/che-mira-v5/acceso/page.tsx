'use client';

import Link from 'next/link';
import {FormEvent,useEffect,useState} from 'react';
import './style.css';

const URL='https://wpherlcpgktqpyfcrqxs.supabase.co';
const KEY='sb_publishable_twh0JhBP7h5c7XQi_TsgCw_-BFEGQqS';

export default function Acceso(){
  const [mode,setMode]=useState<'login'|'signup'>('login');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState('');
  const [next,setNext]=useState('/che-mira-v5/mis-publicaciones');

  useEffect(()=>{const q=new URLSearchParams(window.location.search);setNext(q.get('next')||'/che-mira-v5/mis-publicaciones')},[]);

  const submit=async(e:FormEvent)=>{
    e.preventDefault();setLoading(true);setMessage('');
    const endpoint=mode==='login'?`${URL}/auth/v1/token?grant_type=password`:`${URL}/auth/v1/signup`;
    const res=await fetch(endpoint,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    const data=await res.json().catch(()=>({}));setLoading(false);
    if(!res.ok){setMessage(data?.msg||data?.message||'No pudimos entrar. Revisá los datos.');return}
    if(data.access_token){localStorage.setItem('cm_access_token',data.access_token);if(data.refresh_token)localStorage.setItem('cm_refresh_token',data.refresh_token);if(data.user?.id)localStorage.setItem('cm_user_id',data.user.id);window.location.href=next;return}
    if(mode==='signup'){setMessage('Cuenta creada. Si te llegó un mail de confirmación, abrilo y después iniciá sesión.');setMode('login');return}
    setMessage('No se pudo iniciar una sesión.');
  };

  return <main className="access">
    <header className="accessTop"><Link href="/che-mira-v5" className="accessLogo">CHE, MIRÁ</Link><span>CUENTA</span><Link href="/che-mira-v5">Cerrar</Link></header>
    <section className="accessLayout">
      <div className="accessCopy"><span>PARA PUBLICAR Y ADMINISTRAR</span><h1>Entrá.</h1><p>Mirar y explorar no requiere cuenta. La identidad aparece cuando querés publicar, reclamar o administrar algo.</p><div className="accessRules"><p><b>Consumidor:</b> abierto.</p><p><b>Publicador:</b> cuenta mínima.</p><p><b>Pagos:</b> todavía demo.</p></div></div>
      <form onSubmit={submit} className="accessCard">
        <div className="mode"><button type="button" onClick={()=>setMode('login')} className={mode==='login'?'active':''}>Entrar</button><button type="button" onClick={()=>setMode('signup')} className={mode==='signup'?'active':''}>Crear cuenta</button></div>
        <label><b>Email</b><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label><b>Contraseña</b><input type="password" autoComplete={mode==='login'?'current-password':'new-password'} minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <button className="submit" disabled={loading}>{loading?'Un segundo…':mode==='login'?'Entrar →':'Crear cuenta →'}</button>
        {message&&<p className="message">{message}</p>}
        <small>La cuenta sirve para que sólo vos puedas editar tus publicaciones o pujar por ellas.</small>
      </form>
    </section>
  </main>
}
