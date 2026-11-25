import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  List,
  Minus,
  Plus,
  StickyNote,
  X,
} from 'lucide-react';
import type {
  Book,
  BookmarkItem,
  ReaderSettings,
  ReaderTheme,
  ScriptFont,
} from '../types/library';

interface ReaderViewProps {
  book: Book;
  volumeId: string;
  chapterId: string;
  settings: ReaderSettings;
  bookmarks: BookmarkItem[];
  onUpdateSettings: (next: ReaderSettings) => void;
  onNavigate: (bookId: string, volumeId: string, chapterId: string) => void;
  onToggleBookmark: (item: BookmarkItem) => void;
  onSaveNote: (item: BookmarkItem) => void;
  onBackToBook: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  book,
  volumeId,
  chapterId,
  settings,
  bookmarks,
  onUpdateSettings,
  onNavigate,
  onToggleBookmark,
  onSaveNote,
  onBackToBook,
}) => {
  const [showTocSheet, setShowTocSheet] = useState(false);
  const [showNotePanel, setShowNotePanel] = useState(false);

  const flatEntries = useMemo(() => {
    const list: { volumeId: string; volumeTitle: string; chapterId: string; chapterTitle: string }[] = [];
    for (const v of book.volumes) {
      for (const c of v.chapters) {
        list.push({
          volumeId: v.id,
          volumeTitle: v.volumeTitle,
          chapterId: c.id,
          chapterTitle: c.title,
        });
      }
    }
    return list;
  }, [book]);

  const currentVolume =
    book.volumes.find((v) => v.id === volumeId) ?? book.volumes[0];
  const currentChapter =
    currentVolume.chapters.find((c) => c.id === chapterId) ??
    currentVolume.chapters[0];

  const currentIndex = flatEntries.findIndex(
    (e) => e.volumeId === currentVolume.id && e.chapterId === currentChapter.id
  );
  const prevEntry = currentIndex > 0 ? flatEntries[currentIndex - 1] : null;
  const nextEntry =
    currentIndex >= 0 && currentIndex < flatEntries.length - 1
      ? flatEntries[currentIndex + 1]
      : null;

  const progressPercent =
    flatEntries.length > 0
      ? Math.round(((currentIndex + 1) / flatEntries.length) * 100)
      : 100;

  const bookmarkId = `${book.id}__${currentVolume.id}__${currentChapter.id}`;
  const existingBookmark = bookmarks.find((b) => b.id === bookmarkId);
  const [noteDraft, setNoteDraft] = useState(existingBookmark?.note ?? '');

  React.useEffect(() => {
    setNoteDraft(existingBookmark?.note ?? '');
  }, [bookmarkId, existingBookmark?.note]);

  const themeSurface =
    settings.readerTheme === 'night'
      ? 'bg-[#151411] text-[#EAE3D5] border-[#2C2820]'
      : settings.readerTheme === 'ivory'
      ? 'bg-[#FFFFFF] text-[#171717] border-[#E5E5E5]'
      : 'bg-[#FAF6EC] text-[#231F1A] border-[#E2D9C5]';

  const mutedText =
    settings.readerTheme === 'night'
      ? 'text-[#A69E8E]'
      : 'text-[#6B6359]';

  const handleBookmarkClick = () => {
    onToggleBookmark({
      id: bookmarkId,
      bookId: book.id,
      volumeId: currentVolume.id,
      chapterId: currentChapter.id,
      bookTitle: book.title,
      volumeTitle: currentVolume.volumeTitle,
      chapterTitle: currentChapter.title,
      note: noteDraft.trim() || undefined,
      createdAt: Date.now(),
    });
  };

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote({
      id: bookmarkId,
      bookId: book.id,
      volumeId: currentVolume.id,
      chapterId: currentChapter.id,
      bookTitle: book.title,
      volumeTitle: currentVolume.volumeTitle,
      chapterTitle: currentChapter.title,
      note: noteDraft.trim(),
      createdAt: Date.now(),
    });
    setShowNotePanel(false);
  };

  const setScript = (script: ScriptFont) =>
    onUpdateSettings({ ...settings, script });

  const setReaderTheme = (readerTheme: ReaderTheme) =>
    onUpdateSettings({ ...settings, readerTheme });

  const adjustFontSize = (delta: number) => {
    const next = Math.min(28, Math.max(15, settings.fontSize + delta));
    onUpdateSettings({ ...settings, fontSize: next });
  };

  return (
    <div className="space-y-4">
      {/* Compact Mobile Reader Controls */}
      <div className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={onBackToBook}
              aria-label="فہرستِ کتاب"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] text-[#1C1917] dark:text-[#EDE8DD] cursor-pointer shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowTocSheet(true)}
              className="inline-flex items-center gap-1.5 px-3 min-h-[40px] rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] text-xs font-medium text-[#1C1917] dark:text-[#EDE8DD] cursor-pointer truncate"
            >
              <List className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{currentVolume.volumeTitle}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleBookmarkClick}
              aria-label={existingBookmark ? 'نشانی ہٹائیں' : 'نشانی لگائیں'}
              className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                existingBookmark
                  ? 'border-[#143D2B] bg-[#143D2B]/10 text-[#143D2B] dark:border-[#C59B43] dark:bg-[#C59B43]/15 dark:text-[#C59B43]'
                  : 'border-[#D6CEBE] dark:border-[#332E24] text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              {existingBookmark ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowNotePanel((prev) => !prev)}
              aria-label="حاشیہ لکھیں"
              className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                showNotePanel
                  ? 'border-[#143D2B] bg-[#143D2B]/10 text-[#143D2B] dark:border-[#C59B43] dark:text-[#C59B43]'
                  : 'border-[#D6CEBE] dark:border-[#332E24] text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              <StickyNote className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Typography & Theme Row */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5">
          <div className="flex items-center p-0.5 rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] shrink-0">
            <button
              type="button"
              onClick={() => setScript('nastaliq')}
              className={`px-2.5 py-1 min-h-[32px] rounded-md text-[11px] font-medium cursor-pointer ${
                settings.script === 'nastaliq'
                  ? 'bg-white dark:bg-[#143D2B] text-[#1C1917] dark:text-[#F8F5EE] shadow-xs'
                  : 'text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              نستعلیق
            </button>
            <button
              type="button"
              onClick={() => setScript('naskh')}
              className={`px-2.5 py-1 min-h-[32px] rounded-md text-[11px] font-medium cursor-pointer ${
                settings.script === 'naskh'
                  ? 'bg-white dark:bg-[#143D2B] text-[#1C1917] dark:text-[#F8F5EE] shadow-xs'
                  : 'text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              نسخ
            </button>
          </div>

          <div className="flex items-center rounded-lg border border-[#D6CEBE] dark:border-[#332E24] px-1 shrink-0">
            <button
              type="button"
              onClick={() => adjustFontSize(-2)}
              aria-label="خط چھوٹا کریں"
              className="min-h-[32px] min-w-[30px] flex items-center justify-center cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] tabular-nums px-1">{settings.fontSize}</span>
            <button
              type="button"
              onClick={() => adjustFontSize(2)}
              aria-label="خط بڑا کریں"
              className="min-h-[32px] min-w-[30px] flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center p-0.5 rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] shrink-0">
            <button
              type="button"
              onClick={() => setReaderTheme('parchment')}
              className={`px-2 py-1 min-h-[32px] rounded-md text-[11px] font-medium cursor-pointer ${
                settings.readerTheme === 'parchment'
                  ? 'bg-[#FAF6EC] text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              قدیم
            </button>
            <button
              type="button"
              onClick={() => setReaderTheme('ivory')}
              className={`px-2 py-1 min-h-[32px] rounded-md text-[11px] font-medium cursor-pointer ${
                settings.readerTheme === 'ivory'
                  ? 'bg-white text-[#1C1917] shadow-xs'
                  : 'text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              سفید
            </button>
            <button
              type="button"
              onClick={() => setReaderTheme('night')}
              className={`px-2 py-1 min-h-[32px] rounded-md text-[11px] font-medium cursor-pointer ${
                settings.readerTheme === 'night'
                  ? 'bg-[#151411] text-[#F5F0E6] shadow-xs'
                  : 'text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              شب
            </button>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1.5 rounded-full bg-[#EFEAE0] dark:bg-[#2A261E] overflow-hidden">
            <div
              className="h-full bg-[#143D2B] dark:bg-[#C59B43] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-[#78716C] dark:text-[#9E9689] tabular-nums">
            {currentIndex + 1}/{flatEntries.length}
          </span>
        </div>
      </div>

      {/* Personal Note Drawer */}
      {showNotePanel && (
        <form
          onSubmit={handleSaveNoteSubmit}
          className="rounded-2xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="reader-note-input"
              className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F0E6]"
            >
              ذاتی حاشیہ ({currentChapter.title})
            </label>
            <button
              type="button"
              onClick={() => setShowNotePanel(false)}
              className="p-1 text-stone-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            id="reader-note-input"
            rows={3}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="اپنی یادداشت تحریر کریں..."
            className="w-full rounded-xl bg-white dark:bg-[#12110E] border border-[#D6CEBE] dark:border-[#332E24] p-3 text-xs leading-6 text-[#1C1917] dark:text-[#EDE8DD] focus:outline-hidden focus:ring-2 focus:ring-[#143D2B] dark:focus:ring-[#C59B43]"
          />
          <button
            type="submit"
            className="w-full min-h-[42px] rounded-xl bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] text-xs font-medium cursor-pointer"
          >
            محفوظ کریں
          </button>
        </form>
      )}

      {/* Main Mobile Reading Page */}
      <article className={`rounded-2xl border p-5 sm:p-6 transition-colors ${themeSurface}`}>
        <div className="space-y-6">
          <header className="text-center space-y-3 border-b border-[#D6CEBE]/60 dark:border-[#332E24] pb-5">
            <p className={`font-arabic text-lg ${mutedText}`}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className={`flex flex-wrap items-center justify-center gap-1.5 text-[11px] ${mutedText}`}>
              <span>{book.title}</span>
              <span aria-hidden="true">·</span>
              <span>{currentVolume.volumeTitle}</span>
            </div>
            <h1 className="font-nastaliq text-2xl font-bold leading-[1.9] text-balance">
              {currentChapter.title}
            </h1>
            {currentChapter.arabicHeading && (
              <p className={`font-arabic text-base ${mutedText}`}>
                {currentChapter.arabicHeading}
              </p>
            )}
          </header>

          {currentChapter.epigraphArabic && (
            <blockquote className="py-4 border-y border-[#C59B43]/40 text-center space-y-2.5">
              <p className="font-arabic text-lg leading-[2.0]">
                {currentChapter.epigraphArabic}
              </p>
              {currentChapter.epigraphTranslation && (
                <p className={`font-nastaliq text-xs leading-7 ${mutedText}`}>
                  {currentChapter.epigraphTranslation}
                </p>
              )}
            </blockquote>
          )}

          <div
            className={`space-y-6 text-justify ${
              settings.script === 'nastaliq' ? 'prose-nastaliq' : 'prose-naskh'
            }`}
            style={{ fontSize: `${settings.fontSize}px` }}
          >
            {currentChapter.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {currentChapter.citation && (
            <footer className={`pt-4 border-t border-[#D6CEBE]/60 dark:border-[#332E24] text-[11px] ${mutedText}`}>
              حوالہ: {currentChapter.citation}
            </footer>
          )}

          {/* Thumb-Friendly Previous / Next Chapter Controls */}
          <nav
            aria-label="ابواب کی تبدیلی"
            className="pt-5 border-t border-[#D6CEBE]/60 dark:border-[#332E24] grid grid-cols-2 gap-3"
          >
            {prevEntry ? (
              <button
                type="button"
                onClick={() =>
                  onNavigate(book.id, prevEntry.volumeId, prevEntry.chapterId)
                }
                className="flex items-center justify-start gap-2 px-3 py-2.5 min-h-[48px] rounded-xl border border-[#D6CEBE] dark:border-[#332E24] text-right cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className={`text-[10px] ${mutedText}`}>پچھلا ({prevEntry.volumeTitle})</p>
                  <p className="text-xs font-semibold truncate">{prevEntry.chapterTitle}</p>
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextEntry && (
              <button
                type="button"
                onClick={() =>
                  onNavigate(book.id, nextEntry.volumeId, nextEntry.chapterId)
                }
                className="flex items-center justify-end gap-2 px-3 py-2.5 min-h-[48px] rounded-xl bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] text-right cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-[10px] opacity-80">اگلا ({nextEntry.volumeTitle})</p>
                  <p className="text-xs font-semibold truncate">{nextEntry.chapterTitle}</p>
                </div>
                <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            )}
          </nav>
        </div>
      </article>

      {/* Bottom Sheet Table of Contents for All Volumes */}
      {showTocSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[430px] max-h-[80vh] rounded-t-3xl bg-[#F8F5EE] dark:bg-[#1C1A16] border-t border-[#D6CEBE] dark:border-[#332E24] flex flex-col overflow-hidden">
            <div className="w-10 h-1 rounded-full bg-[#D6CEBE] dark:bg-[#332E24] mx-auto mt-3" />
            <div className="px-4 py-3 border-b border-[#E2DACB] dark:border-[#2E2A22] flex items-center justify-between">
              <h3 className="font-nastaliq text-base font-bold text-[#1C1917] dark:text-[#F5F0E6]">
                {book.title} ({book.volumeCount} جلدیں)
              </h3>
              <button
                type="button"
                onClick={() => setShowTocSheet(false)}
                aria-label="بند کریں"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {book.volumes.map((vol) => (
                <div key={vol.id} className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#7A5B2B] dark:text-[#C59B43] px-1">
                    {vol.volumeTitle} — {vol.arabicVolumeTitle}
                  </p>
                  <ul className="space-y-1">
                    {vol.chapters.map((chap) => {
                      const active =
                        vol.id === currentVolume.id && chap.id === currentChapter.id;
                      return (
                        <li key={chap.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onNavigate(book.id, vol.id, chap.id);
                              setShowTocSheet(false);
                            }}
                            className={`w-full text-right px-3 py-2.5 min-h-[44px] rounded-xl text-xs transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] font-medium'
                                : 'bg-white dark:bg-[#24211C] text-[#1C1917] dark:text-[#EDE8DD]'
                            }`}
                          >
                            {chap.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
