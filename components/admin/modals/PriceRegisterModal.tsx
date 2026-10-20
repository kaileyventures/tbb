'use client';

import React from 'react';
import { Tag, X, Edit2, Trash2, Search } from 'lucide-react';

interface PriceRegisterModalProps {
  showPriceRegisterModal: boolean;
  setShowPriceRegisterModal: (show: boolean) => void;
  posCatalog: Array<{ name: string; category: string; price: number }>;
  registerSearchTerm: string;
  setRegisterSearchTerm: (term: string) => void;
  customProducts: Array<{ name: string; category: string; price: number }>;
  newProductForm: { name: string; category: string; price: string };
  setNewProductForm: React.Dispatch<React.SetStateAction<{ name: string; category: string; price: string }>>;
  handleSaveProductRegister: (e: React.FormEvent) => void;
  handleDeleteProductRegister: (name: string) => void;
  saveCustomProducts: (products: Array<{ name: string; category: string; price: number }>) => void;
}

export const PriceRegisterModal: React.FC<PriceRegisterModalProps> = ({
  showPriceRegisterModal,
  setShowPriceRegisterModal,
  posCatalog,
  registerSearchTerm,
  setRegisterSearchTerm,
  customProducts,
  newProductForm,
  setNewProductForm,
  handleSaveProductRegister,
  handleDeleteProductRegister,
  saveCustomProducts
}) => {
  if (!showPriceRegisterModal) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 10, 19, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #111827 0%, #1e1b4b 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <Tag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                Product & Price Register
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Add new products, modify rates & delete items. Changes update POS catalog instantly.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPriceRegisterModal(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: '#94a3b8',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
            <X size={16} />
          </button>
        </div>

        {/* Quick Add / Update Product Form Bar */}
        <form
          onSubmit={handleSaveProductRegister}
          style={{
            padding: '14px 24px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: '2fr 1.2fr 1fr auto',
            gap: '10px',
            alignItems: 'flex-end'
          }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase' }}>Product Name *</span>
            <input
              type="text"
              required
              placeholder="e.g. Belgian Chocolate Cake"
              value={newProductForm.name}
              onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
              style={{
                padding: '8px 10px',
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase' }}>Category</span>
            <select
              value={newProductForm.category}
              onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
              style={{
                padding: '8px 10px',
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}>
              <option value="Cakes">Cakes</option>
              <option value="Pastries">Pastries</option>
              <option value="Cupcakes">Cupcakes</option>
              <option value="Breads">Breads</option>
              <option value="Snacks">Snacks</option>
              <option value="Beverages">Beverages</option>
              <option value="Bakery">Bakery (General)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#fbbf24', textTransform: 'uppercase' }}>Default Rate (₹) *</span>
            <input
              type="number"
              min="0"
              required
              placeholder="₹ 150"
              value={newProductForm.price}
              onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
              style={{
                padding: '8px 10px',
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: '#fbbf24',
                fontSize: '12px',
                fontWeight: '700',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 16px',
              height: '34px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
            Save / Add Item
          </button>
        </form>

        {/* Filter Search inside Price Register */}
        <div style={{ padding: '10px 24px', background: 'rgba(15, 23, 42, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '9px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search in register..."
              value={registerSearchTerm}
              onChange={(e) => setRegisterSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                outline: 'none'
              }}
            />
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            Showing <b>{posCatalog.filter(p => !registerSearchTerm || p.name.toLowerCase().includes(registerSearchTerm.toLowerCase())).length}</b> products in catalog
          </span>
        </div>

        {/* Editable Product Register Table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 20px 24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 10px' }}>Product Name</th>
                <th style={{ padding: '8px 10px' }}>Category</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Default Rate (₹)</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posCatalog
                .filter(p => !registerSearchTerm || p.name.toLowerCase().includes(registerSearchTerm.toLowerCase()))
                .map(item => {
                  return (
                    <tr key={item.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '12px' }}>
                      <td style={{ padding: '10px', fontWeight: '600', color: '#f8fafc' }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ padding: '2px 8px', background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <input
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) => {
                            const newP = Math.max(0, Number(e.target.value) || 0);
                            const existingIdx = customProducts.findIndex(p => p.name.toLowerCase() === item.name.toLowerCase());
                            let updated: Array<{ name: string; category: string; price: number }>;
                            if (existingIdx >= 0) {
                              updated = customProducts.map((p, idx) => idx === existingIdx ? { ...p, price: newP } : p);
                            } else {
                              updated = [...customProducts, { name: item.name, category: item.category, price: newP }];
                            }
                            saveCustomProducts(updated);
                          }}
                          style={{
                            width: '80px',
                            textAlign: 'right',
                            background: '#1e293b',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            borderRadius: '6px',
                            color: '#fbbf24',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '4px 8px',
                            outline: 'none'
                          }}
                        />
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setNewProductForm({ name: item.name, category: item.category, price: String(item.price) });
                            }}
                            title="Edit in form"
                            style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#fbbf24', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Edit2 size={11} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProductRegister(item.name)}
                            title="Remove from custom register"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '12px 24px', background: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => setShowPriceRegisterModal(false)}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}>
            Done & Back to POS
          </button>
        </div>
      </div>
    </div>
  );
};
