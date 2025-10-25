// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UsuarioProvider } from '@/context/UsuarioContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'iFConnect',
  description: 'Sua rede social',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <UsuarioProvider>
          {children}
        </UsuarioProvider>
      </body>
    </html>
  );
}