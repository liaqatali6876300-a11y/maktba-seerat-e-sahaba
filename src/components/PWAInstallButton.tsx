import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuide(true);
      }
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAction}
        className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] dark:hover:bg-[#D4AC56] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          compact ? 'px-2.5 min-h-[38px]' : 'px-3.5 py-2 min-h-[40px]'
        }`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{compact ? 'انسٹال' : isIOS ? 'آئی فون انسٹال' : 'ایپ انسٹال کریں'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-guide-title"
        >
          <div className="w-full max-w-[420px] rounded-t-3xl sm:rounded-2xl bg-[#F8F5EE] dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] p-5 shadow-2xl text-right">
            <div className="w-10 h-1 rounded-full bg-[#D6CEBE] dark:bg-[#332E24] mx-auto mb-3 sm:hidden" />
            <div className="flex items-start justify-between gap-4 border-b border-[#E4DEC9] dark:border-[#2E2A22] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#143D2B] dark:text-[#C59B43] shrink-0" aria-hidden="true" />
                <h3
                  id="install-guide-title"
                  className="text-base font-semibold text-[#1C1917] dark:text-[#F5F0E6]"
                >
                  موبائل آف لائن انسٹالیشن گائیڈ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="بند کریں"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-2.5 rounded-xl bg-[#EFEAE0] dark:bg-[#24211C] p-3">
                <CheckCircle2 className="w-4 h-4 text-[#143D2B] dark:text-[#C59B43] shrink-0 mt-1" aria-hidden="true" />
                <p className="text-xs leading-6">
                  پانچوں کتب اور تمام ۳۱ جلدیں آپ کے موبائل پر آف لائن محفوظ ہو جائیں گی۔ انٹرنیٹ بند ہونے پر بھی مکمل مطالعہ ممکن ہو گا۔
                </p>
              </div>

              {isIOS ? (
                <ol className="space-y-2 text-xs leading-6 pr-4 list-decimal">
                  <li>سفاری براؤزر کے نچلے بار میں <strong>Share</strong> بٹن دبائیں۔</li>
                  <li>نیچے آ کر <strong>Add to Home Screen</strong> منتخب کریں۔</li>
                  <li>اوپر دائیں جانب <strong>Add</strong> پر ٹیپ کریں۔</li>
                </ol>
              ) : (
                <ol className="space-y-2 text-xs leading-6 pr-4 list-decimal">
                  <li>موبائل کروم براؤزر کا مینو (<strong>⋮</strong>) کھولیں۔</li>
                  <li><strong>Install App</strong> یا <strong>Add to Home screen</strong> منتخب کریں۔</li>
                  <li>تصدیق کے بعد ایپ کا آئیکن آپ کے موبائل اسکرین پر آ جائے گا۔</li>
                </ol>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] text-sm font-medium transition-colors cursor-pointer"
            >
              سمجھ گیا
            </button>
          </div>
        </div>
      )}
    </>
  );
};
