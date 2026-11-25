import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
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
        className="inline-flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-lg bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] dark:hover:bg-[#D4AC56] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{isIOS ? 'آئی فون پر انسٹال کریں' : 'آف لائن ایپ انسٹال کریں'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-guide-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#F8F5EE] dark:bg-[#1C1A16] border border-[#D6CEBE] dark:border-[#332E24] p-6 shadow-2xl text-right">
            <div className="flex items-start justify-between gap-4 border-b border-[#E4DEC9] dark:border-[#2E2A22] pb-4">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-[#143D2B] dark:text-[#C59B43] shrink-0" aria-hidden="true" />
                <h3
                  id="install-guide-title"
                  className="text-lg font-semibold text-[#1C1917] dark:text-[#F5F0E6]"
                >
                  آف لائن ایپ انسٹالیشن گائیڈ
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

            <div className="mt-4 space-y-4 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-2.5 rounded-xl bg-[#EFEAE0] dark:bg-[#24211C] p-3.5">
                <CheckCircle2 className="w-4 h-4 text-[#143D2B] dark:text-[#C59B43] shrink-0 mt-1" aria-hidden="true" />
                <p className="text-xs leading-6">
                  پانچوں کتب اور تمام ۳۱ جلدیں آپ کے آلے پر آف لائن مطالعہ کے لیے محفوظ کی جا سکتی ہیں۔ انسٹالیشن کے بعد انٹرنیٹ کے بغیر مکمل کتب خانہ دستیاب رہے گا۔
                </p>
              </div>

              {isIOS ? (
                <ol className="space-y-2.5 text-sm pr-4 list-decimal">
                  <li>سفاری براؤزر کے نچلے یا بالائی بار میں <strong>Share</strong> بٹن دبائیں۔</li>
                  <li>فہرست میں نیچے آ کر <strong>Add to Home Screen</strong> منتخب کریں۔</li>
                  <li>اوپر دائیں جانب <strong>Add</strong> پر ٹیپ کریں؛ ایپ ہوم اسکرین پر محفوظ ہو جائے گی۔</li>
                </ol>
              ) : (
                <ol className="space-y-2.5 text-sm pr-4 list-decimal">
                  <li>اینڈرائیڈ کروم یا ایج براؤزر کے مینو (<strong>⋮</strong>) کو کھولیں۔</li>
                  <li><strong>Install App</strong> یا <strong>Add to Home screen</strong> کا انتخاب کریں۔</li>
                  <li>کمپیوٹر پر ایڈریس بار کے دائیں کنارے پر موجود انسٹال آئیکن پر کلک کریں۔</li>
                </ol>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full min-h-[44px] rounded-xl bg-[#143D2B] text-[#F8F5EE] hover:bg-[#1B5139] dark:bg-[#C59B43] dark:text-[#12110E] text-sm font-medium transition-colors cursor-pointer"
            >
              سمجھ گیا، بند کریں
            </button>
          </div>
        </div>
      )}
    </>
  );
};
