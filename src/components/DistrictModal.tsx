'use client';

import React, { useEffect } from 'react';
import { DistrictSummary } from '@/lib/types';
import { X, MapPin, AlertCircle } from 'lucide-react';

interface Props {
  district: DistrictSummary | null;
  onClose: () => void;
}

export const DistrictModal: React.FC<Props> = ({ district, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!district) return null;

  const years = Object.keys(district.yearlyData).map(Number).sort((a, b) => a - b);
  const maxPatients = Math.max(...years.map(yr => district.yearlyData[yr]?.patients || 0), 1);

  let riskBadge = 'badge-surveillance';
  let riskText = 'ระดับเฝ้าระวังปกติ';
  let riskAdvice = 'ติดตามสถานการณ์ต่อเนื่อง เสริมสร้างมาตรการชุมชนเข้มแข็งและการบำบัดแบบสมัครใจ';

  if (district.riskLevel === 'critical') {
    riskBadge = 'badge-critical';
    riskText = 'ระดับวิกฤต (พื้นที่เป้าหมายเร่งด่วน)';
    riskAdvice = 'ต้องบูรณาการชุดปฏิบัติการเชิงรุก (Rehab Taskforce) เพิ่มโควตาการบำบัด และติดตามหลังการบำบัดอย่างใกล้ชิด';
  } else if (district.riskLevel === 'moderate') {
    riskBadge = 'badge-moderate';
    riskText = 'ระดับปานกลาง (เฝ้าระวังพิเศษ)';
    riskAdvice = 'ขยายเครือข่ายความร่วมมือระดับหมู่บ้าน/ชุมชน และจัดตั้งศูนย์คัดกรองระดับตำบล';
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-top">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <MapPin size={22} className="text-amber-400" />
            </div>
            <div>
              <div className="modal-title-row">
                <h3 className="modal-district-name">อำเภอ{district.district}</h3>
                {district.rank && (
                  <span className="modal-rank-badge">อันดับที่ #{district.rank} ของจังหวัด</span>
                )}
              </div>
              <p className="modal-district-sub">
                จังหวัดศรีสะเกษ • สถิติย้อนหลัง 4 ปี (พ.ศ. 2565 - 2568)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="modal-close-btn" aria-label="ปิด">
            <X size={20} />
          </button>
        </div>

        {/* Risk Banner */}
        <div className="modal-risk-banner">
          <div className="risk-banner-header">
            <span className={`badge ${riskBadge}`}>{riskText}</span>
            <span className="risk-ratio-tag">เฉลี่ย {district.patientPerVillage} รายต่อชุมชน</span>
          </div>
          <p className="risk-advice-text">
            <AlertCircle size={15} className="inline-icon text-amber-400" />
            {riskAdvice}
          </p>
        </div>

        {/* 4-Year Progress Chart */}
        <div className="history-chart-card">
          <span className="history-heading">สถิติแนวโน้มผู้ป่วยรายปี (พ.ศ. 2565 - 2568)</span>
          <div className="history-bars">
            {years.map((yr) => {
              const data = district.yearlyData[yr];
              const pCount = data?.patients || 0;
              const vCount = data?.villages || 0;
              const hPercent = Math.max((pCount / maxPatients) * 100, 8);

              return (
                <div key={yr} className="history-bar-col">
                  <span className="history-bar-val">{pCount} ราย</span>
                  <div className="history-bar-track">
                    <div
                      className="history-bar-fill"
                      style={{
                        height: `${hPercent}%`,
                        background: district.riskLevel === 'critical'
                          ? 'linear-gradient(180deg, #f87171 0%, #ef4444 100%)'
                          : 'linear-gradient(180deg, #fbbf24 0%, #f97316 100%)',
                      }}
                    />
                  </div>
                  <span className="history-bar-yr">พ.ศ. {yr}</span>
                  <span className="history-bar-villages">{vCount} ชุมชน</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="modal-table-section">
          <h4 className="table-heading">ตารางรายละเอียดรายปี</h4>
          <table className="history-table">
            <thead>
              <tr>
                <th>ปี พ.ศ.</th>
                <th>จำนวนผู้ป่วย (ราย)</th>
                <th>หมู่บ้าน/ชุมชน (แห่ง)</th>
                <th>เฉลี่ย (ราย/ชุมชน)</th>
              </tr>
            </thead>
            <tbody>
              {years.map((yr) => {
                const row = district.yearlyData[yr];
                const p = row?.patients || 0;
                const v = row?.villages || 0;
                const ratio = v > 0 ? (p / v).toFixed(1) : '0';
                return (
                  <tr key={yr}>
                    <td><strong>พ.ศ. {yr}</strong></td>
                    <td className="text-amber-300 font-bold">{p.toLocaleString()}</td>
                    <td>{v}</td>
                    <td>{ratio}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Close footer button */}
        <div className="modal-bottom">
          <button onClick={onClose} className="btn btn-secondary w-full">
            ปิดหน้าต่าง
          </button>
        </div>

      </div>

      <style jsx>{`
        .modal-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .modal-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(249, 115, 22, 0.15);
          border: 1px solid rgba(249, 115, 22, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .modal-district-name {
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
        }

        .modal-rank-badge {
          font-size: 0.75rem;
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          font-weight: 600;
        }

        .modal-district-sub {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 0.2rem;
        }

        .modal-close-btn {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          color: #ffffff;
          background: #334155;
        }

        .modal-risk-banner {
          margin: 1.25rem 1.75rem 0;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 12px;
          padding: 1rem;
        }

        .risk-banner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .risk-ratio-tag {
          font-size: 0.76rem;
          color: #cbd5e1;
        }

        .risk-advice-text {
          font-size: 0.825rem;
          color: #cbd5e1;
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          line-height: 1.4;
        }

        .history-chart-card {
          margin: 1.25rem 1.75rem 0;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .history-heading {
          font-size: 0.85rem;
          font-weight: 600;
          color: #cbd5e1;
          display: block;
          margin-bottom: 1rem;
        }

        .history-bars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
          gap: 1rem;
          align-items: flex-end;
          height: 140px;
        }

        .history-bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
        }

        .history-bar-val {
          font-size: 0.78rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.35rem;
        }

        .history-bar-track {
          width: 38px;
          height: 80px;
          background: rgba(30, 41, 59, 0.5);
          border-radius: 6px 6px 0 0;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .history-bar-fill {
          width: 100%;
          border-radius: 4px 4px 0 0;
          transition: height 0.4s ease;
        }

        .history-bar-yr {
          font-size: 0.75rem;
          font-weight: 600;
          color: #f1f5f9;
          margin-top: 0.4rem;
        }

        .history-bar-villages {
          font-size: 0.65rem;
          color: #94a3b8;
        }

        .modal-table-section {
          padding: 1.25rem 1.75rem;
        }

        .table-heading {
          font-size: 0.85rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.65rem;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.825rem;
        }

        .history-table th {
          text-align: left;
          padding: 0.5rem;
          background: rgba(30, 41, 59, 0.6);
          color: #94a3b8;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .history-table td {
          padding: 0.55rem 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #cbd5e1;
        }

        .modal-bottom {
          padding: 0 1.75rem 1.5rem;
        }

        .w-full {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
