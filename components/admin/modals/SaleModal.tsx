'use client';

import React from 'react';
import CustomDatePicker from '@/components/CustomDatePicker';
import AutoSuggestInput from '@/components/AutoSuggestInput';
import { SaleEntry } from '@/types/admin';
import { formatIndianCurrency } from '../adminUtils';

interface SaleModalProps {
  showSaleModal: boolean;
  setShowSaleModal: (show: boolean) => void;
  editingSale: SaleEntry | null;
  setEditingSale: (sale: SaleEntry | null) => void;
  saleForm: {
    date: string;
    item_name: string;
    category: string;
    quantity: string | number;
    unit: string;
    unit_price: string | number;
    payment_method: any;
    notes: string;
  };
  setSaleForm: React.Dispatch<React.SetStateAction<any>>;
  handleSaveSale: (e: React.FormEvent) => void;
  existingSaleItemNames: string[];
}

export const SaleModal: React.FC<SaleModalProps> = ({
  showSaleModal,
  setShowSaleModal,
  editingSale,
  setEditingSale,
  saleForm,
  setSaleForm,
  handleSaveSale,
  existingSaleItemNames
}) => {
  if (!showSaleModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
      <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fbbf24', marginBottom: '20px' }}>
          {editingSale ? 'Edit Sale Entry' : 'Record New Sale Entry'}
        </h2>

        <form onSubmit={handleSaveSale} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Transaction Date</label>
            <CustomDatePicker
              value={saleForm.date}
              onChange={(e: any) => setSaleForm({ ...saleForm, date: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Item Name</label>
            <AutoSuggestInput
              required
              placeholder="e.g. Chocolate Truffle Cake"
              value={saleForm.item_name}
              onChange={(val) => setSaleForm({ ...saleForm, item_name: val })}
              options={existingSaleItemNames}
              maxSuggestions={5}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Category</label>
              <select
                value={saleForm.category}
                onChange={(e) => setSaleForm({ ...saleForm, category: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
                <option value="Cakes">Cakes</option>
                <option value="Pastries">Pastries</option>
                <option value="Cupcakes">Cupcakes</option>
                <option value="Breads">Breads</option>
                <option value="Custom Cakes">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Payment Method</label>
              <select
                value={saleForm.payment_method}
                onChange={(e) => setSaleForm({ ...saleForm, payment_method: e.target.value as any })}
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}>
                <option value="UPI">UPI / GPay</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="POS">POS</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Quantity & Unit</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number" min="1" required
                  placeholder="Qty..."
                  value={saleForm.quantity}
                  onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSaleForm({ ...saleForm, quantity: val === '' ? '' : Number(val) });
                  }}
                  style={{ flex: 1, padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                />
                <select
                  value={saleForm.unit}
                  onChange={(e) => setSaleForm({ ...saleForm, unit: e.target.value })}
                  style={{ width: '90px', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fbbf24', fontWeight: '700' }}>
                  <option value="Pcs">Pcs</option>
                  <option value="KG">KG</option>
                  <option value="Grams">Grams</option>
                  <option value="Packet">Packet</option>
                  <option value="Unit">Unit</option>
                  <option value="Litre">Litre</option>
                  <option value="Box">Box</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Unit Price (₹)</label>
              <input
                type="number" step="0.01" min="0" required
                placeholder="Enter Price..."
                value={saleForm.unit_price}
                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                onChange={(e) => {
                  const val = e.target.value;
                  setSaleForm({ ...saleForm, unit_price: val === '' ? '' : Number(val) });
                }}
                style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '10px', color: '#fbbf24', fontWeight: '700' }}>
            <span>Calculated Total:</span>
            <span>₹{formatIndianCurrency((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0))}</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => { setShowSaleModal(false); setEditingSale(null); }}
              style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', fontWeight: '600', cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={(Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) <= 0}
              style={{
                flex: 1,
                padding: '12px',
                background: ((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) > 0)
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : '#374151',
                border: 'none',
                borderRadius: '10px',
                color: ((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) > 0) ? '#fff' : '#9ca3af',
                fontWeight: '700',
                cursor: ((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) > 0) ? 'pointer' : 'not-allowed',
                opacity: ((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) > 0) ? 1 : 0.65
              }}>
              {editingSale ? 'Update Sale Entry' : 'Save Sale Entry'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
