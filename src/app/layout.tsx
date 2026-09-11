import type { Metadata, Viewport } from 'next';
import { Geist, Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import PublicSiteWrapper from '@/components/layout/PublicSiteWrapper';
import { CompareProvider } from '@/context/CompareContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Vijaya Durga Refrigeration | Air Conditioners, Appliances & Spares | Ravulapalem, Konaseema',
  description:
    'Air conditioners (Daikin, Lloyd, Mitsubishi Electric), Samsung washing machines, and genuine AC spare parts showroom in Ravulapalem, Dr. B. R. Ambedkar Konaseema District, Andhra Pradesh. Direct WhatsApp and phone showroom inquiry.',
  keywords: [
    'Vijaya Durga Refrigeration',
    'Vijaya Durga Refrigeration Ravulapalem',
    'AC Showroom Ravulapalem',
    'AC Works Ravulapalem',
    'Dr BR Ambedkar Konaseema AC Showroom',
    'Daikin AC Ravulapalem',
    'Lloyd AC Konaseema',
    'Mitsubishi Electric AC Ravulapalem',
    'Samsung Washing Machine Ravulapalem',
    'AC Spare Parts Ravulapalem',
    'AC Compressor R32 Ravulapalem',
    'Copper Pipe AC Konaseema',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[var(--vdr-canvas)] text-[var(--vdr-text-primary)] selection:bg-[var(--vdr-ice)] selection:text-[var(--vdr-navy)] font-sans antialiased flex flex-col min-w-0 max-w-full overflow-x-hidden"
      >
        <CompareProvider>
          <PublicSiteWrapper>{children}</PublicSiteWrapper>
        </CompareProvider>
      </body>
    </html>
  );
}
