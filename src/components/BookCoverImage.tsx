import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverImageProps {
  src: string;
  alt: string;
  title: string;
  arabicTitle: string;
  accentHex: string;
  className?: string;
}

export const BookCoverImage: React.FC<BookCoverImageProps> = ({
  src,
  alt,
  title,
  arabicTitle,
  accentHex,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden ${className}`}
        style={{ backgroundColor: accentHex }}
      >
        <div className="absolute inset-3 border border-[#E5C57A]/40 rounded-lg pointer-events-none" />
        <BookOpen className="w-8 h-8 text-[#E5C57A] mb-3" aria-hidden="true" />
        <p className="font-arabic text-base text-[#F8F5EE] leading-relaxed">{arabicTitle}</p>
        <p className="font-nastaliq text-xs text-[#E5C57A] mt-2">{title}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#EBE6DF] dark:bg-[#1E1B16] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 p-3.5 text-right pointer-events-none">
        <p className="font-arabic text-sm text-[#F8F5EE] drop-shadow-xs truncate">{arabicTitle}</p>
      </div>
    </div>
  );
};
