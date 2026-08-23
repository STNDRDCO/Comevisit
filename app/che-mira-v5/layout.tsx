import type {Metadata} from 'next';
import './runtime.css';

export const metadata:Metadata={
  title:'CHE, MIRÁ — Qué hay en Buenos Aires',
  description:'Descubrí qué está pasando hoy en Buenos Aires. Explorá, guardá, publicá y competí por atención en Ojo Acá.',
  applicationName:'CHE, MIRÁ',
  openGraph:{
    title:'CHE, MIRÁ — Qué hay en Buenos Aires',
    description:'Qué está pasando hoy. Listado abierto, filtros claros y Ojo Acá: atención patrocinada a la vista.',
    type:'website',
    locale:'es_AR'
  },
  twitter:{card:'summary_large_image',title:'CHE, MIRÁ',description:'Qué hay en Buenos Aires.'}
};

export default function CheMiraV5Layout({children}:{children:React.ReactNode}){
  return children;
}
