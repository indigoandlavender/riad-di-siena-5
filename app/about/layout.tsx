import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Riad di Siena: a 300-year-old traditional Moroccan riad in Marrakech medina. Our story, our team, and twenty years of welcoming guests.",
  openGraph: {
    title: "About | Riad di Siena",
    description: "The story of Riad di Siena and twenty years of welcoming guests to Marrakech.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
