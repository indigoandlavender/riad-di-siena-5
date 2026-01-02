import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, convertDriveUrl, getAllSettings, getNexusData } from "@/lib/sheets";

export const revalidate = 0;

// Sheet name mapping (URL param -> actual sheet name)
const SHEET_MAP: Record<string, string> = {
  "amenities": "Amenities",
  "amenities-hero": "Amenities_Hero",
  "beyond-the-walls": "Beyond_The_Walls",
  "beyond-the-walls-hero": "Beyond_The_Walls_Hero",
  "booking-conditions": "Booking_Conditions",
  "content": "Content",
  "desert-content": "Desert_Content",
  "desert-gallery": "Desert_Gallery",
  "desert-hero": "Desert_Hero",
  "desert-tents": "Desert_Tents",
  "directions": "Directions",
  "directions-settings": "Directions_Settings",
  "disclaimer": "Disclaimer",
  "douaria-content": "Douaria_Content",
  "douaria-gallery": "Douaria_Gallery",
  "douaria-hero": "Douaria_Hero",
  "douaria-rooms": "Douaria_Rooms",
  "faq": "FAQ",
  "farm-content": "Farm_Content",
  "farm-hero": "Farm_Hero",
  "farm-produce": "Farm_Produce",
  "home": "Home",
  "house-rules": "House_Rules",
  "journeys": "Journeys",
  "kasbah-content": "Kasbah_Content",
  "kasbah-experience": "Kasbah_Experience",
  "kasbah-gallery": "Kasbah_Gallery",
  "kasbah-hero": "Kasbah_Hero",
  "philosophy": "Philosophy",
  "privacy": "Privacy",
  "rooms": "Rooms",
  "rooms-gallery": "Rooms_Gallery",
  "rooms-hero": "Rooms_Hero",
  "settings": "Settings",
  "terms": "Terms",
  "testimonials": "Testimonials",
  "the-riad": "The_Riad",
  // Nexus sheets
  "nexus-footer": "Footer",
  "nexus-legal": "Legal_Pages",
};

// Fields that contain image URLs and need conversion
const IMAGE_FIELDS = ["Image_URL", "heroImage", "image_url", "image"];

function processImageUrls(obj: Record<string, any>): Record<string, any> {
  const processed = { ...obj };
  for (const field of IMAGE_FIELDS) {
    if (processed[field]) {
      processed[field] = convertDriveUrl(processed[field]);
    }
  }
  return processed;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sheet: string }> }
) {
  try {
    const { sheet } = await params;
    const sheetName = SHEET_MAP[sheet];
    
    if (!sheetName) {
      return NextResponse.json({ error: "Unknown sheet" }, { status: 404 });
    }

    // Handle Nexus sheets separately
    if (sheet.startsWith("nexus-")) {
      return handleNexusSheet(request, sheet, sheetName);
    }

    // Handle special cases
    switch (sheet) {
      case "settings":
        return handleSettings();
      case "rooms":
        return handleRooms();
      case "the-riad":
        return handleTheRiad();
      case "directions":
        return handleDirections();
      default:
        return handleGenericSheet(sheetName);
    }
  } catch (error: any) {
    console.error("API sheets error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleGenericSheet(sheetName: string) {
  const rows = await getSheetData(sheetName);
  const data = rowsToObjects<Record<string, any>>(rows);
  const processed = data.map(processImageUrls);
  
  // Sort by Order field if present
  if (processed.length > 0 && "Order" in processed[0]) {
    processed.sort((a, b) => parseInt(a.Order || "0") - parseInt(b.Order || "0"));
  }
  
  // Return first item for "hero" sheets
  if (sheetName.toLowerCase().includes("hero")) {
    return NextResponse.json(processed[0] || {});
  }
  
  return NextResponse.json(processed);
}

async function handleSettings() {
  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

async function handleRooms() {
  const rows = await getSheetData("Rooms");
  const rooms = rowsToObjects<Record<string, any>>(rows);
  
  const processed = rooms.map((room) => ({
    ...room,
    Image_URL: convertDriveUrl(room.Image_URL || ""),
    features: room.Features ? room.Features.split(",").map((f: string) => f.trim()) : [],
  }));
  
  return NextResponse.json(processed);
}

async function handleTheRiad() {
  const rows = await getSheetData("The_Riad");
  const data = rowsToObjects<Record<string, any>>(rows);
  
  const processed = data.map((item) => ({
    ...item,
    Image_URL: convertDriveUrl(item.Image_URL || ""),
  })) as Record<string, any>[];
  
  // Group by section
  const sections: Record<string, any> = {};
  processed.forEach((item) => {
    if (item.Section) {
      sections[item.Section] = item;
    }
  });
  
  return NextResponse.json({ sections, items: processed });
}

async function handleDirections() {
  const rows = await getSheetData("Directions");
  const directions = rowsToObjects<Record<string, any>>(rows);
  
  // Group by building
  const byBuilding: Record<string, any[]> = {};
  directions.forEach((d) => {
    const building = d.Building || "main";
    if (!byBuilding[building]) byBuilding[building] = [];
    byBuilding[building].push({
      ...d,
      Image_URL: convertDriveUrl(d.Image_URL || ""),
    });
  });
  
  // Sort each building's steps by Order
  Object.keys(byBuilding).forEach((building) => {
    byBuilding[building].sort((a, b) => parseInt(a.Order || "0") - parseInt(b.Order || "0"));
  });
  
  return NextResponse.json(byBuilding);
}

async function handleNexusSheet(request: Request, sheet: string, sheetName: string) {
  if (sheet === "nexus-footer") {
    // Return footer config
    const rows = await getNexusData("Footer");
    if (rows.length < 2) {
      return NextResponse.json({ success: false });
    }
    
    // Simple key-value parsing
    const data = rowsToObjects<Record<string, any>>(rows);
    return NextResponse.json({ success: true, data });
  }
  
  if (sheet === "nexus-legal") {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    
    const rows = await getNexusData("Legal_Pages");
    const pages = rowsToObjects<Record<string, any>>(rows);
    
    if (page) {
      const found = pages.find((p) => p.slug === page || p.Slug === page);
      return NextResponse.json(found || { error: "Page not found" });
    }
    
    return NextResponse.json(pages);
  }
  
  return NextResponse.json({ error: "Unknown Nexus sheet" }, { status: 404 });
}
