import './globals.css';
import { Metadata, Viewport } from 'next';
import ClientLayout from './components/ClientLayout';

export const metadata: Metadata = {
  title: 'Stripe Checkout Demo',
  description: 'A modern e-commerce demo built with Next.js, Stripe, and Tailwind CSS',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
