import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Four individually designed rooms at Riad di Siena. Queen beds, en-suite bathrooms, air conditioning, and traditional Moroccan craftsmanship. From €80/night including breakfast.",
  openGraph: {
    title: "Rooms at Riad di Siena",
    description: "Four individually designed rooms around a courtyard fountain. Queen beds, en-suite bathrooms, rooftop breakfast included.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/rooms",
  },
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
