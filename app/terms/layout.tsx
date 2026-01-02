import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Riad di Siena terms of service. Legal terms governing use of our website and booking services.",
  openGraph: {
    title: "Terms of Service | Riad di Siena",
    description: "Terms of service for Riad di Siena website and bookings.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
