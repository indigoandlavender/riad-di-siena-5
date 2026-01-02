"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Property {
  Property_ID: string;
  Name: string;
  Tagline: string;
  Description: string;
  Image_URL: string;
  Link: string;
  Order: string;
}

interface HeroContent {
  Title: string;
  Subtitle: string;
  Intro: string;
  Image_URL: string;
}

export default function BeyondTheWallsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/sheets/beyond-the-walls").then((res) => res.json()),
      fetch("/api/sheets/beyond-the-walls-hero").then((res) => res.json()),
    ])
      .then(([propertiesData, heroData]) => {
        setProperties(propertiesData);
        setHero(heroData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2a2520]/20 border-t-[#2a2520] rounded-full animate-spin" />
      </div>
    );
  }

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
            Riad di Siena
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8 text-white">
            B E Y O N D  T H E  W A L L S
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

      {/* Intro Section */}
      {hero?.Intro && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl mx-auto">
              <p className="text-[#2a2520]/70 leading-relaxed text-lg md:text-xl text-center">
                {hero.Intro}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Properties Grid */}
      <section className="py-24 md:py-32 bg-[#ebe5db]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {properties.map((property) => (
              <Link 
                key={property.Property_ID} 
                href={property.Link}
                className="group block"
              >
                <article>
                  <div className="aspect-[4/3] overflow-hidden mb-8">
                    {property.Image_URL ? (
                      <img 
                        src={property.Image_URL} 
                        alt={property.Name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2a2520]/5 flex items-center justify-center text-[#2a2520]/20">
                        No image
                      </div>
                    )}
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 mb-3 italic">
                    {property.Name}
                  </h2>
                  <p className="text-[#2a2520]/50 text-lg">
                    {property.Tagline}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
