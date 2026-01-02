"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

declare global {
  interface Window {
    paypal?: any;
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface BookingItem {
  id: string;
  name: string;
  priceEUR: string;
  iCalURL?: string;
}

export interface BookingConfig {
  maxGuestsPerUnit?: number;
  baseGuestsPerUnit?: number;
  maxNights?: number;
  maxUnits?: number;
  unitLabel?: string;
  hasCityTax?: boolean;
  cityTaxPerNight?: number;
  extraPersonFee?: number;
  selectCheckout?: boolean;
  propertyName?: string;
  paypalContainerId?: string;
  isPerPersonPricing?: boolean; // For journeys: price × guests instead of price × nights
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BookingItem;
  config: BookingConfig;
  formatPrice: (amount: number) => string;
  paypalClientId: string;
  onBookingComplete?: (data: any) => void;
}

// ============================================================================
// CALENDAR COMPONENT
// ============================================================================

function Calendar({
  selectedCheckIn,
  selectedCheckOut,
  onSelectDate,
  bookedDates,
  selectCheckout,
}: {
  selectedCheckIn: string;
  selectedCheckOut: string;
  onSelectDate: (date: string) => void;
  bookedDates: string[];
  selectCheckout: boolean;
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const formatDateStr = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isBooked = (dateStr: string) => bookedDates.includes(dateStr);

  const isPast = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date < today;
  };

  const isInRange = (dateStr: string) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return dateStr > selectedCheckIn && dateStr < selectedCheckOut;
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const canGoPrev = new Date(year, month - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="10,2 5,8 10,14" />
          </svg>
        </button>
        <span className="text-sm tracking-wide text-foreground/70">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="6,2 11,8 6,14" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-center text-[10px] tracking-wider text-foreground/30 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDateStr(year, month, day);
          const isBookedDate = isBooked(dateStr);
          const isPastDate = isPast(year, month, day);
          const isCheckIn = dateStr === selectedCheckIn;
          const isCheckOut = dateStr === selectedCheckOut;
          const isRange = isInRange(dateStr);
          const isDisabled = isPastDate || isBookedDate;

          return (
            <button
              key={day}
              onClick={() => !isDisabled && onSelectDate(dateStr)}
              disabled={isDisabled}
              className={`
                aspect-square flex items-center justify-center text-sm relative transition-all
                ${isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-foreground/5"}
                ${isCheckIn || isCheckOut ? "bg-foreground text-[#f8f5f0]" : ""}
                ${isRange ? "bg-foreground/10" : ""}
                ${isPastDate ? "text-foreground/20" : ""}
                ${isBookedDate && !isPastDate ? "text-foreground/30" : ""}
                ${!isDisabled && !isCheckIn && !isCheckOut && !isRange ? "text-foreground/70" : ""}
              `}
            >
              <span className="relative z-10">{day}</span>
              {/* Unavailable indicator */}
              {isBookedDate && !isPastDate && (
                <div className="absolute inset-0 bg-foreground/10" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-foreground/10">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-foreground" />
          <span className="text-[10px] tracking-wide text-foreground/40 uppercase">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-foreground/20 bg-foreground/5" />
          <span className="text-[10px] tracking-wide text-foreground/40 uppercase">Unavailable</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PAYPAL COMPONENT
// ============================================================================

function PayPalButton({
  amount,
  description,
  clientId,
  onSuccess,
  onError,
}: {
  amount: string;
  description: string;
  clientId: string;
  onSuccess: (transactionId: string) => void;
  onError: (err: any) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const buttonsInstance = useRef<any>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let timeoutId: NodeJS.Timeout;

    const renderButton = async () => {
      if (!containerRef.current || !window.paypal || !isMounted.current) return;

      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        buttonsInstance.current = window.paypal.Buttons({
          style: { layout: "vertical", color: "black", shape: "rect", label: "pay", height: 50 },
          createOrder: (_: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{ description, amount: { value: amount, currency_code: "EUR" } }],
            });
          },
          onApprove: async (_: any, actions: any) => {
            if (!isMounted.current) return;
            const order = await actions.order.capture();
            onSuccess(order.id);
          },
          onError: (err: any) => {
            if (!isMounted.current) return;
            onError(err);
          },
        });

        if (containerRef.current && isMounted.current) {
          await buttonsInstance.current.render(containerRef.current);
          if (isMounted.current) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("PayPal render error:", err);
        if (isMounted.current) {
          setError(true);
          setLoading(false);
        }
      }
    };

    const initPayPal = () => {
      if (window.paypal) {
        renderButton();
      } else {
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
          script.async = true;
          script.onload = () => {
            if (isMounted.current) renderButton();
          };
          script.onerror = () => {
            if (isMounted.current) {
              setError(true);
              setLoading(false);
            }
          };
          document.head.appendChild(script);
        } else {
          const checkInterval = setInterval(() => {
            if (window.paypal) {
              clearInterval(checkInterval);
              if (isMounted.current) renderButton();
            }
          }, 100);
          
          timeoutId = setTimeout(() => {
            clearInterval(checkInterval);
            if (isMounted.current && !window.paypal) {
              setError(true);
              setLoading(false);
            }
          }, 10000);
        }
      }
    };

    requestAnimationFrame(initPayPal);

    return () => {
      isMounted.current = false;
      if (timeoutId) clearTimeout(timeoutId);
      
      if (buttonsInstance.current && typeof buttonsInstance.current.close === "function") {
        try {
          buttonsInstance.current.close();
        } catch (e) {}
      }
      buttonsInstance.current = null;
    };
  }, [amount, description, clientId, onSuccess, onError]);

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-foreground/50">Unable to load payment. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}

// ============================================================================
// QUANTITY SELECTOR
// ============================================================================

function QuantitySelector({
  label,
  value,
  min = 1,
  max = 10,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-foreground/10">
      <span className="text-sm text-foreground/70">{label}</span>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 flex items-center justify-center border border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
        </button>
        <span className="w-8 text-center text-foreground">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 flex items-center justify-center border border-foreground/20 text-foreground/50 hover:border-foreground/40 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="6" y1="2" x2="6" y2="10" />
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BookingModal({
  isOpen,
  onClose,
  item,
  config,
  formatPrice,
  paypalClientId,
  onBookingComplete,
}: BookingModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen || !item || !item.id) return null;

  return createPortal(
    <BookingModalContent
      onClose={onClose}
      item={item}
      config={config}
      formatPrice={formatPrice}
      paypalClientId={paypalClientId}
      onBookingComplete={onBookingComplete}
    />,
    document.body
  );
}

function BookingModalContent({
  onClose,
  item,
  config,
  formatPrice,
  paypalClientId,
  onBookingComplete,
}: Omit<BookingModalProps, "isOpen">) {
  const {
    maxGuestsPerUnit = 2,
    baseGuestsPerUnit = 2,
    maxNights = 30,
    maxUnits = 1,
    unitLabel = "room",
    hasCityTax = false,
    cityTaxPerNight = 2.5,
    extraPersonFee = 0,
    selectCheckout = true,
    isPerPersonPricing = false,
  } = config;

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(1);
  const [guests, setGuests] = useState(baseGuestsPerUnit);
  const [units, setUnits] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  // Calculate max guests based on units selected
  const maxGuests = maxGuestsPerUnit * units;
  const baseGuests = baseGuestsPerUnit * units;

  // Fetch booked dates from iCal
  useEffect(() => {
    if (item.iCalURL) {
      fetch(`/api/ical?url=${encodeURIComponent(item.iCalURL)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.bookedDates && Array.isArray(data.bookedDates)) {
            const dates: string[] = [];
            data.bookedDates.forEach((booking: { start: string; end: string }) => {
              const start = new Date(booking.start);
              const end = new Date(booking.end);
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                dates.push(d.toISOString().split("T")[0]);
              }
            });
            setBookedDates(dates);
          }
        })
        .catch((err) => console.error("Failed to fetch availability:", err));
    }
  }, [item.iCalURL]);

  // Handle date selection
  const handleDateSelect = (dateStr: string) => {
    if (selectCheckout) {
      // Date range mode: first click = check-in, second = check-out
      if (!checkIn || (checkIn && checkOut)) {
        setCheckIn(dateStr);
        setCheckOut("");
      } else if (dateStr > checkIn) {
        setCheckOut(dateStr);
      } else {
        setCheckIn(dateStr);
        setCheckOut("");
      }
    } else {
      // Single date mode (arrival only)
      setCheckIn(dateStr);
    }
  };

  // Calculate nights
  const calculatedNights = selectCheckout && checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : nights;

  // Pricing calculations
  const pricePerNight = parseFloat(item.priceEUR) || 0;
  
  // Per-person pricing mode (for journeys): price × guests
  // Standard mode (for rooms): price × nights × units + extras
  const subtotal = isPerPersonPricing 
    ? pricePerNight * guests 
    : pricePerNight * calculatedNights * units;
  const extraGuests = isPerPersonPricing ? 0 : Math.max(0, guests - baseGuests);
  const extraGuestsCost = extraGuests * extraPersonFee * calculatedNights;
  const cityTax = (hasCityTax && !isPerPersonPricing) ? cityTaxPerNight * guests * calculatedNights : 0;
  const total = subtotal + extraGuestsCost + cityTax;

  const canProceedStep1 = isPerPersonPricing
    ? checkIn && guests >= 1
    : (selectCheckout ? checkIn && checkOut && calculatedNights >= 1 : checkIn && nights >= 1);

  const handlePaymentSuccess = useCallback(async (transactionId: string) => {
    setIsSubmitting(true);
    const bookingData = {
      itemId: item.id,
      itemName: item.name,
      checkIn,
      checkOut: selectCheckout ? checkOut : "",
      nights: calculatedNights,
      guests,
      units,
      totalEUR: total.toFixed(2),
      firstName,
      lastName,
      email,
      phone,
      message,
      paypalTransactionId: transactionId,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const result = await response.json();
      if (result.success) {
        setStep(4);
        onBookingComplete?.(bookingData);
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to save booking. Please contact us.");
    } finally {
      setIsSubmitting(false);
    }
  }, [item, checkIn, checkOut, selectCheckout, calculatedNights, guests, units, total, firstName, lastName, email, phone, message, onBookingComplete]);

  const handlePaymentError = useCallback((err: any) => {
    console.error("PayPal error:", err);
    alert("Payment failed. Please try again.");
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Reset form when item changes
  useEffect(() => {
    setStep(1);
    setCheckIn("");
    setCheckOut("");
    setNights(1);
    setGuests(baseGuestsPerUnit);
    setUnits(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }, [item.id, baseGuestsPerUnit]);

  // Cap guests when units decrease
  useEffect(() => {
    if (guests > maxGuests) {
      setGuests(maxGuests);
    }
  }, [units, maxGuests, guests]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#f8f5f0] w-full max-w-md mx-4 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground/80 transition-colors z-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="2" x2="14" y2="14" />
            <line x1="14" y1="2" x2="2" y2="14" />
          </svg>
        </button>

        <div className="p-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-foreground/90 mb-1">{item.name}</h2>
            {maxNights > 1 || hasCityTax || maxGuestsPerUnit > baseGuestsPerUnit ? (
              <p className="text-sm text-foreground/50">{formatPrice(pricePerNight)} per night</p>
            ) : (
              <p className="text-sm text-foreground/50">{formatPrice(pricePerNight)}</p>
            )}
          </div>

          {/* Step 1: Dates */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-6">
                Step 1 of 3 — {selectCheckout ? "Select dates" : "Select arrival"}
              </p>

              {/* Calendar */}
              <Calendar
                selectedCheckIn={checkIn}
                selectedCheckOut={checkOut}
                onSelectDate={handleDateSelect}
                bookedDates={bookedDates}
                selectCheckout={selectCheckout}
              />

              {/* Selected dates display */}
              {checkIn && (
                <div className="mt-6 pt-6 border-t border-foreground/10">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-foreground/40">Check-in: </span>
                      <span className="text-foreground/80">{formatDate(checkIn)}</span>
                    </div>
                    {selectCheckout && checkOut && (
                      <div>
                        <span className="text-foreground/40">Check-out: </span>
                        <span className="text-foreground/80">{formatDate(checkOut)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Nights selector (if not selectCheckout and not per-person pricing and maxNights > 1) */}
              {!selectCheckout && !isPerPersonPricing && maxNights > 1 && checkIn && (
                <div className="mt-4">
                  <QuantitySelector
                    label="Nights"
                    value={nights}
                    min={1}
                    max={maxNights}
                    onChange={setNights}
                  />
                </div>
              )}

              {/* Units selector */}
              {maxUnits > 1 && checkIn && (
                <QuantitySelector
                  label={`${unitLabel.charAt(0).toUpperCase() + unitLabel.slice(1)}s`}
                  value={units}
                  min={1}
                  max={maxUnits}
                  onChange={setUnits}
                />
              )}

              {/* Guests selector */}
              {maxGuests > 1 && checkIn && (
                <QuantitySelector
                  label="Guests"
                  value={guests}
                  min={1}
                  max={maxGuests}
                  onChange={setGuests}
                />
              )}

              {/* Price summary */}
              {canProceedStep1 && (
                <div className="mt-6 pt-6 border-t border-foreground/10">
                  {/* Simple display for fixed-price items (1 night, 1 unit, base guests) */}
                  {calculatedNights === 1 && units === 1 && extraGuests === 0 && !hasCityTax ? (
                    <div className="flex justify-between text-base">
                      <span className="text-foreground/70">Total</span>
                      <span className="font-medium text-foreground">{formatPrice(total)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground/50">
                          {isPerPersonPricing 
                            ? `${formatPrice(pricePerNight)} × ${guests} guest${guests > 1 ? "s" : ""}`
                            : `${formatPrice(pricePerNight)} × ${calculatedNights} night${calculatedNights > 1 ? "s" : ""}${units > 1 ? ` × ${units} ${unitLabel}s` : ""}`
                          }
                        </span>
                        <span className="text-foreground/70">{formatPrice(subtotal)}</span>
                      </div>
                      {extraGuests > 0 && extraPersonFee > 0 && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground/50">
                            Extra guest{extraGuests > 1 ? "s" : ""} ({extraGuests} × €{extraPersonFee})
                          </span>
                          <span className="text-foreground/70">€{extraGuestsCost.toFixed(2)}</span>
                        </div>
                      )}
                      {hasCityTax && !isPerPersonPricing && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground/50">City tax</span>
                          <span className="text-foreground/70">€{cityTax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base pt-3 border-t border-foreground/10">
                        <span className="text-foreground/70">Total</span>
                        <span className="font-medium text-foreground">{formatPrice(total)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Continue button */}
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full mt-8 py-4 bg-foreground text-[#f8f5f0] text-sm tracking-wider uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Guest Details */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-6">Step 2 of 3 — Your details</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-foreground/40 mb-2">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-foreground/40 mb-2">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-wider uppercase text-foreground/40 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-wider uppercase text-foreground/40 mb-2">
                    Phone <span className="normal-case text-foreground/30">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-wider uppercase text-foreground/40 mb-2">
                    Special requests <span className="normal-case text-foreground/30">(optional)</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none text-foreground transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-foreground/20 text-foreground/70 text-sm tracking-wider uppercase hover:border-foreground/40 hover:text-foreground transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="9,2 4,7 9,12" />
                  </svg>
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!firstName || !lastName || !email}
                  className="flex-1 py-4 bg-foreground text-[#f8f5f0] text-sm tracking-wider uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="5,2 10,7 5,12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-6">Step 3 of 3 — Payment</p>

              {/* Booking summary with details */}
              <div className="bg-foreground/[0.03] p-6 mb-6">
                <p className="font-serif text-lg text-foreground/90 mb-3">{item.name}</p>
                <p className="text-sm text-foreground/50 mb-4">
                  {formatDate(checkIn)} {selectCheckout && checkOut ? `→ ${formatDate(checkOut)}` : ""}
                </p>
                
                {/* Detailed breakdown - simplified for fixed-price items */}
                <div className="space-y-2 pt-4 border-t border-foreground/10">
                  {calculatedNights === 1 && units === 1 && extraGuests === 0 && !hasCityTax ? (
                    <div className="flex justify-between text-base">
                      <span className="font-medium text-foreground/80">Total</span>
                      <span className="font-medium text-foreground">{formatPrice(total)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/50">
                          {isPerPersonPricing 
                            ? `${guests} guest${guests > 1 ? "s" : ""}`
                            : `${units > 1 ? `${units} ${unitLabel}s × ` : ""}${calculatedNights} night${calculatedNights > 1 ? "s" : ""}`
                          }
                        </span>
                        <span className="text-foreground/70">{formatPrice(subtotal)}</span>
                      </div>
                      {extraGuests > 0 && extraPersonFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/50">
                            {extraGuests} extra guest{extraGuests > 1 ? "s" : ""} × {calculatedNights} night{calculatedNights > 1 ? "s" : ""}
                          </span>
                          <span className="text-foreground/70">€{extraGuestsCost.toFixed(2)}</span>
                        </div>
                      )}
                      {hasCityTax && cityTax > 0 && !isPerPersonPricing && (
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/50">City tax</span>
                          <span className="text-foreground/70">€{cityTax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base pt-3 border-t border-foreground/10 mt-3">
                        <span className="font-medium text-foreground/80">Total</span>
                        <span className="font-medium text-foreground">{formatPrice(total)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <PayPalButton
                amount={total.toFixed(2)}
                description={`${item.name} - ${formatDate(checkIn)}`}
                clientId={paypalClientId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />

              {isSubmitting && (
                <p className="text-center text-sm text-foreground/50 mt-4">Processing payment...</p>
              )}

              <button
                onClick={() => setStep(2)}
                className="w-full mt-6 py-4 border border-foreground/20 text-foreground/70 text-sm tracking-wider uppercase hover:border-foreground/40 hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9,2 4,7 9,12" />
                </svg>
                Back
              </button>

              {/* Contact link */}
              <p className="text-center mt-6 text-[11px] text-foreground/30">
                <a href="/contact" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/50 transition-colors">Send us a note</a>
              </p>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="w-16 h-16 border border-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="6,14 12,20 22,8" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-foreground/90 mb-2">Booking Confirmed</h3>
              <p className="text-sm text-foreground/50 mb-8">
                Thank you! A confirmation has been sent to {email}
              </p>
              <button
                onClick={onClose}
                className="text-[10px] tracking-[0.2em] uppercase text-foreground/50 hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
