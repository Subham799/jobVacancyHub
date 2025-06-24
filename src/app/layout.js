// src/app/layout.js
import './globals.css';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://www.jobvacancy.com'),
  title: {
    default: 'Job Finder - Latest Employment Opportunities in India',
    template: '%s | Job Finder',
  },
  description: 'Job Finder: Discover latest government, private sector, IT, banking, defense & teaching jobs. Real-time updates, career blogs & application deadlines. Your ultimate career portal in India.',
  keywords: ['government jobs', 'private jobs', 'IT careers', 'banking vacancies', 'teaching positions', 'defense jobs', 'job alerts, career blog, job search India, latest vacancies'],
  authors: [{ name: 'Job Vacancy Hub' }],
  openGraph: {
    type: 'website',
    url: 'https://www.jobvacancy.com/',
    title: 'Job Finder - Latest Employment Opportunities in India',
    description: 'Your premier source for government, private sector, IT, banking, and defense job opportunities with real-time updates and career guidance.',
    images: [{ url: 'https://www.jobvacancy.com/images/job-finder-og.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://www.jobvacancy.com/',
    title: 'Job Finder - Latest Employment Opportunities',
    description: 'Discover your next career move with real-time job updates across government and private sectors.',
    images: [{ url: 'https://www.jobvacancy.com/images/job-finder-twitter.png' }],
  },
  alternates: {
    canonical: 'https://www.jobvacancy.com/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics script using next/script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VZTTBPWXS4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VZTTBPWXS4');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
