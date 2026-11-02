'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SisaketHeader } from '@/components/SisaketHeader';
import { KPICards } from '@/components/KPICards';
import { YearlyTrendChart } from '@/components/YearlyTrendChart';
import { DistrictRankingChart } from '@/components/DistrictRankingChart';
import { DistrictGrid } from '@/components/DistrictGrid';
import { DistrictModal } from '@/components/DistrictModal';
import { GoogleSheetModal } from '@/components/GoogleSheetModal';
import { DataTable } from '@/components/DataTable';
import { DEFAULT_RAW_RECORDS } from '@/lib/defaultData';
import { computeDashboardMetrics } from '@/lib/parser';
import { DashboardMetrics, DistrictSummary } from '@/lib/types';
import { BarChart3, LayoutGrid, TableProperties, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [metrics, setMetrics] = useState<DashboardMetrics>(() =>
    computeDashboardMetrics(DEFAULT_RAW_RECORDS, 'all', 'local-cached')
  );
  const [allRawRecords, setAllRawRecords] = useState(DEFAULT_RAW_RECORDS);
  const [currentSheetUrl, setCurrentSheetUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Navigation
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictSummary | null>(null);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'districts' | 'table'>('overview');

  // Load saved Google Sheet URL from localStorage and update client timestamp
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      lastUpdated: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
    }));
    try {
      const savedUrl = localStorage.getItem('sisaket_google_sheet_url');
      if (savedUrl) {
        setCurrentSheetUrl(savedUrl);
        handleFetchLiveSheet(savedUrl, selectedYear);
      }
    } catch {
      // Ignore localStorage security errors in sandbox
    }
  }, []);

  // On-the-fly fetcher from Google Sheet or local dataset
  const handleFetchLiveSheet = useCallback(async (sheetUrl: string, yr: number | 'all') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const queryParams = new URLSearchParams();
      if (sheetUrl) queryParams.set('url', sheetUrl);
      if (yr !== 'all') queryParams.set('year', yr.toString());

      const res = await fetch(`/api/sheets?${queryParams.toString()}`, {
        cache: 'no-store', // guarantees on-the-fly execution
      });
      const data = await res.json();

      if (data.success && data.metrics) {
        setMetrics(data.metrics);
        if (data.metrics.allRecords && data.metrics.allRecords.length > 0) {
          setAllRawRecords(data.metrics.allRecords);
        }
        return true;
      } else {
        throw new Error(data.error || 'ไม่สามารถดึงข้อมูลจาก Google Sheet ได้');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลสด');
      // Fallback: recompute from existing records on-the-fly
      setMetrics(computeDashboardMetrics(allRawRecords, yr, 'local-cached'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [allRawRecords]);

  // Handle year filter change (instant on-the-fly computation)
  const handleSelectYear = (yr: number | 'all') => {
    setSelectedYear(yr);
    if (currentSheetUrl) {
      handleFetchLiveSheet(currentSheetUrl, yr);
    } else {
      setMetrics(computeDashboardMetrics(allRawRecords, yr, 'local-cached'));
    }
  };

  // Connect custom Google Sheet
  const handleConnectSheet = async (url: string): Promise<boolean> => {
    const success = await handleFetchLiveSheet(url, selectedYear);
    if (success) {
      setCurrentSheetUrl(url);
      try {
        localStorage.setItem('sisaket_google_sheet_url', url);
      } catch {}
      return true;
    }
    return false;
  };

  // Reset to default Sisaket dataset
  const handleResetToDefault = () => {
    setCurrentSheetUrl('');
    setAllRawRecords(DEFAULT_RAW_RECORDS);
    setMetrics(computeDashboardMetrics(DEFAULT_RAW_RECORDS, selectedYear, 'local-cached'));
    try {
      localStorage.removeItem('sisaket_google_sheet_url');
    } catch {}
  };

  // Manual refresh button
  const handleRefresh = () => {
    if (currentSheetUrl) {
      handleFetchLiveSheet(currentSheetUrl, selectedYear);
    } else {
      // Recompute on-the-fly
      setMetrics(computeDashboardMetrics(allRawRecords, selectedYear, 'local-cached'));
    }
  };

  return (
    <main className="dashboard-main">
      {/* Header */}
      <SisaketHeader
        metrics={metrics}
        onRefresh={handleRefresh}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        isLoading={isLoading}
      />

      <div className="container">
        
        {/* Slogan Ticker / Provincial Bar */}
        <div className="slogan-bar">
          <div className="slogan-content">
            <span className="slogan-badge">คำขวัญจังหวัดศรีสะเกษ</span>
            <span className="slogan-text">
              "แดนปราสาทขอม ดอกลำดวนบาน กระเทียมดี ข้าวสารหอม ผ้าไหมงาม ดินดำน้ำชุ่ม จิตใจโอบอ้อมอารี"
            </span>
          </div>
          <div className="onthefly-pill">
            <RefreshCw size={13} className={isLoading ? 'animate-spin text-amber-400' : 'text-amber-400'} />
            <span>On-the-Fly Engine Active</span>
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{errorMessage} (ระบบสลับไปใช้ชุดข้อมูลสำรองอัตโนมัติ)</span>
          </div>
        )}

        {/* Top KPI Cards */}
        <KPICards metrics={metrics} selectedYear={selectedYear} />

        {/* Navigation Tabs */}
        <div className="tab-navigation-bar">
          <div className="nav-tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`nav-tab ${activeTab === 'overview' ? 'nav-tab-active' : ''}`}
            >
              <BarChart3 size={16} />
              <span>ภาพรวม & แนวโน้มการบำบัด</span>
            </button>
            <button
              onClick={() => setActiveTab('districts')}
              className={`nav-tab ${activeTab === 'districts' ? 'nav-tab-active' : ''}`}
            >
              <LayoutGrid size={16} />
              <span>เมทริกซ์ 22 อำเภอ ({metrics.totalDistricts})</span>
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`nav-tab ${activeTab === 'table' ? 'nav-tab-active' : ''}`}
            >
              <TableProperties size={16} />
              <span>ฐานข้อมูลตาราง & ส่งออก</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Overview & Comparative Visualizations */}
        {activeTab === 'overview' && (
          <div className="overview-tab-content">
            <div className="charts-split-grid">
              {/* Left: Multi-Year Trend Chart */}
              <div className="chart-col-trend">
                <YearlyTrendChart
                  yearlySummaries={metrics.yearlySummaries}
                  selectedYear={selectedYear}
                  onSelectYear={handleSelectYear}
                />
              </div>

              {/* Right: Ranking Chart */}
              <div className="chart-col-ranking">
                <DistrictRankingChart
                  districts={metrics.districtSummaries}
                  onSelectDistrict={(d) => setSelectedDistrict(d)}
                  selectedYear={selectedYear}
                />
              </div>
            </div>

            {/* Quick 22 Districts Matrix under overview */}
            <DistrictGrid
              districts={metrics.districtSummaries}
              onSelectDistrict={(d) => setSelectedDistrict(d)}
              selectedYear={selectedYear}
            />
          </div>
        )}

        {/* Tab 2: 22 Districts Matrix */}
        {activeTab === 'districts' && (
          <div className="districts-tab-content">
            <DistrictGrid
              districts={metrics.districtSummaries}
              onSelectDistrict={(d) => setSelectedDistrict(d)}
              selectedYear={selectedYear}
            />
          </div>
        )}

        {/* Tab 3: Data Table */}
        {activeTab === 'table' && (
          <div className="table-tab-content">
            <DataTable
              records={allRawRecords}
              selectedYear={selectedYear}
            />
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="container footer-container">
          <div className="footer-left">
            <p className="footer-title">
              ศูนย์ปฏิบัติการข้อมูลการบำบัดฟื้นฟูผู้ติดยาเสพติด จังหวัดศรีสะเกษ
            </p>
            <p className="footer-sub">
              ระบบเชื่อมต่อและประมวลผลข้อมูล Google Drive & Google Sheet แบบ On-the-Fly โดยไม่ผ่านการแคชถาวร
            </p>
          </div>
          <div className="footer-right">
            <span className="footer-tag">SISAKET PROVINCIAL DATA HUB • NEXT.JS 16</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DistrictModal
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        currentSheetUrl={currentSheetUrl}
        onConnectSheet={handleConnectSheet}
        onResetToDefault={handleResetToDefault}
      />

      <style jsx>{`
        .dashboard-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .slogan-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 12px;
          padding: 0.65rem 1.15rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .slogan-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .slogan-badge {
          font-size: 0.74rem;
          font-weight: 600;
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.12);
          border: 1px solid rgba(251, 191, 36, 0.3);
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .slogan-text {
          font-size: 0.825rem;
          color: #cbd5e1;
          font-style: italic;
        }

        .onthefly-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #fed7aa;
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.25);
          padding: 0.2rem 0.65rem;
          border-radius: 9999px;
          font-weight: 500;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .tab-navigation-bar {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.75rem;
        }

        .nav-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.7);
          padding: 0.3rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .nav-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.15rem;
          border-radius: 9px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #94a3b8;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .nav-tab:hover {
          color: #ffffff;
        }

        .nav-tab-active {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.35);
        }

        .charts-split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .charts-split-grid {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-footer {
          margin-top: auto;
          background: rgba(8, 12, 20, 0.95);
          border-top: 1px solid rgba(249, 115, 22, 0.2);
          padding: 1.75rem 0;
        }

        .footer-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .footer-sub {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.2rem;
        }

        .footer-tag {
          font-size: 0.72rem;
          font-weight: 600;
          color: #f97316;
          letter-spacing: 0.05em;
        }
      `}</style>
    </main>
  );
}
