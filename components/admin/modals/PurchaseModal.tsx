'use client';

import React from 'react';
import CustomDatePicker from '@/components/CustomDatePicker';
import AutoSuggestInput from '@/components/AutoSuggestInput';
import { PurchaseEntry } from '@/types/admin';
import { formatIndianCurrency } from '../adminUtils';

interface PurchaseModalProps {
  showPurchaseModal: boolean;
  setShowPurchaseModal: (show: boolean) => void;
  editingPurchase: PurchaseEntry | null;
  setEditingPurchase: (purchase: PurchaseEntry | null) => void;
  purchaseForm: {
    date: string;
    item_name: string;
    supplier: string;
    category: string;
    amount: string | number;
    payment_status: any;
    bill_no: string;
    payment_method: string;
    notes: string;
  };
  setPurchaseForm: React.Dispatch<React.SetStateAction<any>>;
  handleSavePurchase: (e: React.FormEvent) => void;
  existingPurchaseItemNames: string[];
  existingSuppliers: string[];
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  showPurchaseModal,
  setShowPurchaseModal,
  editingPurchase,
  setEditingPurchase,
  purchaseForm,
  setPurchaseForm,
  handleSavePurchase,
  existingPurchaseItemNames,
  existingSuppliers
}) => {
  if (!showPurchaseModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#818cf8', marginBottom: '20px' }}>
          {editingPurchase ? 'Edit Purchase / Expense Entry' : 'Record New Purchase Entry'}
        </h2>

        <form onSubmit={handleSavePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Date</label>
              <CustomDatePicker
                value={purchaseForm.date}
                onChange={(e: any) => setPurchaseForm({ ...purchaseForm, date: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Bill / Invoice No.</label>
              <input
                type="text"
                placeholder="e.g. MSC/035"
                value={purchaseForm.bill_no}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, bill_no: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Party / Supplier Name</label>
            <AutoSuggestInput
              required
              placeholder="e.g. Murria Sale's, Dairy Fresh..."
              value={purchaseForm.supplier}
              onChange={(val) => setPurchaseForm({ ...purchaseForm, supplier: val })}
              options={existingSuppliers}
              maxSuggestions={5}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Company / Item Name</label>
            <AutoSuggestInput
              required
              placeholder="e.g. Mogu, Coca cola, Paneer..."
              value={purchaseForm.item_name}
              onChange={(val) => setPurchaseForm({ ...purchaseForm, item_name: val })}
              options={existingPurchaseItemNames}
              maxSuggestions={5}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Category</label>
              <select
                value={purchaseForm.category}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, category: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
                <option value="Raw Materials">Raw Materials</option>
                <option value="Dairy">Dairy</option>
                <option value="Beverages">Beverages</option>
                <option value="Packaging">Packaging</option>
                <option value="Snacks">Snacks</option>
                <option value="Utilities">Utilities & Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Total Amount (₹)</label>
              <input
                type="number" step="0.01" min="0" required
                placeholder="Enter ₹ amount..."
                value={purchaseForm.amount}
                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                onChange={(e) => {
                  const val = e.target.value;
                  setPurchaseForm({ ...purchaseForm, amount: val === '' ? '' : Number(val) });
                }}
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Payment Method</label>
              <select
                value={purchaseForm.payment_method}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, payment_method: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay / UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Current Sale">Current Sale</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Payment Status</label>
              <select
                value={purchaseForm.payment_status}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, payment_status: e.target.value as any })}
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Description / Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Extra flavour syrup, batch notes..."
              value={purchaseForm.notes}
              onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })}
              style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(99,102,241,0.1)', borderRadius: '10px', color: '#818cf8', fontWeight: '700' }}>
            <span>Total Purchase Cost:</span>
            <span>₹{formatIndianCurrency(Number(purchaseForm.amount) || 0)}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => { setShowPurchaseModal(false); setEditingPurchase(null); }}
              style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', fontWeight: '600', cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={(Number(purchaseForm.amount) || 0) <= 0}
              style={{
                flex: 1,
                padding: '12px',
                background: ((Number(purchaseForm.amount) || 0) > 0)
                  ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                  : '#374151',
                border: 'none',
                borderRadius: '10px',
                color: ((Number(purchaseForm.amount) || 0) > 0) ? '#fff' : '#9ca3af',
                fontWeight: '700',
                cursor: ((Number(purchaseForm.amount) || 0) > 0) ? 'pointer' : 'not-allowed',
                opacity: ((Number(purchaseForm.amount) || 0) > 0) ? 1 : 0.65
              }}>
              {editingPurchase ? 'Update Purchase Entry' : 'Save Purchase Entry'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
