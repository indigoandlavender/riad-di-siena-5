import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "House Rules",
  description: "Riad di Siena house rules. Guidelines for a comfortable stay including quiet hours, common areas, and respect for our traditional Moroccan home.",
  openGraph: {
    title: "House Rules | Riad di Siena",
    description: "House rules for staying at Riad di Siena in Marrakech.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/house-rules",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HouseRulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
