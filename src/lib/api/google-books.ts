export interface GoogleBookResult {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover_url?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  isbn?: string;
}

export async function searchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(cleanQuery)}&maxResults=5&printType=books`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.items || !Array.isArray(data.items)) return [];

    return data.items.map((item: any) => {
      const info = item.volumeInfo || {};
      
      // Get best quality cover image from Google Books API
      let cover = info.imageLinks?.extraLarge ||
        info.imageLinks?.large ||
        info.imageLinks?.medium ||
        info.imageLinks?.thumbnail ||
        info.imageLinks?.smallThumbnail;

      if (cover) {
        // Upgrade to https and higher resolution zoom
        cover = cover.replace(/^http:\/\//i, 'https://');
        if (cover.includes('&edge=curl')) {
          cover = cover.replace('&edge=curl', '');
        }
      }

      const isbn13 = info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier;
      const isbn10 = info.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10')?.identifier;

      return {
        id: item.id,
        title: info.title || 'Untitled',
        author: Array.isArray(info.authors) ? info.authors.join(', ') : info.authors || 'Unknown Author',
        description: info.description || '',
        cover_url: cover,
        publishedDate: info.publishedDate,
        pageCount: info.pageCount,
        categories: info.categories || ['Fiction'],
        isbn: isbn13 || isbn10,
      };
    });
  } catch (err) {
    console.error('Google Books API search error:', err);
    return [];
  }
}
