"use client";

import { useState, useEffect } from "react";

interface Section {
  Section: string;
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
}

export default function PhilosophyPage() {
  const [content, setContent] = useState<Record<string, Section>>({});

  useEffect(() => {
    fetch("/api/sheets/philosophy")
      .then((res) => res.json())
      .then(setContent)
      .catch(console.error);
  }, []);

  const hero = content.hero;
  const intro = content.intro;
  const imperfection = content.imperfection;
  const wabisabi = content["wabi-sabi"];
  const soul = content.soul;
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
          <p className="text-xs tracking-[0.4em] mb-6">RIAD DI SIENA</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6">Philosophy</h1>
          {hero?.Subtitle && (
            <p className="text-lg font-light leading-relaxed max-w-xl mx-auto">{hero.Subtitle}</p>
          )}
        </div>
      </section>

      {/* Flowing Prose */}
      <section className="py-16 md:py-24 bg-sand">
        <article className="max-w-xl mx-auto px-6 text-foreground/80 leading-relaxed">
          
          {intro?.Subtitle && (
            <p className="mb-6">{intro.Subtitle}</p>
          )}

          {hero?.Title && (
            <h2 className="font-display text-2xl md:text-3xl italic text-foreground/90 mt-12 mb-8">
              {hero.Title}
            </h2>
          )}

          {imperfection?.Subtitle && (
            <p className="mb-6">{imperfection.Subtitle}</p>
          )}

          {imperfection?.Body && (
            <p className="mb-6">{imperfection.Body}</p>
          )}

          {wabisabi?.Title && (
            <h2 className="font-display text-2xl md:text-3xl italic text-foreground/90 mt-12 mb-8">
              {wabisabi.Title}
            </h2>
          )}

          {wabisabi?.Subtitle && (
            <p className="mb-6">{wabisabi.Subtitle}</p>
          )}

          {soul?.Title && (
            <h2 className="font-display text-2xl md:text-3xl italic text-foreground/90 mt-12 mb-8">
              {soul.Title}
            </h2>
          )}

          {soul?.Subtitle && (
            <p className="font-display italic text-foreground/70 text-lg">
              {soul.Subtitle}
            </p>
          )}

          {/* Simple line divider */}
          <div className="flex justify-center my-16">
            <div className="w-12 h-px bg-foreground/30"></div>
          </div>

        </article>
      </section>
    </div>
  );
}
