import type {Metadata} from 'next';
import MobileNav from './mobile-nav';
import V6Tracker from './tracker';
import './mobile.css';
import './today.css';
export const metadata:Metadata={title:'CHE, MIRÁ — Hoy en Buenos Aires',description:'Lo que está pasando, salió, abrió, apareció o se está ofreciendo hoy en Buenos Aires.'};
export default function CheMiraV6Layout({children}:{children:React.ReactNode}){return <>{children}<V6Tracker/><MobileNav/></>}
