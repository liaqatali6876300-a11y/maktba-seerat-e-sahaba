import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Trash2,
} from 'lucide-react';
import type { AttachedVolumeFile, Book, BookVolume, ReaderSettings } from '../types/library';

interface FullVolumeViewerProps {
  book: Book;
  volume: BookVolume;
  file: AttachedVolumeFile;
  settings: ReaderSettings;
  onBack: () => void;
  onRemoveFile: (volumeId: string) => void;
}

const CHARS_PER_PAGE = 1800;

export const FullVolumeViewer: React.FC<FullVolumeViewerProps> = ({
  book,
  volume,
  file,
  settings,
  onBack,
  onRemoveFile,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pageIdx, setPageIdx] = useState(0);

  useEffect(() => {
    if (file.fileType === 'pdf' && file.blob) {
      const url = URL.createObjectURL(file.blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPdfUrl(null);
  }, [file]);

  const textPages = useMemo(() => {
    if (file.fileType !== 'txt' || !file.textContent) return [];
    const content = file.textContent;
    const pages: string[] = [];
    let cursor = 0;
    while (cursor < content.length) {
      let end = Math.min(cursor + CHARS_PER_PAGE, content.length);
      if (end < content.length) {
        const nextBreak = content.indexOf('\n', end);
        if (nextBreak !== -1 && nextBreak - end < 300) {
          end = nextBreak + 1;
        }
      }
      pages.push(content.slice(cursor, end));
      cursor = end;
    }
    return pages.length > 0 ? pages : [''];
  }, [file]);

  const themeSurface =
    settings.readerTheme === 'night'
      ? 'bg-[#151411] text-[#EAE3D5] border-[#2C2820]'
      : settings.readerTheme === 'ivory'
      ? 'bg-[#FFFFFF] text-[#171717] border-[#E5E5E5]'
      : 'bg-[#FAF6EC] text-[#231F1A] border-[#E2D9C5]';

  const fileSizeMB = (file.fileSize / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#1C1A16] border border-[#E2DACB] dark:border-[#2E2A22] p-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="واپس"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-[#EFEAE0] dark:bg-[#24211C] text-[#1C1917] dark:text-[#EDE8DD] cursor-pointer shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F0E6] truncate">
              {book.title} — {volume.volumeTitle}
            </p>
            <p className="text-[11px] text-[#78716C] dark:text-[#9E9689] truncate tabular-nums">
              {file.fileName} · {fileSizeMB} MB
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemoveFile(volume.id)}
          aria-label="منسلک فائل ہٹائیں"
          className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-[#D6CEBE] dark:border-[#332E24] text-stone-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* PDF Offline Viewer */}
      {file.fileType === 'pdf' && pdfUrl && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-[#EFEAE0] dark:bg-[#1C1A16] border border-[#DFD8C8] dark:border-[#2E2A22] p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#1C1917] dark:text-[#EDE8DD]">
              <FileText className="w-4 h-4 text-[#143D2B] dark:text-[#C59B43] shrink-0" />
              <span>مکمل پی ڈی ایف جلد آف لائن محفوظ ہے</span>
            </div>
            <a
              href={pdfUrl}
              download={file.fileName}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] text-xs font-medium shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>موبائل ویور</span>
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#D6CEBE] dark:border-[#332E24] bg-white h-[70vh]">
            <iframe
              src={pdfUrl}
              title={`${book.title} ${volume.volumeTitle}`}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* TXT Paginated Offline Reader */}
      {file.fileType === 'txt' && (
        <article className={`rounded-2xl border p-5 space-y-5 ${themeSurface}`}>
          <div className="flex items-center justify-between text-xs border-b border-[#D6CEBE]/60 dark:border-[#332E24] pb-3">
            <span className="tabular-nums">
              صفحہ {pageIdx + 1} از {textPages.length}
            </span>
            <div className="flex items-center gap-1.5">
              <label htmlFor="jump-page" className="text-[11px] opacity-75">
                صفحہ:
              </label>
              <input
                id="jump-page"
                type="number"
                min={1}
                max={textPages.length}
                value={pageIdx + 1}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!Number.isNaN(val) && val >= 1 && val <= textPages.length) {
                    setPageIdx(val - 1);
                  }
                }}
                className="w-16 px-2 py-1 rounded-lg border border-[#D6CEBE] dark:border-[#332E24] bg-transparent text-xs text-center tabular-nums"
              />
            </div>
          </div>

          <div
            className={`whitespace-pre-wrap text-justify ${
              settings.script === 'nastaliq' ? 'prose-nastaliq' : 'prose-naskh'
            }`}
            style={{ fontSize: `${settings.fontSize}px` }}
          >
            {textPages[pageIdx]}
          </div>

          <div className="pt-4 border-t border-[#D6CEBE]/60 dark:border-[#332E24] grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={pageIdx === 0}
              onClick={() => {
                setPageIdx((p) => Math.max(0, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-1.5 min-h-[44px] rounded-xl border border-[#D6CEBE] dark:border-[#332E24] text-xs font-medium disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>پچھلا صفحہ</span>
            </button>

            <button
              type="button"
              disabled={pageIdx >= textPages.length - 1}
              onClick={() => {
                setPageIdx((p) => Math.min(textPages.length - 1, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-1.5 min-h-[44px] rounded-xl bg-[#143D2B] text-[#F8F5EE] dark:bg-[#C59B43] dark:text-[#12110E] text-xs font-medium disabled:opacity-40 cursor-pointer"
            >
              <span>اگلا صفحہ</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </article>
      )}
    </div>
  );
};
