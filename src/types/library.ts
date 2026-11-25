export interface ChapterSection {
  id: string;
  title: string;
  arabicHeading?: string;
  epigraphArabic?: string;
  epigraphTranslation?: string;
  paragraphs: string[];
  citation?: string;
}

export interface BookVolume {
  id: string;
  volumeNumber: number;
  volumeTitle: string;
  arabicVolumeTitle: string;
  approxPages: number;
  scopeSummary: string;
  chapters: ChapterSection[];
}

export interface Book {
  id: string;
  title: string;
  fullTitle: string;
  arabicTitle: string;
  author: string;
  authorFullName: string;
  authorEra: string;
  volumeCount: number;
  approxPages: number;
  coverImage: string;
  accentHex: string;
  description: string;
  methodology: string;
  volumes: BookVolume[];
}

export interface BookmarkItem {
  id: string;
  bookId: string;
  volumeId: string;
  chapterId: string;
  bookTitle: string;
  volumeTitle: string;
  chapterTitle: string;
  note?: string;
  createdAt: number;
}

export interface ReadingProgress {
  bookId: string;
  volumeId: string;
  chapterId: string;
  updatedAt: number;
}

export interface AttachedVolumeMeta {
  volumeId: string;
  bookId: string;
  fileName: string;
  fileType: 'pdf' | 'txt';
  fileSize: number;
  addedAt: number;
}

export interface AttachedVolumeFile extends AttachedVolumeMeta {
  blob?: Blob;
  textContent?: string;
}

export type ScriptFont = 'nastaliq' | 'naskh';
export type ReaderTheme = 'parchment' | 'ivory' | 'night';

export interface ReaderSettings {
  script: ScriptFont;
  fontSize: number;
  readerTheme: ReaderTheme;
}
