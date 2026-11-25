import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className="sticky bottom-16 mx-3 mb-2 z-30 flex items-center justify-center gap-2 rounded-xl bg-[#143D2B] dark:bg-[#C59B43] text-[#F8F5EE] dark:text-[#12110E] px-3 py-2 text-xs font-medium shadow-md"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>آف لائن موڈ — تمام ۳۱ جلدیں محفوظ ہیں</span>
    </div>
  );
};
