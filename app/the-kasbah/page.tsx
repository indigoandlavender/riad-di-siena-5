"use client";

import { useState, useEffect } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import BookingModal from "@/components/BookingModal";
import GalleryCarousel from "@/components/GalleryCarousel";
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

interface Experience {
  Package_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Extra_Person_EUR: string;
  Single_Supplement_EUR?: string;
  Duration: string;
  Min_Guests: string;
  includes: string[];
}

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption?: string;
}

export default function TheKasbahPage() {
  const { formatPrice } = useCurrency();
  const [hero, setHero] = useState<Hero | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/sheets/kasbah-hero").then((res) => res.json()),
      fetch("/api/sheets/kasbah-content").then((res) => res.json()),
      fetch("/api/sheets/kasbah-experience").then((res) => res.json()),
      fetch("/api/sheets/kasbah-gallery").then((res) => res.json()),
    ])
      .then(([heroData, contentData, expData, galleryData]) => {
        setHero(heroData);
        setParagraphs(contentData);
        if (expData.length > 0) setExperience(expData[0]);
        setGallery(galleryData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          {hero?.Location && (
            <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-8">
              {hero.Location}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8 text-white">
            T H E<br />K A S B A H
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
                  <p key={i} dangerouslySetInnerHTML={{ __html: p.Content.replace(/kasbah/gi, '<em>kasbah</em>').replace(/pisé/gi, '<em>pisé</em>') }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Experience Package */}
      <section className="py-24 md:py-32 bg-[#ebe5db]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-[#2a2520]/40 mb-4">THE STAY</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 italic">
              {experience?.Name || "Two nights in the deep south"}
            </h2>
          </div>

          {loading ? (
            <div className="text-center text-[#2a2520]/50">Loading experience...</div>
          ) : experience ? (
            <div className="bg-[#f5f0e8] p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-serif text-xl mb-6 italic">What's included</h3>
                  <ul className="space-y-4 text-[#2a2520]/60 text-sm">
                    {experience.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2a2520]/30 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-6 italic">Pricing</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[#2a2520]/40 text-xs tracking-widest mb-2">PER NIGHT (DOUBLE OCCUPANCY)</p>
                      <p className="font-serif text-3xl">{formatPrice(parseFloat(experience.Price_EUR))}</p>
                    </div>
                    {experience.Single_Supplement_EUR && (
                      <div>
                        <p className="text-[#2a2520]/40 text-xs tracking-widest mb-2">SINGLE SUPPLEMENT</p>
                        <p className="font-serif text-xl">{formatPrice(parseFloat(experience.Single_Supplement_EUR))}</p>
                      </div>
                    )}
                    <p className="text-[#2a2520]/40 text-xs">
                      Price includes all transfers, accommodation, meals, and activities. 
                      Minimum {experience.Min_Guests} guests. Private kasbah buyout available on request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-[#2a2520]/10 text-center">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs tracking-widest bg-[#2a2520] text-[#f5f0e8] px-10 py-4 hover:bg-[#2a2520]/90 transition-colors inline-block"
                >
                  BOOK THE KASBAH EXPERIENCE
                </button>
                <p className="text-[#2a2520]/40 text-xs mt-6">
                  Also part of{" "}
                  <a 
                    href="/#the-journey" 
                    className="underline hover:text-[#2a2520] transition-colors"
                  >
                    The Slow Journey South
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-[#2a2520]/50">No experience package available</div>
          )}
        </div>
      </section>

      {/* Gallery Carousel */}
      {gallery.length > 0 && (
        <GalleryCarousel images={gallery} />
      )}

      {/* Beyond the Walls Navigation */}
      <BeyondTheWallsNav />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen && experience !== null}
        onClose={() => setIsModalOpen(false)}
        item={experience ? {
          id: experience.Package_ID,
          name: experience.Name,
          priceEUR: experience.Price_EUR,
        } : { id: "", name: "", priceEUR: "0" }}
        config={{
          maxGuestsPerUnit: 3,
          baseGuestsPerUnit: 2,
          extraPersonFee: parseFloat(experience?.Extra_Person_EUR || "0"),
          maxNights: 5,
          maxUnits: 3,
          unitLabel: "room",
          selectCheckout: false,
          propertyName: "The Kasbah",
          paypalContainerId: "paypal-kasbah",
        }}
        formatPrice={formatPrice}
        paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
      />
    </div>
  );
}
