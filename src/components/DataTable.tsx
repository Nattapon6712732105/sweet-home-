'use client';

import React, { useState, useMemo } from 'react';
import { RawRecord, RiskLevel } from '@/lib/types';
import { Table, Search, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  records: RawRecord[];
  selectedYear: number | 'all';
}

type SortField = 'year' | 'district' | 'villages' | 'patients' | 'ratio';

export const DataTable: React.FC<Props> = ({ records, selectedYear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('patients');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for numbers
    }
  };

  const processed = useMemo(() => {
    let list = records.filter((r) => {
      const matchYear = selectedYear === 'all' || r.year === selectedYear;
      const matchSearch = r.district.toLowerCase().includes(searchTerm.toLowerCase());
      return matchYear && matchSearch;
    });

    list.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'year') {
        valA = a.year;
        valB = b.year;
      } else if (sortField === 'district') {
        valA = a.district;
        valB = b.district;
      } else if (sortField === 'villages') {
        valA = a.villages;
        valB = b.villages;
      } else if (sortField === 'patients') {
        valA = a.patients;
        valB = b.patients;
      } else if (sortField === 'ratio') {
        valA = a.villages > 0 ? a.patients / a.villages : 0;
        valB = b.villages > 0 ? b.patients / b.villages : 0;
      }

      if (typeof valA === 'string') {
        const cmp = valA.localeCompare(valB, 'th');
        return sortAsc ? cmp : -cmp;
      }

      return sortAsc ? valA - valB : valB - valA;
    });

    return list;
  }, [records, selectedYear, searchTerm, sortField, sortAsc]);

  const totalPages = Math.ceil(processed.length / pageSize) || 1;
  const paginatedRows = processed.slice((page - 1) * pageSize, page * pageSize);

  const exportCurrentTable = () => {
    const header = 'ปี,อำเภอ,หมู่บ้าน/ชุมชน,ผู้ป่วยเข้ารับบำบัด\n';
    const rows = processed.map(r => `${r.year},${r.district},${r.villages},${r.patients}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sisaket_rehab_filtered_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={13} className="text-slate-500" />;
    }
    return sortAsc ? <ArrowUp size={13} className="text-amber-400" /> : <ArrowDown size={13} className="text-amber-400" />;
  };

  return (
    <div className="glass-panel table-card">
      <div className="table-header-bar">
        <div className="table-title-group">
          <div className="table-icon-box">
            <Table size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="table-heading">ตารางฐานข้อมูลดิบ (On-the-Fly Dynamic Table)</h2>
            <p className="table-subheading">
              ค้นหา กรอง และส่งออกข้อมูลผู้ป่วยบำบัดรายอำเภอ ({processed.length} รายการ)
            </p>
          </div>
        </div>

        <div className="table-action-bar">
          <div className="search-box">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่ออำเภอ..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
          </div>

          <button onClick={exportCurrentTable} className="btn btn-secondary btn-sm">
            <Download size={14} />
            <span>ส่งออก CSV ที่กรอง</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('year')} className="sortable-th">
                <div className="th-content">ปี พ.ศ. {renderSortIcon('year')}</div>
              </th>
              <th onClick={() => handleSort('district')} className="sortable-th">
                <div className="th-content">อำเภอ {renderSortIcon('district')}</div>
              </th>
              <th onClick={() => handleSort('villages')} className="sortable-th">
                <div className="th-content">หมู่บ้าน/ชุมชน {renderSortIcon('villages')}</div>
              </th>
              <th onClick={() => handleSort('patients')} className="sortable-th">
                <div className="th-content">ผู้ป่วยเข้ารับบำบัด {renderSortIcon('patients')}</div>
              </th>
              <th onClick={() => handleSort('ratio')} className="sortable-th">
                <div className="th-content">อัตราส่วน (คน/ชุมชน) {renderSortIcon('ratio')}</div>
              </th>
              <th>สถานะความเสี่ยง</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-slate-400">
                  ไม่พบข้อมูลตามเงื่อนไขที่เลือก
                </td>
              </tr>
            ) : (
              paginatedRows.map((r, i) => {
                const ratio = r.villages > 0 ? (r.patients / r.villages).toFixed(1) : '0';
                let riskBadge = 'badge-surveillance';
                let riskText = 'เฝ้าระวัง';

                if (r.patients >= 50) {
                  riskBadge = 'badge-critical';
                  riskText = 'วิกฤต';
                } else if (r.patients >= 20) {
                  riskBadge = 'badge-moderate';
                  riskText = 'ปานกลาง';
                }

                return (
                  <tr key={`${r.year}-${r.district}-${i}`} className="table-row">
                    <td>
                      <span className="year-cell">พ.ศ. {r.year}</span>
                    </td>
                    <td>
                      <strong className="district-cell">อ.{r.district}</strong>
                    </td>
                    <td>{r.villages} ชุมชน</td>
                    <td>
                      <span className="patient-cell text-amber-300 font-bold">{r.patients.toLocaleString()} ราย</span>
                    </td>
                    <td>{ratio} คน/ชุมชน</td>
                    <td>
                      <span className={`badge ${riskBadge}`}>{riskText}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <span className="page-info">
            แสดงหน้า {page} จาก {totalPages} (ทั้งหมด {processed.length} รายการ)
          </span>
          <div className="page-buttons">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="page-nav-btn"
            >
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`page-num-btn ${page === p ? 'page-num-active' : ''}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="page-nav-btn"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .table-card {
          padding: 1.5rem;
          margin-bottom: 2.5rem;
          background: rgba(15, 23, 42, 0.75);
        }

        .table-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .table-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .table-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(249, 115, 22, 0.15);
          border: 1px solid rgba(249, 115, 22, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .table-heading {
          font-size: 1.15rem;
          font-weight: 600;
          color: #ffffff;
        }

        .table-subheading {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .table-action-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.4rem;
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

        .btn-sm {
          padding: 0.45rem 0.85rem;
          font-size: 0.8rem;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          text-align: left;
        }

        .data-table th {
          background: rgba(30, 41, 59, 0.8);
          color: #cbd5e1;
          font-weight: 600;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          white-space: nowrap;
        }

        .sortable-th {
          cursor: pointer;
          user-select: none;
        }

        .sortable-th:hover {
          background: #334155;
          color: #ffffff;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.15s ease;
        }

        .table-row:hover {
          background: rgba(30, 41, 59, 0.6);
        }

        .data-table td {
          padding: 0.75rem 1rem;
          color: #cbd5e1;
          white-space: nowrap;
        }

        .year-cell {
          font-weight: 500;
          color: #94a3b8;
        }

        .district-cell {
          color: #ffffff;
        }

        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.25rem;
          margin-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-info {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .page-buttons {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .page-nav-btn {
          padding: 0.35rem 0.75rem;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          border-radius: 8px;
          font-size: 0.78rem;
          cursor: pointer;
          font-family: inherit;
        }

        .page-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-num-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(30, 41, 59, 0.4);
          color: #cbd5e1;
          font-size: 0.78rem;
          cursor: pointer;
          font-family: inherit;
        }

        .page-num-active {
          background: #f97316;
          border-color: #ea580c;
          color: #ffffff;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
