import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const bookingId = `RDS-${Date.now()}`;

    const {
      firstName,
      lastName,
      email,
      phone,
      message,
      guests,
      total,
      room,
      checkIn,
      checkOut,
      nights,
      property,
      itemName,
      totalEUR,
      units,
      paypalTransactionId,
    } = body;

    const guestFirstName = firstName || "";
    const guestLastName = lastName || "";
    const propertyName = property || "Riad di Siena";
    const accommodationName = room || itemName || "";
    const finalTotal = total || totalEUR || 0;
    const finalNights = parseInt(String(nights)) || 1;
    const finalGuests = parseInt(String(guests)) || 1;
    
    // Calculate checkOut if not provided
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

    // Send to Make.com webhook - handles Sheet write + emails
    const webhookUrl = process.env.MAKE_BOOKING_WEBHOOK_URL;
    
    if (webhookUrl && checkIn) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            booking_id: bookingId,
            source: "Website",
            status: "confirmed",
            first_name: guestFirstName,
            last_name: guestLastName,
            email,
            phone: phone || "",
            property: propertyName,
            room: accommodationName,
            check_in: checkIn,
            check_out: finalCheckOut,
            nights: finalNights,
            guests: finalGuests,
            total_eur: parseFloat(String(finalTotal)) || 0,
            special_requests: message || "",
            paypal_transaction_id: paypalTransactionId || "",
            created_at: new Date().toISOString(),
          }),
        });
        console.log("Booking sent to Make.com webhook");
      } catch (webhookError) {
        console.error("Make.com webhook failed:", webhookError);
        // Don't fail the booking if webhook fails - guest already paid
      }
    }
    
    return NextResponse.json({ success: true, bookingId });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
