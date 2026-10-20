'use client';

import React from 'react';
import { RotateCcw, Trash2, Edit2, Info } from 'lucide-react';
import { SaleEntry, PurchaseEntry, TrashEntry } from '@/types/admin';
import { formatDateFormatted, formatIndianCurrency, formatEntryFullDateTime, parsePurchaseNotes, normalizePaymentMethod } from './adminUtils';

export type UnifiedEntry =
  | { type: 'sale'; data: SaleEntry; id: string; date: string; createdTimestamp: number }
  | { type: 'purchase'; data: PurchaseEntry; id: string; date: string; createdTimestamp: number };

export type SortField = 'type' | 'date' | 'item_name' | 'category' | 'quantity' | 'unit_price' | 'total_amount' | 'details' | 'createdTimestamp';

interface AdminTableProps {
  ledgerFilter: 'all' | 'sales' | 'purchases' | 'trash';
  trash: TrashEntry[];
  paginatedEntries: UnifiedEntry[];
  filteredUnifiedCount: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  totalPages: number;
  sortField: SortField;
  sortOrder: 'asc' | 'desc';
  handleSort: (field: SortField) => void;
  onRestoreFromTrash: (item: TrashEntry) => void;
  onPermanentDeleteTarget: (item: TrashEntry) => void;
  onEditSale: (sale: SaleEntry) => void;
  onDeleteSale: (sale: SaleEntry) => void;
  onEditPurchase: (purchase: PurchaseEntry) => void;
  onDeletePurchase: (purchase: PurchaseEntry) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  ledgerFilter,
  trash,
  paginatedEntries,
  filteredUnifiedCount,
  currentPage,
  setCurrentPage,
  pageSize,
  totalPages,
  sortField,
  sortOrder,
  handleSort,
  onRestoreFromTrash,
  onPermanentDeleteTarget,
  onEditSale,
  onDeleteSale,
  onEditPurchase,
  onDeletePurchase
}) => {
  return (
    <>
      {ledgerFilter === 'trash' ? (
        /* TRASH TABLE VIEW */
        <div style={{ overflowX: 'auto' }}>
          <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', marginBottom: '12px', fontSize: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} /> Deleted entries are held in Trash and auto-cleared permanently after 20 days. You can restore any item anytime.
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '8px 10px' }}>Original Type</th>
                <th style={{ padding: '8px 10px' }}>Date</th>
                <th style={{ padding: '8px 10px' }}>Item / Description</th>
                <th style={{ padding: '8px 10px' }}>Category</th>
                <th style={{ padding: '8px 10px' }}>Total Amount</th>
                <th style={{ padding: '8px 10px' }}>Deleted On</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trash.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    Trash Bin is currently empty. No deleted records.
                  </td>
                </tr>
              ) : (
                trash.map((tItem) => {
                  const item = tItem.item;
                  const deletedDateFormatted = new Date(tItem.deleted_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                  return (
                    <tr key={tItem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: 0.85 }}>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{
                          padding: '2px 8px',
                          background: tItem.original_type === 'sale' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: tItem.original_type === 'sale' ? '#fbbf24' : '#818cf8',
                          border: `1px solid ${tItem.original_type === 'sale' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }}>
                          {tItem.original_type}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', fontWeight: '600', color: '#cbd5e1', whiteSpace: 'nowrap', fontSize: '12px' }}>
                        {formatDateFormatted(item.date)}
                      </td>
                      <td style={{ padding: '8px 10px', fontWeight: '700', color: '#f8fafc', fontSize: '13px' }}>{item.item_name}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ padding: '2px 8px', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', borderRadius: '4px', fontSize: '11px' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', fontWeight: '800', color: tItem.original_type === 'sale' ? '#4ade80' : '#f87171' }}>
                        ₹{formatIndianCurrency(item.total_amount)}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#94a3b8', fontSize: '11px' }}>
                        {deletedDateFormatted}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => onRestoreFromTrash(tItem)}
                            title="Restore Entry back to ledger"
                            style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600' }}>
                            <RotateCcw size={12} /> Restore
                          </button>
                          <button
                            onClick={() => onPermanentDeleteTarget(tItem)}
                            title="Permanently Delete"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '600' }}>
                            <Trash2 size={12} /> Erase
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* ACTIVE LEDGER TABLE VIEW */
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th onClick={() => handleSort('type')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Type {sortField === 'type' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('date')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Txn Date {sortField === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('item_name')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Item / Description {sortField === 'item_name' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('category')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Category {sortField === 'category' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('quantity')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Qty {sortField === 'quantity' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('unit_price')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Unit Rate {sortField === 'unit_price' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('total_amount')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Total Amount {sortField === 'total_amount' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('details')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Details / Status {sortField === 'details' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('createdTimestamp')} style={{ padding: '8px 10px', cursor: 'pointer', userSelect: 'none' }}>
                  Entry Created {sortField === 'createdTimestamp' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No ledger entries found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedEntries.map((item) => {
                  if (item.type === 'sale') {
                    const sale = item.data;
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ padding: '2px 8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                            Sale
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: '600', color: '#cbd5e1', whiteSpace: 'nowrap', fontSize: '12px' }}>
                          {formatDateFormatted(sale.date)}
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: '700', color: '#f8fafc', fontSize: '13px' }}>{sale.item_name}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ padding: '2px 8px', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', borderRadius: '4px', fontSize: '11px' }}>
                            {sale.category}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: '600' }}>
                          {sale.quantity} <span style={{ fontSize: '11px', color: '#94a3b8' }}>{sale.unit || 'Pcs'}</span>
                        </td>
                        <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>₹{formatIndianCurrency(sale.unit_price)}</td>
                        <td style={{ padding: '8px 10px', fontWeight: '800', color: '#4ade80' }}>+₹{formatIndianCurrency(sale.total_amount)}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '11px', color: '#cbd5e1' }}>
                            {normalizePaymentMethod(sale.payment_method)}
                          </span>
                          {sale.notes && <span style={{ display: 'block', fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{sale.notes}</span>}
                        </td>
                        <td style={{ padding: '8px 10px', color: '#fbbf24', whiteSpace: 'nowrap', fontSize: '11px', fontWeight: '600' }}>
                          {formatEntryFullDateTime(sale.created_at, sale.id)}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => onEditSale(sale)}
                              title="Edit Entry"
                              style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fbbf24', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '600' }}>
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => onDeleteSale(sale)}
                              title="Delete Entry"
                              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '600' }}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    const purchase = item.data;
                    const parsed = parsePurchaseNotes(purchase.notes);
                    const billNo = purchase.bill_no || parsed.bill_no;
                    const paymentMethod = normalizePaymentMethod(purchase.payment_method || parsed.payment_method);
                    const desc = parsed.desc;

                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ padding: '2px 8px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '4px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}>
                            Purchase
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: '600', color: '#cbd5e1', whiteSpace: 'nowrap', fontSize: '12px' }}>
                          {formatDateFormatted(purchase.date)}
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: '700', color: '#f8fafc', fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>{purchase.item_name}</span>
                            {billNo && (
                              <span style={{ padding: '1px 6px', background: 'rgba(129, 140, 248, 0.12)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '4px', color: '#a5b4fc', fontSize: '10px', fontWeight: '600' }}>
                                #{billNo}
                              </span>
                            )}
                          </div>
                          <span style={{ display: 'block', fontSize: '11px', color: '#818cf8', fontWeight: '600', marginTop: '2px' }}>
                            Party: {purchase.supplier}
                          </span>
                          {desc && <span style={{ display: 'block', fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{desc}</span>}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ padding: '2px 8px', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', borderRadius: '4px', fontSize: '11px' }}>
                            {purchase.category || 'Raw Materials'}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', fontWeight: '600' }}>
                          {purchase.quantity || 1} <span style={{ fontSize: '11px', color: '#94a3b8' }}>{purchase.unit || 'Unit'}</span>
                        </td>
                        <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>₹{formatIndianCurrency(purchase.unit_price || purchase.total_amount)}</td>
                        <td style={{ padding: '8px 10px', fontWeight: '800', color: '#f87171' }}>-₹{formatIndianCurrency(purchase.total_amount)}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              display: 'inline-block',
                              width: 'fit-content',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '700',
                              background: purchase.payment_status === 'Paid' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: purchase.payment_status === 'Paid' ? '#4ade80' : '#f87171'
                            }}>
                              {purchase.payment_status || 'Paid'}
                            </span>
                            <span style={{ fontSize: '10px', color: '#cbd5e1' }}>
                              Method: <b style={{ color: '#818cf8' }}>{paymentMethod}</b>
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 10px', color: '#818cf8', whiteSpace: 'nowrap', fontSize: '11px', fontWeight: '600' }}>
                          {formatEntryFullDateTime(purchase.created_at, purchase.id)}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => onEditPurchase(purchase)}
                              title="Edit Entry"
                              style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '600' }}>
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => onDeletePurchase(purchase)}
                              title="Delete Entry"
                              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '600' }}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', gap: '16px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>
          Showing <b>{filteredUnifiedCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}</b> to <b>{Math.min(currentPage * pageSize, filteredUnifiedCount)}</b> of <b>{filteredUnifiedCount}</b> entries
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: currentPage === 1 ? '#4b5563' : '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}>
            Previous
          </button>

          <span style={{ fontSize: '13px', color: '#cbd5e1', padding: '0 8px', fontWeight: '600' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            style={{
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: currentPage >= totalPages ? '#4b5563' : '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
            }}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};
