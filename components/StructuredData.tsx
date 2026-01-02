export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Riad di Siena",
    description: "A 300-year-old house in the heart of Marrakech medina. Not a hotel — a house with soul.",
    url: "https://riaddisiena.com",
    telephone: "+212618070450",
    email: "happy@riaddisiena.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "35 Derb Fhal Zfriti Kennaria",
      addressLocality: "Marrakech",
      postalCode: "40000",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.6295,
      longitude: -7.9811,
    },
    image: "https://riaddisiena.com/og-image.jpg",
    priceRange: "€75 - €110",
    starRating: {
      "@type": "Rating",
      ratingValue: "5",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free WiFi" },
      { "@type": "LocationFeatureSpecification", name: "Breakfast Included" },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning" },
      { "@type": "LocationFeatureSpecification", name: "Rooftop Terrace" },
    ],
    checkInTime: "14:00",
    checkOutTime: "11:00",
    numberOfRooms: 6,
    petsAllowed: false,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
