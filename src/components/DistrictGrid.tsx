'use client';

import React, { useState, useMemo } from 'react';
import { DistrictSummary, RiskLevel } from '@/lib/types';
import { MapPin, Search, ArrowUpDown, ChevronRight } from 'lucide-react';

interface Props {
  districts: DistrictSummary[];
  onSelectDistrict: (district: DistrictSummary) => void;
  selectedYear?: number | 'all';
}

export const DistrictGrid: React.FC<Props> = ({
  districts,
  onSelectDistrict,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'patients' | 'villages' | 'ratio' | 'name'>('patients');

  const filteredAndSorted = useMemo(() => {
    return districts
      .filter((d) => {
        const matchesSearch = d.district.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = riskFilter === 'all' || d.riskLevel === riskFilter;
        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === 'patients') return b.totalPatients - a.totalPatients;
        if (sortBy === 'villages') return b.totalVillages - a.totalVillages;
        if (sortBy === 'ratio') return b.patientPerVillage - a.patientPerVillage;
        if (sortBy === 'name') return a.district.localeCompare(b.district, 'th');
        return 0;
      });
  }, [districts, searchTerm, riskFilter, sortBy]);

  return (
    <div className="glass-panel grid-container">
      {/* Grid Controls Header */}
      <div className="grid-header">
        <div className="grid-title-group">
          <div className="grid-icon-box">
            <MapPin size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="grid-heading">เมทริกซ์ 22 อำเภอ จังหวัดศรีสะเกษ</h2>
            <p className="grid-subheading">
              สรุปภาพรวมแยกรายอำเภอ (พบ {filteredAndSorted.length} จาก 22 อำเภอ)
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid-controls">
          
          {/* Search box */}
          <div className="search-box">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่ออำเภอ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Risk Filters */}
          <div className="risk-filter-pills">
            <button
              onClick={() => setRiskFilter('all')}
              className={`pill-btn ${riskFilter === 'all' ? 'pill-btn-active' : ''}`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setRiskFilter('critical')}
              className={`pill-btn text-rose-400 ${riskFilter === 'critical' ? 'pill-btn-critical' : ''}`}
            >
              วิกฤต
            </button>
            <button
              onClick={() => setRiskFilter('moderate')}
              className={`pill-btn text-amber-400 ${riskFilter === 'moderate' ? 'pill-btn-moderate' : ''}`}
            >
              ปานกลาง
            </button>
            <button
              onClick={() => setRiskFilter('surveillance')}
              className={`pill-btn text-emerald-400 ${riskFilter === 'surveillance' ? 'pill-btn-surveillance' : ''}`}
            >
              เฝ้าระวัง
            </button>
          </div>

          {/* Sort Selector */}
          <div className="sort-box">
            <ArrowUpDown size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'patients' | 'villages' | 'ratio' | 'name')}
              className="sort-select"
            >
              <option value="patients">เรียงตาม: ผู้ป่วยมากที่สุด</option>
              <option value="villages">เรียงตาม: หมู่บ้านมากที่สุด</option>
              <option value="ratio">เรียงตาม: อัตราส่วนต่อชุมชน</option>
              <option value="name">เรียงตาม: ชื่ออำเภอ (ก-ฮ)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Cards Grid */}
      <div className="districts-grid">
        {filteredAndSorted.map((d) => {
          let badgeClass = 'badge-surveillance';
          let riskLabel = 'เฝ้าระวัง';
          let borderColor = 'rgba(16, 185, 129, 0.2)';

          if (d.riskLevel === 'critical') {
            badgeClass = 'badge-critical';
            riskLabel = 'วิกฤต';
            borderColor = 'rgba(239, 68, 68, 0.3)';
          } else if (d.riskLevel === 'moderate') {
            badgeClass = 'badge-moderate';
            riskLabel = 'ปานกลาง';
            borderColor = 'rgba(249, 115, 22, 0.3)';
          }

          const yearsList = Object.keys(d.yearlyData).map(Number).sort((a, b) => a - b);
          const maxInHistory = Math.max(...yearsList.map(yr => d.yearlyData[yr]?.patients || 0), 1);

          return (
            <div
              key={d.district}
              onClick={() => onSelectDistrict(d)}
              className="district-card"
              style={{ borderColor }}
            >
              {/* Card Header */}
              <div className="card-top">
                <div className="district-title-box">
                  <span className="district-name">อ.{d.district}</span>
                  {d.rank && <span className="rank-chip">#{d.rank}</span>}
                </div>
                <span className={`badge ${badgeClass}`}>{riskLabel}</span>
              </div>

              {/* Main metrics */}
              <div className="card-stats">
                <div className="stat-box">
                  <span className="stat-label">ผู้ป่วยบำบัด</span>
                  <div className="stat-val-group">
                    <span className="stat-val-main text-amber-300">{d.totalPatients.toLocaleString()}</span>
                    <span className="stat-val-unit">ราย</span>
                  </div>
                </div>

                <div className="stat-box">
                  <span className="stat-label">หมู่บ้าน/ชุมชน</span>
                  <div className="stat-val-group">
                    <span className="stat-val-main">{d.totalVillages}</span>
                    <span className="stat-val-unit">แห่ง</span>
                  </div>
                </div>

                <div className="stat-box">
                  <span className="stat-label">เฉลี่ยต่อชุมชน</span>
                  <div className="stat-val-group">
                    <span className="stat-val-main">{d.patientPerVillage}</span>
                    <span className="stat-val-unit">คน</span>
                  </div>
                </div>
              </div>

              {/* Mini Sparkline Bar (4-Year trend 2565-2568) */}
              <div className="card-sparkline-row">
                <span className="sparkline-title">แนวโน้ม 4 ปี:</span>
                <div className="sparkline-bars">
                  {yearsList.map((yr) => {
                    const count = d.yearlyData[yr]?.patients || 0;
                    const hPercent = Math.max((count / maxInHistory) * 100, 10);
                    return (
                      <div key={yr} className="sparkline-bar-col" title={`ปี ${yr}: ${count} ราย`}>
                        <div
                          className="sparkline-bar"
                          style={{
                            height: `${hPercent}%`,
                            background: d.riskLevel === 'critical' ? '#ef4444' : '#f97316',
                          }}
                        />
                        <span className="sparkline-yr">{(yr % 100).toString().padStart(2, '0')}</span>
                      </div>
                    );
                  })}
                </div>
                <ChevronRight size={16} className="card-arrow text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .grid-container {
          padding: 1.5rem;
          margin-bottom: 2rem;
          background: rgba(15, 23, 42, 0.75);
        }

        .grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .grid-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .grid-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(249, 115, 22, 0.15);
          border: 1px solid rgba(249, 115, 22, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grid-heading {
          font-size: 1.15rem;
          font-weight: 600;
          color: #ffffff;
        }

        .grid-subheading {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .grid-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.4rem 0.75rem;
          border-radius: 10px;
        }

        .search-input {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.825rem;
          outline: none;
          width: 140px;
          font-family: inherit;
        }

        .search-input::placeholder {
          color: #64748b;
        }

        .risk-filter-pills {
          display: flex;
          align-items: center;
          background: rgba(30, 41, 59, 0.6);
          padding: 0.2rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          gap: 0.2rem;
        }

        .pill-btn {
          padding: 0.3rem 0.65rem;
          border-radius: 7px;
          font-size: 0.76rem;
          font-weight: 500;
          color: #94a3b8;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .pill-btn-active {
          background: #334155;
          color: #ffffff !important;
        }

        .pill-btn-critical.pill-btn-active {
          background: rgba(239, 68, 68, 0.3);
          color: #fca5a5 !important;
        }

        .pill-btn-moderate.pill-btn-active {
          background: rgba(249, 115, 22, 0.3);
          color: #fdba74 !important;
        }

        .pill-btn-surveillance.pill-btn-active {
          background: rgba(16, 185, 129, 0.3);
          color: #6ee7b7 !important;
        }

        .sort-box {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.4rem 0.65rem;
          border-radius: 10px;
        }

        .sort-select {
          background: transparent;
          border: none;
          color: #cbd5e1;
          font-size: 0.78rem;
          outline: none;
          font-family: inherit;
          cursor: pointer;
        }

        .sort-select option {
          background: #0f172a;
          color: #ffffff;
        }

        .districts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.15rem;
        }

        .district-card {
          background: rgba(30, 41, 59, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .district-card:hover {
          transform: translateY(-3px);
          background: rgba(30, 41, 59, 0.8);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .district-title-box {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .district-name {
          font-size: 1.05rem;
          font-weight: 600;
          color: #ffffff;
        }

        .rank-chip {
          font-size: 0.72rem;
          font-weight: 600;
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.12);
          padding: 0.1rem 0.4rem;
          border-radius: 6px;
        }

        .card-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background: rgba(15, 23, 42, 0.5);
          padding: 0.65rem 0.5rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .stat-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-label {
          font-size: 0.68rem;
          color: #94a3b8;
          margin-bottom: 0.2rem;
        }

        .stat-val-group {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
        }

        .stat-val-main {
          font-size: 0.98rem;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-val-unit {
          font-size: 0.65rem;
          color: #64748b;
        }

        .card-sparkline-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sparkline-title {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .sparkline-bars {
          display: flex;
          align-items: flex-end;
          gap: 0.35rem;
          height: 26px;
        }

        .sparkline-bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
        }

        .sparkline-bar {
          width: 8px;
          border-radius: 2px 2px 0 0;
          transition: height 0.3s ease;
        }

        .sparkline-yr {
          font-size: 0.6rem;
          color: #64748b;
          margin-top: 0.15rem;
        }

        .card-arrow {
          transition: transform 0.2s ease;
        }

        .district-card:hover .card-arrow {
          transform: translateX(3px);
          color: #f97316;
        }
      `}</style>
    </div>
  );
};
