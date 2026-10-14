import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/apply', '/guidelines', '/login', '/books/'],
        disallow: ['/dashboard', '/admin', '/settings', '/directory', '/onboarding'],
      },
    ],
    sitemap: 'https://readwithgoodcompany.com/sitemap.xml',
  };
}
