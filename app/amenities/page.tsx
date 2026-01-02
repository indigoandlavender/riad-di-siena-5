"use client";

import { useState, useEffect } from "react";

interface Amenity {
  Amenity_ID: string;
  Title: string;
  Subtitle: string;
  Image_URL: string;
  Order: string;
}

interface Hero {
  Title: string;
  Subtitle: string;
  Image_URL: string;
}

export default function AmenitiesPage() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  useEffect(() => {
    fetch("/api/sheets/amenities-hero")
      .then((res) => res.json())
      .then(setHero)
      .catch(console.error);

    fetch("/api/sheets/amenities")
      .then((res) => res.json())
      .then(setAmenities)
      .catch(console.error);
  }, []);

  const heroImage = hero?.Image_URL || amenities[0]?.Image_URL || "";

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
            A M E N I T I E S
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

      {/* Amenity Sections - Staggered Layout */}
      {amenities.map((amenity, index) => (
        <section 
          key={amenity.Amenity_ID} 
          className={`py-24 md:py-32 ${index % 2 === 0 ? 'bg-[#f5f0e8]' : 'bg-[#ebe5db]'} border-t border-[#2a2520]/10`}
        >
          <div className="container mx-auto px-6 lg:px-16 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Alternate: even = image left, odd = image right */}
              {index % 2 === 0 ? (
                <>
                  <div className="aspect-[4/3] overflow-hidden">
                    {amenity.Image_URL && (
                      <img 
                        src={amenity.Image_URL} 
                        alt={amenity.Title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="md:pl-8">
                    <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 mb-6 italic">
                      {amenity.Title}
                    </h2>
                    <p className="text-[#2a2520]/60 leading-relaxed text-lg">
                      {amenity.Subtitle}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="md:pr-8 md:order-1">
                    <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 mb-6 italic">
                      {amenity.Title}
                    </h2>
                    <p className="text-[#2a2520]/60 leading-relaxed text-lg">
                      {amenity.Subtitle}
                    </p>
                  </div>
                  <div className="aspect-[4/3] overflow-hidden md:order-2">
                    {amenity.Image_URL && (
                      <img 
                        src={amenity.Image_URL} 
                        alt={amenity.Title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ))}

    </div>
  );
}
