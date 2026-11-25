import type { Book } from '../../types/library';
import { alIsabahBook } from './al-isabah';
import { usdAlGhabahBook } from './usd-al-ghabah';
import { tabaqatIbnSadBook } from './tabaqat-ibn-sad';
import { seeratIbnHishamBook } from './seerat-ibn-hisham';
import { alIstiabBook } from './al-istiab';

export const LIBRARY_BOOKS: Book[] = [
  alIsabahBook,
  usdAlGhabahBook,
  tabaqatIbnSadBook,
  seeratIbnHishamBook,
  alIstiabBook,
];

export const TOTAL_VOLUMES_COUNT = LIBRARY_BOOKS.reduce((acc, b) => acc + b.volumes.length, 0);

export const TOTAL_CHAPTERS_COUNT = LIBRARY_BOOKS.reduce(
  (acc, b) => acc + b.volumes.reduce((vAcc, v) => vAcc + v.chapters.length, 0),
  0
);
