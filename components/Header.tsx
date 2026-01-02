"use client";

import Link from "next/link";
import { useState } from "react";
import StayWithUsModal from "./StayWithUsModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStayModalOpen, setIsStayModalOpen] = useState(false);

  const navLinks = [
    { href: "/the-riad", label: "THE HOUSE" },
    { href: "/rooms", label: "ROOMS" },
    { href: "/amenities", label: "AMENITIES" },
    { href: "/philosophy", label: "PHILOSOPHY" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-sand/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Stacked */}
            <Link href="/" className="flex flex-col items-start leading-tight">
              <span className="text-sm tracking-[0.3em] font-light">RIAD</span>
              <span className="text-sm tracking-[0.3em] font-light">DI SIENA</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs tracking-widest text-foreground/70 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setIsStayModalOpen(true)}
                className="text-xs tracking-widest border border-foreground px-6 py-2 hover:bg-foreground hover:text-sand transition-colors"
              >
                STAY WITH US
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-px bg-foreground transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-px bg-foreground transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-px bg-foreground transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pt-8 pb-4 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-widest text-foreground/70 hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsStayModalOpen(true);
                }}
                className="text-sm tracking-widest border border-foreground px-6 py-3 text-center hover:bg-foreground hover:text-sand transition-colors"
              >
                STAY WITH US
              </button>
            </nav>
          )}
        </div>
      </header>

      <StayWithUsModal 
        isOpen={isStayModalOpen} 
        onClose={() => setIsStayModalOpen(false)} 
      />
    </>
  );
}
