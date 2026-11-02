'use client';

import React, { useState } from 'react';
import { DistrictSummary } from '@/lib/types';
import { Award, Eye } from 'lucide-react';

interface Props {
  districts: DistrictSummary[];
  onSelectDistrict: (district: DistrictSummary) => void;
  selectedYear: number | 'all';
}

export const DistrictRankingChart: React.FC<Props> = ({
  districts,
  onSelectDistrict,
  selectedYear,
}) => {
  const [displayCount, setDisplayCount] = useState<number | 'all'>(10);

  if (!districts || districts.length === 0) return null;

  const maxPatients = Math.max(...districts.map(d => d.totalPatients), 1);
  const visibleDistricts = displayCount === 'all' ? districts : districts.slice(0, displayCount);

  return (
    <div className="glass-panel ranking-container">
      <div className="ranking-header">
        <div className="ranking-title-group">
          <div className="ranking-icon-box">
            <Award size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="ranking-heading">การจัดอันดับอำเภอตามจำนวนผู้ป่วยบำบัด</h2>
            <p className="ranking-subheading">
              {selectedYear === 'all' ? 'สถิติสะสมภาพรวมทุกปี' : `ข้อมูลประจำปี พ.ศ. ${selectedYear}`} (คลิกที่แถวเพื่อดูข้อมูลเจาะลึก)
            </p>
          </div>
        </div>

        {/* Display limit toggle */}
        <div className="display-toggle">
          <button
            onClick={() => setDisplayCount(5)}
            className={`toggle-btn ${displayCount === 5 ? 'toggle-btn-active' : ''}`}
          >
            Top 5
          </button>
          <button
            onClick={() => setDisplayCount(10)}
            className={`toggle-btn ${displayCount === 10 ? 'toggle-btn-active' : ''}`}
          >
            Top 10
          </button>
          <button
            onClick={() => setDisplayCount('all')}
            className={`toggle-btn ${displayCount === 'all' ? 'toggle-btn-active' : ''}`}
          >
            ทั้งหมด (22 อำเภอ)
          </button>
        </div>
      </div>

      {/* Ranking List */}
      <div className="ranking-list">
        {visibleDistricts.map((d) => {
          const percentage = Math.max((d.totalPatients / maxPatients) * 100, 2);

          let barColor = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
          let badgeClass = 'badge-surveillance';
          let riskLabel = 'เฝ้าระวัง';

          if (d.riskLevel === 'critical') {
            barColor = 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
            badgeClass = 'badge-critical';
            riskLabel = 'วิกฤต (>50)';
          } else if (d.riskLevel === 'moderate') {
            barColor = 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)';
            badgeClass = 'badge-moderate';
            riskLabel = 'ปานกลาง (20-50)';
          }

          return (
            <div
              key={d.district}
              className="ranking-row"
              onClick={() => onSelectDistrict(d)}
              title={`คลิกดูข้อมูลเชิงลึก อำเภอ${d.district}`}
            >
              {/* Rank Badge */}
              <div className="rank-badge-col">
                <span className={`rank-number ${d.rank && d.rank <= 3 ? 'rank-top3' : ''}`}>
                  #{d.rank}
                </span>
              </div>

              {/* District info */}
              <div className="district-info-col">
                <div className="district-title-row">
                  <span className="district-name">อ.{d.district}</span>
                  <span className={`badge ${badgeClass}`}>{riskLabel}</span>
                  <span className="district-villages-text">{d.totalVillages} หมู่บ้าน</span>
                </div>

                {/* Bar */}
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${percentage}%`,
                      background: barColor,
                    }}
                  />
                </div>
              </div>

              {/* Patient Count */}
              <div className="patient-count-col">
                <span className="patient-number">{d.totalPatients.toLocaleString()}</span>
                <span className="patient-unit">ราย</span>
                <Eye size={14} className="view-icon text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .ranking-container {
          padding: 1.5rem;
          margin-bottom: 2rem;
          background: rgba(15, 23, 42, 0.75);
        }

        .ranking-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .ranking-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ranking-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(249, 115, 22, 0.15);
          border: 1px solid rgba(249, 115, 22, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ranking-heading {
          font-size: 1.15rem;
          font-weight: 600;
          color: #ffffff;
        }

        .ranking-subheading {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .display-toggle {
          display: flex;
          align-items: center;
          background: rgba(30, 41, 59, 0.6);
          padding: 0.25rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          gap: 0.25rem;
        }

        .toggle-btn {
          padding: 0.3rem 0.75rem;
          border-radius: 7px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #94a3b8;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .toggle-btn:hover {
          color: #ffffff;
        }

        .toggle-btn-active {
          background: #334155;
          color: #ffffff !important;
          font-weight: 600;
        }

        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ranking-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.65rem 0.85rem;
          border-radius: 12px;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ranking-row:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(249, 115, 22, 0.3);
          transform: translateX(3px);
        }

        .rank-badge-col {
          width: 38px;
          text-align: center;
          flex-shrink: 0;
        }

        .rank-number {
          font-size: 0.85rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .rank-top3 {
          color: #fbbf24;
          font-size: 0.95rem;
          font-weight: 700;
        }

        .district-info-col {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .district-title-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .district-name {
          font-size: 0.925rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .district-villages-text {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .bar-track {
          width: 100%;
          height: 8px;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .patient-count-col {
          display: flex;
          align-items: baseline;
          gap: 0.35rem;
          flex-shrink: 0;
          min-width: 80px;
          justify-content: flex-end;
        }

        .patient-number {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .patient-unit {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .view-icon {
          margin-left: 0.25rem;
          opacity: 0.6;
        }

        .ranking-row:hover .view-icon {
          opacity: 1;
          color: #f97316;
        }
      `}</style>
    </div>
  );
};
