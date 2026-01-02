import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface BookedRange {
  start: string;
  end: string;
  summary?: string;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ 
      error: "No URL provided",
      bookedDates: [],
      debug: { message: "Missing url parameter" }
    }, { status: 400 });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ 
      error: "Invalid URL format",
      bookedDates: [],
      debug: { message: "URL validation failed", url }
    }, { status: 400 });
  }

  try {
    console.log("[iCal] Fetching:", url);
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/calendar, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
      // Add timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error("[iCal] Fetch failed:", response.status, response.statusText);
      return NextResponse.json({ 
        error: "Failed to fetch iCal",
        bookedDates: [],
        debug: { 
          status: response.status, 
          statusText: response.statusText,
          url: url.substring(0, 50) + "..."
        }
      }, { status: 200 }); // Return 200 so frontend doesn't break
    }

    const icalData = await response.text();
    
    // Check if response is actually iCal format
    if (!icalData.includes("BEGIN:VCALENDAR")) {
      console.error("[iCal] Invalid format - not iCal data");
      return NextResponse.json({ 
        error: "Invalid iCal format",
        bookedDates: [],
        debug: { 
          message: "Response is not valid iCal format",
          preview: icalData.substring(0, 200)
        }
      }, { status: 200 });
    }
    
    console.log("[iCal] Data length:", icalData.length, "bytes");
    
    // Parse iCal data to extract booked date ranges
    const bookedDates: BookedRange[] = [];
    const lines = icalData.split(/\r?\n/);
    let inEvent = false;
    let startDate = "";
    let endDate = "";
    let summary = "";
    let eventCount = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Handle line continuations (lines starting with space/tab)
      while (i + 1 < lines.length && (lines[i + 1].startsWith(" ") || lines[i + 1].startsWith("\t"))) {
        i++;
        line += lines[i].trim();
      }
      
      if (line === "BEGIN:VEVENT") {
        inEvent = true;
        eventCount++;
        startDate = "";
        endDate = "";
        summary = "";
      } else if (line === "END:VEVENT") {
        if (startDate) {
          // If no end date, assume 1 day booking
          if (!endDate) {
            const start = new Date(startDate);
            start.setDate(start.getDate() + 1);
            endDate = start.toISOString().split("T")[0];
          }
          bookedDates.push({
            start: startDate,
            end: endDate,
            summary: summary,
          });
        }
        inEvent = false;
      } else if (inEvent) {
        // Handle DTSTART with various formats
        // DTSTART:20251220 or DTSTART;VALUE=DATE:20251220 or DTSTART:20251220T140000Z
        if (line.startsWith("DTSTART")) {
          const match = line.match(/(\d{4})(\d{2})(\d{2})/);
          if (match) {
            startDate = `${match[1]}-${match[2]}-${match[3]}`;
          }
        } 
        // Handle DTEND with various formats
        else if (line.startsWith("DTEND")) {
          const match = line.match(/(\d{4})(\d{2})(\d{2})/);
          if (match) {
            endDate = `${match[1]}-${match[2]}-${match[3]}`;
          }
        }
        // Capture summary for debugging
        else if (line.startsWith("SUMMARY")) {
          summary = line.replace(/^SUMMARY:?/, "").trim();
        }
      }
    }

    console.log("[iCal] Parsed", bookedDates.length, "bookings from", eventCount, "events");

    return NextResponse.json({ 
      bookedDates,
      debug: {
        totalEvents: eventCount,
        parsedBookings: bookedDates.length,
        rawLength: icalData.length,
        source: url.includes("airbnb") ? "airbnb" : url.includes("booking") ? "booking.com" : "unknown"
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[iCal] Error:", errorMessage);
    
    // Check for timeout
    if (errorMessage.includes("timeout") || errorMessage.includes("aborted")) {
      return NextResponse.json({ 
        error: "Request timeout",
        bookedDates: [],
        debug: { message: "iCal fetch timed out after 10 seconds" }
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      error: "Server error",
      bookedDates: [],
      debug: { message: errorMessage }
    }, { status: 200 }); // Return 200 so frontend doesn't break
  }
}
