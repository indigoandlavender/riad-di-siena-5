"use client";

import { useState, useEffect } from "react";

interface JourneysContent {
  Title: string;
  Subtitle: string;
  Body: string;
  Button_Text: string;
  Button_Link: string;
}

export default function JourneysPage() {
  const [content, setContent] = useState<JourneysContent | null>(null);

  useEffect(() => {
    fetch("/api/sheets/journeys")
      .then((res) => res.json())
      .then(setContent)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl">
          <p className="text-xs tracking-[0.4em] uppercase text-[#2a2520]/40 mb-8">
            Riad di Siena
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8">
            J O U R N E Y S
          </h1>
          <p className="text-xl text-[#2a2520]/50 max-w-xl mx-auto">
            {content?.Subtitle || "Beyond the walls of the riad"}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-[#ebe5db]">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-[#2a2520]/90 mb-8">
              {content?.Title || "Beyond the Walls"}
            </h2>
            
            {content?.Body && (
              <p className="text-[#2a2520]/60 leading-relaxed text-lg mb-12 max-w-2xl mx-auto">
                {content.Body}
              </p>
            )}
            
            {content?.Button_Link && (
              <a 
                href={content.Button_Link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#2a2520]/20 px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#2a2520] hover:text-[#f5f0e8] transition-colors"
              >
                {content?.Button_Text || "Explore Slow Morocco"}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="py-20 md:py-28 border-t border-[#2a2520]/10">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl text-center">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-[#2a2520]/70 italic">
            "The riad is your home. Morocco is your garden."
          </p>
        </div>
      </section>
    </div>
  );
}
