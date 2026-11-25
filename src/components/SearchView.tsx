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
              snippet: matchedPara.slice(0, 220) + (matchedPara.length > 220 ? '...' : ''),
            });
          }
        }
      }
    }

    return hits;
  }, [books, query, filterBookId]);

  return (
    <div className="space-y-8">
      <div className="border-b border-[#E0D9CA] dark:border-[#2C2820] pb-6 space-y-4">
        <div>
          <p className="text-xs font-medium text-[#7A5B2B] dark:text-[#C59B43]">
            فوری مقامی تلاش (بغیر انٹرنیٹ)
          </p>
          <h1 className="font-nastaliq text-3xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
            تمام ۳۱ جلدوں میں تلاش کریں
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <Search
            className="w-5 h-5 text-[#78716C] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="صحابی کا نام، غزوہ، شہر یا موضوع تحریر کریں (مثلاً: صدیق، بدر، خدیجہ)..."
            className="w-full min-h-[48px] pr-12 pl-11 py-3 rounded-xl bg-white dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] text-sm text-[#1C1917] dark:text-[#F5F0E6] placeholder:text-[#78716C] focus:outline-hidden focus:ring-2 focus:ring-[#143D2B] dark:focus:ring-[#C59B43]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="تلاش صاف کریں"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter by Book */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterBookId('all')}
            className={`px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
              className={`px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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

      {/* Suggested Queries or Results */}
      {!query.trim() ? (
        <div className="space-y-4">
          <p className="text-sm text-[#57534E] dark:text-[#B8B0A2]">
            منتخب موضوعات اور اسماءِ گرامی پر کلک کر کے فوری تلاش کریں:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {SUGGESTED_QUERIES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-4 py-2 min-h-[40px] rounded-lg bg-white dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] text-sm text-[#1C1917] dark:text-[#EDE8DD] hover:border-[#143D2B] dark:hover:border-[#C59B43] transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#DFD8C8] dark:border-[#2E2A22] p-8 text-center space-y-2">
          <p className="font-nastaliq text-xl text-[#1C1917] dark:text-[#F5F0E6]">
            کوئی نتیجہ نہیں ملا
          </p>
          <p className="text-sm text-[#57534E] dark:text-[#B8B0A2]">
            براہِ کرم کوئی دوسرا لفظ یا صحابی کا اسمِ گرامی آزمائیں۔
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-[#78716C] dark:text-[#9E9689] tabular-nums">
            کل {results.length} نتائج دستیاب ہوئے
          </p>
          <div className="space-y-4">
            {results.map((hit) => (
              <article
                key={`${hit.bookId}-${hit.volumeId}-${hit.chapterId}`}
                className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-6 space-y-3 hover:border-[#B6A98F] dark:hover:border-[#4A4335] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#9E9689]">
                    <span className="font-semibold text-[#7A5B2B] dark:text-[#C59B43]">
                      {hit.bookTitle}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{hit.volumeTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span>{hit.author}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenReader(hit.bookId, hit.volumeId, hit.chapterId)
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#143D2B] dark:text-[#C59B43] hover:underline min-h-[36px] cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>مکمل باب پڑھیں</span>
                  </button>
                </div>

                <h2 className="font-nastaliq text-xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
                  {hit.chapterTitle}
                </h2>
                <p className="text-sm text-[#57534E] dark:text-[#B8B0A2] leading-7">
                  {hit.snippet}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
