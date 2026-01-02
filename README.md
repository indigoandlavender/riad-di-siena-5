# Riad di Siena

A 300-year-old guesthouse in the heart of Marrakech medina. Not a hotel—a house with soul.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: Playfair Display + Inter
- **Database**: Google Sheets
- **Hosting**: Vercel

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in values
4. Run development server: `npm run dev`

## Environment Variables

```
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY_BASE64=your-base64-encoded-private-key
NEXT_PUBLIC_SITE_URL=https://riaddisiena.com
```

## Google Sheets Structure

The site pulls content from these sheets:

- **Rooms**: Room listings with prices and features
- **House_Rules**: Guidelines for guests
- **Directions**: Step-by-step walking directions
- **Settings**: Site configuration
- **Bookings**: Booking inquiries

## Pages

- `/` - Homepage
- `/the-riad` - About the property
- `/rooms` - Room listings (dynamic from Sheets)
- `/amenities` - What's included
- `/philosophy` - Wabi-sabi and values
- `/contact` - Booking inquiry form
- `/faq` - Frequently asked questions
- `/house-rules` - Guidelines (dynamic from Sheets)
- `/directions` - Walking directions (dynamic from Sheets, hidden from nav)
- `/disclaimer` - Booking disclaimer
- `/booking-conditions` - Terms for booking
- `/privacy` - Privacy policy
- `/terms` - Terms & conditions
- `/journeys` - Placeholder for Slow Morocco integration

## Deployment

Push to GitHub, connect to Vercel, add environment variables.
