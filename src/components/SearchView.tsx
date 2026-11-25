import React, { useMemo, useState } from 'react';
import { Search, BookOpen, X } from 'lucide-react';
import type { Book } from '../types/library';

interface SearchViewProps {
  books: Book[];
  onOpenReader: (bookId: string, volumeId: string, chapterId: string) => void;
}

interface SearchHit {
  bookId: string;
  bookTitle: string;
  author: string;
  volumeId: string;
  volumeTitle: string;
  chapterId: string;
  chapterTitle: string;
  snippet: string;
}

const SUGGESTED_QUERIES = [
  'ابوبکر صدیق',
  'عمر فاروق',
  'خدیجہ',
  'بدر',
  'ہجرت',
  'معاذ بن جبل',
  'اویس قرنی',
];

export const SearchView: React.FC<SearchViewProps> = ({ books, onOpenReader }) => {
  const [query, setQuery] = useState('');
  const [filterBookId, setFilterBookId] = useState<string>('all');

  const results = useMemo<SearchHit[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const q = trimmed.toLowerCase();
    const hits: SearchHit[] = [];

    for (const book of books) {
      if (filterBookId !== 'all' && book.id !== filterBookId) continue;

      for (const vol of book.volumes) {
        for (const chap of vol.chapters) {
          const haystack = [
            chap.title,
            chap.arabicHeading ?? '',
            vol.volumeTitle,
            vol.scopeSummary,
            ...chap.paragraphs,
          ].join(' ');

          if (haystack.toLowerCase().includes(q)) {
            const matchedPara =
              chap.paragraphs.find((p) => p.toLowerCase().includes(q)) ??
              chap.paragraphs[0] ??
              vol.scopeSummary;

            hits.push({
              bookId: book.id,
              bookTitle: book.title,
              author: book.author,
              volumeId: vol.id,
              volumeTitle: vol.volumeTitle,
              chapterId: chap.id,
              chapterTitle: chap.title,
              snippet: matchedPara.slice(0, 160) + (matchedPara.length > 160 ? '...' : ''),
            });
          }
        }
      }
    }

    return hits;
  }, [books, query, filterBookId]);

  return (
    <div className="space-y-5">
      <div className="space-y-3 border-b border-[#E0D9CA] dark:border-[#2C2820] pb-4">
        <h1 className="font-nastaliq text-2xl font-bold text-[#1C1917] dark:text-[#F5F0E6]">
          ۳۱ جلدوں میں آف لائن تلاش
        </h1>

        <div className="relative">
          <Search
            className="w-4 h-4 text-[#78716C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="صحابی، غزوہ یا موضوع لکھیں..."
            className="w-full min-h-[46px] pr-10 pl-10 py-2.5 rounded-xl bg-white dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] text-xs text-[#1C1917] dark:text-[#F5F0E6] placeholder:text-[#78716C] focus:outline-hidden focus:ring-2 focus:ring-[#143D2B] dark:focus:ring-[#C59B43]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="تلاش صاف کریں"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterBookId('all')}
            className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
              filterBookId === 'all'
                ? 'bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E]'
                : 'bg-[#EFEAE0] dark:bg-[#1C1A16] text-[#57534E] dark:text-[#B8B0A2]'
            }`}
          >
            تمام کتب
          </button>
          {books.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setFilterBookId(book.id)}
              className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                filterBookId === book.id
                  ? 'bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E]'
                  : 'bg-[#EFEAE0] dark:bg-[#1C1A16] text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              {book.title}
            </button>
          ))}
        </div>
      </div>

      {!query.trim() ? (
        <div className="space-y-3">
          <p className="text-xs text-[#57534E] dark:text-[#B8B0A2]">
            منتخب موضوعات پر ٹیپ کریں:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-3.5 py-2 min-h-[40px] rounded-xl bg-white dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] text-xs text-[#1C1917] dark:text-[#EDE8DD] cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#DFD8C8] dark:border-[#2E2A22] p-6 text-center space-y-1.5">
          <p className="font-nastaliq text-lg text-[#1C1917] dark:text-[#F5F0E6]">
            کوئی نتیجہ نہیں ملا
          </p>
          <p className="text-xs text-[#57534E] dark:text-[#B8B0A2]">
            کوئی دوسرا لفظ آزمائیں۔
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[11px] text-[#78716C] dark:text-[#9E9689] tabular-nums">
            کل {results.length} نتائج
          </p>
          {results.map((hit) => (
            <article
              key={`${hit.bookId}-${hit.volumeId}-${hit.chapterId}`}
              className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 text-[11px] text-[#78716C] dark:text-[#9E9689]">
                <span className="font-semibold text-[#7A5B2B] dark:text-[#C59B43] truncate">
                  {hit.bookTitle} · {hit.volumeTitle}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenReader(hit.bookId, hit.volumeId, hit.chapterId)}
                  className="inline-flex items-center gap-1 text-[#143D2B] dark:text-[#C59B43] font-medium shrink-0 min-h-[36px] cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>پڑھیں</span>
                </button>
              </div>
              <h2 className="font-nastaliq text-base font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
                {hit.chapterTitle}
              </h2>
              <p className="text-xs text-[#57534E] dark:text-[#B8B0A2] leading-6">
                {hit.snippet}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
