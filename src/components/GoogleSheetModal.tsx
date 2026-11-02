'use client';

import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  Download,
  Copy,
  Check,
  HelpCircle,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { DEFAULT_CSV_TEXT } from '@/lib/defaultData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSheetUrl?: string;
  onConnectSheet: (url: string) => Promise<boolean>;
  onResetToDefault: () => void;
}

export const GoogleSheetModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentSheetUrl = '',
  onConnectSheet,
  onResetToDefault,
}) => {
  const [inputUrl, setInputUrl] = useState(currentSheetUrl);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!inputUrl.trim()) {
      setErrorMessage('กรุณากรอกลิงก์หรือรหัส Google Sheet');
      return;
    }

    setLoading(true);
    try {
      const ok = await onConnectSheet(inputUrl.trim());
      if (ok) {
        setSuccessMessage('เชื่อมต่อ Google Sheet และประมวลผล On the Fly สำเร็จแล้ว!');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage('ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบสิทธิ์การแชร์ของชีต (ต้องเปิดเป็น Everyone with the link can view)');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([DEFAULT_CSV_TEXT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sisaket_rehab_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(DEFAULT_CSV_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content sheet-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="sheet-modal-header">
          <div className="header-left">
            <div className="icon-badge">
              <FileSpreadsheet size={24} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="modal-title">เชื่อมต่อ Google Drive & Google Sheet</h3>
              <p className="modal-sub">ประมวลผลสถิติและแดชบอร์ดแบบ On the Fly แบบสดๆ ครั้งต่อครั้ง</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="ปิด">
            <X size={20} />
          </button>
        </div>

        <div className="sheet-modal-body">
          
          {/* Connection Form */}
          <form onSubmit={handleConnect} className="connect-form">
            <label className="input-label">
              ลิงก์ Google Sheet หรือ Spreadsheet ID:
            </label>
            <div className="input-group">
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMV.../edit"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="url-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary connect-submit-btn"
              >
                {loading ? 'กำลังเชื่อมต่อ...' : 'เชื่อมต่อ On the Fly'}
              </button>
            </div>

            {/* Status alerts */}
            {errorMessage && (
              <div className="alert alert-error">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success">
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Fast actions */}
            <div className="form-quick-actions">
              <button
                type="button"
                onClick={() => {
                  onResetToDefault();
                  setInputUrl('');
                  onClose();
                }}
                className="quick-link text-slate-400"
              >
                ↩ ใช้ข้อมูลตั้งต้นของจังหวัดศรีสะเกษ
              </button>

              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="quick-link text-emerald-400"
              >
                <ExternalLink size={13} />
                สร้าง Google Sheet เปล่าใหม่ (sheets.new)
              </a>
            </div>
          </form>

          {/* Guide Section */}
          <div className="guide-card">
            <div className="guide-header">
              <FolderOpen size={18} className="text-amber-400" />
              <h4 className="guide-title">คู่มือ 5 ขั้นตอนนำไฟล์ขึ้น Google Drive (Google Sheet)</h4>
            </div>

            <ol className="guide-steps">
              <li className="step-item">
                <div className="step-num">1</div>
                <div className="step-content">
                  <strong>ดาวน์โหลดไฟล์ .CSV หรือคัดลอกข้อมูล</strong>
                  <p>ระบบได้แปลงข้อมูลทั้ง 22 อำเภอ (2565-2568) เป็นรูปแบบมาตรฐานพร้อมนำเข้า</p>
                  <div className="step-buttons">
                    <button type="button" onClick={handleDownload} className="btn-step-action">
                      <Download size={13} />
                      ดาวน์โหลดไฟล์ sisaket_rehab_data.csv
                    </button>
                    <button type="button" onClick={handleCopy} className="btn-step-action">
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copied ? 'คัดลอกสำเร็จ!' : 'คัดลอกตาราง CSV'}
                    </button>
                  </div>
                </div>
              </li>

              <li className="step-item">
                <div className="step-num">2</div>
                <div className="step-content">
                  <strong>เปิด Google Drive และสร้าง Google Sheet</strong>
                  <p>เข้าไปที่ Google Drive (drive.google.com) กดปุ่ม "+ ใหม่" (New) &gt; เลือก "Google ชีต" (Google Sheets)</p>
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="drive-link"
                  >
                    <ExternalLink size={12} />
                    เปิด Google Drive ของคุณ
                  </a>
                </div>
              </li>

              <li className="step-item">
                <div className="step-num">3</div>
                <div className="step-content">
                  <strong>นำเข้าข้อมูล CSV เข้าสู่ Google Sheet</strong>
                  <p>ใน Google Sheet ไปที่เมนู <strong>ไฟล์ (File) &gt; นำเข้า (Import) &gt; อัปโหลด (Upload)</strong> แล้วเลือกไฟล์ CSV ที่ดาวน์โหลดไว้ หรือวางข้อความลงในแผ่นงาน</p>
                </div>
              </li>

              <li className="step-item">
                <div className="step-num">4</div>
                <div className="step-content">
                  <strong>เปิดสิทธิ์แชร์เป็นสาธารณะ (สำคัญมาก)</strong>
                  <p>กดปุ่ม <strong>"แชร์" (Share)</strong> สีเขียวขวาบน &gt; ตรงการเข้าถึงทั่วไปเปลี่ยนเป็น <strong>"ทุกคนที่มีลิงก์ (มีสิทธิ์ดู / Anyone with the link - Viewer)"</strong></p>
                </div>
              </li>

              <li className="step-item">
                <div className="step-num">5</div>
                <div className="step-content">
                  <strong>คัดลอกลิงก์มาวางในระบบ</strong>
                  <p>กดปุ่ม "คัดลอกลิงก์" (Copy link) นำมาวางในช่องด้านบน แล้วกด <strong>"เชื่อมต่อ On the Fly"</strong> ระบบจะดึงข้อมูลสดและคำนวณ Dashboard ใหม่ทันที!</p>
                </div>
              </li>
            </ol>
          </div>

        </div>

      </div>

      <style jsx>{`
        .sheet-modal {
          max-width: 720px;
        }

        .sheet-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }

        .modal-sub {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 0.15rem;
        }

        .close-btn {
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

        .close-btn:hover {
          color: #ffffff;
          background: #334155;
        }

        .sheet-modal-body {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .connect-form {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .input-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #f1f5f9;
        }

        .input-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .url-input {
          flex-grow: 1;
          min-width: 260px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(249, 115, 22, 0.3);
          color: #ffffff;
          padding: 0.7rem 1rem;
          border-radius: 12px;
          font-size: 0.88rem;
          outline: none;
          font-family: inherit;
        }

        .url-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 12px rgba(249, 115, 22, 0.3);
        }

        .connect-submit-btn {
          padding: 0.7rem 1.25rem;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          font-size: 0.825rem;
          margin-top: 0.25rem;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid #ef4444;
          color: #fca5a5;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid #10b981;
          color: #6ee7b7;
        }

        .form-quick-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          margin-top: 0.25rem;
        }

        .quick-link {
          background: transparent;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          text-decoration: underline;
          font-family: inherit;
        }

        .quick-link:hover {
          color: #ffffff;
        }

        .guide-card {
          background: rgba(30, 41, 59, 0.45);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 14px;
          padding: 1.25rem;
        }

        .guide-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .guide-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .guide-steps {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .step-item {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(249, 115, 22, 0.2);
          border: 1px solid #f97316;
          color: #fdba74;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .step-content {
          font-size: 0.825rem;
          color: #cbd5e1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .step-content strong {
          color: #ffffff;
        }

        .step-buttons {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.4rem;
          flex-wrap: wrap;
        }

        .btn-step-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          font-size: 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .btn-step-action:hover {
          background: #334155;
          border-color: #f97316;
        }

        .drive-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #38bdf8;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          text-decoration: underline;
        }

        .drive-link:hover {
          color: #7dd3fc;
        }
      `}</style>
    </div>
  );
};
