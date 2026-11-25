import React, { useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  ScrollText,
  ChevronLeft,
  FileUp,
  FileCheck2,
} from 'lucide-react';
import type { AttachedVolumeMeta, Book, ReadingProgress } from '../types/library';
import { BookCoverImage } from './BookCoverImage';

interface BookDetailViewProps {
  book: Book;
  progress?: ReadingProgress;
  volumeFileMeta: Record<string, AttachedVolumeMeta>;
  onBack: () => void;
  onOpenReader: (bookId: string, volumeId: string, chapterId: string) => void;
  onAttachVolumeFile: (bookId: string, volumeId: string, file: File) => void;
  onOpenAttachedVolume: (bookId: string, volumeId: string) => void;
}

export const BookDetailView: React.FC<BookDetailViewProps> = ({
  book,
  progress,
  volumeFileMeta,
  onBack,
  onOpenReader,
  onAttachVolumeFile,
  onOpenAttachedVolume,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingVolumeIdRef = useRef<string | null>(null);

  const resumeVol = progress
    ? book.volumes.find((v) => v.id === progress.volumeId)
    : undefined;
  const resumeChap = resumeVol?.chapters.find((c) => c.id === progress?.chapterId);

  const triggerAttach = (volumeId: string) => {
    pendingVolumeIdRef.current = volumeId;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const volId = pendingVolumeIdRef.current;
    if (file && volId) {
      onAttachVolumeFile(book.id, volId, file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        onChange={handleFileChange}
        className="hidden"
      />

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
              {book.authorEra} · {book.volumeCount} جلدیں · تقریباً {book.approxPages.toLocaleString('ur-PK')} صفحات
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

      {/* Volumes & Chapters List + Offline PDF/TXT Vault per Volume */}
      <section className="space-y-4">
        <div className="px-1 space-y-1">
          <h2 className="font-nastaliq text-xl font-bold text-[#1C1917] dark:text-[#F5F0E6]">
            فہرستِ جلدیں و ابواب ({book.volumeCount} جلدیں · ~{book.approxPages.toLocaleString('ur-PK')} صفحات)
          </h2>
          <p className="text-[11px] text-[#78716C] dark:text-[#9E9689] leading-5">
            ہر جلد کے منتخب اردو ابواب فوری پڑھیں، یا اپنے فون سے مکمل مطبوعہ جلد (PDF / TXT) آف لائن منسلک کر کے محفوظ کریں۔
          </p>
        </div>

        <div className="space-y-4">
          {book.volumes.map((vol) => {
            const attached = volumeFileMeta[vol.id];
            return (
              <div
                key={vol.id}
                className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#EFEAE0] dark:border-[#2A261E] pb-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-[#7A5B2B] dark:text-[#C59B43]">
                        {vol.volumeTitle}
                      </span>
                      <span aria-hidden="true" className="text-[#78716C]">·</span>
                      <span className="font-arabic text-[#78716C] dark:text-[#9E9689]">
                        {vol.arabicVolumeTitle}
                      </span>
                      <span aria-hidden="true" className="text-[#78716C]">·</span>
                      <span className="text-[#78716C] dark:text-[#9E9689] tabular-nums">
                        ~{vol.approxPages.toLocaleString('ur-PK')} صفحات
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
                    ابواب پڑھیں
                  </button>
                </div>

                {/* Full Printed Volume Attachment Row (PDF / TXT Offline Storage) */}
                <div className="rounded-xl bg-[#F8F5EE] dark:bg-[#24211C] p-3 flex items-center justify-between gap-2">
                  {attached ? (
                    <>
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck2 className="w-4 h-4 text-[#143D2B] dark:text-[#C59B43] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-[#143D2B] dark:text-[#C59B43]">
                            مکمل جلد آف لائن محفوظ ہے
                          </p>
                          <p className="text-[10px] text-[#78716C] dark:text-[#9E9689] truncate">
                            {attached.fileName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onOpenAttachedVolume(book.id, vol.id)}
                          className="px-3 py-1.5 min-h-[36px] rounded-lg bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] text-[11px] font-medium cursor-pointer"
                        >
                          مکمل جلد کھولیں
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerAttach(vol.id)}
                          className="px-2.5 py-1.5 min-h-[36px] rounded-lg border border-[#D6CEBE] dark:border-[#332E24] text-[11px] text-[#57534E] dark:text-[#B8B0A2] cursor-pointer"
                        >
                          بدلیں
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[11px] text-[#57534E] dark:text-[#B8B0A2]">
                        مکمل مطبوعہ کتاب (PDF / TXT) فون میں محفوظ کریں
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerAttach(vol.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-[#143D2B] dark:border-[#C59B43] text-[#143D2B] dark:text-[#C59B43] text-[11px] font-medium shrink-0 cursor-pointer"
                      >
                        <FileUp className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>فائل منسلک کریں</span>
                      </button>
                    </>
                  )}
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
            );
          })}
        </div>
      </section>
    </div>
  );
};
