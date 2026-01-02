"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

interface FAQItem {
  Section: string;
  Question: string;
  Answer: string;
  Order: string;
}

export default function FAQPage() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/sheets/faq")
      .then((res) => res.json())
      .then(setFaqItems)
      .catch(console.error);
  }, []);

  // Group by section
  const sections: Record<string, FAQItem[]> = {};
  faqItems.forEach((item) => {
    if (!sections[item.Section]) {
      sections[item.Section] = [];
    }
    sections[item.Section].push(item);
  });

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.Question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.Answer,
      },
    })),
  };

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      {/* FAQ Schema */}
      {faqItems.length > 0 && (
        <Script id="faq-schema" type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </Script>
      )}

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl">
          <p className="text-xs tracking-[0.4em] uppercase text-[#2a2520]/40 mb-8">
            Support
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8">
            F A Q
          </h1>
          <p className="text-xl text-[#2a2520]/50 max-w-xl mx-auto">
            Everything you need to know about staying at Riad di Siena
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName} className="mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-8 pb-4 border-b border-[#2a2520]/10">
                {sectionName}
              </p>
              <div className="space-y-0">
                {items.map((item) => {
                  const currentIndex = globalIndex++;
                  const isOpen = openIndex === currentIndex;
                  return (
                    <div key={currentIndex} className="border-b border-[#2a2520]/10">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : currentIndex)}
                        className="w-full py-6 flex items-start justify-between text-left group"
                      >
                        <span className="font-serif text-lg text-[#2a2520]/90 pr-8 group-hover:text-[#2a2520] transition-colors">
                          {item.Question}
                        </span>
                        <span className="text-[#2a2520]/40 text-xl flex-shrink-0 mt-1 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                          +
                        </span>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
                      >
                        <p className="text-[#2a2520]/50 leading-relaxed pr-12">
                          {item.Answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-16 text-center py-12 border border-[#2a2520]/10">
            <p className="text-[#2a2520]/40 text-sm mb-4">
              Still have questions?
            </p>
            <a 
              href="/contact" 
              className="inline-block border border-[#2a2520]/20 px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#2a2520] hover:text-[#f5f0e8] transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
