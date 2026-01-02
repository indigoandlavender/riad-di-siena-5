"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Booking {
  Booking_ID: string;
  property?: string;
  room?: string;
  tent?: string;
  experience?: string;
  firstName: string;
  lastName: string;
  email: string;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  total: number;
  paypalStatus?: string;
  Timestamp?: string;
}

interface DashboardStats {
  newBookings: number;
  confirmed: number;
  totalBookings: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    newBookings: 0,
    confirmed: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => {
        const bookings = data.bookings || [];
        const confirmed = bookings.filter((b: Booking) => b.paypalStatus === "COMPLETED");
        const revenue = confirmed.reduce((sum: number, b: Booking) => sum + (b.total || 0), 0);
        
        setStats({
          newBookings: bookings.filter((b: Booking) => !b.paypalStatus || b.paypalStatus === "PENDING").length,
          confirmed: confirmed.length,
          totalBookings: bookings.length,
          totalRevenue: revenue,
        });
        setRecentBookings(bookings.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getPropertyName = (booking: Booking): string => {
    if (booking.property) return booking.property;
    if (booking.room) return "The Riad";
    return "Unknown";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-foreground/10 py-6 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="font-serif text-3xl">Admin</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Site →
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <p className="text-4xl font-serif">{stats.newBookings}</p>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif">{stats.confirmed}</p>
                <p className="text-sm text-muted-foreground mt-1">Confirmed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif">{stats.totalBookings}</p>
                <p className="text-sm text-muted-foreground mt-1">Total</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-serif">€{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Revenue</p>
              </div>
            </div>

            {/* Primary Tools */}
            <div className="space-y-4 mb-16">
              <Link
                href="/admin/calendar"
                className="block p-8 border border-foreground/10 hover:border-foreground transition-colors"
              >
                <h2 className="font-serif text-2xl mb-2">Calendar</h2>
                <p className="text-muted-foreground">
                  Visual overview of room availability across The Riad and The Douaria
                </p>
              </Link>
              <Link
                href="/admin/bookings"
                className="block p-8 border border-foreground/10 hover:border-foreground transition-colors"
              >
                <h2 className="font-serif text-2xl mb-2">All Bookings</h2>
                <p className="text-muted-foreground">
                  View and manage all reservations across properties
                </p>
              </Link>
              <Link
                href="/admin/reservations/new"
                className="block p-8 border border-foreground/10 hover:border-foreground transition-colors"
              >
                <h2 className="font-serif text-2xl mb-2">Add Reservation</h2>
                <p className="text-muted-foreground">
                  Manually add bookings from Booking.com, Airbnb, WhatsApp, etc.
                </p>
              </Link>
            </div>

            {/* Recent Bookings */}
            {recentBookings.length > 0 && (
              <div className="border-t border-foreground/10 pt-12">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-6">Recent Bookings</p>
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div 
                      key={booking.Booking_ID} 
                      className="flex items-center justify-between p-4 border border-foreground/10 hover:border-foreground/30 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{booking.firstName} {booking.lastName}</p>
                        <p className="text-sm text-muted-foreground">
                          {getPropertyName(booking)} • {booking.room || booking.tent || booking.experience}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{formatDate(booking.checkIn || "")} → {formatDate(booking.checkOut || "")}</p>
                        <p className="text-sm text-muted-foreground">€{booking.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/admin/bookings" 
                  className="block text-center text-sm text-muted-foreground hover:text-foreground mt-4"
                >
                  View all →
                </Link>
              </div>
            )}

            {/* Property Quick Links */}
            <div className="border-t border-foreground/10 pt-12 mt-12">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-6">Filter by Property</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/admin/bookings?property=riad"
                  className="p-4 border border-foreground/10 hover:border-foreground transition-colors text-center"
                >
                  <p className="text-sm">The Riad</p>
                </Link>
                <Link
                  href="/admin/bookings?property=douaria"
                  className="p-4 border border-foreground/10 hover:border-foreground transition-colors text-center"
                >
                  <p className="text-sm">The Douaria</p>
                </Link>
                <Link
                  href="/admin/bookings?property=kasbah"
                  className="p-4 border border-foreground/10 hover:border-foreground transition-colors text-center"
                >
                  <p className="text-sm">The Kasbah</p>
                </Link>
                <Link
                  href="/admin/bookings?property=desert"
                  className="p-4 border border-foreground/10 hover:border-foreground transition-colors text-center"
                >
                  <p className="text-sm">Desert Camp</p>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
