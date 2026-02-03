import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;

// Convert Google Drive URLs to direct image URLs
export function convertDriveUrl(url: string): string {
  if (!url) return "";
  
  // Already a direct URL (not Google Drive)
  if (!url.includes("drive.google.com")) return url;
  
  // Extract file ID from various Google Drive URL formats
  let fileId = "";
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    // Return thumbnail URL with large size (w1600 = 1600px width)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }
  
  // If no match, return original URL
  return url;
}

async function getAuthClient() {
  // Support both formats:
  // 1. GOOGLE_SERVICE_ACCOUNT_BASE64 (full JSON base64 encoded) - like Slow Morocco
  // 2. GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY_BASE64 (separate values)
  
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    // Decode the full service account JSON
    const serviceAccountJson = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString("utf-8");
    const serviceAccount = JSON.parse(serviceAccountJson);
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    
    return auth;
  }
  
  // Fallback to separate env vars
  const privateKey = process.env.GOOGLE_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.GOOGLE_PRIVATE_KEY_BASE64, "base64").toString("utf-8")
    : undefined;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth;
}

export async function getSheetData(sheetName: string): Promise<string[][]> {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: sheetName,
    });

    return response.data.values || [];
  } catch (error) {
    console.error(`Error fetching ${sheetName}:`, error);
    return [];
  }
}

export async function appendToSheet(sheetName: string, values: string[][]) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: sheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return true;
  } catch (error) {
    console.error(`Error appending to ${sheetName}:`, error);
    return false;
  }
}

// Convert rows to objects using header row as keys
export function rowsToObjects<T>(rows: string[][]): T[] {
  if (rows.length < 2) return [];
  
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj as T;
  });
}

// Get a single setting value
export async function getSetting(key: string): Promise<string | null> {
  const rows = await getSheetData("Settings");
  const settings = rowsToObjects<{ Key: string; Value: string }>(rows);
  const setting = settings.find((s) => s.Key === key);
  return setting?.Value || null;
}

// Get all settings as an object
export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await getSheetData("Settings");
  const settings = rowsToObjects<{ Key: string; Value: string }>(rows);
  const obj: Record<string, string> = {};
  settings.forEach((s) => {
    obj[s.Key] = s.Value;
  });
  return obj;
}

// Content types
export interface ContentBlock {
  Page: string;
  Section: string;
  Title: string;
  Subtitle: string;
  Body: string;
  Image_URL: string;
  Order: string;
}

// Get content for a specific page
export async function getPageContent(page: string): Promise<Record<string, ContentBlock>> {
  const rows = await getSheetData("Content");
  const allContent = rowsToObjects<ContentBlock>(rows);
  const pageContent = allContent.filter((c) => c.Page === page);
  
  const obj: Record<string, ContentBlock> = {};
  pageContent.forEach((c) => {
    // Convert Google Drive URLs to direct URLs
    if (c.Image_URL) {
      c.Image_URL = convertDriveUrl(c.Image_URL);
    }
    obj[c.Section] = c;
  });
  return obj;
}

// Alias for appendToSheet (some files use this name)
export const appendSheetData = appendToSheet;

// Update a specific row in a sheet
export async function updateSheetRow(sheetName: string, rowIndex: number, values: string[]) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    // rowIndex is 0-based from data, but sheets are 1-based and have header row
    // So row 0 in data = row 2 in sheet (row 1 is header)
    const sheetRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${sheetName}!A${sheetRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });

    return true;
  } catch (error) {
    console.error(`Error updating row in ${sheetName}:`, error);
    return false;
  }
}

// Get data from Nexus sheet
const NEXUS_SHEET_ID = process.env.NEXUS_SHEET_ID;

export async function getNexusData(sheetName: string): Promise<string[][]> {
  if (!NEXUS_SHEET_ID) {
    console.warn("NEXUS_SHEET_ID not configured, returning empty data");
    return [];
  }
  
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: sheetName,
    });

    return response.data.values || [];
  } catch (error) {
    console.error(`Error fetching Nexus ${sheetName}:`, error);
    return [];
  }
}
