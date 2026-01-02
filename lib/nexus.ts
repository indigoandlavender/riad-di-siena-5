import { google } from "googleapis";

const NEXUS_SHEET_ID = process.env.NEXUS_SHEET_ID;
const SITE_ID = process.env.SITE_ID || "riad-di-siena";

// Cache for site config to avoid repeated API calls
let siteConfigCache: SiteConfig | null = null;
let siteConfigCacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getAuthClient() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
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
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    
    return auth;
  }
  
  throw new Error("No Google service account credentials found");
}

export async function getNexusSheetData(sheetName: string): Promise<string[][]> {
  if (!NEXUS_SHEET_ID) {
    console.error("NEXUS_SHEET_ID not configured");
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

// Site configuration from Nexus
export interface SiteConfig {
  site_id: string;
  site_name: string;
  site_url: string;
  legal_entity: string;
  contact_email: string;
  contact_phone: string;
  whatsapp: string;
  jurisdiction_country: string;
  jurisdiction_city: string;
  address_line1: string;
  address_line2: string;
  site_type: string;
  parent_brand: string;
  year_founded: string;
  currency_default: string;
  language_default: string;
}

// Get site config from Nexus Sites tab
export async function getSiteConfig(): Promise<SiteConfig | null> {
  // Check cache first
  if (siteConfigCache && Date.now() - siteConfigCacheTime < CACHE_TTL) {
    return siteConfigCache;
  }

  try {
    const rows = await getNexusSheetData("Sites");
    const sites = rowsToObjects<SiteConfig>(rows);
    const siteConfig = sites.find((s) => s.site_id === SITE_ID);
    
    if (siteConfig) {
      siteConfigCache = siteConfig;
      siteConfigCacheTime = Date.now();
    }
    
    return siteConfig || null;
  } catch (error) {
    console.error("Error fetching site config:", error);
    return null;
  }
}

// Replace template variables with site-specific values from Nexus
export async function replaceTemplateVariables(content: string): Promise<string> {
  const siteConfig = await getSiteConfig();
  
  if (!siteConfig) {
    // Fallback to env vars if Nexus unavailable
    const fallbackVars: Record<string, string> = {
      "{{site_name}}": process.env.NEXT_PUBLIC_SITE_NAME || "Riad di Siena",
      "{{site_url}}": process.env.NEXT_PUBLIC_SITE_URL || "https://riaddisiena.com",
      "{{legal_entity}}": process.env.NEXT_PUBLIC_LEGAL_ENTITY || "Riad di Siena",
      "{{contact_email}}": process.env.NEXT_PUBLIC_CONTACT_EMAIL || "happy@riaddisiena.com",
      "{{jurisdiction_country}}": process.env.NEXT_PUBLIC_JURISDICTION_COUNTRY || "Morocco",
      "{{jurisdiction_city}}": process.env.NEXT_PUBLIC_JURISDICTION_CITY || "Marrakech",
      "{{address_line1}}": process.env.NEXT_PUBLIC_ADDRESS_LINE1 || "35 Derb Fhal Zfriti, Kennaria",
      "{{address_line2}}": process.env.NEXT_PUBLIC_ADDRESS_LINE2 || "Marrakech 40000, Morocco",
    };
    
    let result = content;
    for (const [placeholder, value] of Object.entries(fallbackVars)) {
      result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    return result;
  }

  // Map site config to template variables
  const templateVars: Record<string, string> = {
    "{{site_name}}": siteConfig.site_name,
    "{{site_url}}": siteConfig.site_url,
    "{{legal_entity}}": siteConfig.legal_entity,
    "{{contact_email}}": siteConfig.contact_email,
    "{{contact_phone}}": siteConfig.contact_phone,
    "{{whatsapp}}": siteConfig.whatsapp,
    "{{jurisdiction_country}}": siteConfig.jurisdiction_country,
    "{{jurisdiction_city}}": siteConfig.jurisdiction_city,
    "{{address_line1}}": siteConfig.address_line1,
    "{{address_line2}}": siteConfig.address_line2,
    "{{year_founded}}": siteConfig.year_founded,
  };

  let result = content;
  for (const [placeholder, value] of Object.entries(templateVars)) {
    result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  return result;
}

// Get legal page content from Nexus
export interface LegalSection {
  page_id: string;
  page_title: string;
  section_order: string;
  section_title: string;
  section_content: string;
}

export async function getLegalPageContent(pageId: string): Promise<{
  title: string;
  sections: { title: string; content: string }[];
}> {
  const rows = await getNexusSheetData("Nexus_Legal_Pages");
  const allSections = rowsToObjects<LegalSection>(rows);
  
  // Filter by page_id
  const pageSections = allSections
    .filter((s) => s.page_id === pageId)
    .sort((a, b) => parseInt(a.section_order) - parseInt(b.section_order));

  if (pageSections.length === 0) {
    return { title: "", sections: [] };
  }

  const title = pageSections[0].page_title;
  const sections = await Promise.all(
    pageSections.map(async (s) => ({
      title: s.section_title,
      content: await replaceTemplateVariables(s.section_content),
    }))
  );

  return { title, sections };
}

// Get legal templates list
export interface LegalTemplate {
  template_id: string;
  title: string;
  site_types: string;
  last_updated: string;
}

export async function getLegalTemplates(): Promise<LegalTemplate[]> {
  const rows = await getNexusSheetData("Legal_Templates");
  return rowsToObjects<LegalTemplate>(rows);
}

// Get currencies from Nexus
export interface NexusCurrency {
  currency_code: string;
  currency_symbol: string;
  currency_label: string;
  show_for_site_types: string;
}

export async function getNexusCurrencies(): Promise<NexusCurrency[]> {
  const rows = await getNexusSheetData("Nexus_Currencies");
  return rowsToObjects<NexusCurrency>(rows);
}

// Get languages from Nexus
export interface NexusLanguage {
  language_code: string;
  language_label: string;
  native_label: string;
  rtl: string;
  enabled_default: string;
}

export async function getNexusLanguages(): Promise<NexusLanguage[]> {
  const rows = await getNexusSheetData("Nexus_Languages");
  return rowsToObjects<NexusLanguage>(rows);
}

// Get site type configuration
export interface SiteType {
  type_id: string;
  type_name: string;
  show_currency: string;
  legal_pages: string;
}

export async function getSiteTypes(): Promise<SiteType[]> {
  const rows = await getNexusSheetData("Site_Types");
  return rowsToObjects<SiteType>(rows);
}

// Helper to get site ID
export function getSiteId(): string {
  return SITE_ID;
}

// Get legal page by slug (privacy, terms, etc.)
export async function getLegalPageBySlug(slug: string): Promise<{ title: string; content: string } | null> {
  try {
    const pageContent = await getLegalPageContent(slug);
    
    if (!pageContent.title && pageContent.sections.length === 0) {
      return null;
    }
    
    // Combine all sections into one HTML content
    const content = pageContent.sections
      .map((s) => `<h2>${s.title}</h2>\n${s.content}`)
      .join('\n\n');
    
    return {
      title: pageContent.title,
      content,
    };
  } catch (error) {
    console.error(`Error fetching legal page ${slug}:`, error);
    return null;
  }
}

// Get footer links from Nexus
export interface NexusFooterLink {
  brand_id: string;
  column_number: string;
  column_title: string;
  link_order: string;
  link_label: string;
  link_href: string;
  link_type: string;
}

export async function getNexusFooterLinks(brandId?: string): Promise<NexusFooterLink[]> {
  const rows = await getNexusSheetData("Nexus_Footer_Links");
  const allLinks = rowsToObjects<NexusFooterLink>(rows);
  
  // Filter by brand_id if provided, otherwise use SITE_ID
  const targetBrand = brandId || SITE_ID;
  return allLinks.filter((link) => link.brand_id === targetBrand);
}
