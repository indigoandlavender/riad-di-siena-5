import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Riad di Siena privacy policy. How we collect, use, and protect your personal information when you book or contact us.",
  openGraph: {
    title: "Privacy Policy | Riad di Siena",
    description: "How Riad di Siena protects your personal information.",
  },
  alternates: {
    canonical: "https://riaddisiena.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
