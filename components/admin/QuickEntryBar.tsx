'use client';

import React from 'react';
import { TrendingUp, ShoppingBag, PlusCircle } from 'lucide-react';
import CustomDatePicker from '@/components/CustomDatePicker';
import AutoSuggestInput from '@/components/AutoSuggestInput';
import { formatIndianCurrency } from './adminUtils';

interface QuickEntryBarProps {
  quickEntryType: 'sale' | 'purchase';
  setQuickEntryType: (type: 'sale' | 'purchase') => void;
  isSavingQuickEntry: boolean;
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
  handleSaveSale: (e: React.FormEvent) => void;
  handleSavePurchase: (e: React.FormEvent) => void;
  existingSaleItemNames: string[];
  existingPurchaseItemNames: string[];
  existingSuppliers: string[];
}

export const QuickEntryBar: React.FC<QuickEntryBarProps> = ({
  quickEntryType,
  setQuickEntryType,
  isSavingQuickEntry,
  saleForm,
  setSaleForm,
  purchaseForm,
  setPurchaseForm,
  handleSaveSale,
  handleSavePurchase,
  existingSaleItemNames,
  existingPurchaseItemNames,
  existingSuppliers
}) => {
  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto 16px auto',
      background: quickEntryType === 'sale'
        ? 'linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(30, 27, 22, 0.95) 100%)'
        : 'linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(24, 25, 45, 0.95) 100%)',
      border: `1px solid ${quickEntryType === 'sale' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
      borderRadius: '16px',
      padding: '16px 20px',
      boxShadow: quickEntryType === 'sale'
        ? '0 10px 30px -5px rgba(245, 158, 11, 0.15), 0 4px 20px rgba(0,0,0,0.5)'
        : '0 10px 30px -5px rgba(99, 102, 241, 0.15), 0 4px 20px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(16px)',
      position: 'relative',
      zIndex: 50,
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: quickEntryType === 'sale' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)',
            border: `1px solid ${quickEntryType === 'sale' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
            color: quickEntryType === 'sale' ? '#fbbf24' : '#818cf8'
          }}>
            {quickEntryType === 'sale' ? <TrendingUp size={14} /> : <ShoppingBag size={14} />}
          </div>
          <div>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#f8fafc', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⚡ Quick Data Entry
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '20px',
                background: quickEntryType === 'sale' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                color: quickEntryType === 'sale' ? '#fbbf24' : '#818cf8',
                border: `1px solid ${quickEntryType === 'sale' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                textTransform: 'uppercase'
              }}>
                {quickEntryType === 'sale' ? 'Sale Mode' : 'Purchase Mode'}
              </span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            type="button"
            onClick={() => setQuickEntryType('sale')}
            style={{
              padding: '5px 14px',
              background: quickEntryType === 'sale' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.25) 100%)' : 'transparent',
              border: quickEntryType === 'sale' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
              borderRadius: '7px',
              color: quickEntryType === 'sale' ? '#fbbf24' : '#94a3b8',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: quickEntryType === 'sale' ? '0 2px 8px rgba(245, 158, 11, 0.2)' : 'none'
            }}>
            Sale Entry
          </button>
          <button
            type="button"
            onClick={() => setQuickEntryType('purchase')}
            style={{
              padding: '5px 14px',
              background: quickEntryType === 'purchase' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(79, 70, 229, 0.25) 100%)' : 'transparent',
              border: quickEntryType === 'purchase' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
              borderRadius: '7px',
              color: quickEntryType === 'purchase' ? '#818cf8' : '#94a3b8',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: quickEntryType === 'purchase' ? '0 2px 8px rgba(99, 102, 241, 0.2)' : 'none'
            }}>
            Purchase Entry
          </button>
        </div>
      </div>

      {quickEntryType === 'sale' ? (
        /* SALE QUICK ENTRY FORM */
        <form onSubmit={handleSaveSale} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
            <CustomDatePicker
              value={saleForm.date}
              onChange={(e: any) => setSaleForm({ ...saleForm, date: e.target.value })}
              style={{ minHeight: '34px', padding: '4px 8px', fontSize: '12px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: 'span 2' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item Name *</label>
            <AutoSuggestInput
              required
              placeholder="e.g. Chocolate Truffle Cake..."
              value={saleForm.item_name}
              onChange={(val) => setSaleForm({ ...saleForm, item_name: val })}
              options={existingSaleItemNames}
              maxSuggestions={5}
              style={{ height: '34px', padding: '6px 10px', fontSize: '12px', background: '#1e293b', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
            <select
              value={saleForm.category}
              onChange={(e) => setSaleForm({ ...saleForm, category: e.target.value })}
              style={{ width: '100%', padding: '6px 10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', height: '34px', outline: 'none' }}>
              <option value="Cakes">Cakes</option>
              <option value="Pastries">Pastries</option>
              <option value="Cupcakes">Cupcakes</option>
              <option value="Breads">Breads</option>
              <option value="Custom Cakes">Other</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty & Unit *</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              <input
                type="number" min="1" required
                placeholder="Qty"
                value={saleForm.quantity}
                onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value === '' ? '' : Number(e.target.value) })}
                style={{ flex: 1, minWidth: '50px', padding: '6px 8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', height: '34px', outline: 'none' }}
              />
              <select
                value={saleForm.unit}
                onChange={(e) => setSaleForm({ ...saleForm, unit: e.target.value })}
                style={{ width: '70px', padding: '6px 4px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fbbf24', fontSize: '11px', fontWeight: '700', height: '34px', outline: 'none' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Price (₹) *</label>
            <input
              type="number" step="0.01" min="0" required
              placeholder="Price"
              value={saleForm.unit_price}
              onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
              onChange={(e) => setSaleForm({ ...saleForm, unit_price: e.target.value === '' ? '' : Number(e.target.value) })}
              style={{ width: '100%', padding: '6px 10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', height: '34px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</label>
            <select
              value={saleForm.payment_method}
              onChange={(e) => setSaleForm({ ...saleForm, payment_method: e.target.value as any })}
              style={{ width: '100%', padding: '6px 10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', height: '34px', outline: 'none' }}>
              <option value="UPI">UPI / GPay</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="POS">POS</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSavingQuickEntry || (Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) <= 0}
            style={{
              padding: '8px 24px',
              height: '36px',
              whiteSpace: 'nowrap',
              background: isSavingQuickEntry
                ? '#475569'
                : ((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) > 0)
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'rgba(255,255,255,0.05)',
              border: ((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) > 0) ? 'none' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: isSavingQuickEntry ? '#cbd5e1' : ((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) > 0) ? '#fff' : '#64748b',
              fontWeight: '700',
              fontSize: '12px',
              cursor: (isSavingQuickEntry || (Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) <= 0) ? 'not-allowed' : 'pointer',
              boxShadow: ((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0) > 0) ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}>
            {isSavingQuickEntry ? (
              <>⏳ Saving...</>
            ) : (
              <>
                <PlusCircle size={15} /> Add Sale (₹{formatIndianCurrency((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0), false)})
              </>
            )}
          </button>
        </form>
      ) : (
        /* PURCHASE QUICK ENTRY FORM */
        <form onSubmit={handleSavePurchase} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
            <CustomDatePicker
              value={purchaseForm.date}
              onChange={(e: any) => setPurchaseForm({ ...purchaseForm, date: e.target.value })}
              style={{ minHeight: '34px', padding: '4px 8px', fontSize: '12px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Party / Supplier *</label>
            <AutoSuggestInput
              required
              placeholder="e.g. Murria Sale's..."
              value={purchaseForm.supplier}
              onChange={(val) => setPurchaseForm({ ...purchaseForm, supplier: val })}
              options={existingSuppliers}
              maxSuggestions={5}
              style={{ height: '34px', padding: '6px 10px', fontSize: '12px', background: '#1e293b', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company / Item *</label>
            <AutoSuggestInput
              required
              placeholder="e.g. Mogu, Coca cola, Paneer..."
              value={purchaseForm.item_name}
              onChange={(val) => setPurchaseForm({ ...purchaseForm, item_name: val })}
              options={existingPurchaseItemNames}
              maxSuggestions={5}
              style={{ height: '34px', padding: '6px 10px', fontSize: '12px', background: '#1e293b', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bill No.</label>
            <input
              type="text"
              placeholder="e.g. MSC/035"
              value={purchaseForm.bill_no}
              onChange={(e) => setPurchaseForm({ ...purchaseForm, bill_no: e.target.value })}
              style={{ width: '100%', padding: '6px 10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', height: '34px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment</label>
            <select
              value={purchaseForm.payment_method}
              onChange={(e) => setPurchaseForm({ ...purchaseForm, payment_method: e.target.value })}
              style={{ width: '100%', padding: '6px 8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#818cf8', fontSize: '12px', fontWeight: '600', height: '34px', outline: 'none' }}>
              <option value="Cash">Cash</option>
              <option value="GPay">GPay / UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Current Sale">Current Sale</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount (₹) *</label>
            <input
              type="number" step="0.01" min="0" required
              placeholder="₹ Amount"
              value={purchaseForm.amount}
              onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
              onChange={(e) => setPurchaseForm({ ...purchaseForm, amount: e.target.value === '' ? '' : Number(e.target.value) })}
              style={{ width: '100%', padding: '6px 10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', height: '34px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
            <select
              value={purchaseForm.payment_status}
              onChange={(e) => setPurchaseForm({ ...purchaseForm, payment_status: e.target.value as any })}
              style={{ width: '100%', padding: '6px 10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', fontSize: '12px', height: '34px', outline: 'none' }}>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSavingQuickEntry || (Number(purchaseForm.amount) || 0) <= 0}
            style={{
              padding: '8px 20px',
              height: '36px',
              whiteSpace: 'nowrap',
              background: isSavingQuickEntry
                ? '#475569'
                : ((Number(purchaseForm.amount) || 0) > 0)
                  ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                  : 'rgba(255,255,255,0.05)',
              border: ((Number(purchaseForm.amount) || 0) > 0) ? 'none' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: isSavingQuickEntry ? '#cbd5e1' : ((Number(purchaseForm.amount) || 0) > 0) ? '#fff' : '#64748b',
              fontWeight: '700',
              fontSize: '12px',
              cursor: (isSavingQuickEntry || (Number(purchaseForm.amount) || 0) <= 0) ? 'not-allowed' : 'pointer',
              boxShadow: ((Number(purchaseForm.amount) || 0) > 0) ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}>
            {isSavingQuickEntry ? (
              <>⏳ Saving...</>
            ) : (
              <>
                <PlusCircle size={15} /> Add Purchase (₹{formatIndianCurrency(Number(purchaseForm.amount) || 0, false)})
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
