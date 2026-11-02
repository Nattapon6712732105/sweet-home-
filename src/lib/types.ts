export interface RawRecord {
  year: number;          // ปี พ.ศ. เช่น 2565, 2566, 2567, 2568
  district: string;      // อำเภอ
  villages: number;      // จำนวนหมู่บ้าน/ชุมชน
  patients: number;      // จำนวนผู้ป่วยเข้ารับบำบัด
}

export type RiskLevel = 'critical' | 'moderate' | 'surveillance';

export interface DistrictSummary {
  district: string;
  totalPatients: number;
  totalVillages: number;
  patientPerVillage: number;
  yearlyData: Record<number, { patients: number; villages: number }>;
  riskLevel: RiskLevel;
  rank?: number;
  sharePercentage?: number;
  growthFromPrevYear?: number | null;
}

export interface YearSummary {
  year: number;
  totalPatients: number;
  totalVillages: number;
  districtCount: number;
  avgPatientsPerVillage: number;
  growthPercentage?: number | null;
}

export interface DashboardMetrics {
  totalPatients: number;
  totalVillages: number;
  avgPatientsPerVillage: number;
  totalDistricts: number;
  topDistrict: {
    district: string;
    patients: number;
    villages: number;
  };
  highestAverageDistrict: {
    district: string;
    ratio: number;
  };
  growthYoY: number | null;
  riskCounts: {
    critical: number;     // > 50 ราย
    moderate: number;     // 20 - 50 ราย
    surveillance: number; // < 20 ราย
  };
  yearlySummaries: YearSummary[];
  districtSummaries: DistrictSummary[];
  allRecords: RawRecord[];
  source: 'google-sheets' | 'local-cached';
  sheetId?: string;
  sheetUrl?: string;
  lastUpdated: string;
}
