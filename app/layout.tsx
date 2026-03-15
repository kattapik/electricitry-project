import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'EnergySync - Electricity Calculator',
  description: 'Energy consumption dashboard for monitoring',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="light">
      <body className={`${inter.variable} bg-background font-sans text-foreground antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex h-[100dvh] w-full overflow-hidden">
            <Sidebar />
            <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
              <Topbar />
              <div className="h-full w-full flex-1 overflow-auto">{children}</div>
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
