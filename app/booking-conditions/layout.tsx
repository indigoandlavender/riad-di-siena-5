import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Conditions",
  description: "Riad di Siena booking conditions, cancellation policy, and payment terms. Clear policies for reservations at our Marrakech riad.",
  openGraph: {
    title: "Booking Conditions | Riad di Siena",
    description: "Booking conditions and cancellation policy for Riad di Siena.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/booking-conditions",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BookingConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
