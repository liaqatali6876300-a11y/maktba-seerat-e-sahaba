import React from 'react';
import { BookOpen, ArrowLeft, Library } from 'lucide-react';
import type { Book, ReadingProgress } from '../types/library';
import { TOTAL_CHAPTERS_COUNT, TOTAL_VOLUMES_COUNT } from '../data/books';
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
    <div className="space-y-12">
      {/* Editorial Hero Section */}
      <section className="border-b border-[#E0D9CA] dark:border-[#2C2820] pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <p className="text-xs tracking-wide text-[#7A5B2B] dark:text-[#C59B43] font-medium">
                خزانۂ سیرتِ نبوی ﷺ و تراجمِ صحابہ رضی اللہ عنہم
              </p>
              <h1 className="font-nastaliq text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-[1.85] text-balance">
                تاریخِ اسلام کی پانچ عظیم الشان تصانیف — مکمل ۳۱ جلدیں
              </h1>
              <p className="text-base sm:text-lg text-[#57534E] dark:text-[#B8B0A2] leading-8 max-w-2xl">
                حافظ ابن حجر عسقلانی، علامہ ابن اثیر جزری، امام محمد ابن سعد، امام ابن ہشام اور امام ابن عبد البر رحمہم اللہ کی لازوال علمی کاوشیں — فصیح اردو اسلوب اور آف لائن مطالعہ کی سہولت کے ساتھ۔
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {lastReadBook && lastReadVolume && lastReadChapter ? (
                <button
                  type="button"
                  onClick={() => onOpenReader(lastReadBook.id, lastReadVolume.id, lastReadChapter.id)}
                  className="inline-flex items-center gap-2.5 px-5 py-3 min-h-[44px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] dark:hover:bg-[#D4AC56] text-sm font-medium transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>مطالعہ جاری رکھیں: {lastReadBook.title} ({lastReadVolume.volumeTitle})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenReader(books[0].id, books[0].volumes[0].id, books[0].volumes[0].chapters[0].id)}
                  className="inline-flex items-center gap-2.5 px-5 py-3 min-h-[44px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] dark:hover:bg-[#D4AC56] text-sm font-medium transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>جلد اول سے مطالعہ شروع کریں</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenVolumesIndex}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl border border-[#D6CEBE] dark:border-[#332E24] bg-white/70 dark:bg-[#1C1A16] text-[#1C1917] dark:text-[#EDE8DD] hover:bg-[#EFEAE0] dark:hover:bg-[#24211C] text-sm font-medium transition-colors cursor-pointer"
              >
                <Library className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>تمام ۳۱ جلدوں کی فہرست</span>
              </button>
            </div>
          </div>

          {/* Right Curatorial Citation Panel */}
          <div className="lg:col-span-4 rounded-2xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#DFD8C8] dark:border-[#2E2A22] p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-xs font-medium text-[#7A5B2B] dark:text-[#C59B43]">
                اقتباسِ خاص
              </p>
              <p className="font-arabic text-xl leading-[2.0] text-[#1C1917] dark:text-[#F5F0E6]">
                خَيْرُ النَّاسِ قَرْنِي ثُمَّ الَّذِينَ يَلُونَهُمْ ثُمَّ الَّذِينَ يَلُونَهُمْ
              </p>
              <p className="font-nastaliq text-sm leading-8 text-[#57534E] dark:text-[#B8B0A2]">
                ’’سب سے بہترین لوگ میرے زمانے کے ہیں، پھر وہ جو ان کے بعد آئیں گے، پھر وہ جو ان کے بعد ہوں گے۔‘‘
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#D6CEBE] dark:border-[#2E2A22] flex items-center justify-between text-xs text-[#78716C] dark:text-[#9E9689]">
              <span>متفق علیہ (صحیح بخاری و مسلم)</span>
              <span>مکمل آف لائن ذخیرہ</span>
            </div>
          </div>
        </div>

        {/* 4-Column Archive Summary Strip */}
        <div className="mt-8 pt-6 border-t border-[#E0D9CA] dark:border-[#2C2820] grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-[#78716C] dark:text-[#9E9689]">عظیم مصنفین</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-[#1C1917] dark:text-[#F5F0E6]">
              ۵ ائمہ کرام
            </p>
          </div>
          <div>
            <p className="text-xs text-[#78716C] dark:text-[#9E9689]">مکمل جلدیں</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-[#1C1917] dark:text-[#F5F0E6]">
              {TOTAL_VOLUMES_COUNT} جلدیں
            </p>
          </div>
          <div>
            <p className="text-xs text-[#78716C] dark:text-[#9E9689]">ابواب و تذکرے</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-[#1C1917] dark:text-[#F5F0E6]">
              {TOTAL_CHAPTERS_COUNT} مستند مضامین
            </p>
          </div>
          <div>
            <p className="text-xs text-[#78716C] dark:text-[#9E9689]">دستیابی</p>
            <p className="mt-1 text-2xl font-semibold text-[#143D2B] dark:text-[#C59B43]">
              ۱۰۰٪ آف لائن
            </p>
          </div>
        </div>
      </section>

      {/* 5 Classical Books Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-nastaliq text-2xl sm:text-3xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
              امہات الکتب (پانچ مستند مراجع)
            </h2>
            <p className="text-sm text-[#57534E] dark:text-[#B8B0A2]">
              کسی بھی کتاب کا انتخاب کریں اور اس کی تمام جلدوں کا باب وار مطالعہ کریں
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, idx) => {
            const bookProgress = progressMap[book.id];
            const activeVol = bookProgress
              ? book.volumes.find((v) => v.id === bookProgress.volumeId)
              : undefined;

            return (
              <article
                key={book.id}
                className="group rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] overflow-hidden flex flex-col transition-colors hover:border-[#B6A98F] dark:hover:border-[#4A4335]"
              >
                <button
                  type="button"
                  onClick={() => onSelectBook(book.id)}
                  className="text-right flex-1 flex flex-col cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <BookCoverImage
                      src={book.coverImage}
                      alt={book.title}
                      title={book.title}
                      arabicTitle={book.arabicTitle}
                      accentHex={book.accentHex}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4 w-full">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-[#9E9689]">
                        <span className="tabular-nums">۰{idx + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>{book.author}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{book.volumeCount} جلدیں</span>
                      </div>

                      <h3 className="font-nastaliq text-xl font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose group-hover:text-[#143D2B] dark:group-hover:text-[#C59B43] transition-colors">
                        {book.title}
                      </h3>

                      <p className="text-sm text-[#57534E] dark:text-[#B8B0A2] leading-7 line-clamp-3">
                        {book.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#EFEAE0] dark:border-[#2A261E] flex items-center justify-between text-xs font-medium text-[#143D2B] dark:text-[#C59B43]">
                      <span>
                        {activeVol
                          ? `گزشتہ مطالعہ: ${activeVol.volumeTitle}`
                          : `${book.authorEra}`}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span>جلدیں دیکھیں</span>
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                      </span>
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
