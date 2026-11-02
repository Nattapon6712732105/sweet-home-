'use client';

import React, { useState } from 'react';
import { YearSummary } from '@/lib/types';
import { Calendar, BarChart3, TrendingUp, Info } from 'lucide-react';

interface Props {
  yearlySummaries: YearSummary[];
  selectedYear: number | 'all';
  onSelectYear: (year: number | 'all') => void;
}

export const YearlyTrendChart: React.FC<Props> = ({
  yearlySummaries,
  selectedYear,
  onSelectYear,
}) => {
  const [activeHover, setActiveHover] = useState<YearSummary | null>(null);

  if (!yearlySummaries || yearlySummaries.length === 0) return null;

  const maxPatients = Math.max(...yearlySummaries.map(y => y.totalPatients), 10);
  const chartHeight = 220;

  return (
    <div className="glass-panel chart-container">
      <div className="chart-header">
        <div className="chart-title-group">
          <div className="chart-icon-box">
            <TrendingUp size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="chart-heading">แนวโน้มการบำบัดฟื้นฟูรายปี (พ.ศ. 2565 - 2568)</h2>
            <p className="chart-subheading">เปรียบเทียบจำนวนผู้ป่วยและหมู่บ้านเป้าหมายในภาพรวมจังหวัด</p>
          </div>
        </div>

        {/* Year Pills Filter */}
        <div className="year-selector">
          <button
            onClick={() => onSelectYear('all')}
            className={`year-pill ${selectedYear === 'all' ? 'year-pill-active' : ''}`}
          >
            รวมทุกปี
          </button>
          {yearlySummaries.map(y => (
            <button
              key={y.year}
              onClick={() => onSelectYear(y.year)}
              className={`year-pill ${selectedYear === y.year ? 'year-pill-active' : ''}`}
            >
              พ.ศ. {y.year}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Bar & Trend Chart */}
      <div className="chart-body">
        <div className="bars-track">
          {yearlySummaries.map((item, idx) => {
            const heightPercent = Math.max((item.totalPatients / maxPatients) * 100, 6);
            const isSelected = selectedYear === item.year || selectedYear === 'all';

            return (
              <div
                key={item.year}
                className={`bar-column ${isSelected ? 'bar-selected' : 'bar-dimmed'}`}
                onMouseEnter={() => setActiveHover(item)}
                onMouseLeave={() => setActiveHover(null)}
                onClick={() => onSelectYear(item.year)}
              >
                {/* Value on top */}
                <div className="bar-top-info">
                  <span className="bar-value-text">{item.totalPatients.toLocaleString()}</span>
                  {item.growthPercentage !== null && item.growthPercentage !== undefined && (
                    <span className={`bar-growth-tag ${item.growthPercentage >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.growthPercentage >= 0 ? `+${item.growthPercentage}%` : `${item.growthPercentage}%`}
                    </span>
                  )}
                </div>

                {/* Animated Vertical Bar */}
                <div className="bar-outer" style={{ height: `${chartHeight}px` }}>
                  <div
                    className="bar-inner"
                    style={{
                      height: `${heightPercent}%`,
                      background: isSelected
                        ? 'linear-gradient(180deg, #fbbf24 0%, #f97316 60%, #c2410c 100%)'
                        : 'linear-gradient(180deg, #475569 0%, #334155 100%)',
                    }}
                  >
                    <div className="bar-highlight" />
                  </div>
                </div>

                {/* Label X-axis */}
                <div className="bar-x-label">
                  <span className="year-number">พ.ศ. {item.year}</span>
                  <span className="villages-tag">{item.totalVillages} หมู่บ้าน</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip Info Box */}
        {activeHover && (
          <div className="hover-tooltip">
            <div className="tooltip-header">
              <Calendar size={14} className="text-amber-400" />
              <strong>สรุปข้อมูลปี พ.ศ. {activeHover.year}</strong>
            </div>
            <div className="tooltip-grid">
              <div>
                <span className="tooltip-muted">ผู้ป่วยบำบัด:</span>
                <span className="tooltip-bold text-amber-300">{activeHover.totalPatients.toLocaleString()} ราย</span>
              </div>
              <div>
                <span className="tooltip-muted">หมู่บ้าน/ชุมชน:</span>
                <span className="tooltip-bold">{activeHover.totalVillages} แห่ง</span>
              </div>
              <div>
                <span className="tooltip-muted">เฉลี่ยต่อชุมชน:</span>
                <span className="tooltip-bold">{activeHover.avgPatientsPerVillage} ราย</span>
              </div>
              <div>
                <span className="tooltip-muted">อำเภอที่มีรายงาน:</span>
                <span className="tooltip-bold">{activeHover.districtCount} อำเภอ</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .chart-container {
          padding: 1.5rem;
          margin-bottom: 2rem;
          background: rgba(15, 23, 42, 0.75);
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .chart-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chart-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(249, 115, 22, 0.15);
          border: 1px solid rgba(249, 115, 22, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-heading {
          font-size: 1.15rem;
          font-weight: 600;
          color: #ffffff;
        }

        .chart-subheading {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .year-selector {
          display: flex;
          align-items: center;
          background: rgba(30, 41, 59, 0.6);
          padding: 0.25rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          gap: 0.25rem;
        }

        .year-pill {
          padding: 0.35rem 0.85rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          color: #94a3b8;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .year-pill:hover {
          color: #ffffff;
        }

        .year-pill-active {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: #ffffff !important;
          box-shadow: 0 2px 8px rgba(234, 88, 12, 0.4);
        }

        .chart-body {
          position: relative;
          padding-top: 1rem;
        }

        .bars-track {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1.5rem;
          align-items: flex-end;
          padding-bottom: 0.5rem;
        }

        .bar-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .bar-column:hover {
          transform: translateY(-4px);
        }

        .bar-dimmed {
          opacity: 0.6;
        }

        .bar-selected {
          opacity: 1;
        }

        .bar-top-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 0.5rem;
          height: 38px;
          justify-content: flex-end;
        }

        .bar-value-text {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .bar-growth-tag {
          font-size: 0.68rem;
          font-weight: 600;
        }

        .bar-outer {
          width: 64px;
          background: rgba(30, 41, 59, 0.4);
          border-radius: 12px 12px 4px 4px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .bar-inner {
          width: 100%;
          border-radius: 10px 10px 0 0;
          position: relative;
          transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 -4px 15px rgba(249, 115, 22, 0.3);
        }

        .bar-highlight {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.6);
        }

        .bar-x-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 0.75rem;
        }

        .year-number {
          font-size: 0.88rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .villages-tag {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .hover-tooltip {
          margin-top: 1.25rem;
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(249, 115, 22, 0.3);
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.2s ease-out;
        }

        .tooltip-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.84rem;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .tooltip-grid {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          font-size: 0.8rem;
        }

        .tooltip-muted {
          color: #94a3b8;
          margin-right: 0.4rem;
        }

        .tooltip-bold {
          font-weight: 600;
          color: #f1f5f9;
        }
      `}</style>
    </div>
  );
};
