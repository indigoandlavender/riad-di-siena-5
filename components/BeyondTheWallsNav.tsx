"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

// All properties in the ecosystem
const ALL_PROPERTIES = [
  { href: "/the-riad", label: "The Riad", tagline: "The main house" },
  { href: "/the-douaria", label: "The Douaria", tagline: "Across the alley" },
  { href: "/the-kasbah", label: "The Kasbah", tagline: "Draa Valley" },
  { href: "/the-desert-camp", label: "The Desert Camp", tagline: "Deep Sahara" },
  { href: "/the-farm", label: "The Farm", tagline: "Where breakfast begins" },
];

export default function BeyondTheWallsNav() {
  const pathname = usePathname();

  // Filter out current page
  const otherProperties = useMemo(() => {
    return ALL_PROPERTIES.filter(
      (p) => pathname !== p.href && !pathname?.startsWith(p.href + "/")
    );
  }, [pathname]);

  return (
    <section className="py-16 bg-[#ebe6de]">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] text-foreground/50 mb-3">
            BEYOND THE WALLS
          </p>
          <p className="text-foreground/70 text-sm leading-relaxed">
            These are places that share something with this house — a quality of quiet, a way of holding guests, a frequency that's hard to name but easy to feel. If you've rested well here, you'll rest well there.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {otherProperties.map((property) => (
            <Link
              key={property.href}
              href={property.href}
              className="group text-center"
            >
              <span className="block text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {property.label}
              </span>
              <span className="block text-xs text-foreground/50 mt-1">
                {property.tagline}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
