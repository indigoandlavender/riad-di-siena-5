import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Desert Camp",
  description: "Luxury Sahara desert camp at Erg Chebbi dunes, Morocco. Traditional nomad tents, camel treks at sunset, stargazing, and silence. Part of the Riad di Siena collection.",
  openGraph: {
    title: "The Desert Camp | Riad di Siena",
    description: "Luxury Sahara desert camp at Erg Chebbi. Traditional tents, camel treks, stargazing.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/the-desert-camp",
  },
};

export default function TheDesertCampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
