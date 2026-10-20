'use client';

import React from 'react';
import { Database, Eye, EyeOff, FileSpreadsheet, Printer, PlusCircle, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  isSupabaseConnected: boolean;
  showSummaryMetrics: boolean;
  setShowSummaryMetrics: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenExportModal: () => void;
  onOpenPosModal: () => void;
  onOpenEntryTypeModal: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isSupabaseConnected,
  showSummaryMetrics,
  setShowSummaryMetrics,
  onOpenExportModal,
  onOpenPosModal,
  onOpenEntryTypeModal,
  onLogout
}) => {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto 32px auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            The Baker Bro — Admin Dashboard
          </h1>
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            background: isSupabaseConnected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: isSupabaseConnected ? '#4ade80' : '#fbbf24',
            border: `1px solid ${isSupabaseConnected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Database size={13} /> {isSupabaseConnected ? 'Live' : 'Demo Mode (Local)'}
          </span>
        </div>
      </div>

      {/* Top Actions */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Hide / Unhide Analytics Metrics Toggle Button (Default Hidden) */}
        <button
          type="button"
          onClick={() => setShowSummaryMetrics(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: showSummaryMetrics ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: showSummaryMetrics ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
            color: showSummaryMetrics ? '#fbbf24' : '#94a3b8',
            padding: '8px 14px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: showSummaryMetrics ? '0 2px 10px rgba(245, 158, 11, 0.2)' : 'none'
          }}>
          {showSummaryMetrics ? <EyeOff size={15} /> : <Eye size={15} />}
          <span>{showSummaryMetrics ? 'Hide Analytics' : 'Show Analytics'}</span>
        </button>

        <button
          onClick={onOpenExportModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            border: 'none',
            padding: '9px 16px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}>
          <FileSpreadsheet size={15} /> Export to Excel
        </button>

        {/* POS Bill Print & Quick Sale Button */}
        <button
          onClick={onOpenPosModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            color: '#fff',
            border: '1px solid rgba(196, 181, 253, 0.3)',
            padding: '9px 18px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(139, 92, 246, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(139, 92, 246, 0.4)';
          }}>
          <Printer size={16} /> POS Counter Sale
        </button>

        <button
          onClick={onOpenEntryTypeModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: '#fff',
            border: 'none',
            padding: '9px 16px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
            transition: 'all 0.2s ease'
          }}>
          <PlusCircle size={16} /> Add New Entry
        </button>

        {/* Lock / Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          title="Lock Dashboard / Logout"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '9px 14px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}>
          <LogOut size={15} />
          <span>Lock / Logout</span>
        </button>
      </div>
    </div>
  );
};
