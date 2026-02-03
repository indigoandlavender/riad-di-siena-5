import { NextResponse } from "next/server";
import { appendToOpsSheet } from "@/lib/sheets";
import { sendBookingEmails, sendContactEmail } from "@/lib/email";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const bookingId = `RDS-${Date.now()}`;

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
      // New fields from BookingModal
      itemName,
      totalEUR,
      units,
      paypalTransactionId,
    } = body;

    const guestFirstName = firstName || name?.split(" ")[0] || "";
    const guestLastName = lastName || name?.split(" ").slice(1).join(" ") || "";
    const propertyName = property || "Riad di Siena";
    const accommodationName = room || tent || experience || roomPreference || itemName || "";
    const finalTotal = total || totalEUR || 0;
    const finalNights = parseInt(String(nights)) || 1;
    const finalGuests = parseInt(String(guests)) || 1;
    
    // Calculate checkOut if not provided but checkIn and nights are
    let finalCheckOut = checkOut || "";
    if (!finalCheckOut && checkIn && finalNights > 0) {
      try {
        const checkInDate = new Date(checkIn);
        checkInDate.setDate(checkInDate.getDate() + finalNights);
        finalCheckOut = checkInDate.toISOString().split("T")[0];
      } catch (e) {
        console.error("Failed to calculate checkOut:", e);
      }
    }

    // Write directly to OPS Master_Guests (single source of truth)
    let opsSuccess = false;
    if (checkIn) {
      opsSuccess = await appendToOpsSheet({
        bookingId,
        firstName: guestFirstName,
        lastName: guestLastName,
        email,
        phone,
        property: propertyName,
        room: accommodationName,
        checkIn,
        checkOut: finalCheckOut,
        nights: finalNights,
        guests: finalGuests,
        total: parseFloat(String(finalTotal)) || 0,
        message,
      });
      
      if (!opsSuccess) {
        console.error("Failed to write to OPS Master_Guests");
        return NextResponse.json({ success: false, error: "Failed to save booking" }, { status: 500 });
      }
    }

    if (opsSuccess || !checkIn) {
      // Send confirmation emails if payment was successful
      if ((paypalStatus === "COMPLETED" || paypalTransactionId) && email) {
        try {
          const totalNumber = parseFloat(String(finalTotal)) || 0;
          await sendBookingEmails({
            bookingId,
            firstName: guestFirstName,
            lastName: guestLastName,
            email,
            phone,
            property: propertyName,
            room: accommodationName,
            tent,
            experience,
            checkIn,
            checkOut: finalCheckOut,
            nights: finalNights,
            guests: finalGuests,
            total: totalNumber,
            paypalOrderId: paypalOrderId || paypalTransactionId,
            message,
          });
          console.log("Booking emails sent to guest and happy@riaddisiena.com");
        } catch (emailError) {
          console.error("Failed to send booking emails:", emailError);
          // Don't fail the booking if email fails
        }
      }
      
      // Send contact form email (no payment, just a message)
      if (!paypalStatus && !paypalTransactionId && !checkIn && message && email) {
        try {
          await sendContactEmail({
            name: `${guestFirstName} ${guestLastName}`.trim(),
            email,
            phone,
            message,
          });
        } catch (emailError) {
          console.error("Failed to send contact email:", emailError);
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
