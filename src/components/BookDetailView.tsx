import React from 'react';
import { ArrowRight, BookOpen, ScrollText } from 'lucide-react';
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
    <div className="space-y-10">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-[#57534E] dark:text-[#B8B0A2] hover:text-[#1C1917] dark:hover:text-[#F5F0E6] min-h-[44px] cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
          <span>واپس کتب خانہ</span>
        </button>
      </div>

      {/* Book Header Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-b border-[#E0D9CA] dark:border-[#2C2820] pb-10">
        <div className="lg:col-span-4">
          <div className="aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-[#D6CEBE] dark:border-[#332E24]">
            <BookCoverImage
              src={book.coverImage}
              alt={book.title}
              title={book.title}
              arabicTitle={book.arabicTitle}
              accentHex={book.accentHex}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] dark:text-[#9E9689]">
              <span className="font-arabic text-sm text-[#7A5B2B] dark:text-[#C59B43]">
                {book.arabicTitle}
              </span>
              <span aria-hidden="true">·</span>
              <span>{book.authorEra}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{book.volumeCount} مکمل جلدیں</span>
            </div>

            <h1 className="font-nastaliq text-3xl sm:text-4xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-[1.85]">
              {book.fullTitle}
            </h1>

            <p className="text-base font-medium text-[#143D2B] dark:text-[#C59B43]">
              مصنف: {book.authorFullName}
            </p>

            <p className="text-base text-[#44403C] dark:text-[#C8C0B4] leading-8">
              {book.description}
            </p>

            <div className="rounded-xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#DFD8C8] dark:border-[#2E2A22] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7A5B2B] dark:text-[#C59B43]">
                <ScrollText className="w-4 h-4" aria-hidden="true" />
                <span>منہجِ تالیف و علمی خصوصیات</span>
              </div>
              <p className="text-sm text-[#44403C] dark:text-[#B8B0A2] leading-7">
                {book.methodology}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {resumeVol && resumeChap ? (
              <button
                type="button"
                onClick={() => onOpenReader(book.id, resumeVol.id, resumeChap.id)}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] text-sm font-medium transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>مطالعہ جاری رکھیں: {resumeVol.volumeTitle} — {resumeChap.title}</span>
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
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] text-sm font-medium transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>جلد اول سے مطالعہ شروع کریں</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Complete Volumes & Chapters Breakdown */}
      <section className="space-y-6">
        <h2 className="font-nastaliq text-2xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
          فہرستِ جلدیں و ابواب ({book.volumeCount} جلدیں)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {book.volumes.map((vol) => (
            <div
              key={vol.id}
              className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#EFEAE0] dark:border-[#2A261E] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#7A5B2B] dark:text-[#C59B43]">
                    <span className="font-semibold">{vol.volumeTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-arabic">{vol.arabicVolumeTitle}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-[#57534E] dark:text-[#B8B0A2] leading-7">
                    {vol.scopeSummary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenReader(book.id, vol.id, vol.chapters[0].id)}
                  className="px-3.5 py-2 min-h-[40px] rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] text-[#143D2B] dark:text-[#C59B43] hover:bg-[#E4DEC9] dark:hover:bg-[#302C24] text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
                >
                  جلد کھولیں
                </button>
              </div>

              <ul className="divide-y divide-[#F3EFE6] dark:divide-[#26221B]">
                {vol.chapters.map((chap, cIdx) => (
                  <li key={chap.id}>
                    <button
                      type="button"
                      onClick={() => onOpenReader(book.id, vol.id, chap.id)}
                      className="w-full py-3 text-right flex items-start justify-between gap-3 group cursor-pointer min-h-[44px]"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-[#1C1917] dark:text-[#EDE8DD] group-hover:text-[#143D2B] dark:group-hover:text-[#C59B43] transition-colors">
                          <span className="text-xs text-[#78716C] dark:text-[#9E9689] ml-2 tabular-nums">
                            {cIdx + 1}.
                          </span>
                          {chap.title}
                        </p>
                        {chap.arabicHeading && (
                          <p className="font-arabic text-xs text-[#78716C] dark:text-[#9E9689]">
                            {chap.arabicHeading}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-[#143D2B] dark:text-[#C59B43] opacity-70 group-hover:opacity-100 shrink-0 mt-0.5">
                        مطالعہ
                      </span>
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
