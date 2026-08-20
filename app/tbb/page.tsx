'use client';

import React, { useState, useEffect } from 'react';
import CustomDatePicker from '@/components/CustomDatePicker';
import { SaleEntry, PurchaseEntry } from '@/types/admin';
import { exportToExcel } from '@/utils/excelExport';
import { supabase } from '@/context/supabase';
import { 
  TrendingUp, 
  ShoppingBag, 
  PlusCircle, 
  FileSpreadsheet, 
  Trash2, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  Database,
  Lock,
  Edit2,
  AlertTriangle
} from 'lucide-react';

const INITIAL_SALES: SaleEntry[] = [
  { id: '1', date: '2026-08-20', item_name: 'Chocolate Truffle Cake', category: 'Cakes', quantity: 2, unit_price: 550.00, total_amount: 1100.00, payment_method: 'UPI', notes: 'Birthday order' },
  { id: '2', date: '2026-08-19', item_name: 'Almond Croissant', category: 'Pastries', quantity: 6, unit_price: 120.00, total_amount: 720.00, payment_method: 'Card', notes: 'Morning walk-in' },
  { id: '3', date: '2026-08-18', item_name: 'Red Velvet Cupcake Set', category: 'Cupcakes', quantity: 1, unit_price: 450.00, total_amount: 450.00, payment_method: 'Cash', notes: 'Party set' },
  { id: '4', date: '2026-08-17', item_name: 'Custom Wedding Cake (Tier 3)', category: 'Custom Cakes', quantity: 1, unit_price: 4500.00, total_amount: 4500.00, payment_method: 'Bank Transfer', notes: 'Advance payment 50%' },
];

const INITIAL_PURCHASES: PurchaseEntry[] = [
  { id: '1', date: '2026-08-20', item_name: 'Organic Wheat Flour 50kg', supplier: 'GrainCo Supplies', category: 'Raw Materials', quantity: 3, unit_price: 2100.00, total_amount: 6300.00, payment_status: 'Paid', notes: 'Batch #8821' },
  { id: '2', date: '2026-08-19', item_name: 'Unsalted Butter (Case 20kg)', supplier: 'Dairy Fresh Wholesale', category: 'Dairy', quantity: 2, unit_price: 4500.00, total_amount: 9000.00, payment_status: 'Paid', notes: 'Grade A butter' },
  { id: '3', date: '2026-08-16', item_name: 'Belgian Dark Chocolate 10kg', supplier: 'ChocoCraft Ltd', category: 'Raw Materials', quantity: 2, unit_price: 3200.00, total_amount: 6400.00, payment_status: 'Pending', notes: 'Payment due in 15 days' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases' | 'analytics' | 'supabase'>('sales');

  // Password Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Data States
  const [sales, setSales] = useState<SaleEntry[]>(INITIAL_SALES);
  const [purchases, setPurchases] = useState<PurchaseEntry[]>(INITIAL_PURCHASES);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Modal States
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleEntry | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseEntry | null>(null);

  // Delete Confirmation Pop-Screen State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'sale' | 'purchase'; item: SaleEntry | PurchaseEntry } | null>(null);

  // Form Fields - Sale
  const [saleForm, setSaleForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    item_name: '',
    category: 'Cakes',
    quantity: 1,
    unit_price: 0,
    payment_method: 'Card' as const,
    notes: ''
  });

  // Form Fields - Purchase
  const [purchaseForm, setPurchaseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    item_name: '',
    supplier: '',
    category: 'Raw Materials',
    quantity: 1,
    unit_price: 0,
    payment_status: 'Paid' as const,
    notes: ''
  });

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('tbb_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (inputPassword === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('tbb_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect Password. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFromSupabase();
    }
  }, [isAuthenticated]);

  const fetchFromSupabase = async () => {
    if (!supabase) {
      setIsSupabaseConnected(false);
      return;
    }
    setLoading(true);
    try {
      const { data: salesData, error: salesErr } = await supabase.from('sales').select('*').order('date', { ascending: false });
      const { data: purchasesData, error: purErr } = await supabase.from('purchases').select('*').order('date', { ascending: false });

      if (!salesErr && salesData) setSales(salesData);
      if (!purErr && purchasesData) setPurchases(purchasesData);
      setIsSupabaseConnected(true);
    } catch (e) {
      console.warn('Supabase not fully configured yet, using local state.', e);
      setIsSupabaseConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Open Add/Edit Sale Modal
  const openSaleModal = (sale?: SaleEntry) => {
    if (sale) {
      setEditingSale(sale);
      setSaleForm({
        date: sale.date,
        item_name: sale.item_name,
        category: sale.category,
        quantity: sale.quantity,
        unit_price: sale.unit_price,
        payment_method: sale.payment_method as any,
        notes: sale.notes || ''
      });
    } else {
      setEditingSale(null);
      setSaleForm({
        date: new Date().toISOString().slice(0, 10),
        item_name: '',
        category: 'Cakes',
        quantity: 1,
        unit_price: 0,
        payment_method: 'Card',
        notes: ''
      });
    }
    setShowSaleModal(true);
  };

  // Open Add/Edit Purchase Modal
  const openPurchaseModal = (purchase?: PurchaseEntry) => {
    if (purchase) {
      setEditingPurchase(purchase);
      setPurchaseForm({
        date: purchase.date,
        item_name: purchase.item_name,
        supplier: purchase.supplier,
        category: purchase.category,
        quantity: purchase.quantity,
        unit_price: purchase.unit_price,
        payment_status: purchase.payment_status as any,
        notes: purchase.notes || ''
      });
    } else {
      setEditingPurchase(null);
      setPurchaseForm({
        date: new Date().toISOString().slice(0, 10),
        item_name: '',
        supplier: '',
        category: 'Raw Materials',
        quantity: 1,
        unit_price: 0,
        payment_status: 'Paid',
        notes: ''
      });
    }
    setShowPurchaseModal(true);
  };

  // Save (Create or Update) Sale Entry
  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const total_amount = saleForm.quantity * saleForm.unit_price;

    if (editingSale) {
      // UPDATE
      const updatedEntry: SaleEntry = { ...editingSale, ...saleForm, total_amount };
      if (supabase) {
        await supabase.from('sales').update(saleForm).eq('id', editingSale.id);
      }
      setSales(sales.map(s => s.id === editingSale.id ? updatedEntry : s));
    } else {
      // CREATE
      let newEntry: SaleEntry = { id: Date.now().toString(), ...saleForm, total_amount };
      if (supabase) {
        const { id, ...payload } = newEntry;
        const { data, error } = await supabase.from('sales').insert([payload]).select();
        if (error) {
          alert('Supabase Error: ' + error.message);
          return;
        }
        if (data && data.length > 0) newEntry = data[0];
      }
      setSales([newEntry, ...sales]);
    }

    setShowSaleModal(false);
    setEditingSale(null);
  };

  // Save (Create or Update) Purchase Entry
  const handleSavePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const total_amount = purchaseForm.quantity * purchaseForm.unit_price;

    if (editingPurchase) {
      // UPDATE
      const updatedEntry: PurchaseEntry = { ...editingPurchase, ...purchaseForm, total_amount };
      if (supabase) {
        await supabase.from('purchases').update(purchaseForm).eq('id', editingPurchase.id);
      }
      setPurchases(purchases.map(p => p.id === editingPurchase.id ? updatedEntry : p));
    } else {
      // CREATE
      let newEntry: PurchaseEntry = { id: Date.now().toString(), ...purchaseForm, total_amount };
      if (supabase) {
        const { id, ...payload } = newEntry;
        const { data, error } = await supabase.from('purchases').insert([payload]).select();
        if (error) {
          alert('Supabase Error: ' + error.message);
          return;
        }
        if (data && data.length > 0) newEntry = data[0];
      }
      setPurchases([newEntry, ...purchases]);
    }

    setShowPurchaseModal(false);
    setEditingPurchase(null);
  };

  // Confirm and Execute Delete via Pop-Screen Modal
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'sale') {
      if (supabase) await supabase.from('sales').delete().eq('id', deleteTarget.item.id);
      setSales(sales.filter(s => s.id !== deleteTarget.item.id));
    } else {
      if (supabase) await supabase.from('purchases').delete().eq('id', deleteTarget.item.id);
      setPurchases(purchases.filter(p => p.id !== deleteTarget.item.id));
    }

    setDeleteTarget(null);
  };

  const filteredSales = sales.filter((s: SaleEntry) => {
    const matchesSearch = s.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.payment_method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStart = !filterStartDate || s.date >= filterStartDate;
    const matchesEnd = !filterEndDate || s.date <= filterEndDate;
    return matchesSearch && matchesStart && matchesEnd;
  });

  const filteredPurchases = purchases.filter((p: PurchaseEntry) => {
    const matchesSearch = p.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStart = !filterStartDate || p.date >= filterStartDate;
    const matchesEnd = !filterEndDate || p.date <= filterEndDate;
    return matchesSearch && matchesStart && matchesEnd;
  });

  const totalSalesAmount = sales.reduce((acc: number, curr: SaleEntry) => acc + curr.total_amount, 0);
  const totalPurchaseAmount = purchases.reduce((acc: number, curr: PurchaseEntry) => acc + curr.total_amount, 0);
  const netProfit = totalSalesAmount - totalPurchaseAmount;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif', padding: '20px' }}>
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', padding: '40px 32px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', margin: '0 auto 20px auto' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Access Protected
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px', lineHeight: '1.5' }}>
            Enter your secret Admin password to unlock The Baker Bro dashboard.
          </p>

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input 
              type="password" required
              placeholder="Enter Admin Password..."
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none', textAlign: 'center', letterSpacing: '0.1em' }}
            />

            {authError && (
              <div style={{ color: '#f87171', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {authError}
              </div>
            )}

            <button 
              type="submit"
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)', transition: 'transform 0.15s ease' }}>
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif', padding: '32px 24px' }}>
      
      {/* Header Bar */}
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
              <Database size={13} /> {isSupabaseConnected ? 'Supabase Live' : 'Demo Mode (Local)'}
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>
            Manage Sales, Purchase ledger entries, view analytics, and export Excel reports.
          </p>
        </div>

        {/* Top Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => exportToExcel(activeTab === 'sales' ? filteredSales : filteredPurchases, activeTab.toUpperCase() + '_REPORT', activeTab)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 18px', 
              borderRadius: '10px', 
              fontWeight: '600', 
              fontSize: '14px', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' 
            }}>
            <FileSpreadsheet size={16} /> Export to Excel
          </button>
          {activeTab === 'sales' ? (
            <button 
              onClick={() => openSaleModal()}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                color: '#fff', 
                border: 'none', 
                padding: '10px 18px', 
                borderRadius: '10px', 
                fontWeight: '600', 
                fontSize: '14px', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)' 
              }}>
              <PlusCircle size={16} /> New Sale Entry
            </button>
          ) : (
            <button 
              onClick={() => openPurchaseModal()}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', 
                color: '#fff', 
                border: 'none', 
                padding: '10px 18px', 
                borderRadius: '10px', 
                fontWeight: '600', 
                fontSize: '14px', 
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)' 
              }}>
              <PlusCircle size={16} /> New Purchase Entry
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 32px auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue (Sales)</span>
            <div style={{ padding: '8px', background: 'rgba(34, 197, 94, 0.12)', borderRadius: '10px', color: '#4ade80' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '12px', color: '#f8fafc' }}>
            ₹{totalSalesAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '13px', color: '#4ade80' }}>
            <ArrowUpRight size={14} /> {sales.length} total transaction entries
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Expenses (Purchases)</span>
            <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.12)', borderRadius: '10px', color: '#f87171' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '12px', color: '#f8fafc' }}>
            ₹{totalPurchaseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '13px', color: '#f87171' }}>
            <ArrowDownRight size={14} /> {purchases.length} raw material & supply orders
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Margin / Profit</span>
            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '10px', color: '#fbbf24' }}>
              <Database size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '12px', color: netProfit >= 0 ? '#fbbf24' : '#f87171' }}>
            ₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px' }}>
            Sales revenue minus purchase costs
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px', boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
        
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('sales')}
            style={{ 
              padding: '12px 20px', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'sales' ? '3px solid #f59e0b' : '3px solid transparent', 
              color: activeTab === 'sales' ? '#fbbf24' : '#94a3b8', 
              fontWeight: '700', 
              fontSize: '15px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease' 
            }}>
            Sales Ledger ({sales.length})
          </button>
          <button 
            onClick={() => setActiveTab('purchases')}
            style={{ 
              padding: '12px 20px', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'purchases' ? '3px solid #6366f1' : '3px solid transparent', 
              color: activeTab === 'purchases' ? '#818cf8' : '#94a3b8', 
              fontWeight: '700', 
              fontSize: '15px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease' 
            }}>
            Purchase Ledger ({purchases.length})
          </button>
          <button 
            onClick={() => setActiveTab('supabase')}
            style={{ 
              padding: '12px 20px', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'supabase' ? '3px solid #10b981' : '3px solid transparent', 
              color: activeTab === 'supabase' ? '#34d399' : '#94a3b8', 
              fontWeight: '700', 
              fontSize: '15px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease' 
            }}>
            Supabase DB Config
          </button>
        </div>

        {activeTab !== 'supabase' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>Search Item / Category</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search by keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>From Date</label>
              <CustomDatePicker 
                value={filterStartDate}
                onChange={(e: any) => setFilterStartDate(e.target.value)}
                placeholder="Start Date..."
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>To Date</label>
              <CustomDatePicker 
                value={filterEndDate}
                onChange={(e: any) => setFilterEndDate(e.target.value)}
                placeholder="End Date..."
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                onClick={() => { setSearchTerm(''); setFilterStartDate(''); setFilterEndDate(''); }}
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s' }}>
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Sales Ledger Table */}
        {activeTab === 'sales' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Item Name</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Qty</th>
                  <th style={{ padding: '12px 16px' }}>Unit Price</th>
                  <th style={{ padding: '12px 16px' }}>Total Amount</th>
                  <th style={{ padding: '12px 16px' }}>Payment Method</th>
                  <th style={{ padding: '12px 16px' }}>Notes</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No sale entries found matching your filter criteria.</td>
                  </tr>
                ) : (
                  filteredSales.map((sale: SaleEntry) => (
                    <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: '#f59e0b' }}>{sale.date}</td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#f8fafc' }}>{sale.item_name}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderRadius: '6px', fontSize: '12px' }}>
                          {sale.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>{sale.quantity}</td>
                      <td style={{ padding: '14px 16px' }}>₹{sale.unit_price.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: '#4ade80' }}>₹{sale.total_amount.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', fontSize: '12px', color: '#cbd5e1' }}>
                          {sale.payment_method}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px' }}>{sale.notes || '-'}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => openSaleModal(sale)}
                            title="Edit Entry"
                            style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fbbf24', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => setDeleteTarget({ type: 'sale', item: sale })}
                            title="Delete Entry"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Purchase Ledger Table */}
        {activeTab === 'purchases' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Item / Supply</th>
                  <th style={{ padding: '12px 16px' }}>Supplier</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Qty</th>
                  <th style={{ padding: '12px 16px' }}>Unit Price</th>
                  <th style={{ padding: '12px 16px' }}>Total Amount</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No purchase entries found.</td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase: PurchaseEntry) => (
                    <tr key={purchase.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: '#818cf8' }}>{purchase.date}</td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#f8fafc' }}>{purchase.item_name}</td>
                      <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{purchase.supplier}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderRadius: '6px', fontSize: '12px' }}>
                          {purchase.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>{purchase.quantity}</td>
                      <td style={{ padding: '14px 16px' }}>₹{purchase.unit_price.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', fontWeight: '800', color: '#f87171' }}>₹{purchase.total_amount.toFixed(2)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontSize: '12px',
                          background: purchase.payment_status === 'Paid' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: purchase.payment_status === 'Paid' ? '#4ade80' : '#f87171'
                        }}>
                          {purchase.payment_status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => openPurchaseModal(purchase)}
                            title="Edit Entry"
                            style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                            <Edit2 size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => setDeleteTarget({ type: 'purchase', item: purchase })}
                            title="Delete Entry"
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Supabase Setup Guide */}
        {activeTab === 'supabase' && (
          <div style={{ padding: '12px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#34d399' }}>
              Connect Supabase Database
            </h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              To sync your sales and purchase records permanently in your cloud Supabase database, create a project at <b>supabase.com</b> and run the following SQL script in your Supabase SQL Editor:
            </p>

            <pre style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', color: '#38bdf8', overflowX: 'auto', fontSize: '13px', lineHeight: '1.5' }}>
{`-- 1. Create Sales Table
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Purchases Table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  item_name TEXT NOT NULL,
  supplier TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
            </pre>
          </div>
        )}

      </div>

      {/* Pop-Screen Modal - Sale Entry (Add / Edit) */}
      {showSaleModal && (
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
                <input 
                  type="text" required
                  placeholder="e.g. Chocolate Truffle Cake"
                  value={saleForm.item_name}
                  onChange={(e) => setSaleForm({ ...saleForm, item_name: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
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
                    <option value="Custom Cakes">Custom Cakes</option>
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
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Quantity</label>
                  <input 
                    type="number" min="1" required
                    value={saleForm.quantity}
                    onChange={(e) => setSaleForm({ ...saleForm, quantity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Unit Price (₹)</label>
                  <input 
                    type="number" step="0.01" min="0" required
                    value={saleForm.unit_price}
                    onChange={(e) => setSaleForm({ ...saleForm, unit_price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '10px', color: '#fbbf24', fontWeight: '700' }}>
                <span>Calculated Total:</span>
                <span>₹{(saleForm.quantity * saleForm.unit_price).toFixed(2)}</span>
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
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                  {editingSale ? 'Update Sale Entry' : 'Save Sale Entry'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Pop-Screen Modal - Purchase Entry (Add / Edit) */}
      {showPurchaseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#818cf8', marginBottom: '20px' }}>
              {editingPurchase ? 'Edit Purchase Entry' : 'Record Purchase Entry'}
            </h2>
            
            <form onSubmit={handleSavePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Purchase Date</label>
                <CustomDatePicker 
                  value={purchaseForm.date}
                  onChange={(e: any) => setPurchaseForm({ ...purchaseForm, date: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Item / Raw Material</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Flour 50kg"
                    value={purchaseForm.item_name}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, item_name: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Supplier Vendor</label>
                  <input 
                    type="text" required
                    placeholder="e.g. GrainCo Ltd"
                    value={purchaseForm.supplier}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, supplier: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>
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
                    <option value="Packaging">Packaging</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Utilities">Utilities</option>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Quantity</label>
                  <input 
                    type="number" min="1" required
                    value={purchaseForm.quantity}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Unit Cost (₹)</label>
                  <input 
                    type="number" step="0.01" min="0" required
                    value={purchaseForm.unit_price}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, unit_price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(99,102,241,0.1)', borderRadius: '10px', color: '#818cf8', fontWeight: '700' }}>
                <span>Total Purchase Cost:</span>
                <span>₹{(purchaseForm.quantity * purchaseForm.unit_price).toFixed(2)}</span>
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
                  style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                  {editingPurchase ? 'Update Purchase Entry' : 'Save Purchase Entry'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Pop-Screen Modal - Delete Confirmation */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px' }}>
          <div style={{ background: '#111827', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ width: '56px', height: '56px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 20px auto' }}>
              <AlertTriangle size={28} />
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#f87171', margin: '0 0 8px 0' }}>
              Delete {deleteTarget.type === 'sale' ? 'Sale' : 'Purchase'} Entry?
            </h3>
            
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <b>"{deleteTarget.item.item_name}"</b>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
