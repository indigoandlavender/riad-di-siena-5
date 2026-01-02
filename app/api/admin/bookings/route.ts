import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects, appendToSheet } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await getSheetData("Bookings");
    const rawBookings = rowsToObjects(rows);
    
    // Parse the bookings data - handle both old and new format
    const bookings = rawBookings.map((row: any) => {
      // If there's a Booking_Data column with JSON, parse it and merge
      if (row.Booking_Data) {
        try {
          const bookingData = JSON.parse(row.Booking_Data);
          return {
            Booking_ID: row.Booking_ID,
            Timestamp: row.Timestamp,
            ...bookingData,
          };
        } catch {
          // If JSON parsing fails, return raw row
          return {
            Booking_ID: row.Booking_ID,
            Timestamp: row.Timestamp,
            firstName: row.First_Name || row.firstName || "",
            lastName: row.Last_Name || row.lastName || "",
            email: row.Email || row.email || "",
            phone: row.Phone || row.phone || "",
            checkIn: row.Check_In || row.checkIn || "",
            checkOut: row.Check_Out || row.checkOut || "",
            guests: row.Guests || row.guests || "",
            total: row.Total || row.total || "",
            paypalStatus: row.PayPal_Status || row.paypalStatus || row.Status || "PENDING",
            paypalOrderId: row.PayPal_Order_ID || row.paypalOrderId || "",
            room: row.Room || row.room || "",
            property: row.Property || row.property || "Riad di Siena",
            source: row.Source || row.source || "",
            notes: row.Notes || row.notes || "",
          };
        }
      }
      
      // Handle rows without Booking_Data (old format or simple rows)
      return {
        Booking_ID: row.Booking_ID,
        Timestamp: row.Timestamp,
        firstName: row.First_Name || row.firstName || "",
        lastName: row.Last_Name || row.lastName || "",
        email: row.Email || row.email || "",
        phone: row.Phone || row.phone || "",
        checkIn: row.Check_In || row.checkIn || "",
        checkOut: row.Check_Out || row.checkOut || "",
        guests: row.Guests || row.guests || "",
        total: row.Total || row.total || "",
        paypalStatus: row.PayPal_Status || row.paypalStatus || row.Status || "PENDING",
        paypalOrderId: row.PayPal_Order_ID || row.paypalOrderId || "",
        room: row.Room || row.room || "",
        property: row.Property || row.property || "Riad di Siena",
        source: row.Source || row.source || "",
        notes: row.Notes || row.notes || "",
      };
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json({ bookings: [], error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create booking data object
    const bookingData = {
      property: data.property || "",
      room: data.room || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      checkIn: data.checkIn || "",
      checkOut: data.checkOut || "",
      guests: data.guests || 1,
      total: data.total || 0,
      paypalStatus: data.paypalStatus || "COMPLETED",
      source: data.source || "manual",
      notes: data.notes || "",
    };

    // Append to sheet
    await appendToSheet("Bookings", [[
      data.Booking_ID || `MANUAL-${Date.now()}`,
      data.Timestamp || new Date().toISOString(),
      JSON.stringify(bookingData),
    ]]);

    return NextResponse.json({ success: true, booking_id: data.Booking_ID });
  } catch (error) {
    console.error("Failed to add booking:", error);
    return NextResponse.json({ error: "Failed to add booking" }, { status: 500 });
  }
}
