"use client";

import { useState } from "react";

interface FAQItem {
  Section: string;
  Question: string;
  Answer: string;
  Order: string;
}

interface FAQAccordionProps {
  sections: Record<string, FAQItem[]>;
}

export default function FAQAccordion({ sections }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-12">
      {Object.entries(sections).map(([sectionName, items]) => (
        <div key={sectionName}>
          <h2 className="font-serif text-lg text-foreground/70 mb-6">
            {sectionName}
          </h2>
          <div className="border-t border-foreground/10">
            {items.map((item) => {
              const itemKey = `${sectionName}-${item.Question}`;
              const isOpen = openItems.has(itemKey);
              
              return (
                <div key={item.Question} className="border-b border-foreground/10">
                  <button
                    onClick={() => toggleItem(itemKey)}
                    className="w-full py-5 flex items-center justify-between text-left group"
                  >
                    <span className="text-sm text-foreground/70 pr-4">
                      {item.Question}
                    </span>
                    <span className="flex-shrink-0 text-foreground/30 group-hover:text-foreground/50 transition-colors">
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1"
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </span>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-foreground/50 leading-relaxed pb-6 pr-8 text-sm">
                      {item.Answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
