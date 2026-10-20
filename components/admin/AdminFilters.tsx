'use client';

import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, Filter, X } from 'lucide-react';
import CustomDatePicker from '@/components/CustomDatePicker';

interface AdminFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedMonthKey: string;
  availableMonths: Array<{ key: string; label: string }>;
  handleMonthFilterChange: (key: string) => void;
  filterStartDate: string;
  setFilterStartDate: (v: string) => void;
  filterEndDate: string;
  setFilterEndDate: (v: string) => void;
  setSelectedMonthKey: (v: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilterCount: number;
  handleResetFilters: () => void;
  // Advanced filter states
  ledgerFilter: 'all' | 'sales' | 'purchases' | 'trash';
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  availableCategories: string[];
  selectedSupplier: string;
  setSelectedSupplier: (s: string) => void;
  availableSuppliers: string[];
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (m: string) => void;
  availablePaymentMethods: string[];
  selectedPaymentStatus: string;
  setSelectedPaymentStatus: (st: string) => void;
  availablePaymentStatuses: string[];
  minAmount: string;
  setMinAmount: (a: string) => void;
  maxAmount: string;
  setMaxAmount: (a: string) => void;
}

export const AdminFilters: React.FC<AdminFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedMonthKey,
  availableMonths,
  handleMonthFilterChange,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  setSelectedMonthKey,
  pageSize,
  setPageSize,
  showAdvancedFilters,
  setShowAdvancedFilters,
  activeFilterCount,
  handleResetFilters,
  ledgerFilter,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  selectedSupplier,
  setSelectedSupplier,
  availableSuppliers,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  availablePaymentMethods,
  selectedPaymentStatus,
  setSelectedPaymentStatus,
  availablePaymentStatuses,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount
}) => {
  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      padding: '12px 14px',
      marginBottom: '14px',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(12px)'
    }}>
      {/* Top Primary Filter Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '8px',
        alignItems: 'center'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '160px', gridColumn: 'span 2' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: searchTerm ? '#60a5fa' : '#64748b' }} />
          <input
            type="text"
            placeholder="Search item, bill#, party, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 26px 6px 28px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: searchTerm ? '1px solid rgba(96, 165, 250, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '12px',
              height: '32px',
              outline: 'none'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Quick Month Select Dropdown */}
        <div style={{ minWidth: '135px' }}>
          <select
            value={selectedMonthKey}
            onChange={(e) => handleMonthFilterChange(e.target.value)}
            style={{
              width: '100%',
              padding: '5px 8px',
              background: selectedMonthKey !== 'all' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.9)',
              border: selectedMonthKey !== 'all' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: selectedMonthKey !== 'all' ? '#93c5fd' : '#cbd5e1',
              fontSize: '11px',
              fontWeight: '700',
              height: '32px',
              outline: 'none',
              cursor: 'pointer'
            }}>
            <option value="all">All Months</option>
            {availableMonths.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
            <option value="custom">Custom Date Range</option>
          </select>
        </div>

        {/* From Date */}
        <div style={{ minWidth: '125px' }}>
          <CustomDatePicker
            value={filterStartDate}
            onChange={(e: any) => {
              const newStart = e.target.value;
              setFilterStartDate(newStart);
              setSelectedMonthKey('custom');
              if (filterEndDate && newStart > filterEndDate) {
                setFilterEndDate(newStart);
              }
            }}
            placeholder="From Date"
            style={{ minHeight: '32px', padding: '4px 6px', fontSize: '11px', background: 'rgba(15, 23, 42, 0.9)' }}
          />
        </div>

        {/* To Date */}
        <div style={{ minWidth: '125px' }}>
          <CustomDatePicker
            value={filterEndDate}
            min={filterStartDate}
            onChange={(e: any) => {
              const newEnd = e.target.value;
              setSelectedMonthKey('custom');
              if (!filterStartDate || newEnd >= filterStartDate) {
                setFilterEndDate(newEnd);
              } else {
                setFilterEndDate(filterStartDate);
              }
            }}
            placeholder="To Date"
            style={{ minHeight: '32px', padding: '4px 6px', fontSize: '11px', background: 'rgba(15, 23, 42, 0.9)' }}
          />
        </div>

        {/* Entries Per Page */}
        <div style={{ minWidth: '95px' }}>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '5px 8px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '11px',
              fontWeight: '600',
              height: '32px',
              outline: 'none',
              cursor: 'pointer'
            }}>
            <option value={10}>10 / page</option>
            <option value={30}>30 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={250}>250 / page</option>
            <option value={500}>500 / page</option>
          </select>
        </div>

        {/* Toggle More Filters Button */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(prev => !prev)}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '6px 10px',
              height: '32px',
              background: showAdvancedFilters || activeFilterCount > 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: showAdvancedFilters || activeFilterCount > 0 ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: showAdvancedFilters || activeFilterCount > 0 ? '#a5b4fc' : '#cbd5e1',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}>
            <SlidersHorizontal size={12} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span style={{
                background: '#6366f1',
                color: '#fff',
                borderRadius: '10px',
                padding: '1px 5px',
                fontSize: '9px',
                fontWeight: '800'
              }}>
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={11} style={{ transform: showAdvancedFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>

          {/* Reset Filter Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset all filters"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 10px',
                height: '32px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
              <RotateCcw size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Advanced Filters Drawer */}
      {showAdvancedFilters && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '8px',
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '4px 8px',
                background: selectedCategory !== 'all' ? 'rgba(245, 158, 11, 0.2)' : '#1e293b',
                border: selectedCategory !== 'all' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: selectedCategory !== 'all' ? '#fbbf24' : '#f8fafc',
                fontSize: '11px',
                height: '30px',
                outline: 'none',
                cursor: 'pointer'
              }}>
              <option value="all">All Categories</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Supplier Filter (Purchases only) */}
          {(ledgerFilter === 'all' || ledgerFilter === 'purchases') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Supplier / Party</span>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  background: selectedSupplier !== 'all' ? 'rgba(99, 102, 241, 0.2)' : '#1e293b',
                  border: selectedSupplier !== 'all' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: selectedSupplier !== 'all' ? '#a5b4fc' : '#f8fafc',
                  fontSize: '11px',
                  height: '30px',
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                <option value="all">All Suppliers</option>
                {availableSuppliers.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment Mode</span>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '4px 8px',
                background: selectedPaymentMethod !== 'all' ? 'rgba(234, 179, 8, 0.2)' : '#1e293b',
                border: selectedPaymentMethod !== 'all' ? '1px solid rgba(234, 179, 8, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: selectedPaymentMethod !== 'all' ? '#fef08a' : '#f8fafc',
                fontSize: '11px',
                height: '30px',
                outline: 'none',
                cursor: 'pointer'
              }}>
              <option value="all">All Payment Modes</option>
              {availablePaymentMethods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter (Purchases only) */}
          {(ledgerFilter === 'all' || ledgerFilter === 'purchases') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment Status</span>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  background: selectedPaymentStatus !== 'all' ? 'rgba(34, 197, 94, 0.2)' : '#1e293b',
                  border: selectedPaymentStatus !== 'all' ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: selectedPaymentStatus !== 'all' ? '#86efac' : '#f8fafc',
                  fontSize: '11px',
                  height: '30px',
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                <option value="all">All Statuses</option>
                {availablePaymentStatuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          )}

          {/* Min Amount Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Min ₹</span>
            <input
              type="number"
              placeholder="Min Amount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '4px 8px',
                background: minAmount ? 'rgba(59, 130, 246, 0.2)' : '#1e293b',
                border: minAmount ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '11px',
                height: '30px',
                outline: 'none'
              }}
            />
          </div>

          {/* Max Amount Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Max ₹</span>
            <input
              type="number"
              placeholder="Max Amount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '4px 8px',
                background: maxAmount ? 'rgba(59, 130, 246, 0.2)' : '#1e293b',
                border: maxAmount ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '11px',
                height: '30px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Active Filter Chips Bar (Shows only when active filters exist) */}
      {activeFilterCount > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          alignItems: 'center',
          marginTop: '10px',
          paddingTop: '8px',
          borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
          fontSize: '11px'
        }}>
          <span style={{ color: '#64748b', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={10} /> Active Filters ({activeFilterCount}):
          </span>

          {searchTerm && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#93c5fd', padding: '2px 8px', borderRadius: '12px' }}>
              Search: &quot;{searchTerm}&quot;
              <X size={10} style={{ cursor: 'pointer' }} onClick={() => setSearchTerm('')} />
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', padding: '2px 8px', borderRadius: '12px' }}>
              Category: {selectedCategory}
              <X size={10} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('all')} />
            </span>
          )}

          {selectedSupplier !== 'all' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#a5b4fc', padding: '2px 8px', borderRadius: '12px' }}>
              Supplier: {selectedSupplier}
              <X size={10} style={{ cursor: 'pointer' }} onClick={() => setSelectedSupplier('all')} />
            </span>
          )}

          {selectedPaymentMethod !== 'all' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', color: '#fef08a', padding: '2px 8px', borderRadius: '12px' }}>
              Method: {selectedPaymentMethod}
              <X size={10} style={{ cursor: 'pointer' }} onClick={() => setSelectedPaymentMethod('all')} />
            </span>
          )}

          {selectedPaymentStatus !== 'all' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#86efac', padding: '2px 8px', borderRadius: '12px' }}>
              Status: {selectedPaymentStatus}
              <X size={10} style={{ cursor: 'pointer' }} onClick={() => setSelectedPaymentStatus('all')} />
            </span>
          )}

          {(minAmount || maxAmount) && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#d8b4fe', padding: '2px 8px', borderRadius: '12px' }}>
              ₹: {minAmount || '0'} - {maxAmount || '∞'}
              <X size={10} style={{ cursor: 'pointer' }} onClick={() => { setMinAmount(''); setMaxAmount(''); }} />
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '10px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', padding: '0 4px' }}>
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
