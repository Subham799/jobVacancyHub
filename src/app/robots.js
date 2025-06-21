// src/app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/', // Example: if you had private sections
    },
    sitemap: 'https://www.jobvacancy.com/sitemap.xml', // Link to your sitemap
  }
}
