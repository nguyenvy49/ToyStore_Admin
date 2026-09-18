import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { Metadata } from 'next';
import { NotificationProvider } from '@/context/NotificationContext';

export const metadata: Metadata = {
  title: {
    template: "%s | Admin-ToyWords",
    default: "Admin-ToyWords",
  }
};

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <NotificationProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}