"use client";

import { useState, useEffect } from "react";
import BookingModal from "@/components/BookingModal";
import GalleryCarousel from "@/components/GalleryCarousel";
import { useCurrency } from "@/components/CurrencyContext";
import ElfsightWidget, { ElfsightScript } from "@/components/ElfsightWidget";

interface Room {
  Room_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Features: string;
  Image_URL: string;
  Widget_ID?: string;
  iCal_URL?: string;
  features: string[];
  Bookable?: string; // "Yes", "No", or empty (defaults to Yes)
}

interface Hero {
  Title: string;
  Subtitle: string;
  Image_URL: string;
}

interface GalleryImage {
  Image_ID: string;
  Image_URL: string;
  Caption?: string;
}

const BedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="1" y="8" width="18" height="8" rx="1" />
    <path d="M3 8V5a2 2 0 012-2h10a2 2 0 012 2v3" />
    <line x1="1" y1="16" x2="1" y2="18" />
    <line x1="19" y1="16" x2="19" y2="18" />
  </svg>
);

const BathIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M3 10h14a1 1 0 011 1v3a4 4 0 01-4 4H6a4 4 0 01-4-4v-3a1 1 0 011-1z" />
    <path d="M4 10V5a2 2 0 012-2h1" />
  </svg>
);

const WifiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <path d="M2 8c4.5-4 11.5-4 16 0" />
    <path d="M5 11c3-2.5 7-2.5 10 0" />
    <path d="M8 14c1.5-1 3.5-1 5 0" />
    <circle cx="10" cy="16" r="1" fill="currentColor" />
  </svg>
);

const AcIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25">
    <rect x="2" y="4" width="16" height="10" rx="1" />
    <path d="M5 17c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3" />
    <path d="M10 17c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3" />
  </svg>
);

const iconMap: Record<string, () => JSX.Element> = {
  "bathroom": BathIcon,
  "ensuite": BathIcon,
  "wi-fi": WifiIcon,
  "wifi": WifiIcon,
  "air": AcIcon,
  "conditioning": AcIcon,
  "bed": BedIcon,
  "queen": BedIcon,
  "king": BedIcon,
  "double": BedIcon,
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hero, setHero] = useState<Hero | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cityTaxPerNight, setCityTaxPerNight] = useState(2.5);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    Promise.all([
      fetch("/api/sheets/rooms").then((res) => res.json()),
      fetch("/api/sheets/rooms-hero").then((res) => res.json()),
      fetch("/api/sheets/rooms-gallery").then((res) => res.json()),
      fetch("/api/sheets/settings").then((res) => res.json()),
    ])
      .then(([roomsData, heroData, galleryData, settingsData]) => {
        setRooms(roomsData);
        setHero(heroData);
        setGallery(galleryData);
        if (settingsData.city_tax_eur) {
          setCityTaxPerNight(parseFloat(settingsData.city_tax_eur));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const openBookingModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const getIconForFeature = (feature: string): JSX.Element | null => {
    const lowerFeature = feature.toLowerCase();
    const matchedKey = Object.keys(iconMap).find(key => lowerFeature.includes(key));
    if (matchedKey) {
      const Icon = iconMap[matchedKey];
      return <Icon />;
    }
    return null;
  };

  // Show nothing until data loads to prevent flicker
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero with background image */}
      <section className="relative h-[60vh] flex items-center justify-center">
        {hero?.Image_URL && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${hero.Image_URL}')` }}
          />
        )}
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 text-center text-sand px-6 max-w-3xl">
          <p className="text-xs tracking-[0.4em] mb-6">RIAD DI SIENA</p>
          {hero?.Title && (
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              {hero.Title}
            </h1>
          )}
          {hero?.Subtitle && (
            <p className="text-lg font-light leading-relaxed max-w-xl mx-auto">
              {hero.Subtitle}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-24">
            {rooms.map((room, index) => (
              <article key={room.Room_ID} className="grid md:grid-cols-2 gap-12 items-start">
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="aspect-[4/3] bg-foreground/5 overflow-hidden">
                    {room.Image_URL ? (
                      <img src={room.Image_URL} alt={room.Name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/20">
                        <BedIcon />
                      </div>
                    )}
                  </div>
                </div>

                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <p className="text-xs tracking-widest text-muted-foreground mb-3">
                    FROM {formatPrice(parseFloat(room.Price_EUR))} / NIGHT
                  </p>
                  <h2 className="font-serif text-2xl text-foreground/90 mb-4">{room.Name}</h2>
                  <p className="text-foreground/70 leading-relaxed mb-8">{room.Description}</p>
                  
                  {room.features && room.features.length > 0 && (
                    <div className="mb-8">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {room.features.map((feature) => {
                          const icon = getIconForFeature(feature);
                          return (
                            <div key={feature} className="flex items-center gap-3 text-foreground/60">
                              <span className="text-foreground/40">
                                {icon || <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 block" />}
                              </span>
                              <span className="text-sm">{feature}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Check if room is bookable - defaults to yes unless explicitly "No" or room is "Jewel Box" */}
                  {room.Bookable?.toLowerCase() === "no" ? (
                    <p className="text-xs tracking-widest text-muted-foreground italic">
                      Not available for direct booking
                    </p>
                  ) : (
                    <button
                      onClick={() => openBookingModal(room)}
                      className="text-xs tracking-widest border border-foreground px-8 py-4 hover:bg-foreground hover:text-cream transition-colors"
                    >
                      CHECK AVAILABILITY
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Carousel */}
      {gallery.length > 0 && (
        <GalleryCarousel images={gallery} />
      )}

      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest text-muted-foreground mb-4">REVIEWS</p>
            <h2 className="font-serif text-xl text-foreground/80">What guests say</h2>
          </div>
          
          <div className="space-y-16">
            {rooms.filter(room => room.Widget_ID).map((room) => (
              <div key={room.Room_ID}>
                <p className="text-xs tracking-widest text-muted-foreground mb-6 text-center">
                  {room.Name.toUpperCase()}
                </p>
                <ElfsightWidget widgetId={room.Widget_ID!} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ElfsightScript />

      <BookingModal
        isOpen={isModalOpen && selectedRoom !== null}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setSelectedRoom(null), 300);
        }}
        item={selectedRoom ? {
          id: selectedRoom.Room_ID,
          name: selectedRoom.Name,
          priceEUR: selectedRoom.Price_EUR,
          iCalURL: selectedRoom.iCal_URL,
        } : { id: "", name: "", priceEUR: "0" }}
        config={{
          maxGuestsPerUnit: 2,
          baseGuestsPerUnit: 2,
          hasCityTax: true,
          cityTaxPerNight,
          selectCheckout: true,
          paypalContainerId: `paypal-amenity-${selectedRoom?.Room_ID || "default"}`,
        }}
        formatPrice={formatPrice}
        paypalClientId="AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu"
      />
    </div>
  );
}
