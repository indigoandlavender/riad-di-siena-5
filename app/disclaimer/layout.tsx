import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Riad di Siena website disclaimer. Information about content accuracy, external links, and limitations of liability.",
  openGraph: {
    title: "Disclaimer | Riad di Siena",
    description: "Website disclaimer for Riad di Siena.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/disclaimer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
