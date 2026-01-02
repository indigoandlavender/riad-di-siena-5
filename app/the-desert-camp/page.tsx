"use client";

import { useState, useEffect } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import BookingModal from "@/components/BookingModal";
import GalleryCarousel from "@/components/GalleryCarousel";
import BeyondTheWallsNav from "@/components/BeyondTheWallsNav";
import {
  IconTent,
  IconBed,
  IconShower,
  IconCamel,
  IconMeals,
} from "@/components/icons";

interface Hero { Title: string; Subtitle: string; Location: string; Image_URL: string; }
interface Paragraph { Content: string; }
interface Tent { Tent_ID: string; Level: string; Name: string; Description: string; Price_EUR: string; Extra_Person_EUR: string; features: string[]; }
interface GalleryImage { Image_ID: string; Image_URL: string; Caption?: string; }

const ViewIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" /></svg>);

const iconMap: Record<string, () => JSX.Element> = { 
  "tent": () => <IconTent size={20} />, 
  "handwoven": () => <IconTent size={20} />, 
  "bed": () => <IconBed size={20} />, 
  "linens": () => <IconBed size={20} />, 
  "bedding": () => <IconBed size={20} />, 
  "bathroom": () => <IconShower size={20} />, 
  "en-suite": () => <IconShower size={20} />, 
  "ensuite": () => <IconShower size={20} />, 
  "view": () => <ViewIcon />, 
  "dune": () => <ViewIcon />, 
  "location": () => <ViewIcon />, 
  "camel": () => <IconCamel size={20} />, 
  "dinner": () => <IconMeals size={20} />, 
  "breakfast": () => <IconMeals size={20} />, 
  "meal": () => <IconMeals size={20} /> 
};

const getIconForFeature = (feature: string): JSX.Element | null => {
  const lowerFeature = feature.toLowerCase();
  const matchedKey = Object.keys(iconMap).find(key => lowerFeature.includes(key));
  if (matchedKey) { const Icon = iconMap[matchedKey]; return <Icon />; }
  return null;
};

export default function TheDesertCampPage() {
  const { formatPrice } = useCurrency();
  const [hero, setHero] = useState<Hero | null>(null);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [tents, setTents] = useState<Tent[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTent, setSelectedTent] = useState<Tent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openBookingModal = (tent: Tent) => { setSelectedTent(tent); setIsModalOpen(true); };

  useEffect(() => {
    Promise.all([
      fetch("/api/sheets/desert-hero").then((res) => res.json()),
      fetch("/api/sheets/desert-content").then((res) => res.json()),
      fetch("/api/sheets/desert-tents").then((res) => res.json()),
      fetch("/api/sheets/desert-gallery").then((res) => res.json()),
    ]).then(([heroData, contentData, tentsData, galleryData]) => {
      setHero(heroData); setParagraphs(contentData); setTents(tentsData); setGallery(galleryData); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const heroImage = hero?.Image_URL || "";

  return (
    <div className="bg-[#f5f0e8] text-[#2a2520] min-h-screen">
      <section className="min-h-screen flex items-center justify-center relative">
        {heroImage && (<><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} /><div className="absolute inset-0 bg-[#2a2520]/50" /></>)}
        <div className="container mx-auto px-6 lg:px-16 text-center max-w-4xl relative z-10">
          {hero?.Location && <p className="text-xs tracking-[0.4em] uppercase text-white/60 mb-8">{hero.Location}</p>}
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.15em] font-light mb-8 text-white">T H E<br />D E S E R T  C A M P</h1>
          {hero?.Subtitle && <p className="text-xl md:text-2xl text-white/80 font-serif italic max-w-2xl mx-auto">{hero.Subtitle}</p>}
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2"><div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/30 to-white/0" /></div>
      </section>

      {paragraphs.length > 0 && (
        <section className="py-24 md:py-32 border-t border-[#2a2520]/10">
          <div className="container mx-auto px-6 lg:px-16"><div className="max-w-3xl mx-auto"><div className="text-[#2a2520]/70 leading-relaxed text-lg md:text-xl space-y-6">{paragraphs.map((p, i) => <p key={i}>{p.Content}</p>)}</div></div></div>
        </section>
      )}

      <section className="py-24 md:py-32 bg-[#ebe5db]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] text-[#2a2520]/40 mb-4">THE STAY</p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#2a2520]/90 italic">Two ways to experience the night</h2>
          </div>
          {loading ? <div className="text-center text-[#2a2520]/50">Loading options...</div> : (
            <div className="grid md:grid-cols-2 gap-8">
              {tents.map((tent, index) => (
                <div key={tent.Tent_ID} className={`flex flex-col ${index === 0 ? "bg-[#f5f0e8] p-8" : "bg-[#2a2520] text-[#f5f0e8] p-8"}`}>
                  <p className={`text-xs tracking-[0.3em] mb-2 ${index === 0 ? 'text-[#2a2520]/40' : 'text-[#f5f0e8]/60'}`}>{tent.Level.toUpperCase()}</p>
                  <h3 className="font-serif text-2xl mb-4 italic">{tent.Name}</h3>
                  <p className={`text-sm leading-relaxed mb-6 ${index === 0 ? 'text-[#2a2520]/60' : 'text-[#f5f0e8]/70'}`}>{tent.Description}</p>
                  <div className={`space-y-3 flex-grow ${index === 0 ? 'text-[#2a2520]/50' : 'text-[#f5f0e8]/60'}`}>
                    {tent.features.map((feature, i) => {
                      const icon = getIconForFeature(feature);
                      return (<div key={i} className="flex items-center gap-3"><span className={index === 0 ? 'text-[#2a2520]/30' : 'text-[#f5f0e8]/40'}>{icon || <span className="w-1.5 h-1.5 rounded-full bg-current block" />}</span><span className="text-sm">{feature}</span></div>);
                    })}
                  </div>
                  <div className={`pt-6 mt-8 border-t ${index === 0 ? 'border-[#2a2520]/10' : 'border-[#f5f0e8]/20'}`}>
                    <p className={`text-xs tracking-widest mb-2 ${index === 0 ? 'text-[#2a2520]/40' : 'text-[#f5f0e8]/60'}`}>FROM</p>
                    <p className="font-serif text-2xl mb-4">{formatPrice(parseFloat(tent.Price_EUR))} <span className={`text-sm font-sans ${index === 0 ? 'text-[#2a2520]/40' : 'text-[#f5f0e8]/60'}`}> / night</span></p>
                    <button onClick={() => openBookingModal(tent)} className={`text-xs tracking-widest border px-6 py-3 inline-block transition-colors ${index === 0 ? 'border-[#2a2520] hover:bg-[#2a2520] hover:text-[#f5f0e8]' : 'border-[#f5f0e8]/70 hover:bg-[#f5f0e8]/10'}`}>BOOK {tent.Name.toUpperCase()}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-center text-[#2a2520]/40 text-xs mt-8">Also part of <a href="/#the-journey" className="underline hover:text-[#2a2520] transition-colors">The Slow Journey South</a></p>
        </div>
      </section>

      {gallery.length > 0 && <GalleryCarousel images={gallery} />}
      <BeyondTheWallsNav />

      <BookingModal isOpen={isModalOpen && selectedTent !== null} onClose={() => { setIsModalOpen(false); setTimeout(() => setSelectedTent(null), 300); }}
        item={selectedTent ? { id: selectedTent.Tent_ID, name: selectedTent.Name, priceEUR: selectedTent.Price_EUR } : { id: "", name: "", priceEUR: "0" }}
        config={{ maxGuestsPerUnit: 4, baseGuestsPerUnit: 2, extraPersonFee: parseFloat(selectedTent?.Extra_Person_EUR || "0"), maxNights: 3, maxUnits: 4, unitLabel: "tent", selectCheckout: false, propertyName: "The Desert Camp", paypalContainerId: `paypal-tent-${selectedTent?.Tent_ID || "default"}` }}
        formatPrice={formatPrice} paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
      />
    </div>
  );
}
