import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ComeVisit — The city, built by locals',
  description: 'Discover what to eat, see, drink and do anywhere. Built by locals, with transparent sponsored competition for attention.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR"><body>{children}</body></html>;
}
