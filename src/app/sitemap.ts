import { MetadataRoute } from 'next';
import { INITIAL_BOOKS } from '@/lib/data/initial-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://readwithgoodcompany.com';

  const bookUrls = INITIAL_BOOKS.map((book) => ({
    url: `${baseUrl}/books/${book.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guidelines`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...bookUrls,
  ];
}
