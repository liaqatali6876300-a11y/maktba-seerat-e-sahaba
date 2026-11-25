import React from 'react';
import { BookOpen, ChevronLeft, Library } from 'lucide-react';
import type { Book, ReadingProgress } from '../types/library';
import { TOTAL_APPROX_PAGES, TOTAL_VOLUMES_COUNT } from '../data/books';
import { BookCoverImage } from './BookCoverImage';

interface LibraryHomeProps {
  books: Book[];
  progressMap: Record<string, ReadingProgress>;
  onSelectBook: (bookId: string) => void;
  onOpenReader: (bookId: string, volumeId: string, chapterId: string) => void;
  onOpenVolumesIndex: () => void;
}

export const LibraryHome: React.FC<LibraryHomeProps> = ({
  books,
  progressMap,
  onSelectBook,
  onOpenReader,
  onOpenVolumesIndex,
}) => {
  const recentProgressList = Object.values(progressMap).sort((a, b) => b.updatedAt - a.updatedAt);
  const lastRead = recentProgressList[0];
  const lastReadBook = lastRead ? books.find((b) => b.id === lastRead.bookId) : undefined;
  const lastReadVolume = lastReadBook?.volumes.find((v) => v.id === lastRead?.volumeId);
  const lastReadChapter = lastReadVolume?.chapters.find((c) => c.id === lastRead?.chapterId);

  return (
    <div className="space-y-6">
      {/* Compact Mobile Hero Card */}
      <section className="rounded-2xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#DFD8C8] dark:border-[#2E2A22] p-5 space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-[#7A5B2B] dark:text-[#C59B43]">
            خزانۂ سیرتِ نبوی ﷺ و تراجمِ صحابہ
          </p>
          <h1 className="font-nastaliq text-2xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-[1.9] text-balance">
            پانچ عظیم مصنفین — مکمل ۳۱ جلدیں
          </h1>
          <p className="text-xs text-[#57534E] dark:text-[#B8B0A2] leading-6">
            فصیح اردو اسلوب اور خوبصورت نستعلیق خط میں منتخب ابواب + مکمل ۱۲,۰۰۰ صفحات کی پی ڈی ایف/ٹیکسٹ جلدیں آف لائن محفوظ کرنے کی سہولت۔
          </p>
        </div>

        {/* 4 Compact Metrics */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[#DFD8C8] dark:border-[#2E2A22] text-center">
          <div>
            <p className="text-base font-bold tabular-nums text-[#1C1917] dark:text-[#F5F0E6]">۵</p>
            <p className="text-[10px] text-[#78716C] dark:text-[#9E9689]">مصنفین</p>
          </div>
          <div>
            <p className="text-base font-bold tabular-nums text-[#1C1917] dark:text-[#F5F0E6]">
              {TOTAL_VOLUMES_COUNT}
            </p>
            <p className="text-[10px] text-[#78716C] dark:text-[#9E9689]">جلدیں</p>
          </div>
          <div>
            <p className="text-base font-bold tabular-nums text-[#1C1917] dark:text-[#F5F0E6]">
              {TOTAL_APPROX_PAGES.toLocaleString('ur-PK')}+
            </p>
            <p className="text-[10px] text-[#78716C] dark:text-[#9E9689]">مطبوعہ صفحات</p>
          </div>
          <div>
            <p className="text-base font-bold text-[#143D2B] dark:text-[#C59B43]">۱۰۰٪</p>
            <p className="text-[10px] text-[#78716C] dark:text-[#9E9689]">آف لائن</p>
          </div>
        </div>

        {/* Primary Mobile Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          {lastReadBook && lastReadVolume && lastReadChapter ? (
            <button
              type="button"
              onClick={() => onOpenReader(lastReadBook.id, lastReadVolume.id, lastReadChapter.id)}
              className="w-full flex items-center justify-center gap-2 px-4 min-h-[46px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] text-xs font-medium transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">
                جاری رکھیں: {lastReadBook.title} ({lastReadVolume.volumeTitle})
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                onOpenReader(books[0].id, books[0].volumes[0].id, books[0].volumes[0].chapters[0].id)
              }
              className="w-full flex items-center justify-center gap-2 px-4 min-h-[46px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] text-xs font-medium transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>جلد اول سے مطالعہ شروع کریں</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenVolumesIndex}
            className="w-full flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-xl border border-[#D6CEBE] dark:border-[#332E24] bg-white/80 dark:bg-[#12110E]/60 text-[#1C1917] dark:text-[#EDE8DD] text-xs font-medium transition-colors cursor-pointer"
          >
            <Library className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>تمام ۳۱ جلدیں اور مکمل کتب منسلک کریں</span>
          </button>
        </div>
      </section>

      {/* Mobile Touch-List Cards for 5 Classical Works */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-nastaliq text-xl font-bold text-[#1C1917] dark:text-[#F5F0E6]">
            امہات الکتب (۵ کتابیں)
          </h2>
          <span className="text-xs text-[#78716C] dark:text-[#9E9689] tabular-nums">
            کل ۳۱ جلدیں · ۱۲,۰۰۰+ صفحات
          </span>
        </div>

        <div className="space-y-3">
          {books.map((book, idx) => {
            const bookProgress = progressMap[book.id];
            const activeVol = bookProgress
              ? book.volumes.find((v) => v.id === bookProgress.volumeId)
              : undefined;

            return (
              <article
                key={book.id}
                className="group rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] overflow-hidden active:scale-[0.99] transition-transform"
              >
                <button
                  type="button"
                  onClick={() => onSelectBook(book.id)}
                  className="w-full p-3.5 text-right flex items-stretch gap-3.5 cursor-pointer min-h-[112px]"
                >
                  <div className="w-24 shrink-0 rounded-xl overflow-hidden border border-[#E2DACB] dark:border-[#2E2A22]">
                    <BookCoverImage
                      src={book.coverImage}
                      alt={book.title}
                      title={book.title}
                      arabicTitle={book.arabicTitle}
                      accentHex={book.accentHex}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] dark:text-[#9E9689]">
                        <span className="tabular-nums">۰{idx + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{book.author}</span>
                      </div>

                      <h3 className="font-nastaliq text-lg font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-[1.8]">
                        {book.title}
                      </h3>

                      <p className="text-xs text-[#57534E] dark:text-[#B8B0A2] leading-6">
                        {book.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-medium text-[#143D2B] dark:text-[#C59B43]">
                      <span className="tabular-nums">
                        {activeVol
                          ? `${book.volumeCount} جلدیں · ~${book.approxPages.toLocaleString('ur-PK')} صفحات · ${activeVol.volumeTitle}`
                          : `${book.volumeCount} جلدیں · ~${book.approxPages.toLocaleString('ur-PK')} صفحات`}
                      </span>
                      <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
