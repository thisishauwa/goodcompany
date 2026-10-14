import { INITIAL_BOOKS } from '@/lib/data/initial-data';
import { BookDetailClient } from '@/components/books/BookDetailClient';

export function generateStaticParams() {
  return INITIAL_BOOKS.map((book) => ({
    id: book.id,
  }));
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookDetailClient bookId={id} />;
}
