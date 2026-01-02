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

  // Use first amenity image as hero fallback
  const heroImage = hero?.Image_URL || amenities[0]?.Image_URL || "";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 text-center text-sand px-6 max-w-3xl">
          <p className="text-xs tracking-[0.4em] mb-6">RIAD DI SIENA</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6">
            {hero?.Title || "Amenities"}
          </h1>
          {hero?.Subtitle && (
            <p className="text-lg font-light leading-relaxed max-w-xl mx-auto">
              {hero.Subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Amenity Sections - Alternating Layout */}
      <div className="bg-sand">
        {amenities.map((amenity, index) => (
          <section key={amenity.Amenity_ID} className="py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex justify-center mb-12">
                <div className="w-12 h-px bg-foreground/20"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                {/* Alternate: even = image left, odd = image right */}
                {index % 2 === 0 ? (
                  <>
                    <div className="aspect-[4/3] overflow-hidden bg-foreground/5">
                      {amenity.Image_URL && (
                        <img 
                          src={amenity.Image_URL} 
                          alt={amenity.Title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="md:pl-8">
                      <h2 className="font-serif text-2xl md:text-3xl text-foreground/90 mb-4">
                        {amenity.Title}
                      </h2>
                      <p className="text-foreground/70 leading-relaxed">
                        {amenity.Subtitle}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:pr-8 md:order-1">
                      <h2 className="font-serif text-2xl md:text-3xl text-foreground/90 mb-4">
                        {amenity.Title}
                      </h2>
                      <p className="text-foreground/70 leading-relaxed">
                        {amenity.Subtitle}
                      </p>
                    </div>
                    <div className="aspect-[4/3] overflow-hidden bg-foreground/5 md:order-2">
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
    </div>
  );
}
