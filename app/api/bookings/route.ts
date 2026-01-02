import { NextResponse } from "next/server";
import { getSheetData, appendToSheet, rowsToObjects } from "@/lib/sheets";
import { sendBookingEmails } from "@/lib/email";

export const revalidate = 0;

export async function GET() {
  try {
    const rows = await getSheetData("Bookings");
    const bookings = rowsToObjects(rows);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const bookingId = `RDS-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Handle both old form submissions and new PayPal bookings
    const {
      // Common fields
      firstName,
      lastName,
      email,
      phone,
      message,
      guests,
      total,
      // Room bookings
      room,
      roomId,
      checkIn,
      checkOut,
      nights,
      // Property bookings (Kasbah, Desert)
      property,
      tent,
      tentId,
      tentLevel,
      experience,
      experienceId,
      // PayPal
      paypalOrderId,
      paypalStatus,
      // Legacy fields
      name,
      roomPreference,
    } = body;

    const guestFirstName = firstName || name?.split(" ")[0] || "";
    const guestLastName = lastName || name?.split(" ").slice(1).join(" ") || "";
    const propertyName = property || "Riad di Siena";
    const accommodationName = room || tent || experience || roomPreference || "";

    // Store all booking data as JSON for flexibility
    const bookingData = JSON.stringify({
      firstName: guestFirstName,
      lastName: guestLastName,
      email,
      phone,
      message,
      guests,
      total,
      room,
      roomId,
      checkIn,
      checkOut,
      nights,
      property: propertyName,
      tent,
      tentId,
      tentLevel,
      experience,
      experienceId,
      paypalOrderId,
      paypalStatus,
      roomPreference,
    });

    const success = await appendToSheet("Bookings", [
      [
        bookingId,
        timestamp,
        guestFirstName,
        guestLastName,
        email,
        phone || "",
        checkIn || "",
        checkOut || "",
        guests || "",
        total || "",
        paypalStatus || "PENDING",
        paypalOrderId || "",
        accommodationName,
        propertyName,
        bookingData,
      ]
    ]);

    if (success) {
      // Send confirmation emails if payment was successful
      if (paypalStatus === "COMPLETED" && email) {
        try {
          await sendBookingEmails({
            bookingId,
            firstName: guestFirstName,
            lastName: guestLastName,
            email,
            phone,
            property: propertyName,
            room,
            tent,
            experience,
            checkIn,
            checkOut,
            nights: nights || 1,
            guests: guests || 1,
            total: total || 0,
            paypalOrderId,
            message,
          });
        } catch (emailError) {
          console.error("Failed to send booking emails:", emailError);
          // Don't fail the booking if email fails
        }
      }
      
      return NextResponse.json({ success: true, bookingId });
    } else {
      return NextResponse.json({ success: false, error: "Failed to save booking" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
