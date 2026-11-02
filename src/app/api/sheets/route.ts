import { NextRequest, NextResponse } from 'next/server';
import { fetchGoogleSheetCSV } from '@/lib/sheets';
import { parseCSV, computeDashboardMetrics } from '@/lib/parser';
import { DEFAULT_CSV_TEXT, DEFAULT_RAW_RECORDS } from '@/lib/defaultData';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const defaultSheet = 'https://docs.google.com/spreadsheets/d/1aPuNopIwNKeN3HlA413IFbjG2feiNGuKvQ6PJA2y8UM/edit?usp=sharing';
  const sheetInput = searchParams.get('url') || searchParams.get('id') || process.env.GOOGLE_SHEET_URL || process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || defaultSheet;
  const yearParam = searchParams.get('year');
  const selectedYear = yearParam && yearParam !== 'all' ? parseInt(yearParam, 10) : 'all';

  if (!sheetInput) {
    // Return default parsed Sisaket dataset
    const metrics = computeDashboardMetrics(DEFAULT_RAW_RECORDS, selectedYear, 'local-cached');
    return NextResponse.json({
      success: true,
      mode: 'default',
      metrics,
    });
  }

  try {
    // Fetch live on-the-fly from Google Sheets
    const csvContent = await fetchGoogleSheetCSV(sheetInput);
    const records = parseCSV(csvContent);

    if (records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบข้อมูลแถวใน Google Sheet กรุณาตรวจสอบหัวตาราง (ปี, อำเภอ, หมู่บ้าน/ชุมชน, ผู้ป่วยเข้ารับบำบัด)',
        },
        { status: 400 }
      );
    }

    const metrics = computeDashboardMetrics(records, selectedYear, 'google-sheets', sheetInput, sheetInput);

    return NextResponse.json({
      success: true,
      mode: 'google-sheets',
      sourceUrl: sheetInput,
      rowCount: records.length,
      metrics,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก Google Sheet';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvText, selectedYear = 'all', sheetUrl } = body;

    let records = DEFAULT_RAW_RECORDS;
    let source: 'google-sheets' | 'local-cached' = 'local-cached';

    if (csvText && typeof csvText === 'string') {
      records = parseCSV(csvText);
      source = 'google-sheets';
    }

    const yr = selectedYear && selectedYear !== 'all' ? parseInt(selectedYear, 10) : 'all';
    const metrics = computeDashboardMetrics(records, yr, source, sheetUrl, sheetUrl);

    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการประมวลผลข้อมูล';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
