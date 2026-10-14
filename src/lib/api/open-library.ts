export interface OpenLibraryBookResult {
  title: string;
  author: string;
  first_publish_year?: number;
  cover_url?: string;
  isbn?: string;
  genre: string;
  description?: string;
  rating?: number;
  work_key?: string;
}

function cleanGenre(subjects?: string[]): string {
  if (!subjects || subjects.length === 0) return 'Contemporary Fiction';
  for (const s of subjects) {
    const lower = s.toLowerCase();
    if (lower.includes('romance') || lower.includes('rom-com')) return 'Contemporary Romance';
    if (lower.includes('thriller') || lower.includes('suspense')) return 'Psychological Thriller';
    if (lower.includes('mystery')) return 'Mystery & Detective';
    if (lower.includes('fantasy')) return 'Fantasy';
    if (lower.includes('science fiction') || lower.includes('sci-fi')) return 'Science Fiction';
    if (lower.includes('historical')) return 'Historical Fiction';
    if (lower.includes('memoir') || lower.includes('biography')) return 'Memoir';
    if (lower.includes('literary')) return 'Literary Fiction';
  }
  const first = subjects[0].split(',')[0].trim();
  return first || 'Contemporary Fiction';
}

export async function fetchWorkDescription(workKey: string): Promise<string> {
  try {
    const cleanKey = workKey.startsWith('/') ? workKey : `/${workKey}`;
    const res = await fetch(`https://openlibrary.org${cleanKey}.json`);
    if (!res.ok) return '';
    const data = await res.json();
    let desc = '';
    if (typeof data.description === 'string') {
      desc = data.description;
    } else if (data.description && typeof data.description.value === 'string') {
      desc = data.description.value;
    }
    // Clean up publisher stamps like "--Publisher", leading/trailing quotes, etc.
    return desc
      .replace(/--Publisher$/i, '')
      .replace(/^["'\s]+|["'\s]+$/g, '')
      .trim();
  } catch (error) {
    console.error('Failed to fetch Open Library work description:', error);
    return '';
  }
}

export async function searchOpenLibrary(query: string): Promise<OpenLibraryBookResult[]> {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      cleanQuery
    )}&fields=key,title,author_name,first_publish_year,cover_i,isbn,subject,ratings_average,first_sentence&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.docs || !Array.isArray(data.docs)) return [];

    const results: OpenLibraryBookResult[] = data.docs.map((doc: any) => {
      const coverUrl = doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : doc.isbn?.[0]
        ? `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`
        : undefined;

      const genre = cleanGenre(doc.subject);
      const rating = doc.ratings_average
        ? Math.round(doc.ratings_average * 10) / 10
        : undefined;

      const firstSentence = Array.isArray(doc.first_sentence)
        ? doc.first_sentence[0]
        : typeof doc.first_sentence === 'string'
        ? doc.first_sentence
        : undefined;

      return {
        title: doc.title,
        author: Array.isArray(doc.author_name)
          ? doc.author_name.join(', ')
          : doc.author_name || 'Unknown Author',
        first_publish_year: doc.first_publish_year,
        cover_url: coverUrl,
        isbn: doc.isbn?.[0],
        genre,
        description: firstSentence,
        rating,
        work_key: doc.key,
      };
    });

    return results;
  } catch (error) {
    console.error('Failed to search Open Library:', error);
    return [];
  }
}

/**
 * Reliably fetches the average community rating for a book title & author.
 * Queries Open Library search with specific title filter and returns a number between 1.0 and 5.0.
 */
export async function fetchBookRating(title: string, author?: string): Promise<number | undefined> {
  try {
    const cleanTitle = title.trim();
    if (!cleanTitle) return undefined;

    // 1. Direct title query to Open Library
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
      cleanTitle
    )}&limit=4&fields=title,author_name,ratings_average,ratings_count`;

    const res = await fetch(url);
    if (!res.ok) return undefined;

    const data = await res.json();
    if (!data.docs || !Array.isArray(data.docs)) return undefined;

    for (const doc of data.docs) {
      if (typeof doc.ratings_average === 'number' && doc.ratings_average > 0) {
        return Math.round(doc.ratings_average * 10) / 10;
      }
    }

    // 2. If author is provided, try combined query
    if (author) {
      const combinedUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(
        `${cleanTitle} ${author}`
      )}&limit=3&fields=title,author_name,ratings_average`;
      const combinedRes = await fetch(combinedUrl);
      if (combinedRes.ok) {
        const combinedData = await combinedRes.json();
        for (const doc of combinedData.docs || []) {
          if (typeof doc.ratings_average === 'number' && doc.ratings_average > 0) {
            return Math.round(doc.ratings_average * 10) / 10;
          }
        }
      }
    }

    return undefined;
  } catch (err) {
    console.error('Failed to fetch book rating:', err);
    return undefined;
  }
}
