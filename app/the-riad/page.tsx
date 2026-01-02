"use client";

import { useState, useEffect } from "react";

interface Section {
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
}

export default function TheRiadPage() {
  const [content, setContent] = useState<Record<string, Section>>({});

  useEffect(() => {
    fetch("/api/sheets/the-riad")
      .then((res) => res.json())
      .then(setContent)
      .catch(console.error);
  }, []);

  const hero = content.hero;
  const history = content.history;
  const authentic = content.authentic;
  const original = content.original;
  const courtyard = content.courtyard;
  const location = content.location;
  const heroImage = hero?.Image_URL || "";

  return (
    <div className="bg-[#f5f0e8] text-[#2a2520] min-h-screen">
      {/* Hero - Full viewport with image */}
      <section className="min-h-screen flex items-center justify-center relative">
        {heroImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
            <div className="absolute inset-0 bg-[#2a2520]/40" />
          </>
        )}
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl relative z-10">
          <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-8">
            Marrakech Medina
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8 text-white">
            T H E<br />H O U S E
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-serif italic max-w-2xl mx-auto">
            A 300-year-old sanctuary in the heart of the medina
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />
        </div>
      </section>

      {/* Opening prose */}
      {hero?.Subtitle && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl mx-auto">
              <p className="text-[#2a2520]/70 leading-relaxed text-lg md:text-xl">
                {hero.Subtitle}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* History Section */}
      {history && (history.Title || history.Subtitle) && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
            <div className="space-y-16">
              {history?.Title && (
                <div className="max-w-2xl mr-auto">
                  <p className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 leading-relaxed italic">
                    {history.Title}
                  </p>
                </div>
              )}
              {history?.Subtitle && (
                <div className="max-w-2xl ml-auto text-right">
                  <p className="text-lg md:text-xl leading-relaxed text-[#2a2520]/60">
                    {history.Subtitle}
                  </p>
                </div>
              )}
              {history?.Body && (
                <div className="max-w-2xl mr-auto">
                  <p className="text-lg leading-relaxed text-[#2a2520]/60">
                    {history.Body}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Authentic Section */}
      {authentic?.Subtitle && (
        <section className="py-24 md:py-32 bg-[#ebe5db]">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl mx-auto">
              <p className="text-[#2a2520]/70 leading-relaxed text-lg md:text-xl text-center">
                {authentic.Subtitle}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Original + Courtyard */}
      {(original?.Subtitle || courtyard?.Subtitle) && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16 max-w-5xl">
            <div className="space-y-16">
              {original?.Subtitle && (
                <div className="max-w-2xl ml-auto text-right">
                  <p className="text-lg md:text-xl leading-relaxed text-[#2a2520]/60">
                    {original.Subtitle}
                  </p>
                </div>
              )}
              {courtyard?.Subtitle && (
                <div className="max-w-2xl mr-auto">
                  <p className="text-lg md:text-xl leading-relaxed text-[#2a2520]/60">
                    {courtyard.Subtitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Location Quote */}
      {(location?.Title || location?.Subtitle) && (
        <section className="py-16 md:py-20 border-y border-[#2a2520]/10 bg-[#f5f0e8]">
          <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
            <div className="flex items-start gap-6">
              <span className="font-serif text-6xl md:text-8xl text-[#2a2520]/20 leading-none">"</span>
              <div>
                {location?.Title && (
                  <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#2a2520]/80">
                    {location.Title}
                  </p>
                )}
                {location?.Subtitle && (
                  <p className="text-[#2a2520]/40 text-sm mt-4">
                    {location.Subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
