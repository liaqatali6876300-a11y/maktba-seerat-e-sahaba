import React, { useEffect, useState } from 'react';
import { BookOpen, Library, Search, Bookmark, Moon, Sun } from 'lucide-react';
import { LIBRARY_BOOKS } from './data/books';
import type {
  BookmarkItem,
  ReaderSettings,
  ReadingProgress,
} from './types/library';
import {
  loadAllProgress,
  loadBookmarks,
  loadReaderSettings,
  removeBookmark,
  saveBookmark,
  saveProgress,
  saveReaderSettings,
} from './utils/offlineStorage';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LibraryHome } from './components/LibraryHome';
import { VolumesIndexView } from './components/VolumesIndexView';
import { BookDetailView } from './components/BookDetailView';
import { ReaderView } from './components/ReaderView';
import { SearchView } from './components/SearchView';
import { BookmarksView } from './components/BookmarksView';

type AppView =
  | { type: 'home' }
  | { type: 'volumes' }
  | { type: 'book'; bookId: string }
  | { type: 'reader'; bookId: string; volumeId: string; chapterId: string }
  | { type: 'search' }
  | { type: 'bookmarks' };

export default function App() {
  const [view, setView] = useState<AppView>({ type: 'home' });
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, ReadingProgress>>({});
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>({
    script: 'nastaliq',
    fontSize: 19,
    readerTheme: 'parchment',
  });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    void loadBookmarks().then(setBookmarks);
    void loadAllProgress().then(setProgressMap);
    void loadReaderSettings().then(setReaderSettings);

    const savedDark = localStorage.getItem('maktaba_dark') === 'true';
    setIsDark(savedDark);
    document.documentElement.classList.toggle('dark', savedDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('maktaba_dark', String(next));
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const handleOpenReader = (
    bookId: string,
    volumeId: string,
    chapterId: string
  ) => {
    setView({ type: 'reader', bookId, volumeId, chapterId });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const nextProgress: ReadingProgress = {
      bookId,
      volumeId,
      chapterId,
      updatedAt: Date.now(),
    };
    setProgressMap((prev) => ({ ...prev, [bookId]: nextProgress }));
    void saveProgress(nextProgress);
  };

  const handleUpdateSettings = (next: ReaderSettings) => {
    setReaderSettings(next);
    void saveReaderSettings(next);
  };

  const handleToggleBookmark = (item: BookmarkItem) => {
    const exists = bookmarks.some((b) => b.id === item.id);
    if (exists) {
      setBookmarks((prev) => prev.filter((b) => b.id !== item.id));
      void removeBookmark(item.id);
    } else {
      setBookmarks((prev) => [item, ...prev]);
      void saveBookmark(item);
    }
  };

  const handleSaveNote = (item: BookmarkItem) => {
    setBookmarks((prev) => {
      const filtered = prev.filter((b) => b.id !== item.id);
      return [item, ...filtered];
    });
    void saveBookmark(item);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    void removeBookmark(id);
  };

  const activeBook =
    view.type === 'book' || view.type === 'reader'
      ? LIBRARY_BOOKS.find((b) => b.id === view.bookId) ?? LIBRARY_BOOKS[0]
      : LIBRARY_BOOKS[0];

  const isNavActive = (tab: 'home' | 'volumes' | 'search' | 'bookmarks') => {
    if (tab === 'home') return view.type === 'home' || view.type === 'book';
    return view.type === tab;
  };

  return (
    <div className="min-h-screen bg-[#EAE3D3] dark:bg-[#0B0A08] sm:py-4 flex justify-center">
      {/* Mobile Screen Display Shell (full-bleed on phones, 430px mobile screen on wider displays) */}
      <div className="w-full sm:max-w-[430px] min-h-screen sm:min-h-[calc(100vh-2rem)] sm:rounded-[30px] sm:border sm:border-[#D6CEBE] dark:sm:border-[#2E2A22] sm:shadow-2xl bg-[#F8F5EE] text-[#1C1917] dark:bg-[#12110E] dark:text-[#EDE8DD] flex flex-col relative overflow-x-clip transition-colors">
        {/* Compact Mobile Top App Bar (56px) */}
        <header className="sticky top-0 z-40 h-14 px-4 bg-[#F8F5EE]/95 dark:bg-[#12110E]/95 backdrop-blur-md border-b border-[#E0D9CA] dark:border-[#2C2820] flex items-center justify-between gap-3 sm:rounded-t-[30px]">
          <button
            type="button"
            onClick={() => setView({ type: 'home' })}
            className="font-nastaliq text-lg font-bold text-[#143D2B] dark:text-[#C59B43] whitespace-nowrap shrink-0 cursor-pointer"
          >
            مکتبہ سیرت و طبقات
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDark ? 'دن کا منظر' : 'شبِ مطالعہ'}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg border border-[#D6CEBE] dark:border-[#332E24] text-[#1C1917] dark:text-[#EDE8DD] cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#C59B43]" />
              ) : (
                <Moon className="w-4 h-4 text-[#143D2B]" />
              )}
            </button>
            <PWAInstallButton compact />
          </div>
        </header>

        {/* Scrollable Mobile Content Area */}
        <main className="flex-1 px-4 py-5 pb-20">
          {view.type === 'home' && (
            <LibraryHome
              books={LIBRARY_BOOKS}
              progressMap={progressMap}
              onSelectBook={(bookId) => {
                setView({ type: 'book', bookId });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenReader={handleOpenReader}
              onOpenVolumesIndex={() => {
                setView({ type: 'volumes' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {view.type === 'volumes' && (
            <VolumesIndexView
              books={LIBRARY_BOOKS}
              onOpenReader={handleOpenReader}
              onSelectBook={(bookId) => {
                setView({ type: 'book', bookId });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {view.type === 'book' && (
            <BookDetailView
              book={activeBook}
              progress={progressMap[activeBook.id]}
              onBack={() => setView({ type: 'home' })}
              onOpenReader={handleOpenReader}
            />
          )}

          {view.type === 'reader' && (
            <ReaderView
              book={activeBook}
              volumeId={view.volumeId}
              chapterId={view.chapterId}
              settings={readerSettings}
              bookmarks={bookmarks}
              onUpdateSettings={handleUpdateSettings}
              onNavigate={handleOpenReader}
              onToggleBookmark={handleToggleBookmark}
              onSaveNote={handleSaveNote}
              onBackToBook={() => setView({ type: 'book', bookId: activeBook.id })}
            />
          )}

          {view.type === 'search' && (
            <SearchView
              books={LIBRARY_BOOKS}
              onOpenReader={handleOpenReader}
            />
          )}

          {view.type === 'bookmarks' && (
            <BookmarksView
              bookmarks={bookmarks}
              onOpenReader={handleOpenReader}
              onRemoveBookmark={handleRemoveBookmark}
            />
          )}
        </main>

        <OfflineIndicator />

        {/* Persistent Mobile Bottom Navigation Bar (Thumb Zone, 56px) */}
        <nav
          aria-label="موبائل نیویگیشن"
          className="sticky bottom-0 z-40 h-14 bg-[#F8F5EE]/95 dark:bg-[#12110E]/95 backdrop-blur-md border-t border-[#E0D9CA] dark:border-[#2C2820] grid grid-cols-4 items-center sm:rounded-b-[30px]"
        >
          <button
            type="button"
            onClick={() => setView({ type: 'home' })}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium cursor-pointer ${
              isNavActive('home')
                ? 'text-[#143D2B] dark:text-[#C59B43]'
                : 'text-[#78716C] dark:text-[#9E9689]'
            }`}
          >
            <BookOpen className="w-5 h-5" aria-hidden="true" />
            <span className="mt-0.5">کتب خانہ</span>
          </button>

          <button
            type="button"
            onClick={() => setView({ type: 'volumes' })}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium cursor-pointer ${
              isNavActive('volumes')
                ? 'text-[#143D2B] dark:text-[#C59B43]'
                : 'text-[#78716C] dark:text-[#9E9689]'
            }`}
          >
            <Library className="w-5 h-5" aria-hidden="true" />
            <span className="mt-0.5">۳۱ جلدیں</span>
          </button>

          <button
            type="button"
            onClick={() => setView({ type: 'search' })}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium cursor-pointer ${
              isNavActive('search')
                ? 'text-[#143D2B] dark:text-[#C59B43]'
                : 'text-[#78716C] dark:text-[#9E9689]'
            }`}
          >
            <Search className="w-5 h-5" aria-hidden="true" />
            <span className="mt-0.5">تلاش</span>
          </button>

          <button
            type="button"
            onClick={() => setView({ type: 'bookmarks' })}
            className={`flex flex-col items-center justify-center min-h-[44px] text-[11px] font-medium cursor-pointer ${
              isNavActive('bookmarks')
                ? 'text-[#143D2B] dark:text-[#C59B43]'
                : 'text-[#78716C] dark:text-[#9E9689]'
            }`}
          >
            <Bookmark className="w-5 h-5" aria-hidden="true" />
            <span className="mt-0.5">محفوظات</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
