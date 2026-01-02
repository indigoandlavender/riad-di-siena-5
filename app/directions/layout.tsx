import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directions",
  description: "How to find Riad di Siena in Marrakech medina. Step-by-step walking directions from Jemaa el-Fna, GPS coordinates, and tips for navigating the old city.",
  openGraph: {
    title: "Directions | Riad di Siena",
    description: "How to find Riad di Siena in Marrakech medina. Step-by-step directions and GPS coordinates.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/directions",
  },
};

export default function DirectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
