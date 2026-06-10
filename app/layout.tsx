import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ScrollToTopButton } from '@/components/scroll-to-top';
import { FavoritesProvider } from '@/components/favorites-provider';
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: 'https://garage-sale-iota.vercel.app/',
  title: 'Liquidação',
  description: 'Móveis, eletrônicos e muito mais.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <FavoritesProvider>
            {children}
            <ScrollToTopButton />
          </FavoritesProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
