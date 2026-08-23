'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useParams} from 'next/navigation';
import './style.css';

type Profile={slug:string;display_name:string|null;bio:string|null;instagram_url:string|null;website_url:string|null};
type Listing={slug:string;title:string;category:string;neighborhood:string;venue:string|null;starts_at:string;price_label:string|null;description:string|null;destination_type:string;destination_url:string};
const BA='America/Argentina/Buenos_Aires';
const formatDate=(iso:string)=>new Intl.DateTimeFormat('es-AR',{timeZone:BA,weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso)).replace(',',' ·').toUpperCase();
const cta=(type:string)=>type==='instagram'?'Ver Instagram ↗':type==='whatsapp'?'Abrir WhatsApp ↗':type==='checkout'?'Comprar ↗':'Ir a la web ↗';

export default function OrganizerPage(){
  const params=useParams<{slug:string}>();const slug=params.slug;const [profile,setProfile]=useState<Profile|null>(null);const [listings,setListings]=useState<Listing[]>([]);const [loading,setLoading]=useState(true);const [notFound,setNotFound]=useState(false);
  useEffect(()=>{fetch(`/api/cm/organizers/${encodeURIComponent(slug)}`).then(async r=>{if(r.status===404){setNotFound(true);return null}return r.ok?r.json():Promise.reject()}).then(x=>{if(x?.data){setProfile(x.data.profile);setListings(x.data.listings||[])}}).catch(()=>setNotFound(true)).finally(()=>setLoading(false))},[slug]);
  const share=async()=>{const url=window.location.href;if(navigator.share){await navigator.share({title:profile?.display_name||'CHE, MIRÁ',url}).catch(()=>{})}else await navigator.clipboard?.writeText(url)};
  if(loading)return <main className="organizerPage"><div className="orgLoading">Cargando agenda…</div></main>;
  if(notFound||!profile)return <main className="organizerPage"><header className="orgTop"><Link href="/che-mira-v5">CHE, MIRÁ</Link></header><section className="orgEmpty"><h1>No encontramos esa agenda.</h1><Link href="/che-mira-v5/explorar">Explorar →</Link></section></main>;
  return <main className="organizerPage"><header className="orgTop"><Link href="/che-mira-v5" className="orgLogo">CHE, MIRÁ</Link><nav><Link href="/che-mira-v5/explorar">Explorar</Link><button onClick={share}>Compartir agenda ↗</button></nav></header><section className="orgHero"><span>AGENDA DEL ORGANIZADOR</span><h1>{profile.display_name||profile.slug}</h1>{profile.bio&&<p>{profile.bio}</p>}<div className="orgLinks">{profile.instagram_url&&<a href={profile.instagram_url} target="_blank" rel="noreferrer">Instagram ↗</a>}{profile.website_url&&<a href={profile.website_url} target="_blank" rel="noreferrer">Web ↗</a>}</div></section><section className="orgAgenda"><div className="orgSectionTitle"><div><span>PRÓXIMAMENTE</span><h2>{listings.length} cosa{listings.length===1?'':'s'} para mirar.</h2></div><p>Ordenado por fecha. Sin ranking editorial.</p></div>{listings.map(x=><article key={x.slug}><div className="orgWhen"><strong>{formatDate(x.starts_at)}</strong><span>{x.category}</span></div><div className="orgMain"><h3><Link href={`/che-mira-v5/p/${x.slug}`}>{x.title}</Link></h3><p>{x.neighborhood}{x.venue?` · ${x.venue}`:''}</p><small>{x.description}</small></div><div className="orgAction"><b>{x.price_label||'Consultar'}</b><Link href={`/che-mira-v5/p/${x.slug}`}>Ver ficha</Link><a href={x.destination_url} target="_blank" rel="noreferrer">{cta(x.destination_type)}</a></div></article>)}{listings.length===0&&<div className="orgNoPlans"><h3>No tiene publicaciones próximas.</h3><p>Esta agenda se va a llenar cada vez que publique algo nuevo.</p></div>}</section><footer><span>CHE, MIRÁ no recomienda este organizador.</span><b>Esta página ordena sus publicaciones.</b></footer></main>
}
