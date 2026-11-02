'use client';

import React from 'react';
import { Users, Home, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DashboardMetrics } from '@/lib/types';

interface Props {
  metrics: DashboardMetrics;
  selectedYear: number | 'all';
}

export const KPICards: React.FC<Props> = ({ metrics, selectedYear }) => {
  const yearLabel = selectedYear === 'all' ? 'รวมทุกปี (2565-2568)' : `ประจำปี พ.ศ. ${selectedYear}`;

  return (
    <section className="kpi-section">
      <div className="grid-kpi">
        
        {/* Card 1: Total Patients */}
        <div className="glass-panel kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">ผู้ป่วยเข้ารับบำบัดทั้งหมด</span>
            <div className="kpi-icon-wrapper kpi-icon-orange">
              <Users size={22} />
            </div>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value">{metrics.totalPatients.toLocaleString()}</span>
            <span className="kpi-unit">ราย</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-period">{yearLabel}</span>
            {metrics.growthYoY !== null && typeof selectedYear === 'number' && (
              <span className={`kpi-change ${metrics.growthYoY >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {metrics.growthYoY >= 0 ? `+${metrics.growthYoY}%` : `${metrics.growthYoY}%`} YoY
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Total Communities */}
        <div className="glass-panel kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">หมู่บ้าน/ชุมชนเป้าหมาย</span>
            <div className="kpi-icon-wrapper kpi-icon-amber">
              <Home size={22} />
            </div>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value">{metrics.totalVillages.toLocaleString()}</span>
            <span className="kpi-unit">แห่ง</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-period">ครอบคลุม {metrics.totalDistricts} อำเภอ</span>
            <span className="badge badge-surveillance">100% รายงานผล</span>
          </div>
        </div>

        {/* Card 3: Avg Patients per Community */}
        <div className="glass-panel kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">อัตราเฉลี่ยผู้ป่วยต่อชุมชน</span>
            <div className="kpi-icon-wrapper kpi-icon-blue">
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value">{metrics.avgPatientsPerVillage}</span>
            <span className="kpi-unit">คน / ชุมชน</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-period">สูงสุด: อ.{metrics.highestAverageDistrict.district} ({metrics.highestAverageDistrict.ratio} คน)</span>
          </div>
        </div>

        {/* Card 4: Top Burden District */}
        <div className="glass-panel kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">พื้นที่เฝ้าระวังสูงสุด</span>
            <div className="kpi-icon-wrapper kpi-icon-red">
              <AlertTriangle size={22} />
            </div>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value text-amber-300">อ.{metrics.topDistrict.district}</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-period">จำนวน {metrics.topDistrict.patients} ราย ({metrics.topDistrict.villages} ชุมชน)</span>
            <span className="badge badge-critical">อันดับ 1</span>
          </div>
        </div>

        {/* Card 5: Risk Stratification */}
        <div className="glass-panel kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">การกระจายระดับความเสี่ยง</span>
            <div className="kpi-icon-wrapper kpi-icon-green">
              <ShieldCheck size={22} />
            </div>
          </div>
          <div className="risk-bars-container">
            <div className="risk-stat-item">
              <span className="risk-dot bg-rose-500" />
              <span className="risk-label">วิกฤต (&gt;50)</span>
              <strong className="risk-count text-rose-400">{metrics.riskCounts.critical} อำเภอ</strong>
            </div>
            <div className="risk-stat-item">
              <span className="risk-dot bg-amber-500" />
              <span className="risk-label">ปานกลาง (20-50)</span>
              <strong className="risk-count text-amber-400">{metrics.riskCounts.moderate} อำเภอ</strong>
            </div>
            <div className="risk-stat-item">
              <span className="risk-dot bg-emerald-500" />
              <span className="risk-label">เฝ้าระวัง (&lt;20)</span>
              <strong className="risk-count text-emerald-400">{metrics.riskCounts.surveillance} อำเภอ</strong>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .kpi-section {
          margin-bottom: 2rem;
        }

        .kpi-card {
          padding: 1.35rem 1.45rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.7);
          border-radius: 16px;
          border: 1px solid rgba(249, 115, 22, 0.16);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          border-color: rgba(249, 115, 22, 0.4);
        }

        .kpi-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .kpi-title {
          font-size: 0.86rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .kpi-icon-wrapper {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-icon-orange {
          background: rgba(249, 115, 22, 0.15);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.3);
        }

        .kpi-icon-amber {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .kpi-icon-blue {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .kpi-icon-red {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .kpi-icon-green {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .kpi-value-container {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .kpi-value {
          font-size: 2.1rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .kpi-unit {
          font-size: 0.88rem;
          color: #94a3b8;
          font-weight: 400;
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.76rem;
        }

        .kpi-period {
          color: #94a3b8;
        }

        .kpi-change {
          font-weight: 600;
        }

        .risk-bars-container {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: 0.25rem;
        }

        .risk-stat-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.76rem;
        }

        .risk-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 0.4rem;
        }

        .risk-label {
          color: #cbd5e1;
          flex-grow: 1;
        }

        .bg-rose-500 { background-color: #ef4444; }
        .bg-amber-500 { background-color: #f97316; }
        .bg-emerald-500 { background-color: #10b981; }
        .text-rose-400 { color: #f87171; }
        .text-amber-400 { color: #fbbf24; }
        .text-emerald-400 { color: #34d399; }
      `}</style>
    </section>
  );
};
