"use client";

import { useState, useEffect } from "react";

interface Section {
  title: string;
  content: string;
}

interface LegalContent {
  title: string;
  sections: Section[];
}

interface NexusLegalPageProps {
  pageId: string;
  fallbackTitle: string;
  localApiEndpoint?: string; // Optional local API fallback
}

export default function NexusLegalPage({ pageId, fallbackTitle, localApiEndpoint }: NexusLegalPageProps) {
  const [content, setContent] = useState<LegalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [useNexus, setUseNexus] = useState(true);

  useEffect(() => {
    // Try Nexus first
    fetch(`/api/sheets/nexus-legal?page=${pageId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Nexus not available");
        return res.json();
      })
      .then((data) => {
        if (data.sections && data.sections.length > 0) {
          setContent(data);
          setLoading(false);
        } else {
          throw new Error("No Nexus content");
        }
      })
      .catch(() => {
        // Fallback to local API if available
        if (localApiEndpoint) {
          setUseNexus(false);
          fetch(localApiEndpoint)
            .then((res) => res.json())
            .then((data) => {
              // Convert local format to Nexus format
              if (Array.isArray(data)) {
                setContent({
                  title: fallbackTitle,
                  sections: data.map((s: { Title: string; Content: string }) => ({
                    title: s.Title,
                    content: s.Content,
                  })),
                });
              }
              setLoading(false);
            })
            .catch(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });
  }, [pageId, localApiEndpoint, fallbackTitle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-6">
              Legal
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#2a2520]/90">
              {fallbackTitle}
            </h1>
          </div>
        </section>
        <section className="pb-24 md:pb-32">
          <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
            <div className="border-t border-[#2a2520]/10 pt-12">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-[#2a2520]/10 rounded w-3/4"></div>
                <div className="h-4 bg-[#2a2520]/10 rounded w-1/2"></div>
                <div className="h-4 bg-[#2a2520]/10 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#2a2520]">
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-[#2a2520]/40 mb-6">
            Legal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#2a2520]/90">
            {content?.title || fallbackTitle}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          <div className="border-t border-[#2a2520]/10 pt-12">
            {content?.sections && content.sections.length > 0 ? (
              <div className="space-y-10">
                {content.sections.map((section, index) => (
                  <div key={index}>
                    {section.title && section.title !== "Intro" && (
                      <h2 className="font-serif text-xl text-[#2a2520]/90 mb-4">{section.title}</h2>
                    )}
                    <p className="text-[#2a2520]/50 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#2a2520]/50">Content not available.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
