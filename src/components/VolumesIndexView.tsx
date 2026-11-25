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
    <div className="space-y-8">
      <div className="border-b border-[#E0D9CA] dark:border-[#2C2820] pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#7A5B2B] dark:text-[#C59B43]">
              مکمل اشاریہ کتب
            </p>
            <h1 className="font-nastaliq text-3xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
              پانچ کتب کی تمام ۳۱ جلدیں
            </h1>
          </div>
          <p className="text-sm text-[#57534E] dark:text-[#B8B0A2] tabular-nums">
            ۸ + ۷ + ۸ + ۴ + ۴ = ۳۱ مکمل جلدیں
          </p>
        </div>

        {/* Author Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setSelectedBookId('all')}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedBookId === 'all'
                ? 'bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E]'
                : 'bg-[#EFEAE0] dark:bg-[#1C1A16] text-[#57534E] dark:text-[#B8B0A2] hover:text-[#1C1917] dark:hover:text-[#F5F0E6]'
            }`}
          >
            تمام کتب (۳۱ جلدیں)
          </button>
          {books.map((book) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBookId(book.id)}
              className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedBookId === book.id
                  ? 'bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E]'
                  : 'bg-[#EFEAE0] dark:bg-[#1C1A16] text-[#57534E] dark:text-[#B8B0A2] hover:text-[#1C1917] dark:hover:text-[#F5F0E6]'
              }`}
            >
              {book.title} ({book.volumeCount})
            </button>
          ))}
        </div>
      </div>

      {/* Volumes List grouped by Book */}
      <div className="space-y-12">
        {visibleBooks.map((book, bIdx) => (
          <section key={book.id} className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#E5DEC9] dark:border-[#2A261E] pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#9E9689]">
                  <span className="tabular-nums">کتاب ۰{bIdx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span>{book.author}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-arabic">{book.arabicTitle}</span>
                </div>
                <h2 className="font-nastaliq text-2xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
                  {book.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => onSelectBook(book.id)}
                className="text-xs font-medium text-[#143D2B] dark:text-[#C59B43] hover:underline inline-flex items-center gap-1 min-h-[40px] px-2 cursor-pointer"
              >
                <span>تعارفِ مصنف اور منہج</span>
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {book.volumes.map((vol) => (
                <div
                  key={vol.id}
                  className="rounded-xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-5 flex flex-col justify-between space-y-4 hover:border-[#B6A98F] dark:hover:border-[#4A4335] transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-[#9E9689]">
                      <span className="font-semibold text-[#7A5B2B] dark:text-[#C59B43]">
                        {vol.volumeTitle}
                      </span>
                      <span className="font-arabic">{vol.arabicVolumeTitle}</span>
                    </div>
                    <p className="text-sm text-[#1C1917] dark:text-[#EDE8DD] leading-7">
                      {vol.scopeSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0EBE1] dark:border-[#2A261E] flex items-center justify-between">
                    <span className="text-xs text-[#78716C] dark:text-[#9E9689] tabular-nums">
                      {vol.chapters.length} ابواب
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenReader(book.id, vol.id, vol.chapters[0].id)
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#143D2B] dark:text-[#C59B43] hover:underline min-h-[40px] px-2 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>مطالعہ کریں</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
