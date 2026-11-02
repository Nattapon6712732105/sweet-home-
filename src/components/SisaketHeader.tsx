'use client';

import React from 'react';
import Image from 'next/image';
import { RefreshCw, Download, Sparkles } from 'lucide-react';
import { DashboardMetrics } from '@/lib/types';
import { DEFAULT_CSV_TEXT } from '@/lib/defaultData';

interface Props {
  metrics: DashboardMetrics;
  onRefresh: () => void;
  isLoading: boolean;
}

export const SisaketHeader: React.FC<Props> = ({
  metrics,
  onRefresh,
  isLoading,
}) => {

  const handleDownloadCSV = () => {
    const blob = new Blob([DEFAULT_CSV_TEXT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sisaket_rehab_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLive = metrics.source === 'google-sheets';

  return (
    <header className="header-wrapper">
      {/* Top Identity Bar */}
      <div className="header-banner-container">
        <div className="header-banner-overlay" />
        <div className="header-content container">
          
          {/* Logo & Title */}
          <div className="header-brand">
            <div className="logo-container">
              <Image
                src="/images/sisaket_seal.jpg"
                alt="ตราประจำจังหวัดศรีสะเกษ ดอกลำดวน"
                width={76}
                height={76}
                className="logo-img"
                priority
              />
              <div className="dok-lamduan-glow" />
            </div>

            <div className="brand-text">
              <div className="brand-pill">
                <Sparkles size={14} className="text-amber-400" />
                <span>จังหวัดศรีสะเกษ • แดนปราสาทขอม ดอกลำดวนบาน</span>
              </div>
              <h1 className="brand-title">
                ระบบศูนย์ข้อมูลการบำบัดฟื้นฟูผู้ติดยาเสพติด
              </h1>
              <p className="brand-subtitle">
                ศูนย์ปฏิบัติการข้อมูล ศอ.ปส.จ.ศก. • ประมวลผลและวิเคราะห์ข้อมูลแบบ Real-time On the Fly
              </p>
            </div>
          </div>

          {/* Dynamic Sync Status & Quick Actions */}
          <div className="header-actions">
            
            {/* Live Data Badge */}
            <div className={`status-pill ${isLive ? 'status-live' : 'status-cached'}`}>
              <span className={`pulse-dot ${isLive ? 'pulse-dot-green' : 'bg-amber-400'}`} />
              <div className="status-text">
                <span className="status-label">
                  {isLive ? 'Google Sheet สด (On the Fly)' : 'ข้อมูลตั้งต้น (Default Cache)'}
                </span>
                <span className="status-time">อัปเดต: {metrics.lastUpdated}</span>
              </div>
            </div>

            {/* Action Buttons (View-Only & Safe) */}
            <div className="action-buttons-group">
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="btn btn-primary"
                title="ดึงข้อมูลล่าสุดจาก Google Sheet ทันที"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>{isLoading ? 'กำลังประมวลผล...' : 'รีเฟรชสด (On the Fly)'}</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="btn btn-secondary"
                title="ดาวน์โหลดชุดข้อมูลรายงาน (CSV)"
              >
                <Download size={16} />
                <span>ดาวน์โหลดรายงาน (CSV)</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      <style jsx>{`
        .header-wrapper {
          position: relative;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(249, 115, 22, 0.25);
        }

        .header-banner-container {
          position: relative;
          background-image: url('/images/sisaket_banner.jpg');
          background-size: cover;
          background-position: center 30%;
          padding: 2.25rem 0 2rem;
          box-shadow: inset 0 -40px 60px #070b14, 0 10px 30px rgba(0, 0, 0, 0.6);
        }

        .header-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7, 11, 20, 0.82) 0%,
            rgba(15, 23, 42, 0.88) 60%,
            rgba(7, 11, 20, 0.98) 100%
          );
          backdrop-filter: blur(2px);
        }

        .header-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .logo-container {
          position: relative;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #9a3412 100%);
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.5);
          flex-shrink: 0;
        }

        .logo-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .dok-lamduan-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
          pointer-events: none;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .brand-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.785rem;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          padding: 0.2rem 0.65rem;
          border-radius: 9999px;
          width: fit-content;
          font-weight: 500;
        }

        .brand-title {
          font-size: 1.65rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
          line-height: 1.25;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .brand-subtitle {
          font-size: 0.885rem;
          color: #cbd5e1;
          font-weight: 400;
        }

        .header-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.75rem;
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.4rem 0.85rem;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .status-live {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(6, 78, 59, 0.25);
        }

        .status-cached {
          border-color: rgba(245, 158, 11, 0.4);
          background: rgba(120, 53, 15, 0.25);
        }

        .status-text {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .status-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #f1f5f9;
        }

        .status-time {
          font-size: 0.68rem;
          color: #94a3b8;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            align-items: flex-start;
            width: 100%;
          }

          .brand-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </header>
  );
};
