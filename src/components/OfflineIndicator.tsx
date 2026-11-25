import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className="fixed bottom-18 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#143D2B] dark:bg-[#C59B43] text-[#F8F5EE] dark:text-[#12110E] px-3.5 py-2 text-xs font-medium shadow-lg border border-[#C59B43]/30"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>آف لائن موڈ — تمام ۳۱ جلدیں مقامی طور پر دستیاب ہیں</span>
    </div>
  );
};
