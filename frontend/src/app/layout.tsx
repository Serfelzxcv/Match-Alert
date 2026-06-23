import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Match Alert',
  description: 'Football match alerts application',
  icons: {
    icon: '/assets/match-alert-isotipo.png.png',
    shortcut: '/assets/match-alert-isotipo.png.png',
    apple: '/assets/match-alert-isotipo.png.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
