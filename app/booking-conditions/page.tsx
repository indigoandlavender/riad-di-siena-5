"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Condition {
  Section: string;
  Title: string;
  Content: string;
}

export default function BookingConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    fetch("/api/sheets/booking-conditions")
      .then((res) => res.json())
      .then(setConditions)
      .catch(console.error);
  }, []);

  // Group by section
  const sections: Record<string, Condition[]> = {};
  conditions.forEach((item) => {
    if (!sections[item.Section]) {
      sections[item.Section] = [];
    }
    sections[item.Section].push(item);
  });

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-6">
            Policies
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2a2520]/90">
            Booking Conditions
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="border-t border-[#2a2520]/10 pt-12 space-y-12">
            {Object.entries(sections).map(([sectionName, items]) => (
              <div key={sectionName}>
                <h2 className="font-serif text-xl text-[#2a2520]/90 mb-6">{sectionName}</h2>
                {items.length === 1 && !items[0].Title ? (
                  <p className="text-[#2a2520]/50 leading-relaxed">{items[0].Content}</p>
                ) : (
                  <ul className="space-y-3 text-[#2a2520]/50">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="text-[#2a2520]/30">—</span>
                        <span className="leading-relaxed">
                          {item.Title ? (
                            item.Content.includes("FAQ") || item.Content.includes("House Rules") || item.Content.includes("Disclaimer") ? (
                              <span>{item.Title && `${item.Title}: `}<Link href={item.Content.includes("FAQ") ? "/faq" : item.Content.includes("Disclaimer") ? "/disclaimer" : "/house-rules"} className="underline hover:text-[#2a2520] transition-colors">{item.Content}</Link></span>
                            ) : (
                              <span>{item.Title}: {item.Content}</span>
                            )
                          ) : (
                            item.Content.includes("FAQ") || item.Content.includes("House Rules") || item.Content.includes("Disclaimer") ? (
                              <Link href={item.Content.includes("FAQ") ? "/faq" : item.Content.includes("Disclaimer") ? "/disclaimer" : "/house-rules"} className="underline hover:text-[#2a2520] transition-colors">{item.Content}</Link>
                            ) : (
                              item.Content
                            )
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
