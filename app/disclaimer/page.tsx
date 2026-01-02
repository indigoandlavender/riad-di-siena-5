"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Section {
  Section: string;
  Title: string;
  Content: string;
}

export default function DisclaimerPage() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch("/api/sheets/disclaimer")
      .then((res) => res.json())
      .then(setSections)
      .catch(console.error);
  }, []);

  const intro = sections.find((s) => s.Section === "intro");

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-6">
            Important Information
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2a2520]/90">
            {intro?.Title || "Before You Book"}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="border-t border-[#2a2520]/10 pt-12 space-y-8 text-[#2a2520]/60 leading-relaxed">
            {sections.map((section, i) => (
              section.Content && <p key={i}>{section.Content}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-16 border-t border-[#2a2520]/10">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/faq"
              className="text-xs tracking-[0.2em] uppercase text-[#2a2520]/50 hover:text-[#2a2520] transition-colors"
            >
              Read FAQ
            </Link>
            <Link
              href="/house-rules"
              className="text-xs tracking-[0.2em] uppercase text-[#2a2520]/50 hover:text-[#2a2520] transition-colors"
            >
              House Rules
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
