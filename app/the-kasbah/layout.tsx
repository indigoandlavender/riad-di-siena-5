import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Kasbah",
  description: "A 500-year-old fortified house in Morocco's Draa Valley, 6 hours south of Marrakech. Part of the Riad di Siena collection. Palm groves, mud-brick walls, the silence of the south.",
  openGraph: {
    title: "The Kasbah | Riad di Siena",
    description: "500-year-old fortified house in Morocco's Draa Valley. Palm groves, mud-brick walls, silence.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/the-kasbah",
  },
};

export default function TheKasbahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
