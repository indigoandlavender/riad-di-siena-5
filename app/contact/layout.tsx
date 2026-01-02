import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Riad di Siena in Marrakech. Email happy@riaddisiena.com or WhatsApp for reservations, questions, or journey planning. We respond within 24 hours.",
  openGraph: {
    title: "Contact | Riad di Siena",
    description: "Contact Riad di Siena in Marrakech. Email or WhatsApp for reservations and questions.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
