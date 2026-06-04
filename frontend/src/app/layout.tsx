import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Match Alert',
  description: 'Football match alerts application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
