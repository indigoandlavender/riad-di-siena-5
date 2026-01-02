import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Farm",
  description: "A working farm in the Atlas foothills, part of the Riad di Siena collection. Organic gardens, traditional agriculture, and mountain hospitality.",
  openGraph: {
    title: "The Farm | Riad di Siena",
    description: "Working farm in the Atlas foothills. Organic gardens and mountain hospitality.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/the-farm",
  },
};

export default function TheFarmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
