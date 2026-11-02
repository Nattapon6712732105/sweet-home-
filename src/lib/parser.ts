import { RawRecord, DistrictSummary, DashboardMetrics, YearSummary, RiskLevel } from './types';

/**
 * Parse CSV text from Google Sheet export or uploaded file on-the-fly
 */
export function parseCSV(csvText: string): RawRecord[] {
  if (!csvText || typeof csvText !== 'string') return [];

  // Remove Byte Order Mark (BOM) if present
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length < 2) return [];

  // Parse header
  const headerLine = lines[0];
  const headers = splitCSVLine(headerLine).map(h => h.trim().toLowerCase());

  // Find column indices
  let yearIdx = headers.findIndex(h => h.includes('ปี') || h.includes('year'));
  let districtIdx = headers.findIndex(h => h.includes('อำเภอ') || h.includes('district') || h.includes('amphoe'));
  let villageIdx = headers.findIndex(h => h.includes('หมู่บ้าน') || h.includes('ชุมชน') || h.includes('village') || h.includes('community'));
  let patientIdx = headers.findIndex(h => h.includes('ผู้ป่วย') || h.includes('บำบัด') || h.includes('patient') || h.includes('count') || h.includes('cases'));

  // Default fallback if indices not found by keyword
  if (yearIdx === -1) yearIdx = 0;
  if (districtIdx === -1) districtIdx = 1;
  if (villageIdx === -1) villageIdx = 2;
  if (patientIdx === -1) patientIdx = 3;

  const records: RawRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = splitCSVLine(lines[i]);
    if (row.length < 3) continue;

    const rawYear = row[yearIdx]?.trim();
    const rawDistrict = row[districtIdx]?.trim();
    const rawVillages = row[villageIdx]?.replace(/,/g, '').trim();
    const rawPatients = row[patientIdx]?.replace(/,/g, '').trim();

    if (!rawDistrict) continue;

    const year = parseInt(rawYear, 10);
    const villages = parseInt(rawVillages, 10) || 0;
    const patients = parseInt(rawPatients, 10) || 0;

    if (!isNaN(year)) {
      records.push({
        year,
        district: cleanDistrictName(rawDistrict),
        villages,
        patients,
      });
    }
  }

  return records;
}

/**
 * Split CSV line respecting double quotes
 */
function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Standardize district names in Sisaket
 */
function cleanDistrictName(name: string): string {
  let cleaned = name.trim();
  // Strip common prefixes if someone writes "อ.เมืองศรีสะเกษ" or "อำเภอเมืองศรีสะเกษ"
  if (cleaned.startsWith('อำเภอ')) {
    cleaned = cleaned.replace(/^อำเภอ/, '').trim();
  } else if (cleaned.startsWith('อ.')) {
    cleaned = cleaned.replace(/^อ\./, '').trim();
  }
  return cleaned;
}

/**
 * Calculate dynamic metrics on-the-fly based on raw records and optional year filter
 */
export function computeDashboardMetrics(
  allRecords: RawRecord[],
  selectedYear: number | 'all' = 'all',
  source: 'google-sheets' | 'local-cached' = 'local-cached',
  sheetId?: string,
  sheetUrl?: string,
  timestamp?: string
): DashboardMetrics {
  // 1. Group records by year
  const yearlyMap = new Map<number, RawRecord[]>();
  const allYearsSet = new Set<number>();

  for (const record of allRecords) {
    allYearsSet.add(record.year);
    const list = yearlyMap.get(record.year) || [];
    list.push(record);
    yearlyMap.set(record.year, list);
  }

  const sortedYears = Array.from(allYearsSet).sort((a, b) => a - b);

  // 2. Compute year summaries
  const yearlySummaries: YearSummary[] = sortedYears.map((yr, idx) => {
    const list = yearlyMap.get(yr) || [];
    const totalPatients = list.reduce((sum, r) => sum + r.patients, 0);
    const totalVillages = list.reduce((sum, r) => sum + r.villages, 0);
    const districtCount = new Set(list.map(r => r.district)).size;
    const avgPatientsPerVillage = totalVillages > 0 ? Number((totalPatients / totalVillages).toFixed(2)) : 0;

    let growthPercentage: number | null = null;
    if (idx > 0) {
      const prevYear = sortedYears[idx - 1];
      const prevList = yearlyMap.get(prevYear) || [];
      const prevPatients = prevList.reduce((sum, r) => sum + r.patients, 0);
      if (prevPatients > 0) {
        growthPercentage = Number((((totalPatients - prevPatients) / prevPatients) * 100).toFixed(1));
      }
    }

    return {
      year: yr,
      totalPatients,
      totalVillages,
      districtCount,
      avgPatientsPerVillage,
      growthPercentage,
    };
  });

  // Filter records according to selectedYear
  const filteredRecords = selectedYear === 'all'
    ? allRecords
    : allRecords.filter(r => r.year === selectedYear);

  // Group by district
  const districtMap = new Map<string, {
    totalPatients: number;
    totalVillages: number;
    yearlyData: Record<number, { patients: number; villages: number }>;
  }>();

  for (const record of filteredRecords) {
    const existing = districtMap.get(record.district) || {
      totalPatients: 0,
      totalVillages: 0,
      yearlyData: {},
    };

    existing.totalPatients += record.patients;
    existing.totalVillages += record.villages;
    existing.yearlyData[record.year] = {
      patients: record.patients,
      villages: record.villages,
    };

    districtMap.set(record.district, existing);
  }

  // Also build 4-year history for all districts even if year is filtered, to allow deep-dive modal
  const fullDistrictMap = new Map<string, Record<number, { patients: number; villages: number }>>();
  for (const record of allRecords) {
    const existing = fullDistrictMap.get(record.district) || {};
    existing[record.year] = { patients: record.patients, villages: record.villages };
    fullDistrictMap.set(record.district, existing);
  }

  const grandTotalPatients = Array.from(districtMap.values()).reduce((sum, d) => sum + d.totalPatients, 0);
  const grandTotalVillages = Array.from(districtMap.values()).reduce((sum, d) => sum + d.totalVillages, 0);

  // Format district summaries
  const districtSummaries: DistrictSummary[] = Array.from(districtMap.entries()).map(([district, data]) => {
    const patientPerVillage = data.totalVillages > 0 ? Number((data.totalPatients / data.totalVillages).toFixed(2)) : 0;
    const sharePercentage = grandTotalPatients > 0 ? Number(((data.totalPatients / grandTotalPatients) * 100).toFixed(1)) : 0;

    // Determine risk level based on patient count
    // If selectedYear is a single year, use threshold: >= 50 Critical, >= 20 Moderate, < 20 Surveillance
    // If selectedYear is 'all', average per active year
    const activeYearsCount = Object.keys(data.yearlyData).length || 1;
    const effectivePatientLoad = selectedYear === 'all' ? data.totalPatients / activeYearsCount : data.totalPatients;

    let riskLevel: RiskLevel = 'surveillance';
    if (effectivePatientLoad >= 50) {
      riskLevel = 'critical';
    } else if (effectivePatientLoad >= 20) {
      riskLevel = 'moderate';
    }

    // Historical comparison (growth from previous year if single year selected)
    let growthFromPrevYear: number | null = null;
    if (typeof selectedYear === 'number') {
      const prevYear = selectedYear - 1;
      const history = fullDistrictMap.get(district);
      if (history && history[prevYear] !== undefined) {
        const prevPatients = history[prevYear].patients;
        if (prevPatients > 0) {
          growthFromPrevYear = Number((((data.totalPatients - prevPatients) / prevPatients) * 100).toFixed(1));
        } else if (data.totalPatients > 0) {
          growthFromPrevYear = 100;
        }
      }
    }

    return {
      district,
      totalPatients: data.totalPatients,
      totalVillages: data.totalVillages,
      patientPerVillage,
      yearlyData: fullDistrictMap.get(district) || data.yearlyData,
      riskLevel,
      sharePercentage,
      growthFromPrevYear,
    };
  });

  // Sort descending by totalPatients
  districtSummaries.sort((a, b) => b.totalPatients - a.totalPatients);

  // Assign ranks
  districtSummaries.forEach((d, idx) => {
    d.rank = idx + 1;
  });

  // Risk counts
  const riskCounts = {
    critical: districtSummaries.filter(d => d.riskLevel === 'critical').length,
    moderate: districtSummaries.filter(d => d.riskLevel === 'moderate').length,
    surveillance: districtSummaries.filter(d => d.riskLevel === 'surveillance').length,
  };

  // Top district
  const topDistrict = districtSummaries.length > 0
    ? {
        district: districtSummaries[0].district,
        patients: districtSummaries[0].totalPatients,
        villages: districtSummaries[0].totalVillages,
      }
    : { district: '-', patients: 0, villages: 0 };

  // Highest average district
  const sortedByRatio = [...districtSummaries].sort((a, b) => b.patientPerVillage - a.patientPerVillage);
  const highestAverageDistrict = sortedByRatio.length > 0
    ? {
        district: sortedByRatio[0].district,
        ratio: sortedByRatio[0].patientPerVillage,
      }
    : { district: '-', ratio: 0 };

  // Overall latest YoY growth
  let latestGrowthYoY: number | null = null;
  if (yearlySummaries.length >= 2) {
    latestGrowthYoY = yearlySummaries[yearlySummaries.length - 1].growthPercentage ?? null;
  }

  const avgPatientsPerVillage = grandTotalVillages > 0 ? Number((grandTotalPatients / grandTotalVillages).toFixed(2)) : 0;

  return {
    totalPatients: grandTotalPatients,
    totalVillages: grandTotalVillages,
    avgPatientsPerVillage,
    totalDistricts: districtSummaries.length,
    topDistrict,
    highestAverageDistrict,
    growthYoY: latestGrowthYoY,
    riskCounts,
    yearlySummaries,
    districtSummaries,
    allRecords,
    source,
    sheetId,
    sheetUrl,
    lastUpdated: timestamp || 'ล่าสุด',
  };
}
