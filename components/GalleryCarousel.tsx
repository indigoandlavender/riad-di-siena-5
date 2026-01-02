"use client";

import { useRef } from "react";

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption?: string;
}

interface GalleryCarouselProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
}

export default function GalleryCarousel({ images, title, subtitle }: GalleryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <section className="py-16 bg-sand">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-xs tracking-[0.3em] text-muted-foreground mb-3">{subtitle}</p>
            )}
            {title && (
              <h2 className="font-serif text-2xl md:text-3xl text-foreground/80">{title}</h2>
            )}
          </div>
        )}

        {/* Carousel */}
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

          {/* Images */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {images.map((image) => (
              <div
                key={image.Image_ID}
                className="flex-shrink-0 w-[280px]"
              >
                <div className="aspect-[3/4] bg-foreground/5 overflow-hidden">
                  {image.Image_URL && (
                    <img
                      src={image.Image_URL}
                      alt={image.Caption || "Gallery image"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                {image.Caption && (
                  <p className="mt-3 text-sm text-foreground/70">{image.Caption}</p>
                )}
              </div>
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
        </div>
      </div>
    </section>
  );
}
