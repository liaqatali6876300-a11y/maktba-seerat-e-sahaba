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
  const [showMobileToc, setShowMobileToc] = useState(false);
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
    const next = Math.min(30, Math.max(15, settings.fontSize + delta));
    onUpdateSettings({ ...settings, fontSize: next });
  };

  return (
    <div className="space-y-6">
      {/* Reader Progress & Top Utility Strip */}
      <div className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToBook}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] text-[#1C1917] dark:text-[#EDE8DD] hover:bg-[#E4DEC9] dark:hover:bg-[#302C24] text-xs font-medium transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
              <span>فہرستِ کتاب</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMobileToc(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[#D6CEBE] dark:border-[#332E24] text-xs font-medium text-[#1C1917] dark:text-[#EDE8DD] cursor-pointer"
            >
              <List className="w-4 h-4" aria-hidden="true" />
              <span>جلدیں ({book.volumeCount})</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#57534E] dark:text-[#B8B0A2]">
              <span className="font-semibold text-[#1C1917] dark:text-[#F5F0E6]">
                {book.title}
              </span>
              <span aria-hidden="true">·</span>
              <span>{currentVolume.volumeTitle}</span>
            </div>
          </div>

          {/* Typography & Reading Theme Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Script Selector */}
            <div className="flex items-center p-1 rounded-lg bg-[#EFEAE0] dark:bg-[#24211C]">
              <button
                type="button"
                onClick={() => setScript('nastaliq')}
                className={`px-2.5 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
                className={`px-2.5 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  settings.script === 'naskh'
                    ? 'bg-white dark:bg-[#143D2B] text-[#1C1917] dark:text-[#F8F5EE] shadow-xs'
                    : 'text-[#57534E] dark:text-[#B8B0A2]'
                }`}
              >
                نسخ
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1 rounded-lg border border-[#D6CEBE] dark:border-[#332E24] px-1.5 py-1">
              <button
                type="button"
                onClick={() => adjustFontSize(-2)}
                aria-label="خط چھوٹا کریں"
                className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded hover:bg-[#EFEAE0] dark:hover:bg-[#2A261E] cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs tabular-nums px-1.5">{settings.fontSize}</span>
              <button
                type="button"
                onClick={() => adjustFontSize(2)}
                aria-label="خط بڑا کریں"
                className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded hover:bg-[#EFEAE0] dark:hover:bg-[#2A261E] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reader Theme */}
            <div className="flex items-center p-1 rounded-lg bg-[#EFEAE0] dark:bg-[#24211C]">
              <button
                type="button"
                onClick={() => setReaderTheme('parchment')}
                className={`px-2.5 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  settings.readerTheme === 'parchment'
                    ? 'bg-[#FAF6EC] text-[#1C1917] shadow-xs'
                    : 'text-[#57534E] dark:text-[#B8B0A2]'
                }`}
              >
                کاغذِ قدیم
              </button>
              <button
                type="button"
                onClick={() => setReaderTheme('ivory')}
                className={`px-2.5 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors cursor-pointer ${
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
                className={`px-2.5 py-1.5 min-h-[34px] rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  settings.readerTheme === 'night'
                    ? 'bg-[#151411] text-[#F5F0E6] shadow-xs'
                    : 'text-[#57534E] dark:text-[#B8B0A2]'
                }`}
              >
                شب
              </button>
            </div>

            {/* Bookmark & Note Buttons */}
            <button
              type="button"
              onClick={handleBookmarkClick}
              aria-label={existingBookmark ? 'نشانی ہٹائیں' : 'نشانی لگائیں'}
              className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                existingBookmark
                  ? 'border-[#143D2B] bg-[#143D2B]/10 text-[#143D2B] dark:border-[#C59B43] dark:bg-[#C59B43]/15 dark:text-[#C59B43]'
                  : 'border-[#D6CEBE] dark:border-[#332E24] text-[#57534E] dark:text-[#B8B0A2]'
              }`}
            >
              {existingBookmark ? (
                <BookmarkCheck className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Bookmark className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {existingBookmark ? 'محفوظ شدہ' : 'نشانی'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowNotePanel((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-[#D6CEBE] dark:border-[#332E24] text-xs font-medium text-[#57534E] dark:text-[#B8B0A2] hover:text-[#1C1917] dark:hover:text-[#F5F0E6] cursor-pointer"
            >
              <StickyNote className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">حاشیہ</span>
            </button>
          </div>
        </div>

        {/* Thin Reading Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-[#EFEAE0] dark:bg-[#2A261E] overflow-hidden">
            <div
              className="h-full bg-[#143D2B] dark:bg-[#C59B43] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-[#78716C] dark:text-[#9E9689] tabular-nums">
            {currentIndex + 1} / {flatEntries.length} ({progressPercent}٪)
          </span>
        </div>
      </div>

      {/* Personal Note Drawer (if toggled) */}
      {showNotePanel && (
        <form
          onSubmit={handleSaveNoteSubmit}
          className="rounded-2xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="reader-note-input"
              className="text-sm font-semibold text-[#1C1917] dark:text-[#F5F0E6]"
            >
              ذاتی حاشیہ و یادداشت ({currentChapter.title})
            </label>
            <button
              type="button"
              onClick={() => setShowNotePanel(false)}
              className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            id="reader-note-input"
            rows={3}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="اس باب سے متعلق اپنا علمی نکتہ یا یادداشت یہاں تحریر کریں (آف لائن محفوظ رہے گی)..."
            className="w-full rounded-xl bg-white dark:bg-[#12110E] border border-[#D6CEBE] dark:border-[#332E24] p-3 text-sm leading-7 text-[#1C1917] dark:text-[#EDE8DD] focus:outline-hidden focus:ring-2 focus:ring-[#143D2B] dark:focus:ring-[#C59B43]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 min-h-[40px] rounded-lg bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] text-xs font-medium cursor-pointer"
            >
              حاشیہ محفوظ کریں
            </button>
          </div>
        </form>
      )}

      {/* Asymmetric Reading Grid: TOC Sidebar + Main Prose Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar TOC (All Volumes of the Book) */}
        <aside className="hidden lg:block lg:col-span-4 rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-5 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-5">
          <div className="border-b border-[#EFEAE0] dark:border-[#2A261E] pb-3">
            <p className="text-xs text-[#7A5B2B] dark:text-[#C59B43] font-medium">
              فہرستِ جلدیں ({book.volumeCount} جلدیں)
            </p>
            <h2 className="font-nastaliq text-lg font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
              {book.title}
            </h2>
          </div>

          <div className="space-y-4">
            {book.volumes.map((vol) => {
              const isVolActive = vol.id === currentVolume.id;
              return (
                <div key={vol.id} className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => onNavigate(book.id, vol.id, vol.chapters[0].id)}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      isVolActive
                        ? 'bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E]'
                        : 'bg-[#F5F1E8] dark:bg-[#24211C] text-[#44403C] dark:text-[#C8C0B4] hover:bg-[#EAE3D3] dark:hover:bg-[#2E2A22]'
                    }`}
                  >
                    <span>{vol.volumeTitle}</span>
                    <span className="font-arabic font-normal opacity-80">
                      {vol.arabicVolumeTitle}
                    </span>
                  </button>

                  <ul className="space-y-1 pr-2">
                    {vol.chapters.map((chap) => {
                      const isActive =
                        vol.id === currentVolume.id && chap.id === currentChapter.id;
                      return (
                        <li key={chap.id}>
                          <button
                            type="button"
                            onClick={() => onNavigate(book.id, vol.id, chap.id)}
                            className={`w-full text-right px-3 py-2 rounded-lg text-xs leading-6 transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[#143D2B]/10 text-[#143D2B] dark:bg-[#C59B43]/15 dark:text-[#C59B43] font-semibold'
                                : 'text-[#57534E] dark:text-[#A8A093] hover:text-[#1C1917] dark:hover:text-[#F5F0E6]'
                            }`}
                          >
                            {chap.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Reading Folio */}
        <article
          className={`lg:col-span-8 rounded-2xl border p-6 sm:p-10 lg:p-14 transition-colors ${themeSurface}`}
        >
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Ornamental Bismillah & Volume Header */}
            <header className="text-center space-y-4 border-b border-[#D6CEBE]/60 dark:border-[#332E24] pb-8">
              <p className={`font-arabic text-xl ${mutedText}`}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <div className={`flex items-center justify-center gap-2 text-xs ${mutedText}`}>
                <span>{book.title}</span>
                <span aria-hidden="true">·</span>
                <span>{currentVolume.volumeTitle}</span>
                <span aria-hidden="true">·</span>
                <span className="font-arabic">{currentVolume.arabicVolumeTitle}</span>
              </div>
              <h1 className="font-nastaliq text-2xl sm:text-3xl font-bold leading-[2.0] text-balance">
                {currentChapter.title}
              </h1>
              {currentChapter.arabicHeading && (
                <p className={`font-arabic text-lg ${mutedText}`}>
                  {currentChapter.arabicHeading}
                </p>
              )}
            </header>

            {/* Classical Arabic Epigraph / Citation Block (Hairline top & bottom, no thick left bar) */}
            {currentChapter.epigraphArabic && (
              <blockquote className="py-6 border-y border-[#C59B43]/40 text-center space-y-3">
                <p className="font-arabic text-xl sm:text-2xl leading-[2.1]">
                  {currentChapter.epigraphArabic}
                </p>
                {currentChapter.epigraphTranslation && (
                  <p className={`font-nastaliq text-sm leading-8 ${mutedText}`}>
                    {currentChapter.epigraphTranslation}
                  </p>
                )}
              </blockquote>
            )}

            {/* Main Prose Content */}
            <div
              className={`space-y-7 text-justify ${
                settings.script === 'nastaliq' ? 'prose-nastaliq' : 'prose-naskh'
              }`}
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              {currentChapter.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Source Citation Footer */}
            {currentChapter.citation && (
              <footer className={`pt-6 border-t border-[#D6CEBE]/60 dark:border-[#332E24] text-xs ${mutedText}`}>
                حوالہ: {currentChapter.citation}
              </footer>
            )}

            {/* Previous / Next Chapter & Volume Navigation */}
            <nav
              aria-label="ابواب کی تبدیلی"
              className="pt-8 border-t border-[#D6CEBE]/60 dark:border-[#332E24] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
            >
              {prevEntry ? (
                <button
                  type="button"
                  onClick={() =>
                    onNavigate(book.id, prevEntry.volumeId, prevEntry.chapterId)
                  }
                  className="inline-flex items-center justify-start gap-2.5 px-4 py-3 min-h-[48px] rounded-xl border border-[#D6CEBE] dark:border-[#332E24] hover:bg-black/5 dark:hover:bg-white/5 text-right transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className={`text-[11px] ${mutedText}`}>پچھلا باب ({prevEntry.volumeTitle})</p>
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
                  className="inline-flex items-center justify-end gap-2.5 px-4 py-3 min-h-[48px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] text-right transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] opacity-80">اگلا باب ({nextEntry.volumeTitle})</p>
                    <p className="text-xs font-semibold truncate">{nextEntry.chapterTitle}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              )}
            </nav>
          </div>
        </article>
      </div>

      {/* Mobile TOC Drawer */}
      {showMobileToc && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full sm:max-w-lg max-h-[82vh] rounded-t-3xl sm:rounded-2xl bg-[#F8F5EE] dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#E2DACB] dark:border-[#2E2A22] flex items-center justify-between">
              <h3 className="font-nastaliq text-lg font-bold text-[#1C1917] dark:text-[#F5F0E6]">
                {book.title} — جلدیں اور ابواب
              </h3>
              <button
                type="button"
                onClick={() => setShowMobileToc(false)}
                aria-label="بند کریں"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {book.volumes.map((vol) => (
                <div key={vol.id} className="space-y-1.5">
                  <p className="text-xs font-semibold text-[#7A5B2B] dark:text-[#C59B43] px-2">
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
                              setShowMobileToc(false);
                            }}
                            className={`w-full text-right px-3 py-2.5 min-h-[44px] rounded-xl text-sm transition-colors cursor-pointer ${
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
