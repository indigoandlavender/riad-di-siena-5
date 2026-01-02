"use client";

import { useState, useEffect } from "react";
import { useCurrency } from "./CurrencyContext";
import BookingModal from "./BookingModal";

interface Room {
  Room_ID: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Image_URL: string;
  iCal_URL?: string;
  property: "riad" | "douaria";
}

interface Experience {
  Package_ID: string;
  Name: string;
  Price_EUR: string;
  Extra_Person_EUR: string;
  Duration: string;
  Min_Guests: string;
  includes: string[];
}

interface Tent {
  Tent_ID: string;
  Level: string;
  Name: string;
  Description: string;
  Price_EUR: string;
  Extra_Person_EUR: string;
  features: string[];
}

interface StayWithUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAYPAL_CLIENT_ID = "AWVf28iPmlVmaEyibiwkOtdXAl5UPqL9i8ee9yStaG6qb7hCwNRB2G95SYwbcikLnBox6CGyO-boyAvu";

export default function StayWithUsModal({ isOpen, onClose }: StayWithUsModalProps) {
  const { formatPrice } = useCurrency();
  const [riadRooms, setRiadRooms] = useState<Room[]>([]);
  const [douariaRooms, setDouariaRooms] = useState<Room[]>([]);
  const [kasbahExperience, setKasbahExperience] = useState<Experience | null>(null);
  const [desertTents, setDesertTents] = useState<Tent[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<any>(null);
  const [bookingConfig, setBookingConfig] = useState<any>(null);
  const [cityTaxPerNight, setCityTaxPerNight] = useState(2.5);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch("/api/sheets/rooms").then(res => res.json()),
        fetch("/api/sheets/douaria-rooms").then(res => res.json()),
        fetch("/api/sheets/kasbah-experience").then(res => res.json()),
        fetch("/api/sheets/desert-tents").then(res => res.json()),
        fetch("/api/sheets/settings").then(res => res.json()),
      ])
        .then(([riad, douaria, kasbah, tents, settings]) => {
          const filterBookable = (rooms: any[]) => rooms.filter((r: any) => 
            r.Bookable?.toLowerCase() !== "no"
          );
          setRiadRooms(filterBookable(riad).map((r: Room) => ({ ...r, property: "riad" })));
          setDouariaRooms(filterBookable(douaria).map((r: Room) => ({ ...r, property: "douaria" })));
          if (kasbah.length > 0) setKasbahExperience(kasbah[0]);
          setDesertTents(tents);
          if (settings.city_tax_eur) {
            setCityTaxPerNight(parseFloat(settings.city_tax_eur));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  const openRoomBooking = (room: Room) => {
    setBookingItem({
      id: room.Room_ID,
      name: room.Name,
      priceEUR: room.Price_EUR,
      iCalURL: room.iCal_URL,
    });
    setBookingConfig({
      maxGuestsPerUnit: 2,
      baseGuestsPerUnit: 2,
      hasCityTax: true,
      cityTaxPerNight,
      selectCheckout: true,
      paypalContainerId: `paypal-room-${room.Room_ID}`,
    });
    setBookingModalOpen(true);
  };

  const openKasbahBooking = () => {
    if (!kasbahExperience) return;
    setBookingItem({
      id: kasbahExperience.Package_ID,
      name: kasbahExperience.Name,
      priceEUR: kasbahExperience.Price_EUR,
    });
    setBookingConfig({
      maxGuestsPerUnit: 3,
      baseGuestsPerUnit: 2,
      extraPersonFee: parseFloat(kasbahExperience.Extra_Person_EUR || "0"),
      maxNights: 5,
      maxUnits: 3,
      unitLabel: "room",
      selectCheckout: false,
      propertyName: "The Kasbah",
      paypalContainerId: "paypal-kasbah",
    });
    setBookingModalOpen(true);
  };

  const openTentBooking = (tent: Tent) => {
    setBookingItem({
      id: tent.Tent_ID,
      name: tent.Name,
      priceEUR: tent.Price_EUR,
    });
    setBookingConfig({
      maxGuestsPerUnit: 4,
      baseGuestsPerUnit: 2,
      extraPersonFee: parseFloat(tent.Extra_Person_EUR || "0"),
      maxNights: 3,
      maxUnits: 4,
      unitLabel: "tent",
      selectCheckout: false,
      propertyName: "The Desert Camp",
      paypalContainerId: `paypal-tent-${tent.Tent_ID}`,
    });
    setBookingModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative bg-[#f8f5f0] w-full max-w-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#f8f5f0] border-b border-foreground/15 px-10 py-6 flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">Stay With Us</h2>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="2" y1="2" x2="14" y2="14" />
                <line x1="14" y1="2" x2="2" y2="14" />
              </svg>
            </button>
          </div>

          {/* Content - scrollable but no visible scrollbar */}
          <div className="px-10 py-8 max-h-[65vh] overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-5 h-5 border border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-10">
                {/* Riad di Siena */}
                {riadRooms.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 mb-5">Riad di Siena</p>
                    <div className="space-y-2">
                      {riadRooms.map((room) => (
                        <button
                          key={room.Room_ID}
                          onClick={() => openRoomBooking(room)}
                          className="w-full flex items-center justify-between py-4 px-5 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all duration-200 group"
                        >
                          <div className="text-left">
                            <p className="font-serif text-foreground group-hover:text-foreground transition-colors">{room.Name}</p>
                            <p className="text-[11px] text-foreground/60 mt-1">Main House · No. 37</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-foreground/70">from {formatPrice(parseFloat(room.Price_EUR))}</p>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40 group-hover:text-foreground/70 transition-colors">
                              <polyline points="5,2 10,7 5,12" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* The Douaria */}
                {douariaRooms.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 mb-5">The Douaria</p>
                    <div className="space-y-2">
                      {douariaRooms.map((room) => (
                        <button
                          key={room.Room_ID}
                          onClick={() => openRoomBooking(room)}
                          className="w-full flex items-center justify-between py-4 px-5 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all duration-200 group"
                        >
                          <div className="text-left">
                            <p className="font-serif text-foreground group-hover:text-foreground transition-colors">{room.Name}</p>
                            <p className="text-[11px] text-foreground/60 mt-1">The Annex · No. 35</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-foreground/70">from {formatPrice(parseFloat(room.Price_EUR))}</p>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40 group-hover:text-foreground/70 transition-colors">
                              <polyline points="5,2 10,7 5,12" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* The Kasbah */}
                {kasbahExperience && (
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 mb-5">The Kasbah</p>
                    <button
                      onClick={openKasbahBooking}
                      className="w-full flex items-center justify-between py-4 px-5 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all duration-200 group"
                    >
                      <div className="text-left">
                        <p className="font-serif text-foreground group-hover:text-foreground transition-colors">{kasbahExperience.Name}</p>
                        <p className="text-[11px] text-foreground/60 mt-1">Draa Valley · {kasbahExperience.Duration} nights</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-foreground/70">from {formatPrice(parseFloat(kasbahExperience.Price_EUR))}</p>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40 group-hover:text-foreground/70 transition-colors">
                          <polyline points="5,2 10,7 5,12" />
                        </svg>
                      </div>
                    </button>
                  </div>
                )}

                {/* The Desert Camp */}
                {desertTents.length > 0 && (
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 mb-5">The Desert Camp</p>
                    <div className="space-y-2">
                      {desertTents.map((tent) => (
                        <button
                          key={tent.Tent_ID}
                          onClick={() => openTentBooking(tent)}
                          className="w-full flex items-center justify-between py-4 px-5 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-all duration-200 group"
                        >
                          <div className="text-left">
                            <p className="font-serif text-foreground group-hover:text-foreground transition-colors">{tent.Name}</p>
                            <p className="text-[11px] text-foreground/60 mt-1">Erg Chebbi · {tent.Level}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm text-foreground/70">from {formatPrice(parseFloat(tent.Price_EUR))}</p>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/40 group-hover:text-foreground/70 transition-colors">
                              <polyline points="5,2 10,7 5,12" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unified Booking Modal - Keep mounted, use isOpen for visibility */}
      <BookingModal
        isOpen={bookingModalOpen && bookingItem !== null}
        onClose={() => {
          setBookingModalOpen(false);
          // Clear item after delay to let modal close gracefully
          setTimeout(() => {
            setBookingItem(null);
            setBookingConfig(null);
          }, 300);
        }}
        item={bookingItem || { id: "", name: "", priceEUR: "0" }}
        config={bookingConfig || {}}
        formatPrice={formatPrice}
        paypalClientId={PAYPAL_CLIENT_ID}
      />
    </>
  );
}
