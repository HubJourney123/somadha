import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'সমাধা - ব্রাহ্মণবাড়িয়া অভিযোগ ব্যবস্থাপনা',
  description: 'ব্রাহ্মণবাড়িয়ার জনগণের জন্য ডিজিটাল অভিযোগ ব্যবস্থাপনা প্ল্যাটফর্ম',
  themeColor: '#ff9248',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'সমাধা'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ff9248" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#ff9248" />
        <meta name="msapplication-TileColor" content="#ff9248" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}