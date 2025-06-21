// src/app/layout.js
import './globals.css'; // This imports the global Tailwind CSS
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JobConnect - Find Your Dream Job Effortlessly',
  description: 'Your professional job portal for government, private, and sector-specific jobs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children} {/* This is where your page.js content will be rendered */}
      </body>
    </html>
  );
}