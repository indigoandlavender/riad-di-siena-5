import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Douaria",
  description: "Modern annex to Riad di Siena, steps from the main house. Three contemporary rooms with private rooftop terrace in Marrakech medina. Traditional location, modern comfort.",
  openGraph: {
    title: "The Douaria | Riad di Siena",
    description: "Modern annex with private rooftop terrace in Marrakech medina. Three contemporary rooms.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/the-douaria",
  },
};

export default function TheDouariaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
