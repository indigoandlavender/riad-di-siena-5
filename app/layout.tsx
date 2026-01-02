import type { Metadata } from 'next'
import Script from 'next/script'
import { CurrencyProvider } from '@/components/CurrencyContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Chatbot from '@/components/Chatbot'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://riaddisiena.com"),
  title: {
    default: "Riad di Siena | Marrakech Medina",
    template: "%s | Riad di Siena",
  },
  description: "A 300-year-old sanctuary in the heart of Marrakech medina. Four rooms, a courtyard fountain, rooftop views of the Atlas. Not a hotel—a home with soul.",
  keywords: ["riad marrakech", "marrakech medina", "riad morocco", "traditional moroccan house", "marrakech accommodation", "riad with courtyard"],
  authors: [{ name: "Riad di Siena" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://riaddisiena.com",
    siteName: "Riad di Siena",
    title: "Riad di Siena | Marrakech Medina",
    description: "A 300-year-old sanctuary in the heart of Marrakech medina. Four rooms, a courtyard fountain, rooftop views of the Atlas. Not a hotel—a home with soul.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Riad di Siena courtyard with traditional zellige fountain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riad di Siena | Marrakech Medina",
    description: "A 300-year-old sanctuary in the heart of Marrakech medina. Four rooms, a courtyard fountain, rooftop views of the Atlas.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: "https://riaddisiena.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": "https://riaddisiena.com/#lodgingbusiness",
  "name": "Riad di Siena",
  "description": "A 300-year-old traditional Moroccan riad in the heart of Marrakech medina. Four uniquely designed rooms around a courtyard with zellige fountain, rooftop terrace with Atlas Mountain views.",
  "url": "https://riaddisiena.com",
  "telephone": "+212-524-391723",
  "email": "happy@riaddisiena.com",
  "image": [
    "https://riaddisiena.com/og-image.jpg"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "37 Derb Fhal Zfriti, Kennaria",
    "addressLocality": "Marrakech",
    "addressRegion": "Marrakech-Safi",
    "postalCode": "40000",
    "addressCountry": "MA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 31.6295,
    "longitude": -7.9811
  },
  "priceRange": "€80-€150",
  "currenciesAccepted": "EUR, MAD",
  "paymentAccepted": "PayPal, Credit Card, Cash",
  "checkinTime": "14:00",
  "checkoutTime": "11:00",
  "numberOfRooms": 4,
  "petsAllowed": false,
  "starRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5"
  },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Rooftop Terrace", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Traditional Breakfast Included", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Courtyard", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Airport Transfer Available", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Concierge Service", "value": true }
  ],
  "sameAs": [
    "https://www.instagram.com/riaddisiena"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V48C7J04GJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V48C7J04GJ');
          `}
        </Script>
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify(structuredData)}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <CurrencyProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Chatbot />
        </CurrencyProvider>
      </body>
    </html>
  )
}
