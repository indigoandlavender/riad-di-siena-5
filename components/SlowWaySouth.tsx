"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BookingModal from "./BookingModal";
import { useCurrency } from "./CurrencyContext";

// The Slow Way South - Syndication Component
// Pulls journey data from Slow Morocco API - FULLY DYNAMIC

interface Journey {
  slug: string;
  title: string;
  duration: string;
  durationDays: number;
  description: string;
  arcDescription: string;
  heroImage: string;
  price: string;
  startCity: string;
  focus: string;
}

interface ItineraryDay {
  dayNumber: number;
  cityName: string;
  fromCity: string;
  toCity: string;
  description: string;
  imageUrl: string;
  travelTime: string;
  activities: string;
  meals: string;
}

interface SlowWaySouthProps {
  journeySlug?: string;
  ctaText?: string;
}

export default function SlowWaySouth({ 
  journeySlug = "3-Day-Sahara-Circle",
  ctaText = "The Full Journey"
}: SlowWaySouthProps) {
  const { formatPrice } = useCurrency();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [journey, setJourney] = useState<Journey | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [bannerTitle, setBannerTitle] = useState("The Slow Journey South");
  const [journeyPrice, setJourneyPrice] = useState(1200);
  const [loading, setLoading] = useState(true);

  // Fetch settings for banner title and price
  useEffect(() => {
    fetch("/api/sheets/settings")
      .then((res) => res.json())
      .then((settings) => {
        if (settings.journey_banner_title) {
          setBannerTitle(settings.journey_banner_title);
        }
        if (settings.journey_price) {
          setJourneyPrice(parseFloat(settings.journey_price) || 1200);
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  useEffect(() => {
    fetch(`https://www.slowmorocco.com/api/journeys/${journeySlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJourney(data.journey);
          setItinerary(data.itinerary || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Slow Morocco journey:", err);
        setLoading(false);
      });
  }, [journeySlug]);

  if (loading) {
    return (
      <section className="bg-sand py-20">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (!journey) {
    return null;
  }

  // Build focus tags from journey data
  const focusTags = [
    journey.durationDays ? `${journey.durationDays} Days` : "",
    journey.focus || "",
  ].filter(Boolean).join(" · ");

  return (
    <section id="the-journey" className="bg-sand">
      {/* Immersive Hero Image */}
      <div className="relative h-[70vh] bg-[#e8e0d4]">
        {journey.heroImage && (
          <Image
            src={journey.heroImage}
            alt={journey.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-16 text-white">
            {focusTags && (
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-white/80">
                {focusTags}
              </p>
            )}
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              {bannerTitle}
            </h2>
            {journey.arcDescription && (
              <p className="max-w-xl text-white/90 leading-relaxed">
                {journey.arcDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Journey Details */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Day markers - Dynamic from itinerary */}
          {itinerary.length > 0 && (
            <div className={`grid gap-12 mb-16 ${
              itinerary.length === 2 ? "md:grid-cols-2" :
              itinerary.length === 3 ? "md:grid-cols-3" :
              itinerary.length >= 4 ? "md:grid-cols-4" : ""
            }`}>
              {itinerary.map((day) => (
                <div key={day.dayNumber} className="text-center">
                  <div className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-sm mx-auto mb-4">
                    {day.dayNumber}
                  </div>
                  <h3 className="font-serif text-lg mb-2">
                    {day.fromCity && day.toCity && day.fromCity !== day.toCity 
                      ? `${day.fromCity} → ${day.toCity}`
                      : day.cityName || `Day ${day.dayNumber}`
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {day.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center">
            {/* Price */}
            <p className="text-2xl font-serif mb-2">
              {formatPrice(journeyPrice)}
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              for 2 guests / all meals included
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                href={`https://slowmorocco.com/journeys/${journeySlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-foreground px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                {ctaText}
              </Link>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-block bg-foreground text-sand px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
              >
                Begin
              </button>
            </div>

            {/* Attribution */}
            <p className="text-xs text-muted-foreground mb-4">
              A journey by{" "}
              <a 
                href="https://slowmorocco.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Slow Morocco
              </a>
            </p>

            {/* Day Adventures Link */}
            <a 
              href="https://slowmorocco.com/day-trips" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Day Adventures →
            </a>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        item={{
          id: journey.slug || journeySlug,
          name: bannerTitle,
          priceEUR: String(journeyPrice),
        }}
        config={{
          maxNights: 1,
          maxUnits: 1,
          maxGuestsPerUnit: 1,
          baseGuestsPerUnit: 1,
          selectCheckout: false,
          propertyName: "Slow Morocco",
          paypalContainerId: `paypal-${journey.slug || journeySlug}`,
        }}
        formatPrice={formatPrice}
        paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
      />
    </section>
  );
}
