import { NextResponse } from "next/server";
import { getSheetData, rowsToObjects } from "@/lib/sheets";

export const dynamic = "force-dynamic";

interface TrainingItem {
  Category: string;
  Question: string;
  Answer: string;
  Answer_FR?: string;
  Answer_ES?: string;
  Answer_IT?: string;
  Answer_PT?: string;
  Answer_AR?: string;
  Keywords: string;
  Order: string;
}

interface ChatRequest {
  message: string;
  language?: string;
  history?: { role: string; content: string }[];
}

// Get answer in the requested language
function getLocalizedAnswer(item: TrainingItem, language: string): string {
  switch (language) {
    case "fr": return item.Answer_FR || item.Answer;
    case "es": return item.Answer_ES || item.Answer;
    case "it": return item.Answer_IT || item.Answer;
    case "pt": return item.Answer_PT || item.Answer;
    case "ar": return item.Answer_AR || item.Answer;
    default: return item.Answer;
  }
}

// Simple keyword matching to find relevant answers
function findBestMatch(query: string, training: TrainingItem[]): TrainingItem | null {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  let bestMatch: TrainingItem | null = null;
  let bestScore = 0;

  for (const item of training) {
    let score = 0;
    
    // Check keywords
    if (item.Keywords) {
      const keywords = item.Keywords.toLowerCase().split(",").map(k => k.trim());
      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) {
          score += 3; // Higher weight for keyword matches
        }
      }
    }
    
    // Check question similarity
    if (item.Question) {
      const questionWords = item.Question.toLowerCase().split(/\s+/);
      for (const word of queryWords) {
        if (word.length > 2 && questionWords.some(qw => qw.includes(word) || word.includes(qw))) {
          score += 1;
        }
      }
    }
    
    // Check if query contains category
    if (item.Category && queryLower.includes(item.Category.toLowerCase())) {
      score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  // Only return if we have a reasonable match
  return bestScore >= 2 ? bestMatch : null;
}

export async function GET() {
  try {
    const rows = await getSheetData("Chatbot_Training");
    const training = rowsToObjects<TrainingItem>(rows);
    
    // Return training data (for debugging or client-side use)
    return NextResponse.json({ 
      training: training.sort((a, b) => parseInt(a.Order || "0") - parseInt(b.Order || "0"))
    });
  } catch (error) {
    console.error("Error fetching chatbot training:", error);
    return NextResponse.json({ training: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { message, language = "en", history }: ChatRequest = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Fetch training data
    const rows = await getSheetData("Chatbot_Training");
    const training = rowsToObjects<TrainingItem>(rows);
    
    // Get system prompt / personality from training data
    const systemItem = training.find(t => t.Category?.toLowerCase() === "system");
    const greetingItem = training.find(t => t.Category?.toLowerCase() === "greeting");
    
    // Check for greeting
    const greetingWords = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "salaam", "bonjour", "hola", "ciao", "olá", "مرحبا", "السلام عليكم"];
    const isGreeting = greetingWords.some(g => message.toLowerCase().trim().startsWith(g));
    
    if (isGreeting && greetingItem) {
      return NextResponse.json({ 
        response: getLocalizedAnswer(greetingItem, language),
        category: "greeting"
      });
    }

    // Find best matching answer
    const match = findBestMatch(message, training.filter(t => t.Category?.toLowerCase() !== "system"));
    
    if (match) {
      return NextResponse.json({ 
        response: getLocalizedAnswer(match, language),
        category: match.Category,
        matched_question: match.Question
      });
    }

    // Default fallback response
    const fallbackItem = training.find(t => t.Category?.toLowerCase() === "fallback");
    const fallbackResponse = fallbackItem 
      ? getLocalizedAnswer(fallbackItem, language)
      : "I'd be happy to help you with that. For specific inquiries about rooms, availability, or bookings, please reach out to us directly through our contact page or WhatsApp. Is there anything else about Riad di Siena I can help you with?";

    return NextResponse.json({ 
      response: fallbackResponse,
      category: "fallback"
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json({ 
      response: "I apologize, but I'm having trouble right now. Please try again or contact us directly.",
      error: true 
    }, { status: 500 });
  }
}
