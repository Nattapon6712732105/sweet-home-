/**
 * Default embedded Google Sheet URL (can be overridden via environment variable)
 */
export const DEFAULT_SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || process.env.GOOGLE_SHEET_URL || '';

/**
 * Extract Google Spreadsheet ID or normalize URL
 */
export function extractSpreadsheetId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an ID (alphanumeric, dashes, underscores, length > 20)
  if (/^[a-zA-Z0-9-_]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex for standard Google Sheets URL
  // e.g. https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
  const matchStandard = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (matchStandard && matchStandard[1]) {
    return matchStandard[1];
  }

  // Check if it's a published web CSV URL (2PACX-...)
  if (trimmed.includes('/spreadsheets/d/e/2PACX-')) {
    return trimmed; // Return full URL as special published key
  }

  return null;
}

/**
 * Get direct CSV fetch URL from spreadsheet ID or published URL
 */
export function getGoogleSheetCsvUrl(input: string, gid = '0'): string {
  const trimmed = input.trim();

  // If it's already a direct published CSV link
  if (trimmed.includes('pub?output=csv') || trimmed.includes('export?format=csv')) {
    return trimmed;
  }

  // If it is a published link like .../pubhtml or .../pub
  if (trimmed.includes('/spreadsheets/d/e/2PACX-')) {
    const base = trimmed.split('?')[0].replace(/\/pubhtml$/, '/pub').replace(/\/pub$/, '/pub');
    return `${base}?output=csv&gid=${gid}`;
  }

  const sheetId = extractSpreadsheetId(trimmed);
  if (!sheetId) {
    throw new Error('ไม่พบรหัส Google Spreadsheet ID ที่ถูกต้อง กรุณาตรวจสอบลิงก์ Google Sheet');
  }

  // Primary Google Sheets CSV export endpoint
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

/**
 * Fetch Google Sheet CSV data On-the-Fly (no-cache)
 */
export async function fetchGoogleSheetCSV(sheetUrlOrId: string): Promise<string> {
  const csvUrl = getGoogleSheetCsvUrl(sheetUrlOrId);

  // Fetch with cache: 'no-store' to guarantee on-the-fly real-time fetch
  const res = await fetch(csvUrl, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/csv, text/plain, */*',
    },
  });

  if (!res.ok) {
    // Attempt fallback with Google Visualization API
    const sheetId = extractSpreadsheetId(sheetUrlOrId);
    if (sheetId && !sheetId.startsWith('http')) {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      const fallbackRes = await fetch(gvizUrl, { cache: 'no-store' });
      if (fallbackRes.ok) {
        return await fallbackRes.text();
      }
    }
    throw new Error(`ไม่สามารถดึงข้อมูลจาก Google Sheet ได้ (HTTP ${res.status}): โปรดตรวจสอบว่าได้ตั้งค่าสิทธิ์ 'ทุกคนที่มีลิงก์มีสิทธิ์ดู' (Public view) หรือยัง`);
  }

  const text = await res.text();

  // Check if response looks like HTML login page instead of CSV
  if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
    throw new Error("Google Sheet นี้ยังไม่ได้เปิดสิทธิ์แชร์แบบสาธารณะ กรุณาตั้งค่า 'ทุกคนที่มีลิงก์ (มีสิทธิ์ดู)' ใน Google Drive");
  }

  return text;
}
