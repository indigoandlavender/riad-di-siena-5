"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface Room {
  Room_ID: string;
  Name: string;
  Price_EUR: string;
  property: string;
}

interface Booking {
  Booking_ID: string;
  firstName: string;
  lastName: string;
  room: string;
  property: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  paypalStatus: string;
  source?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Property colors
const PROPERTY_COLORS: { [key: string]: { bg: string; border: string; text: string } } = {
  riad: { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800" },
  douaria: { bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-800" },
};

export default function CalendarPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch rooms and bookings
  useEffect(() => {
    Promise.all([
      fetch("/api/sheets/rooms").then((r) => r.json()),
      fetch("/api/sheets/douaria-rooms").then((r) => r.json()),
      fetch("/api/admin/bookings").then((r) => r.json()),
    ])
      .then(([riadRooms, douariaRooms, bookingsData]) => {
        const allRooms = [
          ...riadRooms.map((r: Room) => ({ ...r, property: "riad" })),
          ...douariaRooms.map((r: Room) => ({ ...r, property: "douaria" })),
        ];
        setRooms(allRooms);
        setBookings(bookingsData.bookings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Get days in current month view (including padding days)
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Add padding days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push(d);
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add padding days for next month to complete the grid
    const endPadding = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  }, [currentDate]);

  // Check if a room is booked on a specific date
  const getBookingForRoomOnDate = (room: Room, date: Date): Booking | null => {
    const dateStr = date.toISOString().split("T")[0];
    
    return bookings.find((b) => {
      // Match room name (case insensitive)
      const roomMatch = b.room?.toLowerCase() === room.Name.toLowerCase();
      
      // Match property
      const propertyMatch = 
        b.property?.toLowerCase() === room.property ||
        (room.property === "riad" && (!b.property || b.property === "Riad di Siena")) ||
        (room.property === "douaria" && b.property?.toLowerCase().includes("douaria"));
      
      if (!roomMatch || !propertyMatch) return false;
      
      // Check if date falls within booking range
      if (!b.checkIn || !b.checkOut) return false;
      
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      const current = new Date(dateStr);
      
      return current >= checkIn && current < checkOut;
    }) || null;
  };

  // Navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const formatDateRange = (checkIn: string, checkOut: string) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    return `${inDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${outDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-foreground/10 py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl">Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Room availability overview
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/reservations/new"
              className="text-xs uppercase tracking-wide bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
            >
              + Add Reservation
            </Link>
            <Link
              href="/admin"
              className="text-xs uppercase tracking-wide border border-foreground/10 px-4 py-2 hover:border-foreground transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPrevMonth}
              className="p-2 border border-foreground/10 hover:border-foreground transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 12L6 8l4-4" />
              </svg>
            </button>
            <h2 className="font-serif text-2xl min-w-[200px] text-center">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 border border-foreground/10 hover:border-foreground transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 12l4-4-4-4" />
              </svg>
            </button>
          </div>
          <button
            onClick={goToToday}
            className="text-xs uppercase tracking-wide border border-foreground/10 px-4 py-2 hover:border-foreground transition-colors"
          >
            Today
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 ${PROPERTY_COLORS.riad.bg} ${PROPERTY_COLORS.riad.border} border`} />
            <span className="text-sm text-muted-foreground">The Riad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 ${PROPERTY_COLORS.douaria.bg} ${PROPERTY_COLORS.douaria.border} border`} />
            <span className="text-sm text-muted-foreground">The Douaria</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-background border border-foreground/10" />
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="border border-foreground/10 overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-foreground/10 bg-sand/30">
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-center text-xs uppercase tracking-wide text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, idx) => (
              <div
                key={idx}
                className={`min-h-[120px] border-b border-r border-foreground/10 p-2 ${
                  !isCurrentMonth(date) ? "bg-foreground/5" : ""
                } ${isToday(date) ? "bg-amber-50" : ""}`}
              >
                {/* Date Number */}
                <div className={`text-sm mb-2 ${
                  !isCurrentMonth(date) ? "text-muted-foreground/50" : ""
                } ${isToday(date) ? "font-bold text-amber-700" : ""}`}>
                  {date.getDate()}
                </div>

                {/* Room Bookings */}
                <div className="space-y-1">
                  {rooms.map((room) => {
                    const booking = getBookingForRoomOnDate(room, date);
                    const colors = PROPERTY_COLORS[room.property] || PROPERTY_COLORS.riad;
                    
                    if (booking) {
                      return (
                        <button
                          key={room.Room_ID}
                          onClick={() => setSelectedBooking(booking)}
                          className={`w-full text-left px-1.5 py-0.5 text-[10px] truncate rounded ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}
                          title={`${room.Name}: ${booking.firstName} ${booking.lastName}`}
                        >
                          {room.Name.split(" ")[0]}
                        </button>
                      );
                    }
                    
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room List Summary */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* The Riad */}
          <div className="border border-foreground/10 p-6">
            <h3 className="font-serif text-xl mb-4">The Riad</h3>
            <div className="space-y-3">
              {rooms.filter((r) => r.property === "riad").map((room) => {
                const today = new Date();
                const booking = getBookingForRoomOnDate(room, today);
                return (
                  <div key={room.Room_ID} className="flex items-center justify-between">
                    <span className="text-sm">{room.Name}</span>
                    {booking ? (
                      <span className={`text-xs px-2 py-1 ${PROPERTY_COLORS.riad.bg} ${PROPERTY_COLORS.riad.text}`}>
                        {booking.firstName} {booking.lastName}
                      </span>
                    ) : (
                      <span className="text-xs text-green-600">Available</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* The Douaria */}
          <div className="border border-foreground/10 p-6">
            <h3 className="font-serif text-xl mb-4">The Douaria</h3>
            <div className="space-y-3">
              {rooms.filter((r) => r.property === "douaria").map((room) => {
                const today = new Date();
                const booking = getBookingForRoomOnDate(room, today);
                return (
                  <div key={room.Room_ID} className="flex items-center justify-between">
                    <span className="text-sm">{room.Name}</span>
                    {booking ? (
                      <span className={`text-xs px-2 py-1 ${PROPERTY_COLORS.douaria.bg} ${PROPERTY_COLORS.douaria.text}`}>
                        {booking.firstName} {booking.lastName}
                      </span>
                    ) : (
                      <span className="text-xs text-green-600">Available</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>

            <h3 className="font-serif text-2xl mb-1">
              {selectedBooking.firstName} {selectedBooking.lastName}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {selectedBooking.room} • {selectedBooking.property === "douaria" ? "The Douaria" : "The Riad"}
            </p>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-foreground/10 pb-2">
                <span className="text-muted-foreground text-sm">Dates</span>
                <span className="text-sm">{formatDateRange(selectedBooking.checkIn, selectedBooking.checkOut)}</span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-2">
                <span className="text-muted-foreground text-sm">Guests</span>
                <span className="text-sm">{selectedBooking.guests}</span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-2">
                <span className="text-muted-foreground text-sm">Total</span>
                <span className="text-sm">€{selectedBooking.total}</span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-2">
                <span className="text-muted-foreground text-sm">Status</span>
                <span className={`text-xs px-2 py-1 ${
                  selectedBooking.paypalStatus === "COMPLETED" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {selectedBooking.paypalStatus === "COMPLETED" ? "Confirmed" : "Pending"}
                </span>
              </div>
              {selectedBooking.source && (
                <div className="flex justify-between border-b border-foreground/10 pb-2">
                  <span className="text-muted-foreground text-sm">Source</span>
                  <span className="text-sm capitalize">{selectedBooking.source}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/admin/bookings"
                className="flex-1 text-center text-xs uppercase tracking-wide border border-foreground/20 py-3 hover:border-foreground transition-colors"
              >
                View All Bookings
              </Link>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 text-xs uppercase tracking-wide bg-foreground text-background py-3 hover:bg-foreground/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
