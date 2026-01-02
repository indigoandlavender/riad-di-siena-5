"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Direction {
  Step_Number: string;
  Building: string;
  Caption: string;
  Caption_FR: string;
  Caption_ES: string;
  Caption_IT: string;
  Caption_PT: string;
  Caption_AR: string;
  Image_URL: string;
}

interface DirectionsSetting {
  Key: string;
  EN: string;
  FR: string;
  ES: string;
  IT: string;
  PT: string;
  AR: string;
}

type Language = "en" | "fr" | "es" | "it" | "pt" | "ar";

const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  it: "IT",
  pt: "PT",
  ar: "AR",
};

export default function RiadDirectionsPage() {
  const [directions, setDirections] = useState<{ main: Direction[]; annex: Direction[] }>({ main: [], annex: [] });
  const [settings, setSettings] = useState<Record<string, DirectionsSetting>>({});
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    fetch("/api/sheets/directions")
      .then((res) => res.json())
      .then(setDirections)
      .catch(console.error);
      
    fetch("/api/sheets/directions-settings")
      .then((res) => res.json())
      .then(setSettings)
      .catch(console.error);
  }, []);

  const currentDirections = directions.main;

  // Check if text contains Arabic characters
  const isArabicText = (text: string): boolean => {
    return /[\u0600-\u06FF]/.test(text);
  };

  const getCaption = (step: Direction): string => {
    switch (language) {
      case "fr": return step.Caption_FR || step.Caption;
      case "es": return step.Caption_ES || step.Caption;
      case "it": return step.Caption_IT || step.Caption;
      case "pt": return step.Caption_PT || step.Caption;
      case "ar": return step.Caption_AR || step.Caption;
      default: return step.Caption;
    }
  };

  const getText = (key: string, fallback: string): string => {
    const setting = settings[key];
    if (!setting) return fallback;
    switch (language) {
      case "fr": return setting.FR || setting.EN || fallback;
      case "es": return setting.ES || setting.EN || fallback;
      case "it": return setting.IT || setting.EN || fallback;
      case "pt": return setting.PT || setting.EN || fallback;
      case "ar": return setting.AR || setting.EN || fallback;
      default: return setting.EN || fallback;
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const isRTL = language === "ar";
    const stepsHTML = currentDirections.map((step) => `
      <div style="margin-bottom: 24px; page-break-inside: avoid;">
        <div style="display: flex; align-items: flex-start; gap: 16px; direction: ${isRTL ? 'rtl' : 'ltr'};">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #4a5043; color: #faf8f5; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">
            ${step.Step_Number}
          </div>
          <p style="color: #333; line-height: 1.6; margin: 0;">${getCaption(step)}</p>
        </div>
      </div>
    `).join('');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="${isRTL ? 'rtl' : 'ltr'}">
        <head>
          <title>Walking Directions - Riad di Siena (No. 37)</title>
          <style>
            body { font-family: Georgia, serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #1a1a1a; }
            h1 { font-size: 24px; font-weight: normal; margin-bottom: 8px; }
            .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; }
            .note { background: #f5f0e8; padding: 16px; margin-bottom: 32px; font-size: 13px; color: #666; line-height: 1.6; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 13px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Walking Directions</h1>
          <p class="subtitle">To Riad di Siena (No. 37)</p>
          <div class="note">
            <strong>A gentle note:</strong> Google Maps will lead you to No. 43, which is a different riad. Trust these directions instead—they were written by someone who has walked this path many times.
          </div>
          ${stepsHTML}
          <div class="footer">
            <p>Lost? WhatsApp us and we'll guide you home.</p>
            <p>riaddisiena.com</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen pt-24 bg-sand">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          {(() => {
            const title = getText("page_title", "Walking Directions");
            return (
              <h1 className="font-serif text-2xl md:text-3xl text-foreground/80 mb-4" dir={isArabicText(title) ? "rtl" : "ltr"}>
                {title}
              </h1>
            );
          })()}
          {(() => {
            const subtitle = getText("main_subtitle", "To Riad di Siena (No. 37)");
            return (
              <p className="text-foreground/60 text-sm" dir={isArabicText(subtitle) ? "rtl" : "ltr"}>
                {subtitle}
              </p>
            );
          })()}
        </div>

        {/* Google Maps Warning Note */}
        <div className="bg-cream border border-foreground/10 p-6 mb-10 text-center">
          {(() => {
            const noteTitle = getText("note_title", "A gentle note:");
            const noteText = getText("note_text", "Google Maps will lead you to No. 43, which is a different riad. Trust these directions instead—they were written by someone who has walked this path many times. If you need help along the way, just send us a message and we'll guide you home.");
            const isArabic = isArabicText(noteTitle) || isArabicText(noteText);
            return (
              <p className="text-foreground/70 text-sm leading-relaxed" dir={isArabic ? "rtl" : "ltr"}>
                <span className="font-medium text-foreground/80">{noteTitle}</span> {noteText}
              </p>
            );
          })()}
        </div>

        {/* Link to Douaria Directions */}
        <div className="flex justify-center mb-8">
          {(() => {
            const linkText = getText("link_to_douaria", "Looking for The Douaria (No. 35)? →");
            return (
              <Link 
                href="/annex-directions"
                className="text-xs tracking-widest text-foreground/50 hover:text-foreground/70 transition-colors"
                dir={isArabicText(linkText) ? "rtl" : "ltr"}
              >
                {linkText}
              </Link>
            );
          })()}
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center gap-2 mb-12">
          {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang, idx) => (
            <span key={lang} className="flex items-center">
              <button
                onClick={() => setLanguage(lang)}
                className={`text-xs px-3 py-1 ${language === lang ? "text-foreground font-medium" : "text-foreground/40"}`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
              {idx < Object.keys(LANGUAGE_LABELS).length - 1 && (
                <span className="text-foreground/20">|</span>
              )}
            </span>
          ))}
        </div>

        {/* Download PDF Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 text-xs tracking-widest text-foreground/50 hover:text-foreground/70 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25">
              <rect x="3" y="6" width="10" height="7" rx="1" />
              <path d="M4 6V3a1 1 0 011-1h6a1 1 0 011 1v3" />
              <path d="M6 10h4" />
            </svg>
            {getText("save_offline", "PRINT FOR OFFLINE")}
          </button>
        </div>

        {/* Direction Steps */}
        <div className="space-y-12">
          {currentDirections.map((step) => {
            const caption = getCaption(step);
            const captionIsArabic = isArabicText(caption);
            return (
            <div key={step.Step_Number} className={`flex gap-6 ${captionIsArabic ? 'flex-row-reverse' : ''}`}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-olive text-sand flex items-center justify-center text-sm font-medium">
                {step.Step_Number}
              </div>
              <div className="flex-1">
                <p className={`text-foreground/70 leading-relaxed mb-4 ${captionIsArabic ? 'text-right' : ''}`} dir={captionIsArabic ? 'rtl' : 'ltr'}>
                  {caption}
                </p>
                {step.Image_URL && (
                  <div className="aspect-video bg-foreground/5 overflow-hidden rounded">
                    <img 
                      src={step.Image_URL} 
                      alt={`Step ${step.Step_Number}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
