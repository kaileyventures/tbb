'use client';

import React from 'react';
import { AlertTriangle, Trash2, Printer, TrendingUp, ShoppingBag, FileSpreadsheet } from 'lucide-react';
import { SaleEntry, PurchaseEntry, TrashEntry } from '@/types/admin';
import { exportSingleToExcel, exportBothToExcel } from '@/utils/excelExport';

// --- Delete Target Confirmation Modal ---
interface DeleteConfirmModalProps {
  deleteTarget: { type: 'sale' | 'purchase'; item: SaleEntry | PurchaseEntry } | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  deleteTarget,
  onCancel,
  onConfirm
}) => {
  if (!deleteTarget) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px' }}>
      <div style={{ background: '#111827', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
        <div style={{ width: '56px', height: '56px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 20px auto' }}>
          <AlertTriangle size={28} />
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#f87171', margin: '0 0 8px 0' }}>
          Move {deleteTarget.type === 'sale' ? 'Sale' : 'Purchase'} Entry to Trash?
        </h3>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
          Are you sure you want to move <b>"{deleteTarget.item.item_name}"</b> to Trash? It can be restored anytime within 20 days.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}>
            Move to Trash
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Permanent Delete Confirmation Modal ---
interface PermanentDeleteConfirmModalProps {
  permanentDeleteTarget: TrashEntry | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PermanentDeleteConfirmModal: React.FC<PermanentDeleteConfirmModalProps> = ({
  permanentDeleteTarget,
  onCancel,
  onConfirm
}) => {
  if (!permanentDeleteTarget) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px' }}>
      <div style={{ background: '#111827', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)' }}>
        <div style={{ width: '56px', height: '56px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 20px auto' }}>
          <Trash2 size={28} />
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444', margin: '0 0 8px 0' }}>
          Erase Permanently from Trash?
        </h3>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
          Are you sure you want to permanently erase <b>"{permanentDeleteTarget.item.item_name}"</b>? This action <b>CANNOT</b> be undone and cannot be recovered.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }}>
            Erase Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Select Entry Type Modal ---
interface EntryTypeModalProps {
  showEntryTypeModal: boolean;
  setShowEntryTypeModal: (show: boolean) => void;
  onOpenPos: () => void;
  onOpenSaleModal: () => void;
  onOpenPurchaseModal: () => void;
}

export const EntryTypeModal: React.FC<EntryTypeModalProps> = ({
  showEntryTypeModal,
  setShowEntryTypeModal,
  onOpenPos,
  onOpenSaleModal,
  onOpenPurchaseModal
}) => {
  if (!showEntryTypeModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px' }}>
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '28px', padding: '36px 32px', width: '100%', maxWidth: '520px', textAlign: 'center', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.85)' }}>

        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #f59e0b 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Create New Ledger Record
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px', lineHeight: '1.5' }}>
          Select the type of financial transaction you want to record.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>

          {/* Option 1: POS Counter Sale */}
          <button
            onClick={() => {
              setShowEntryTypeModal(false);
              onOpenPos();
            }}
            style={{
              background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.04) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              borderRadius: '20px',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#a78bfa')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)')}>

            <div style={{ width: '52px', height: '52px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4b5fd' }}>
              <Printer size={26} />
            </div>

            <div>
              <div style={{ color: '#c4b5fd', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>
                POS Counter Sale
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.3' }}>
                Touch POS, 3-inch thermal slip print & auto-save
              </div>
            </div>

          </button>

          {/* Option 2: Sale Entry */}
          <button
            onClick={() => {
              setShowEntryTypeModal(false);
              onOpenSaleModal();
            }}
            style={{
              background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.03) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '20px',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fbbf24')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)')}>

            <div style={{ width: '52px', height: '52px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <TrendingUp size={26} />
            </div>

            <div>
              <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>
                Sale Entry
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.3' }}>
                Customer orders, cakes & bakery sales revenue
              </div>
            </div>

          </button>

          {/* Option 3: Purchase Entry */}
          <button
            onClick={() => {
              setShowEntryTypeModal(false);
              onOpenPurchaseModal();
            }}
            style={{
              background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.03) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '20px',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#818cf8')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)')}>

            <div style={{ width: '52px', height: '52px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <ShoppingBag size={26} />
            </div>

            <div>
              <div style={{ color: '#818cf8', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>
                Purchase Entry
              </div>
              <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.3' }}>
                Raw materials, flour, butter & supplies expenses
              </div>
            </div>

          </button>

        </div>

        <button
          onClick={() => setShowEntryTypeModal(false)}
          style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#94a3b8', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          Cancel
        </button>

      </div>
    </div>
  );
};

// --- Export Modal ---
interface ExportModalProps {
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  filteredSales: SaleEntry[];
  filteredPurchases: PurchaseEntry[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  showExportModal,
  setShowExportModal,
  filteredSales,
  filteredPurchases
}) => {
  if (!showExportModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px' }}>
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '28px', padding: '36px 32px', width: '100%', maxWidth: '560px', textAlign: 'center', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.85)' }}>

        <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', margin: '0 auto 16px auto' }}>
          <FileSpreadsheet size={28} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Export Excel Report
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px', lineHeight: '1.5' }}>
          Choose which report data you would like to download into Excel:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>

          {/* Option 1: Sales Only */}
          <button
            onClick={() => {
              setShowExportModal(false);
              exportSingleToExcel(filteredSales, 'TBB_SALES_REPORT', 'Sales');
            }}
            style={{
              background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.03) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '18px',
              padding: '20px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fbbf24')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)')}>
            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: '#fbbf24' }}>
              <TrendingUp size={22} />
            </div>
            <div>
              <div style={{ color: '#fbbf24', fontWeight: '800', fontSize: '14px', marginBottom: '2px' }}>Sales Only</div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>{filteredSales.length} records</div>
            </div>
          </button>

          {/* Option 2: Purchases Only */}
          <button
            onClick={() => {
              setShowExportModal(false);
              exportSingleToExcel(filteredPurchases, 'TBB_PURCHASES_REPORT', 'Purchases');
            }}
            style={{
              background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.03) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '18px',
              padding: '20px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#818cf8')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)')}>
            <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px', color: '#818cf8' }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <div style={{ color: '#818cf8', fontWeight: '800', fontSize: '14px', marginBottom: '2px' }}>Purchases Only</div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>{filteredPurchases.length} records</div>
            </div>
          </button>

          {/* Option 3: Both (Sales & Purchases) */}
          <button
            onClick={() => {
              setShowExportModal(false);
              exportBothToExcel(filteredSales, filteredPurchases, 'TBB_COMPLETE');
            }}
            style={{
              background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.04) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '18px',
              padding: '20px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#34d399')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)')}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#34d399' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div style={{ color: '#34d399', fontWeight: '800', fontSize: '14px', marginBottom: '2px' }}>Both (Full)</div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>Multi-sheet Excel</div>
            </div>
          </button>

        </div>

        <button
          onClick={() => setShowExportModal(false)}
          style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#94a3b8', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          Cancel
        </button>

      </div>
    </div>
  );
};
