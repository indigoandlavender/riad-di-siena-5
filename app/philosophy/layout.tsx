import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Philosophy",
  description: "The Riad di Siena philosophy: slow hospitality, authentic experiences, and the art of Moroccan welcome. Not a hotel—a home that happens to have guests.",
  openGraph: {
    title: "Our Philosophy | Riad di Siena",
    description: "Slow hospitality, authentic experiences, and the art of Moroccan welcome.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/philosophy",
  },
};

export default function PhilosophyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
