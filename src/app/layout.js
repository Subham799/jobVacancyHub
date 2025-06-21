// src/app/layout.js
// Correct path for globals.css now that it's in src/app/
import './globals.css';

export const metadata = {
  // SEO Meta Tags
  metadataBase: new URL('https://www.jobvacancy.com'), // Base URL for canonical and OG tags
  title: {
    default: 'Job Finder - Latest Employment Opportunities in India',
    template: '%s | Job Finder', // For dynamic titles
  },
  description: 'Job Finder: Discover latest government, private sector, IT, banking, defense & teaching jobs. Real-time updates, career blogs & application deadlines. Your ultimate career portal in India.',
  keywords: ['government jobs', 'private jobs', 'IT careers', 'banking vacancies', 'teaching positions', 'defense jobs', 'job alerts, career blog, job search India, latest vacancies'],
  authors: [{ name: 'Job Vacancy Hub' }],
  
  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    url: 'https://www.jobvacancy.com/',
    title: 'Job Finder - Latest Employment Opportunities in India',
    description: 'Your premier source for government, private sector, IT, banking, and defense job opportunities with real-time updates and career guidance.',
    images: [{ url: 'https://www.jobvacancy.com/images/job-finder-og.png' }],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    url: 'https://www.jobvacancy.com/',
    title: 'Job Finder - Latest Employment Opportunities',
    description: 'Discover your next career move with real-time job updates across government and private sectors.',
    images: [{ url: 'https://www.jobvacancy.com/images/job-finder-twitter.png' }],
  },

  // Canonical URL (default for homepage)
  alternates: {
    canonical: 'https://www.jobvacancy.com/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager - Place directly here or use a dedicated script component if more complex */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VZTTBPWXS4"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VZTTBPWXS4');
          `,
        }} />
        {/* Meta Pixel Code would go here if needed, similar dangerouslySetInnerHTML */}
      </head>
      <body>{children}</body>
    </html>
  );
}
