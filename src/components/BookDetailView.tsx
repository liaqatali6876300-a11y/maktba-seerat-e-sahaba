import React from 'react';
import { ArrowRight, BookOpen, ScrollText, ChevronLeft } from 'lucide-react';
import type { Book, ReadingProgress } from '../types/library';
import { BookCoverImage } from './BookCoverImage';

interface BookDetailViewProps {
  book: Book;
  progress?: ReadingProgress;
  onBack: () => void;
  onOpenReader: (bookId: string, volumeId: string, chapterId: string) => void;
}

export const BookDetailView: React.FC<BookDetailViewProps> = ({
  book,
  progress,
  onBack,
  onOpenReader,
}) => {
  const resumeVol = progress
    ? book.volumes.find((v) => v.id === progress.volumeId)
    : undefined;
  const resumeChap = resumeVol?.chapters.find((c) => c.id === progress?.chapterId);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] dark:text-[#B8B0A2] hover:text-[#1C1917] dark:hover:text-[#F5F0E6] min-h-[44px] cursor-pointer"
      >
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
        <span>واپس کتب خانہ</span>
      </button>

      {/* Mobile Book Header Card */}
      <section className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-4 space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-24 aspect-[3/4] shrink-0 rounded-xl overflow-hidden border border-[#D6CEBE] dark:border-[#332E24]">
            <BookCoverImage
              src={book.coverImage}
              alt={book.title}
              title={book.title}
              arabicTitle={book.arabicTitle}
              accentHex={book.accentHex}
              className="w-full h-full"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <p className="font-arabic text-xs text-[#7A5B2B] dark:text-[#C59B43] truncate">
              {book.arabicTitle}
            </p>
            <h1 className="font-nastaliq text-xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-[1.8]">
              {book.title}
            </h1>
            <p className="text-xs font-medium text-[#143D2B] dark:text-[#C59B43]">
              {book.authorFullName}
            </p>
            <p className="text-[11px] text-[#78716C] dark:text-[#9E9689] tabular-nums">
              {book.authorEra} · {book.volumeCount} مکمل جلدیں
            </p>
          </div>
        </div>

        <p className="text-xs text-[#44403C] dark:text-[#C8C0B4] leading-6">
          {book.description}
        </p>

        <div className="rounded-xl bg-[#F8F5EE] dark:bg-[#24211C] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7A5B2B] dark:text-[#C59B43]">
            <ScrollText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>منہجِ تالیف</span>
          </div>
          <p className="text-xs text-[#57534E] dark:text-[#B8B0A2] leading-6">
            {book.methodology}
          </p>
        </div>

        {resumeVol && resumeChap ? (
          <button
            type="button"
            onClick={() => onOpenReader(book.id, resumeVol.id, resumeChap.id)}
            className="w-full flex items-center justify-center gap-2 px-4 min-h-[46px] rounded-xl bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] text-xs font-medium cursor-pointer"
          >
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              جاری رکھیں: {resumeVol.volumeTitle} — {resumeChap.title}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              onOpenReader(
                book.id,
                book.volumes[0].id,
                book.volumes[0].chapters[0].id
              )
            }
            className="w-full flex items-center justify-center gap-2 px-4 min-h-[46px] rounded-xl bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] text-xs font-medium cursor-pointer"
          >
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>جلد اول سے مطالعہ شروع کریں</span>
          </button>
        )}
      </section>

      {/* Volumes & Chapters List */}
      <section className="space-y-4">
        <h2 className="font-nastaliq text-xl font-bold text-[#1C1917] dark:text-[#F5F0E6] px-1">
          فہرستِ جلدیں و ابواب ({book.volumeCount} جلدیں)
        </h2>

        <div className="space-y-4">
          {book.volumes.map((vol) => (
            <div
              key={vol.id}
              className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3 border-b border-[#EFEAE0] dark:border-[#2A261E] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#7A5B2B] dark:text-[#C59B43]">
                      {vol.volumeTitle}
                    </span>
                    <span aria-hidden="true" className="text-[#78716C]">·</span>
                    <span className="font-arabic text-[#78716C] dark:text-[#9E9689]">
                      {vol.arabicVolumeTitle}
                    </span>
                  </div>
                  <p className="text-xs text-[#57534E] dark:text-[#B8B0A2] leading-6">
                    {vol.scopeSummary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenReader(book.id, vol.id, vol.chapters[0].id)}
                  className="px-3 py-1.5 min-h-[38px] rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] text-[#143D2B] dark:text-[#C59B43] text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
                >
                  کھولیں
                </button>
              </div>

              <ul className="divide-y divide-[#F3EFE6] dark:divide-[#26221B]">
                {vol.chapters.map((chap, cIdx) => (
                  <li key={chap.id}>
                    <button
                      type="button"
                      onClick={() => onOpenReader(book.id, vol.id, chap.id)}
                      className="w-full py-2.5 text-right flex items-center justify-between gap-2 cursor-pointer min-h-[44px]"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#1C1917] dark:text-[#EDE8DD] leading-6">
                          <span className="text-[#78716C] ml-1.5 tabular-nums">
                            {cIdx + 1}.
                          </span>
                          {chap.title}
                        </p>
                        {chap.arabicHeading && (
                          <p className="font-arabic text-[11px] text-[#78716C] dark:text-[#9E9689] truncate">
                            {chap.arabicHeading}
                          </p>
                        )}
                      </div>
                      <ChevronLeft className="w-4 h-4 text-[#78716C] shrink-0" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
