import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intellectual Property",
  description: "Riad di Siena intellectual property notice. Copyright, trademarks, and usage rights for website content and imagery.",
  openGraph: {
    title: "Intellectual Property | Riad di Siena",
    description: "Intellectual property and copyright information for Riad di Siena.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/intellectual-property",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IntellectualPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
