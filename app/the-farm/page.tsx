"use client";

import { useState, useEffect } from "react";
import BeyondTheWallsNav from "@/components/BeyondTheWallsNav";

interface Hero {
  Title: string;
  Subtitle: string;
  Location: string;
  Image_URL: string;
}

interface Paragraph {
  Content: string;
}

interface Produce {
  Produce_ID: string;
  Name: string;
  Description: string;
  Season: string;
}

export default function TheFarmPage() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/sheets/farm-hero").then((res) => res.json()),
      fetch("/api/sheets/farm-content").then((res) => res.json()),
      fetch("/api/sheets/farm-produce").then((res) => res.json()),
    ])
      .then(([heroData, contentData, produceData]) => {
        setHero(heroData);
        setParagraphs(contentData);
        setProduce(produceData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroImage = hero?.Image_URL || "";

  return (
    <div className="bg-[#f5f0e8] text-[#2a2520] min-h-screen">
      {/* Hero - Full viewport */}
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
          {hero?.Location && (
            <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-8">
              {hero.Location}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8 text-white">
            T H E<br />F A R M
          </h1>
          {hero?.Subtitle && (
            <p className="text-xl md:text-2xl text-white/80 font-serif italic max-w-2xl mx-auto">
              {hero.Subtitle}
            </p>
          )}
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />
        </div>
      </section>

      {/* Description */}
      {paragraphs.length > 0 && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl mx-auto">
              <div className="text-[#2a2520]/70 leading-relaxed text-lg md:text-xl space-y-6">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p.Content}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What Comes from The Farm */}
      <section className="py-24 md:py-32 bg-[#ebe5db]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-[#2a2520]/40 mb-4">FROM THE FARM</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 italic">What reaches your table</h2>
          </div>
          
          {loading ? (
            <div className="text-center text-[#2a2520]/50">Loading...</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
              {produce.map((item) => (
                <div key={item.Produce_ID} className="py-4">
                  <p className="font-serif text-xl mb-2 italic">{item.Name}</p>
                  <p className="text-[#2a2520]/50 text-sm">{item.Description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Beyond the Walls Navigation */}
      <BeyondTheWallsNav />
    </div>
  );
}
