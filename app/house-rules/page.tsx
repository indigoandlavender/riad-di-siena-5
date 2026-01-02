"use client";

import { useState, useEffect } from "react";

interface Rule {
  Title: string;
  Content: string;
}

export default function HouseRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    fetch("/api/sheets/house-rules")
      .then((res) => res.json())
      .then(setRules)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-6">
            Guest Information
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2a2520]/90 mb-6">
            House Rules
          </h1>
          <p className="text-xl text-[#2a2520]/50">
            To ensure a peaceful stay for everyone
          </p>
        </div>
      </section>

      {/* Rules */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="border-t border-[#2a2520]/10 pt-12 space-y-0">
            {rules.map((rule) => (
              <div key={rule.Title} className="py-8 border-b border-[#2a2520]/10">
                <h3 className="font-serif text-xl text-[#2a2520]/90 mb-4">{rule.Title}</h3>
                <p className="text-[#2a2520]/50 leading-relaxed">{rule.Content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 md:py-20 bg-[#ebe5db]">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <p className="font-serif text-2xl text-[#2a2520]/70 italic">
            Thank you for helping us keep this a peaceful place.
          </p>
        </div>
      </section>
    </div>
  );
}
