"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Section {
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
}

export default function TheRiadPage() {
  const [content, setContent] = useState<Record<string, Section>>({});

  useEffect(() => {
    fetch("/api/sheets/the-riad")
      .then((res) => res.json())
      .then(setContent)
      .catch(console.error);
  }, []);

  const hero = content.hero;
  const authentic = content.authentic;
  const comingHome = content["coming-home"];
  const heroImage = hero?.Image_URL || "";

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 text-center text-sand px-6 max-w-3xl">
          <p className="text-xs tracking-[0.4em] mb-6">MARRAKECH MEDINA</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6">The House</h1>
          {hero?.Title && (
            <p className="text-lg font-light leading-relaxed max-w-xl mx-auto">{hero.Title}</p>
          )}
        </div>
      </section>

      {/* Flowing Prose */}
      <section className="py-16 md:py-24 bg-sand">
        <article className="max-w-xl mx-auto px-6 text-foreground/80 leading-relaxed">
          
          {hero?.Subtitle && (
            <p className="mb-6">{hero.Subtitle}</p>
          )}

          {authentic?.Title && (
            <h2 className="font-display text-2xl md:text-3xl italic text-foreground/90 mt-12 mb-8">
              {authentic.Title}
            </h2>
          )}

          {authentic?.Subtitle && (
            <p className="mb-6 whitespace-pre-line">{authentic.Subtitle}</p>
          )}

          {comingHome && (comingHome.Title || comingHome.Subtitle) && (
            <p className="mb-6">
              {comingHome.Title && <strong>{comingHome.Title}.</strong>} {comingHome.Subtitle}
            </p>
          )}

          {/* Simple line divider */}
          <div className="flex justify-center my-12">
            <div className="w-12 h-px bg-foreground/30"></div>
          </div>

          {/* Soft CTA */}
          <div className="text-center">
            <Link
              href="/rooms"
              className="text-xs tracking-widest text-foreground/60 hover:text-foreground transition-colors"
            >
              View the rooms →
            </Link>
          </div>

        </article>
      </section>
    </div>
  );
}
