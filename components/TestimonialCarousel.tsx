"use client";

import { useState } from "react";

interface Testimonial {
  Testimonial_ID: string;
  Guest_Name: string;
  Quote: string;
  Source: string;
  Date: string;
}

interface Props {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setExpandedId(null);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setExpandedId(null);
  };

  const current = testimonials[currentIndex];
  if (!current) return null;

  // Truncate to ~3 lines (roughly 150 characters)
  const truncateText = (text: string, maxLength: number = 180) => {
    if (text.length <= maxLength) return { text, truncated: false };
    return { text: text.slice(0, maxLength).trim() + "...", truncated: true };
  };

  const { text: displayText, truncated } = truncateText(current.Quote);
  const isExpanded = expandedId === current.Testimonial_ID;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Quote */}
      <div className="text-center mb-8">
        <p className="font-display text-xl md:text-2xl italic text-foreground/80 leading-relaxed">
          "{isExpanded ? current.Quote : displayText}"
        </p>
        {truncated && !isExpanded && (
          <button
            onClick={() => setExpandedId(current.Testimonial_ID)}
            className="text-sm text-olive mt-4 hover:underline"
          >
            Read more
          </button>
        )}
        {isExpanded && (
          <button
            onClick={() => setExpandedId(null)}
            className="text-sm text-olive mt-4 hover:underline"
          >
            Show less
          </button>
        )}
      </div>

      {/* Attribution */}
      <div className="text-center mb-8">
        <p className="text-sm font-medium">{current.Guest_Name}</p>
        <p className="text-xs text-muted-foreground">{current.Source}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={prevSlide}
          className="p-2 hover:bg-foreground/10 rounded-full transition-colors"
          aria-label="Previous testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setExpandedId(null);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-foreground" : "bg-foreground/30"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2 hover:bg-foreground/10 rounded-full transition-colors"
          aria-label="Next testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
