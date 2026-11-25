import React, { useState } from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import type { Book } from '../types/library';

interface VolumesIndexViewProps {
  books: Book[];
  onOpenReader: (bookId: string, volumeId: string, chapterId: string) => void;
  onSelectBook: (bookId: string) => void;
}

export const VolumesIndexView: React.FC<VolumesIndexViewProps> = ({
  books,
  onOpenReader,
  onSelectBook,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>('all');

  const visibleBooks =
    selectedBookId === 'all' ? books : books.filter((b) => b.id === selectedBookId);

  return (
    <div className="space-y-6">
      <div className="space-y-3 border-b border-[#E0D9CA] dark:border-[#2C2820] pb-4">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="font-nastaliq text-2xl font-bold text-[#1C1917] dark:text-[#F5F0E6]">
            تمام ۳۱ جلدوں کی فہرست
          </h1>
          <span className="text-xs text-[#78716C] dark:text-[#9E9689] tabular-nums">
            ۸+۷+۸+۴+۴
          </span>
        </div>

        {/* Horizontal Scrollable Author Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            type="button"
            onClick={() => setSelectedBookId('all')}
            className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedBookId === 'all'
                ? 'bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E]'
                : 'bg-[#EFEAE0] dark:bg-[#1C1A16] text-[#57534E] dark:text-[#B8B0A2]'
            }`}
          >
            تمام (۳۱)
          </button>
          {books.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBookId(book.id)}
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedBookId === book.id
                  ? 'bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E]'
                  : 'bg-[#EFEAE0] dark:bg-[#1C1A16] text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              {book.title} ({book.volumeCount})
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Volume Cards */}
      <div className="space-y-8">
        {visibleBooks.map((book, bIdx) => (
          <section key={book.id} className="space-y-3">
            <div className="flex items-center justify-between gap-2 px-1">
              <div>
                <p className="text-[11px] text-[#78716C] dark:text-[#9E9689]">
                  کتاب ۰{bIdx + 1} · {book.author}
                </p>
                <h2 className="font-nastaliq text-xl font-bold text-[#1C1917] dark:text-[#F5F0E6]">
                  {book.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => onSelectBook(book.id)}
                className="text-xs font-medium text-[#143D2B] dark:text-[#C59B43] inline-flex items-center gap-1 min-h-[40px] px-2 shrink-0 cursor-pointer"
              >
                <span>تعارف</span>
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-2.5">
              {book.volumes.map((vol) => (
                <button
                  key={vol.id}
                  type="button"
                  onClick={() => onOpenReader(book.id, vol.id, vol.chapters[0].id)}
                  className="w-full text-right rounded-xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-4 flex items-center justify-between gap-3 active:scale-[0.99] transition-transform cursor-pointer min-h-[68px]"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#7A5B2B] dark:text-[#C59B43]">
                        {vol.volumeTitle}
                      </span>
                      <span aria-hidden="true" className="text-[#78716C]">·</span>
                      <span className="font-arabic text-[#78716C] dark:text-[#9E9689]">
                        {vol.arabicVolumeTitle}
                      </span>
                      <span aria-hidden="true" className="text-[#78716C]">·</span>
                      <span className="text-[#78716C] dark:text-[#9E9689] tabular-nums">
                        {vol.chapters.length} ابواب
                      </span>
                    </div>
                    <p className="text-xs text-[#44403C] dark:text-[#C8C0B4] leading-6 line-clamp-2">
                      {vol.scopeSummary}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] flex items-center justify-center text-[#143D2B] dark:text-[#C59B43] shrink-0">
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
