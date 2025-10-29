import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'সমাধা - ব্রাহ্মণবাড়িয়া অভিযোগ ব্যবস্থাপনা',
  description: 'ব্রাহ্মণবাড়িয়ার জনগণের জন্য ডিজিটাল অভিযোগ ব্যবস্থাপনা প্ল্যাটফর্ম',
  keywords: 'সমাধা, ব্রাহ্মণবাড়িয়া, অভিযোগ, complaint, Bangladesh',
  authors: [{ name: 'সমাধা টিম' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FF6B35',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}