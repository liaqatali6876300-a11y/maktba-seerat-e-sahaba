import type { BookmarkItem, ReaderSettings, ReadingProgress } from '../types/library';

const DB_NAME = 'MaktabaSeeratOfflineDB';
const DB_VERSION = 1;
const STORE_BOOKMARKS = 'bookmarks';
const STORE_PROGRESS = 'progress';
const STORE_SETTINGS = 'settings';

const DEFAULT_SETTINGS: ReaderSettings = {
  script: 'nastaliq',
  fontSize: 20,
  readerTheme: 'parchment',
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
        db.createObjectStore(STORE_BOOKMARKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        db.createObjectStore(STORE_PROGRESS, { keyPath: 'bookId' });
      }
      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadBookmarks(): Promise<BookmarkItem[]> {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, 'readonly');
      const req = tx.objectStore(STORE_BOOKMARKS).getAll();
      req.onsuccess = () => {
        const items = (req.result as BookmarkItem[]).sort((a, b) => b.createdAt - a.createdAt);
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    const raw = localStorage.getItem('maktaba_bookmarks');
    return raw ? JSON.parse(raw) : [];
  }
}

export async function saveBookmark(item: BookmarkItem): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, 'readwrite');
      tx.objectStore(STORE_BOOKMARKS).put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const list = await loadBookmarks();
    const filtered = list.filter((b) => b.id !== item.id);
    localStorage.setItem('maktaba_bookmarks', JSON.stringify([item, ...filtered]));
  }
}

export async function removeBookmark(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKMARKS, 'readwrite');
      tx.objectStore(STORE_BOOKMARKS).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const list = await loadBookmarks();
    localStorage.setItem('maktaba_bookmarks', JSON.stringify(list.filter((b) => b.id !== id)));
  }
}

export async function loadAllProgress(): Promise<Record<string, ReadingProgress>> {
  try {
    const db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROGRESS, 'readonly');
      const req = tx.objectStore(STORE_PROGRESS).getAll();
      req.onsuccess = () => {
        const map: Record<string, ReadingProgress> = {};
        for (const item of req.result as ReadingProgress[]) {
          map[item.bookId] = item;
        }
        resolve(map);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    const raw = localStorage.getItem('maktaba_progress');
    return raw ? JSON.parse(raw) : {};
  }
}

export async function saveProgress(progress: ReadingProgress): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROGRESS, 'readwrite');
      tx.objectStore(STORE_PROGRESS).put(progress);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const all = await loadAllProgress();
    all[progress.bookId] = progress;
    localStorage.setItem('maktaba_progress', JSON.stringify(all));
  }
}

export async function loadReaderSettings(): Promise<ReaderSettings> {
  try {
    const db = await openDatabase();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_SETTINGS, 'readonly');
      const req = tx.objectStore(STORE_SETTINGS).get('reader');
      req.onsuccess = () => {
        if (req.result && req.result.value) {
          resolve({ ...DEFAULT_SETTINGS, ...req.result.value });
        } else {
          resolve(DEFAULT_SETTINGS);
        }
      };
      req.onerror = () => resolve(DEFAULT_SETTINGS);
    });
  } catch {
    const raw = localStorage.getItem('maktaba_settings');
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  }
}

export async function saveReaderSettings(settings: ReaderSettings): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_SETTINGS, 'readwrite');
      tx.objectStore(STORE_SETTINGS).put({ key: 'reader', value: settings });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem('maktaba_settings', JSON.stringify(settings));
  }
}
