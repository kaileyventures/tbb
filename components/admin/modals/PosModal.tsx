'use client';

import React, { useEffect, useState } from 'react';
import { Printer, Tag, X, Search, ShoppingCart, FileSpreadsheet, Plus, Minus, Keyboard } from 'lucide-react';
import CustomDatePicker from '@/components/CustomDatePicker';
import { formatDateFormatted, formatIndianCurrency } from '../adminUtils';

interface PosModalProps {
  showPosModal: boolean;
  setShowPosModal: (show: boolean) => void;
  posDate: string;
  setPosDate: (date: string) => void;
  posCatalog: Array<{ name: string; category: string; price: number; salesCount: number }>;
  nextPosBillNumber: string;
  posSearchTerm: string;
  setPosSearchTerm: (term: string) => void;
  posSelectedCategory: string;
  setPosSelectedCategory: (cat: string) => void;
  posCart: Array<{ name: string; category: string; price: number; qty: number }>;
  setPosCart: React.Dispatch<React.SetStateAction<Array<{ name: string; category: string; price: number; qty: number }>>>;
  handleTogglePosItem: (product: { name: string; category: string; price: number }) => void;
  updatePosQty: (name: string, delta: number) => void;
  updatePosPrice: (name: string, newPrice: number) => void;
  posCartTotal: number;
  todaySalesStats: { total: number; count: number; posBills: number };
  posRightTab: 'slip' | 'history';
  setPosRightTab: (tab: 'slip' | 'history') => void;
  todayPosBillsList: Array<{ billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number }>;
  printThermalSlip: (billData: { billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number }) => void;
  handleSaveAndPrintPos: (shouldPrint?: boolean) => void;
  isProcessingPos: boolean;
  lastPrintedBill: { billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number } | null;
  onOpenPriceRegister: () => void;
}

export const PosModal: React.FC<PosModalProps> = ({
  showPosModal,
  setShowPosModal,
  posDate,
  setPosDate,
  posCatalog,
  nextPosBillNumber,
  posSearchTerm,
  setPosSearchTerm,
  posSelectedCategory,
  setPosSelectedCategory,
  posCart,
  setPosCart,
  handleTogglePosItem,
  updatePosQty,
  updatePosPrice,
  posCartTotal,
  todaySalesStats,
  posRightTab,
  setPosRightTab,
  todayPosBillsList,
  printThermalSlip,
  handleSaveAndPrintPos,
  isProcessingPos,
  lastPrintedBill,
  onOpenPriceRegister
}) => {
  const [activeItemName, setActiveItemName] = useState<string | null>(null);

  // Compute filtered catalog for keyboard shortcut indexing
  const filteredCatalog = posCatalog.filter(p => {
    const matchesSearch = !posSearchTerm || p.name.toLowerCase().includes(posSearchTerm.toLowerCase());
    const matchesCat = posSelectedCategory === 'all' || p.category === posSelectedCategory;
    return matchesSearch && matchesCat;
  });

  // Keep activeItemName synced: if activeItem is not in cart, fallback to last item in cart or null
  useEffect(() => {
    if (activeItemName && !posCart.some(i => i.name === activeItemName)) {
      if (posCart.length > 0) {
        setActiveItemName(posCart[posCart.length - 1].name);
      } else {
        setActiveItemName(null);
      }
    } else if (!activeItemName && posCart.length > 0) {
      setActiveItemName(posCart[posCart.length - 1].name);
    }
  }, [posCart, activeItemName]);

  // Keyboard shortcut listener: 1-9 & 0 for product select, ArrowUp/ArrowDown for qty, NumpadEnter for Save & Print
  useEffect(() => {
    if (!showPosModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is currently typing in an input or select box, don't hijack number keys
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

      // Numeric Numpad Enter / Regular Enter on modal level
      if (e.code === 'NumpadEnter' || (e.key === 'Enter' && !isInput)) {
        e.preventDefault();
        if (posCart.length > 0 && !isProcessingPos) {
          handleSaveAndPrintPos(true);
        }
        return;
      }

      // If user is typing in search input, allow typing numbers and text normally
      if (isInput) return;

      // 1-9 and 0 shortcuts for the first 10 products
      // Key '1' -> index 0, '2' -> index 1, ..., '9' -> index 8, '0' -> index 9
      const key = e.key;
      let targetIndex = -1;
      if (key >= '1' && key <= '9') {
        targetIndex = parseInt(key, 10) - 1;
      } else if (key === '0') {
        targetIndex = 9; // 10th product
      }

      if (targetIndex >= 0 && targetIndex < filteredCatalog.length) {
        e.preventDefault();
        const targetProduct = filteredCatalog[targetIndex];
        const isAlreadyInCart = posCart.some(i => i.name === targetProduct.name);
        
        if (!isAlreadyInCart) {
          // Select product
          handleTogglePosItem(targetProduct);
          setActiveItemName(targetProduct.name);
        } else {
          // If already selected, setting it as active target or increasing qty
          setActiveItemName(targetProduct.name);
        }
        return;
      }

      // ArrowUp to increase quantity of active item
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const targetName = activeItemName || (posCart.length > 0 ? posCart[posCart.length - 1].name : null);
        if (targetName) {
          updatePosQty(targetName, 1);
        }
        return;
      }

      // ArrowDown to decrease quantity of active item (zero unselects)
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const targetName = activeItemName || (posCart.length > 0 ? posCart[posCart.length - 1].name : null);
        if (targetName) {
          updatePosQty(targetName, -1);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPosModal, filteredCatalog, posCart, activeItemName, isProcessingPos, handleTogglePosItem, updatePosQty, handleSaveAndPrintPos]);

  if (!showPosModal) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 10, 19, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0e1322 0%, #13182e 100%)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '1240px',
        height: '92vh',
        maxHeight: '860px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(15, 23, 42, 0.65)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
            }}>
              <Printer size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                The Baker Bro — POS Counter Sale
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Tap product buttons to add/remove • Auto-records in Sales with payment method <b>POS</b>
              </p>
            </div>
          </div>

          {/* Date Selector & Product Register Button & Bill No & Close (Aligned in one line) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Sale Date Input */}
            <div style={{ minWidth: '155px' }}>
              <CustomDatePicker
                value={posDate}
                onChange={(e: any) => setPosDate(e.target?.value || e)}
                style={{ 
                  height: '38px', 
                  minHeight: '38px', 
                  padding: '6px 10px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  background: '#1e293b',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              />
            </div>

            {/* Edit Products & Price Register Button */}
            <button
              type="button"
              onClick={onOpenPriceRegister}
              title="Open Products & Price Register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '38px',
                padding: '0 14px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fbbf24',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)')}>
              <Tag size={14} /> Price Register ({posCatalog.length})
            </button>

            {/* Current Bill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '38px',
              padding: '0 12px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Current Bill:</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#a78bfa', fontFamily: 'monospace' }}>{nextPosBillNumber}</span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPosModal(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#94a3b8',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body - 2 Columns */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.45fr 1fr',
          gap: '0',
          overflow: 'hidden'
        }}>

          {/* LEFT COLUMN: Large Product Buttons with Search & Category Tabs */}
          <div style={{
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden'
          }}>
            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search bakery product..."
                  value={posSearchTerm}
                  onChange={(e) => setPosSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                {posSearchTerm && (
                  <button
                    onClick={() => setPosSearchTerm('')}
                    style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <select
                value={posSelectedCategory}
                onChange={(e) => setPosSelectedCategory(e.target.value)}
                style={{
                  padding: '8px 10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#a78bfa',
                  fontSize: '12px',
                  fontWeight: '700',
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                <option value="all">All Categories</option>
                {Array.from(new Set(posCatalog.map(p => p.category))).sort().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Prompt instructions with Shortcut Guide */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Keyboard size={13} style={{ color: '#a78bfa' }} />
                <span>
                  Keys <b>[1-9, 0]</b> select • <b>[↑ / ↓]</b> qty • <b>[Enter]</b> Save & Print
                </span>
              </div>
              <span style={{ color: '#c4b5fd', fontWeight: '700' }}>{posCart.length} item(s) in slip</span>
            </div>

            {/* Dynamic Sized Product Buttons Grid based on Sales Volume */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              alignContent: 'start',
              padding: '6px 4px 12px 2px'
            }}>
              {filteredCatalog
                .map((product, index) => {
                  const cartItem = posCart.find(i => i.name === product.name);
                  const isSelected = Boolean(cartItem);
                  const isActiveTarget = isSelected && activeItemName === product.name;

                  // First 10 items have keyboard shortcuts: 1-9 for indices 0-8, 0 for index 9
                  const shortcutKey = index < 9 ? `${index + 1}` : index === 9 ? '0' : null;

                  const isTop2 = index < 2;
                  const isNext4 = index >= 2 && index < 6;
                  const isSmall = index >= 6;

                  const gridColSpan = isTop2 ? 'span 2' : 'span 1';
                  const minHeight = isTop2 ? '118px' : isNext4 ? '98px' : '82px';

                  return (
                    <div
                      key={product.name}
                      onClick={() => {
                        if (!isSelected) {
                          handleTogglePosItem(product);
                          setActiveItemName(product.name);
                        } else {
                          setActiveItemName(product.name);
                        }
                      }}
                      style={{
                        gridColumn: gridColSpan,
                        minHeight: minHeight,
                        background: isSelected
                          ? isActiveTarget
                            ? 'linear-gradient(145deg, rgba(147, 51, 234, 0.45) 0%, rgba(109, 40, 217, 0.35) 100%)'
                            : 'linear-gradient(145deg, rgba(139, 92, 246, 0.35) 0%, rgba(109, 40, 217, 0.25) 100%)'
                          : isTop2
                            ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
                            : isNext4
                              ? 'linear-gradient(145deg, rgba(99, 102, 241, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)'
                              : 'linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                        border: isSelected
                          ? isActiveTarget
                            ? '2px solid #c084fc'
                            : '2px solid #a855f7'
                          : isTop2
                            ? '1.5px solid rgba(245, 158, 11, 0.35)'
                            : isNext4
                              ? '1px solid rgba(129, 140, 248, 0.2)'
                              : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: isTop2 ? '16px' : isNext4 ? '13px' : '10px',
                        padding: isTop2 ? '14px 14px' : isNext4 ? '11px 11px' : '9px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: isSelected ? 'default' : 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        position: 'relative',
                        boxShadow: isSelected
                          ? isActiveTarget
                            ? '0 0 0 2px rgba(192, 132, 252, 0.5), 0 4px 16px rgba(139, 92, 246, 0.35)'
                            : '0 4px 14px rgba(139, 92, 246, 0.25)'
                          : 'none',
                        userSelect: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = isTop2 ? '#fbbf24' : '#8b5cf6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = isTop2
                            ? 'rgba(245, 158, 11, 0.35)'
                            : isNext4
                              ? 'rgba(129, 140, 248, 0.2)'
                              : 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}>
                      
                      {/* Selection Checkmark / Quick Deselect */}
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePosItem(product);
                          }}
                          title="Click to unselect and remove"
                          style={{
                            position: 'absolute',
                            top: '7px',
                            right: '7px',
                            width: isTop2 ? '22px' : '18px',
                            height: isTop2 ? '22px' : '18px',
                            borderRadius: '50%',
                            background: '#a855f7',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: isTop2 ? '12px' : '10px',
                            fontWeight: '900',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            zIndex: 2,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ef4444';
                            e.currentTarget.innerText = '✕';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#a855f7';
                            e.currentTarget.innerText = '✓';
                          }}>
                          ✓
                        </button>
                      )}

                      {/* Top Category Tag, Shortcut Key Badge & Name */}
                      <div 
                        style={{ cursor: isSelected ? 'pointer' : 'inherit' }}
                        onClick={() => {
                          if (isSelected) {
                            setActiveItemName(product.name);
                            handleTogglePosItem(product);
                          }
                        }}
                        title={isSelected ? "Click title to unselect" : "Click to select"}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSmall ? '2px' : '4px' }}>
                          <span style={{
                            fontSize: isTop2 ? '11px' : '9px',
                            fontWeight: '700',
                            color: isSelected ? '#ddd6fe' : isTop2 ? '#fbbf24' : '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}>
                            {product.category}
                          </span>

                          {/* Keyboard Serial Number Shortcut Badge (1 to 9, and 0 for 10) */}
                          {shortcutKey !== null && (
                            <span 
                              title={`Press key "${shortcutKey}" to select`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: isTop2 ? '20px' : '18px',
                                height: isTop2 ? '20px' : '18px',
                                padding: '0 4px',
                                borderRadius: '5px',
                                background: isSelected 
                                  ? isActiveTarget 
                                    ? 'rgba(255, 255, 255, 0.95)' 
                                    : 'rgba(255, 255, 255, 0.2)' 
                                  : 'rgba(255, 255, 255, 0.08)',
                                border: isSelected 
                                  ? isActiveTarget 
                                    ? '1px solid #fff' 
                                    : '1px solid rgba(255, 255, 255, 0.4)' 
                                  : '1px solid rgba(255, 255, 255, 0.15)',
                                color: isSelected ? (isActiveTarget ? '#7e22ce' : '#fff') : '#94a3b8',
                                fontSize: isTop2 ? '11px' : '10px',
                                fontWeight: '900',
                                fontFamily: 'monospace',
                                marginRight: isSelected ? (isTop2 ? '26px' : '22px') : '0'
                              }}
                            >
                              {shortcutKey}
                            </span>
                          )}
                        </div>

                        {/* Product Name */}
                        <div style={{
                          fontSize: isTop2 ? '16px' : isNext4 ? '14px' : '12.5px',
                          fontWeight: '800',
                          color: isSelected ? '#fff' : '#f8fafc',
                          lineHeight: '1.25',
                          display: '-webkit-box',
                          WebkitLineClamp: isSmall ? 1 : 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {product.name}
                        </div>

                        {/* Sold counter if available */}
                        {product.salesCount > 0 && !isSmall && (
                          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
                            Sold: <b>{product.salesCount}</b> units
                          </div>
                        )}
                      </div>

                      {/* Price & Selected Qty footer with Stepper */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: isSmall ? '5px' : '8px',
                        paddingTop: isSmall ? '4px' : '6px',
                        borderTop: isSelected ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        <span style={{
                          fontSize: isTop2 ? '16px' : isNext4 ? '14px' : '12.5px',
                          fontWeight: '800',
                          color: isSelected ? '#fbbf24' : isTop2 ? '#fbbf24' : '#38bdf8'
                        }}>
                          ₹{formatIndianCurrency(cartItem ? cartItem.price : product.price, false)}
                        </span>

                        {isSelected && cartItem && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              background: 'rgba(15, 23, 42, 0.75)',
                              border: '1px solid rgba(139, 92, 246, 0.5)',
                              borderRadius: '8px',
                              padding: '2px 4px',
                              gap: isTop2 ? '6px' : '4px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.35)'
                            }}
                          >
                            {/* Decrease Button (unselects when qty goes to 0) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updatePosQty(product.name, -1);
                              }}
                              title={cartItem.qty === 1 ? "Reduce to 0 (Unselect)" : "Decrease quantity"}
                              style={{
                                width: isTop2 ? '22px' : '19px',
                                height: isTop2 ? '22px' : '19px',
                                borderRadius: '5px',
                                background: cartItem.qty === 1 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                                border: cartItem.qty === 1 ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.15)',
                                color: cartItem.qty === 1 ? '#f87171' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
                                e.currentTarget.style.color = '#fff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = cartItem.qty === 1 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = cartItem.qty === 1 ? '#f87171' : '#fff';
                              }}
                            >
                              <Minus size={isTop2 ? 12 : 10} />
                            </button>

                            {/* Qty Display */}
                            <span style={{
                              fontSize: isTop2 ? '13px' : '11px',
                              fontWeight: '900',
                              color: '#c4b5fd',
                              minWidth: isTop2 ? '18px' : '14px',
                              textAlign: 'center',
                              fontFamily: 'monospace'
                            }}>
                              {cartItem.qty}
                            </span>

                            {/* Increase Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updatePosQty(product.name, 1);
                              }}
                              title="Increase quantity"
                              style={{
                                width: isTop2 ? '22px' : '19px',
                                height: isTop2 ? '22px' : '19px',
                                borderRadius: '5px',
                                background: 'rgba(139, 92, 246, 0.35)',
                                border: '1px solid rgba(139, 92, 246, 0.6)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#8b5cf6';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.35)';
                              }}
                            >
                              <Plus size={isTop2 ? 12 : 10} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* RIGHT COLUMN: POS Slip Cart & Today's Sale Stats & Print Action */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(11, 15, 25, 0.6)',
            overflow: 'hidden'
          }}>

            {/* Right Top Bar: Today's Sale & Bill Counter */}
            <div style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Today&apos;s Total Sales</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#4ade80', marginTop: '2px' }}>
                  ₹{formatIndianCurrency(todaySalesStats.total)}
                </div>
              </div>

              <div style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Today POS Bills</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#c4b5fd' }}>
                    {todaySalesStats.posBills}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    (Next: {nextPosBillNumber})
                  </span>
                </div>
              </div>
            </div>

            {/* Slip vs Today's History Tab Switcher */}
            <div style={{
              padding: '8px 16px',
              background: 'rgba(15, 23, 42, 0.4)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setPosRightTab('slip')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: posRightTab === 'slip' ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : 'rgba(255, 255, 255, 0.05)',
                    color: posRightTab === 'slip' ? '#fff' : '#94a3b8',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s'
                  }}>
                  <ShoppingCart size={13} /> Current Slip ({posCart.length})
                </button>

                <button
                  type="button"
                  onClick={() => setPosRightTab('history')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: posRightTab === 'history' ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'rgba(255, 255, 255, 0.05)',
                    color: posRightTab === 'history' ? '#fff' : '#94a3b8',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s'
                  }}>
                  <FileSpreadsheet size={13} /> Today&apos;s Bills ({todayPosBillsList.length})
                </button>
              </div>

              {posRightTab === 'slip' && posCart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPosCart([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '2px 6px'
                  }}>
                  Clear All
                </button>
              )}
            </div>

            {/* TAB 1: ACTUAL 3-INCH THERMAL SLIP PREVIEW */}
            {posRightTab === 'slip' ? (
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                background: 'radial-gradient(ellipse at center, rgba(30, 27, 75, 0.45) 0%, rgba(5, 7, 15, 0.85) 100%)'
              }}>
                <div style={{
                  width: '100%',
                  maxWidth: '310px',
                  background: '#fdfbf7',
                  color: '#111827',
                  padding: '16px 14px 20px 14px',
                  borderRadius: '4px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.1)',
                  fontFamily: 'monospace, Courier, system-ui',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  {/* Metadata Header */}
                  <div style={{ fontSize: '10px', display: 'flex', justifyContent: 'space-between', color: '#374151', marginBottom: '2px' }}>
                    <span><b>Bill:</b> {nextPosBillNumber}</span>
                    <span><b>Pay:</b> POS</span>
                  </div>
                  <div style={{ fontSize: '10px', display: 'flex', justifyContent: 'space-between', color: '#374151', paddingBottom: '6px', borderBottom: '1px dashed #6b7280' }}>
                    <span><b>Date:</b> {formatDateFormatted(posDate)}</span>
                    <span>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                  </div>

                  {/* Items Table Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.5fr 0.65fr 0.75fr', fontSize: '10px', fontWeight: 'bold', borderBottom: '1px dashed #6b7280', padding: '6px 0', color: '#111827' }}>
                    <span>ITEM</span>
                    <span style={{ textAlign: 'center' }}>QTY</span>
                    <span style={{ textAlign: 'right' }}>RATE</span>
                    <span style={{ textAlign: 'right' }}>AMT</span>
                  </div>

                  {/* Items List */}
                  <div style={{ padding: '2px 0' }}>
                    {posCart.length === 0 ? (
                      <div style={{ padding: '36px 10px', textAlign: 'center', color: '#9ca3af', fontSize: '11px', fontStyle: 'italic' }}>
                        --- NO PRODUCTS SELECTED ---<br/>
                        <span style={{ fontSize: '9px', color: '#a1a1aa' }}>Tap any product button on the left</span>
                      </div>
                    ) : (
                      posCart.map(item => (
                        <div key={item.name} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.5fr 0.65fr 0.75fr', alignItems: 'center', fontSize: '11px', color: '#111', padding: '5px 0', borderBottom: '1px dotted #e5e7eb', gap: '2px' }}>
                          <span style={{ fontWeight: '600', wordBreak: 'break-word', lineHeight: '1.25' }}>
                            {item.name}
                          </span>
                          
                          {/* Quantity display */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1px' }}>
                            <button
                              type="button"
                              onClick={() => updatePosQty(item.name, -1)}
                              title="Decrease quantity"
                              style={{ border: 'none', background: '#e5e7eb', width: '15px', height: '15px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', lineHeight: '1', padding: 0, fontWeight: 'bold' }}>
                              -
                            </button>
                            <span style={{ fontWeight: 'bold', fontSize: '11px', minWidth: '14px', textAlign: 'center' }}>{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => updatePosQty(item.name, 1)}
                              title="Increase quantity"
                              style={{ border: 'none', background: '#e5e7eb', width: '15px', height: '15px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', lineHeight: '1', padding: 0, fontWeight: 'bold' }}>
                              +
                            </button>
                          </div>

                          {/* Editable Rate in slip */}
                          <div style={{ textAlign: 'right' }}>
                            <input
                              type="number"
                              min="0"
                              value={item.price}
                              onChange={(e) => updatePosPrice(item.name, Number(e.target.value) || 0)}
                              title="Edit unit price"
                              style={{ width: '42px', textAlign: 'right', border: '1px solid #d1d5db', background: '#fff', fontSize: '10px', padding: '1px 2px', borderRadius: '3px', outline: 'none' }}
                            />
                          </div>

                          {/* Line Amount */}
                          <span style={{ textAlign: 'right', fontWeight: 'bold', color: '#000' }}>
                            ₹{formatIndianCurrency(item.qty * item.price, false)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Total Section */}
                  <div style={{ borderTop: '2px solid #000', paddingTop: '8px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '900', color: '#000' }}>
                      <span>TOTAL PAYABLE:</span>
                      <span>₹{formatIndianCurrency(posCartTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB 2: TODAY'S POS BILLS HISTORY LIST */
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Bills generated on <b>{formatDateFormatted(posDate)}</b>:</span>
                  <span style={{ color: '#c4b5fd', fontWeight: '700' }}>{todayPosBillsList.length} bill(s)</span>
                </div>

                {todayPosBillsList.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                    <Printer size={28} style={{ opacity: 0.4, margin: '0 auto 8px auto', display: 'block' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>No POS bills printed for this date yet.</span>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>Select products on the left and click &apos;Print Thermal Slip&apos; to generate your first bill.</div>
                  </div>
                ) : (
                  todayPosBillsList.map(bill => (
                    <div
                      key={bill.billNo}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'all 0.15s'
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: '#c4b5fd', fontFamily: 'monospace' }}>
                            #{bill.billNo}
                          </span>
                          <span style={{ fontSize: '9px', fontWeight: '700', padding: '1px 6px', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>
                            POS
                          </span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#4ade80' }}>
                          ₹{formatIndianCurrency(bill.total)}
                        </span>
                      </div>

                      <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                        {bill.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <button
                          type="button"
                          onClick={() => printThermalSlip(bill)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            border: '1px solid rgba(139, 92, 246, 0.4)',
                            color: '#c4b5fd',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}>
                          <Printer size={12} /> Re-print 3&quot; Slip
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Right Bottom: Summary & Print Thermal Button */}
            <div style={{
              padding: '14px 16px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#c4b5fd', textTransform: 'uppercase' }}>Total Payable</span>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>Payment Method: <b>POS</b></div>
                </div>
                <span style={{ fontSize: '20px', fontWeight: '900', color: '#4ade80' }}>
                  ₹{formatIndianCurrency(posCartTotal)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowPosModal(false)}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}>
                  Close
                </button>

                {/* SAVE ONLY */}
                <button
                  type="button"
                  disabled={posCart.length === 0 || isProcessingPos}
                  onClick={() => handleSaveAndPrintPos(false)}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    background: posCart.length > 0 && !isProcessingPos
                      ? 'rgba(16, 185, 129, 0.18)'
                      : '#1e293b',
                    border: posCart.length > 0 && !isProcessingPos
                      ? '1px solid rgba(52, 211, 153, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    color: posCart.length > 0 && !isProcessingPos ? '#34d399' : '#64748b',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: posCart.length > 0 && !isProcessingPos ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (posCart.length > 0 && !isProcessingPos) {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.28)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (posCart.length > 0 && !isProcessingPos) {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.18)';
                    }
                  }}>
                  ✓ Save Only
                </button>

                {/* SAVE & PRINT */}
                <button
                  type="button"
                  disabled={posCart.length === 0 || isProcessingPos}
                  onClick={() => handleSaveAndPrintPos(true)}
                  style={{
                    flex: 1.3,
                    padding: '12px 16px',
                    background: posCart.length > 0 && !isProcessingPos
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
                      : '#334155',
                    border: '1px solid rgba(196, 181, 253, 0.3)',
                    borderRadius: '12px',
                    color: posCart.length > 0 && !isProcessingPos ? '#fff' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: posCart.length > 0 && !isProcessingPos ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: posCart.length > 0 && !isProcessingPos
                      ? '0 6px 20px rgba(139, 92, 246, 0.45)'
                      : 'none',
                    transition: 'all 0.15s'
                  }}>
                  <Printer size={15} />
                  {isProcessingPos ? 'Processing...' : 'Save & Print'}
                </button>
              </div>

              {lastPrintedBill && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#94a3b8', paddingTop: '4px' }}>
                  <span>Last Printed: <b style={{ color: '#c4b5fd' }}>{lastPrintedBill.billNo}</b> (₹{formatIndianCurrency(lastPrintedBill.total)})</span>
                  <button
                    type="button"
                    onClick={() => printThermalSlip(lastPrintedBill)}
                    style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', textDecoration: 'underline', padding: '0', fontSize: '10px' }}>
                    Re-print Slip
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
