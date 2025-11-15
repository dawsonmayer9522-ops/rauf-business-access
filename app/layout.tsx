import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Abdul Rauf Business Access Portal',
  description:
    'Internal tool for managing my Facebook Businesses and Pages. Demonstrates business_management, pages_show_list and pages_manage_metadata permissions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' min-h-screen bg-gray-100'}>
        {children}
      </body>
    </html>
  );
}