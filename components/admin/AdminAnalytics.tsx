'use client';

import React from 'react';
import { BarChart3, CreditCard, Layers, TrendingUp, ShoppingBag, Database } from 'lucide-react';
import { formatIndianCurrency } from './adminUtils';
import { SaleEntry, PurchaseEntry } from '@/types/admin';

interface AdminAnalyticsProps {
  showSummaryMetrics: boolean;
  metricBreakdownTab: 'payment' | 'category';
  setMetricBreakdownTab: (tab: 'payment' | 'category') => void;
  filteredSales: SaleEntry[];
  filteredPurchases: PurchaseEntry[];
  totalSalesAmount: number;
  totalPurchaseAmount: number;
  netProfit: number;
  salesByPaymentMethod: [string, { count: number; total: number }][];
  purchasesByPaymentMethod: [string, { count: number; total: number }][];
  salesByCategory: [string, { count: number; total: number }][];
  purchasesByCategory: [string, { count: number; total: number }][];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  showSummaryMetrics,
  metricBreakdownTab,
  setMetricBreakdownTab,
  filteredSales,
  filteredPurchases,
  totalSalesAmount,
  totalPurchaseAmount,
  netProfit,
  salesByPaymentMethod,
  purchasesByPaymentMethod,
  salesByCategory,
  purchasesByCategory
}) => {
  if (!showSummaryMetrics) return null;

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto 16px auto',
      background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      {/* Top Header of Analytics Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '6px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '8px', color: '#fbbf24' }}>
            <BarChart3 size={16} />
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc' }}>Financial Analytics & Category Summary</span>
            <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>Real-time calculations based on active filters</span>
          </div>
        </div>

        {/* Toggle Tab between Payment Methods and Categories Breakdown */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={() => setMetricBreakdownTab('payment')}
            style={{
              padding: '4px 10px',
              background: metricBreakdownTab === 'payment' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              border: metricBreakdownTab === 'payment' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
              borderRadius: '6px',
              color: metricBreakdownTab === 'payment' ? '#a5b4fc' : '#94a3b8',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
            <CreditCard size={12} /> Payment Methods
          </button>
          <button
            type="button"
            onClick={() => setMetricBreakdownTab('category')}
            style={{
              padding: '4px 10px',
              background: metricBreakdownTab === 'category' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              border: metricBreakdownTab === 'category' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
              borderRadius: '6px',
              color: metricBreakdownTab === 'category' ? '#fbbf24' : '#94a3b8',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
            <Layers size={12} /> Category Breakdown
          </button>
        </div>
      </div>

      {/* 3 Main Metric & Category/Payment Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        
        {/* 1. SALES / TOTAL REVENUE CARD */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(20, 35, 30, 0.7) 100%)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 24px -4px rgba(34, 197, 94, 0.15)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} /> Total Revenue (Sales)
              </span>
              <div style={{ padding: '4px 8px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '20px', color: '#4ade80', fontSize: '10px', fontWeight: '700' }}>
                {filteredSales.length} Entries
              </div>
            </div>

            <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '8px', color: '#4ade80', letterSpacing: '-0.02em' }}>
              ₹{formatIndianCurrency(totalSalesAmount)}
            </div>

            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', marginBottom: '14px' }}>
              Total collected sales in selected filter
            </div>
          </div>

          {/* Embedded Sales Breakdown */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            borderRadius: '10px',
            padding: '10px 12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {metricBreakdownTab === 'payment' ? <CreditCard size={11} /> : <Layers size={11} />}
                {metricBreakdownTab === 'payment' ? 'Sales by Payment Method' : 'Sales by Category'}
              </span>
              <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '600' }}>Share %</span>
            </div>

            {metricBreakdownTab === 'payment' ? (
              salesByPaymentMethod.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', padding: '8px 0' }}>No sales records found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                  {salesByPaymentMethod.map(([method, data]) => {
                    const pct = totalSalesAmount > 0 ? Math.round((data.total / totalSalesAmount) * 100) : 0;
                    return (
                      <div key={method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', fontSize: '11px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{method}</span>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>({data.count})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: '700', color: '#4ade80' }}>₹{formatIndianCurrency(data.total)}</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8', minWidth: '24px', textAlign: 'right' }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              salesByCategory.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', padding: '8px 0' }}>No sales categories found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                  {salesByCategory.map(([cat, data]) => {
                    const pct = totalSalesAmount > 0 ? Math.round((data.total / totalSalesAmount) * 100) : 0;
                    return (
                      <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', fontSize: '11px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{cat}</span>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>({data.count})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: '700', color: '#4ade80' }}>₹{formatIndianCurrency(data.total)}</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8', minWidth: '24px', textAlign: 'right' }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>

        {/* 2. PURCHASES / TOTAL EXPENSES CARD */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(35, 20, 25, 0.7) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 24px -4px rgba(239, 68, 68, 0.15)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#f87171', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingBag size={14} /> Total Expenses (Purchases)
              </span>
              <div style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', color: '#f87171', fontSize: '10px', fontWeight: '700' }}>
                {filteredPurchases.length} Orders
              </div>
            </div>

            <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '8px', color: '#f87171', letterSpacing: '-0.02em' }}>
              ₹{formatIndianCurrency(totalPurchaseAmount)}
            </div>

            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', marginBottom: '14px' }}>
              Total material & inventory expenses
            </div>
          </div>

          {/* Embedded Purchases Breakdown */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '10px',
            padding: '10px 12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {metricBreakdownTab === 'payment' ? <CreditCard size={11} /> : <Layers size={11} />}
                {metricBreakdownTab === 'payment' ? 'Purchases by Payment Method' : 'Purchases by Category'}
              </span>
              <span style={{ fontSize: '9px', color: '#64748b', fontWeight: '600' }}>Share %</span>
            </div>

            {metricBreakdownTab === 'payment' ? (
              purchasesByPaymentMethod.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', padding: '8px 0' }}>No purchase records found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                  {purchasesByPaymentMethod.map(([method, data]) => {
                    const pct = totalPurchaseAmount > 0 ? Math.round((data.total / totalPurchaseAmount) * 100) : 0;
                    return (
                      <div key={method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', fontSize: '11px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{method}</span>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>({data.count})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: '700', color: '#f87171' }}>₹{formatIndianCurrency(data.total)}</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8', minWidth: '24px', textAlign: 'right' }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              purchasesByCategory.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', padding: '8px 0' }}>No purchase categories found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '140px', overflowY: 'auto' }}>
                  {purchasesByCategory.map(([cat, data]) => {
                    const pct = totalPurchaseAmount > 0 ? Math.round((data.total / totalPurchaseAmount) * 100) : 0;
                    return (
                      <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', fontSize: '11px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{cat}</span>
                          <span style={{ fontSize: '10px', color: '#64748b' }}>({data.count})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: '700', color: '#f87171' }}>₹{formatIndianCurrency(data.total)}</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8', minWidth: '24px', textAlign: 'right' }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>

        {/* 3. NET MARGIN / PROFIT CARD */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(35, 30, 20, 0.7) 100%)',
          border: `1px solid ${netProfit >= 0 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: netProfit >= 0 ? '0 8px 24px -4px rgba(245, 158, 11, 0.15)' : '0 8px 24px -4px rgba(239, 68, 68, 0.15)'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: netProfit >= 0 ? '#fbbf24' : '#f87171', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={14} /> Net Profit Margin
              </span>
              <div style={{ padding: '4px 8px', background: netProfit >= 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${netProfit >= 0 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '20px', color: netProfit >= 0 ? '#fbbf24' : '#f87171', fontSize: '10px', fontWeight: '700' }}>
                {netProfit >= 0 ? 'Surplus' : 'Deficit'}
              </div>
            </div>

            <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '8px', color: netProfit >= 0 ? '#fbbf24' : '#f87171', letterSpacing: '-0.02em' }}>
              ₹{formatIndianCurrency(netProfit)}
            </div>

            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', marginBottom: '14px' }}>
              Sales Revenue minus Purchase Costs
            </div>
          </div>

          {/* Profit summary breakdown box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>Total Sales:</span>
              <span style={{ fontWeight: '700', color: '#4ade80' }}>+₹{formatIndianCurrency(totalSalesAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
              <span style={{ color: '#94a3b8' }}>Total Purchases:</span>
              <span style={{ fontWeight: '700', color: '#f87171' }}>-₹{formatIndianCurrency(totalPurchaseAmount)}</span>
            </div>
            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '700' }}>
              <span style={{ color: '#f8fafc' }}>Net Margin:</span>
              <span style={{ color: netProfit >= 0 ? '#fbbf24' : '#f87171' }}>
                {totalSalesAmount > 0 ? `${Math.round((netProfit / totalSalesAmount) * 100)}% Margin` : '0%'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
