import React from 'react';
import { Bookmark, BookOpen, Trash2 } from 'lucide-react';
import type { BookmarkItem } from '../types/library';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  onOpenReader: (bookId: string, volumeId: string, chapterId: string) => void;
  onRemoveBookmark: (id: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onOpenReader,
  onRemoveBookmark,
}) => {
  return (
    <div className="space-y-5">
      <div className="border-b border-[#E0D9CA] dark:border-[#2C2820] pb-4">
        <p className="text-[11px] font-medium text-[#7A5B2B] dark:text-[#C59B43]">
          ذاتی محفوظات (آف لائن)
        </p>
        <h1 className="font-nastaliq text-2xl font-bold text-[#1C1917] dark:text-[#F5F0E6]">
          نشانیاں اور حواشی
        </h1>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#DFD8C8] dark:border-[#2E2A22] p-8 text-center space-y-2.5">
          <Bookmark className="w-7 h-7 mx-auto text-[#7A5B2B] dark:text-[#C59B43]" aria-hidden="true" />
          <p className="font-nastaliq text-lg text-[#1C1917] dark:text-[#F5F0E6]">
            ابھی کوئی نشانی محفوظ نہیں
          </p>
          <p className="text-xs text-[#57534E] dark:text-[#B8B0A2] leading-6">
            مطالعہ کے دوران کسی بھی باب پر نشانی یا حاشیہ محفوظ کریں۔
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 text-[11px] text-[#78716C] dark:text-[#9E9689]">
                <span className="truncate">
                  {item.bookTitle} · {item.volumeTitle}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveBookmark(item.id)}
                  aria-label="نشانی حذف کریں"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-stone-400 hover:text-red-700 dark:hover:text-red-400 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h2 className="font-nastaliq text-lg font-bold text-[#1C1917] dark:text-[#F5F0E6] leading-loose">
                {item.chapterTitle}
              </h2>

              {item.note && (
                <p className="text-xs text-[#44403C] dark:text-[#C8C0B4] bg-[#F8F5EE] dark:bg-[#24211C] rounded-xl p-3 leading-6">
                  {item.note}
                </p>
              )}

              <div className="pt-2 border-t border-[#EFEAE0] dark:border-[#2A261E] flex items-center justify-between">
                <span className="text-[11px] text-[#78716C] dark:text-[#9E9689]">
                  {new Date(item.createdAt).toLocaleDateString('ur-PK')}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onOpenReader(item.bookId, item.volumeId, item.chapterId)
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#143D2B] dark:text-[#C59B43] min-h-[38px] cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>باب کھولیں</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
