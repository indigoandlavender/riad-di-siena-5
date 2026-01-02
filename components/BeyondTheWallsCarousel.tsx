"use client";

import { useRef } from "react";
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

interface Props {
  properties: Property[];
}

export default function BeyondTheWallsCarousel({ properties }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!properties || properties.length === 0) return null;

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border border-foreground/20 rounded-full flex items-center justify-center hover:border-foreground transition-colors -ml-5"
        aria-label="Scroll left"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 12L6 8l4-4" />
        </svg>
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {properties.map((property) => (
          <Link
            key={property.Property_ID}
            href={property.Link}
            className="flex-shrink-0 w-[280px] group"
          >
            {/* Image */}
            <div className="aspect-[4/5] mb-4 overflow-hidden bg-foreground/10">
              {property.Image_URL && (
                <img
                  src={property.Image_URL}
                  alt={property.Name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            
            {/* Content */}
            <h3 className="font-serif text-lg mb-1 group-hover:text-foreground/70 transition-colors">
              {property.Name}
            </h3>
            {property.Tagline && (
              <p className="text-sm text-muted-foreground mb-2 italic">
                {property.Tagline}
              </p>
            )}
            {property.Description && (
              <p className="text-sm text-foreground/60 leading-relaxed line-clamp-3">
                {property.Description}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background border border-foreground/20 rounded-full flex items-center justify-center hover:border-foreground transition-colors -mr-5"
        aria-label="Scroll right"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 12l4-4-4-4" />
        </svg>
      </button>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
