import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about staying at Riad di Siena. Check-in times, airport transfers, breakfast, payments, and everything you need to know before your visit to Marrakech.",
  openGraph: {
    title: "FAQ | Riad di Siena",
    description: "Everything you need to know about staying at Riad di Siena in Marrakech.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/faq",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
