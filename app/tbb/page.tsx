'use client';

import React, { useState, useEffect } from 'react';
import CustomDatePicker from '@/components/CustomDatePicker';
import AutoSuggestInput from '@/components/AutoSuggestInput';
import { SaleEntry, PurchaseEntry, TrashEntry } from '@/types/admin';
import { exportSingleToExcel, exportBothToExcel } from '@/utils/excelExport';
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
  AlertTriangle,
  RotateCcw,
  Info,
  X
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

// Helper to format YYYY-MM-DD into "DD-MMM-YYYY, DDD" format (e.g. 20-Aug-2026, Thu)
const formatDateFormatted = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  if (isNaN(d.getTime())) return dateStr;

  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = dayNames[d.getDay()];

  return `${day}-${month}-${year}, ${dayName}`;
};

export default function AdminPage() {
  // Password Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Data States
  const [sales, setSales] = useState<SaleEntry[]>(INITIAL_SALES);
  const [purchases, setPurchases] = useState<PurchaseEntry[]>(INITIAL_PURCHASES);
  const [trash, setTrash] = useState<TrashEntry[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Toast Notification Pop-up State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters & Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'sales' | 'purchases' | 'trash'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Modal States
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showEntryTypeModal, setShowEntryTypeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleEntry | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseEntry | null>(null);

  // Delete Confirmation Pop-Screen State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'sale' | 'purchase'; item: SaleEntry | PurchaseEntry } | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<TrashEntry | null>(null);

  // Trigger toast pop-up message
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Automatic Trash Purging (Older than 20 days)
  const cleanExpiredTrash = (trashList: TrashEntry[]): TrashEntry[] => {
    const twentyDaysInMs = 20 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    return trashList.filter(item => {
      const deletedTime = new Date(item.deleted_at).getTime();
      return (now - deletedTime) < twentyDaysInMs;
    });
  };

  // Load local trash or fetch from Supabase
  useEffect(() => {
    const localTrash = localStorage.getItem('tbb_admin_trash');
    if (localTrash) {
      try {
        const parsed: TrashEntry[] = JSON.parse(localTrash);
        const cleaned = cleanExpiredTrash(parsed);
        setTrash(cleaned);
        localStorage.setItem('tbb_admin_trash', JSON.stringify(cleaned));
      } catch (err) {
        console.error('Error parsing local trash:', err);
      }
    }
  }, []);

  // Sync Trash with LocalStorage
  const saveTrashState = (updatedTrash: TrashEntry[]) => {
    const cleaned = cleanExpiredTrash(updatedTrash);
    setTrash(cleaned);
    localStorage.setItem('tbb_admin_trash', JSON.stringify(cleaned));
  };

  // Confirm and Move Entry to Trash
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const deletedItem = deleteTarget.item;
    const itemTitle = deletedItem.item_name;
    const newTrashEntry: TrashEntry = {
      id: `trash-${Date.now()}-${deletedItem.id}`,
      original_type: deleteTarget.type,
      item: deletedItem,
      deleted_at: new Date().toISOString()
    };

    if (deleteTarget.type === 'sale') {
      if (supabase) await supabase.from('sales').delete().eq('id', deletedItem.id);
      setSales(sales.filter(s => s.id !== deletedItem.id));
    } else {
      if (supabase) await supabase.from('purchases').delete().eq('id', deletedItem.id);
      setPurchases(purchases.filter(p => p.id !== deletedItem.id));
    }

    const updatedTrash = [newTrashEntry, ...trash];
    saveTrashState(updatedTrash);

    setDeleteTarget(null);
    triggerToast(`🗑️ "${itemTitle}" moved to Trash. It will be permanently cleared after 20 days.`);
  };

  // Restore Entry from Trash back to active ledger
  const restoreFromTrash = async (trashEntry: TrashEntry) => {
    const item = trashEntry.item;
    if (trashEntry.original_type === 'sale') {
      const saleItem = item as SaleEntry;
      if (supabase) {
        await supabase.from('sales').insert([saleItem]);
      }
      setSales([saleItem, ...sales]);
    } else {
      const purchaseItem = item as PurchaseEntry;
      if (supabase) {
        await supabase.from('purchases').insert([purchaseItem]);
      }
      setPurchases([purchaseItem, ...purchases]);
    }

    const updatedTrash = trash.filter(t => t.id !== trashEntry.id);
    saveTrashState(updatedTrash);
    triggerToast(`✨ Successfully restored "${item.item_name}" back to the active ledger!`);
  };

  // Permanently purge a single item from Trash
  const confirmPermanentDelete = () => {
    if (!permanentDeleteTarget) return;
    const updatedTrash = trash.filter(t => t.id !== permanentDeleteTarget.id);
    saveTrashState(updatedTrash);
    const itemName = permanentDeleteTarget.item.item_name;
    setPermanentDeleteTarget(null);
    triggerToast(`🔥 Permanently erased "${itemName}" from Trash.`);
  };

  // Form Fields - Sale
  const [saleForm, setSaleForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    item_name: '',
    category: 'Cakes',
    quantity: '' as string | number,
    unit_price: '' as string | number,
    payment_method: 'Card' as const,
    notes: ''
  });

  // Form Fields - Purchase
  const [purchaseForm, setPurchaseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    item_name: '',
    supplier: '',
    category: 'Raw Materials',
    quantity: '' as string | number,
    unit_price: '' as string | number,
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
        quantity: '',
        unit_price: '',
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
        quantity: '',
        unit_price: '',
        payment_status: 'Paid',
        notes: ''
      });
    }
    setShowPurchaseModal(true);
  };

  // Save (Create or Update) Sale Entry
  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(saleForm.quantity) || 0;
    const price = Number(saleForm.unit_price) || 0;
    const total_amount = qty * price;

    const payloadForm = {
      ...saleForm,
      quantity: qty,
      unit_price: price
    };

    if (editingSale) {
      // UPDATE
      const updatedEntry: SaleEntry = { ...editingSale, ...payloadForm, total_amount };
      if (supabase) {
        await supabase.from('sales').update(payloadForm).eq('id', editingSale.id);
      }
      setSales(sales.map(s => s.id === editingSale.id ? updatedEntry : s));
    } else {
      // CREATE
      let newEntry: SaleEntry = { id: Date.now().toString(), ...payloadForm, total_amount };
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
    const qty = Number(purchaseForm.quantity) || 0;
    const price = Number(purchaseForm.unit_price) || 0;
    const total_amount = qty * price;

    const payloadForm = {
      ...purchaseForm,
      quantity: qty,
      unit_price: price
    };

    if (editingPurchase) {
      // UPDATE
      const updatedEntry: PurchaseEntry = { ...editingPurchase, ...payloadForm, total_amount };
      if (supabase) {
        await supabase.from('purchases').update(payloadForm).eq('id', editingPurchase.id);
      }
      setPurchases(purchases.map(p => p.id === editingPurchase.id ? updatedEntry : p));
    } else {
      // CREATE
      let newEntry: PurchaseEntry = { id: Date.now().toString(), ...payloadForm, total_amount };
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

  // Unified combined items type
  type UnifiedEntry = 
    | { type: 'sale'; data: SaleEntry; id: string; date: string }
    | { type: 'purchase'; data: PurchaseEntry; id: string; date: string };

  const unifiedEntries: UnifiedEntry[] = [
    ...sales.map(s => ({ type: 'sale' as const, data: s, id: `sale-${s.id}`, date: s.date })),
    ...purchases.map(p => ({ type: 'purchase' as const, data: p, id: `pur-${p.id}`, date: p.date }))
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const filteredUnified = unifiedEntries.filter((item) => {
    // 1. Ledger type filter
    if (ledgerFilter === 'sales' && item.type !== 'sale') return false;
    if (ledgerFilter === 'purchases' && item.type !== 'purchase') return false;

    // 2. Date range filter
    if (filterStartDate && item.date < filterStartDate) return false;
    if (filterEndDate && item.date > filterEndDate) return false;

    // 3. Search term filter
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();

    if (item.type === 'sale') {
      const s = item.data;
      return s.item_name.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term) ||
        s.payment_method.toLowerCase().includes(term) ||
        (s.notes && s.notes.toLowerCase().includes(term));
    } else {
      const p = item.data;
      return p.item_name.toLowerCase().includes(term) ||
        p.supplier.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.payment_status.toLowerCase().includes(term) ||
        (p.notes && p.notes.toLowerCase().includes(term));
    }
  });

  // Calculate total pages & Paginated slice
  const totalPages = Math.ceil(filteredUnified.length / pageSize) || 1;
  const paginatedEntries = filteredUnified.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset current page when filters or pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [ledgerFilter, searchTerm, filterStartDate, filterEndDate, pageSize]);

  const totalSalesAmount = filteredSales.reduce((acc: number, curr: SaleEntry) => acc + curr.total_amount, 0);
  const totalPurchaseAmount = filteredPurchases.reduce((acc: number, curr: PurchaseEntry) => acc + curr.total_amount, 0);
  const netProfit = totalSalesAmount - totalPurchaseAmount;

  // Extract unique previous entries for auto-suggestions (max 5)
  const existingSaleItemNames = Array.from(new Set(sales.map(s => s.item_name)));
  const existingPurchaseItemNames = Array.from(new Set(purchases.map(p => p.item_name)));
  const existingSuppliers = Array.from(new Set(purchases.map(p => p.supplier)));

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
              <Database size={13} /> {isSupabaseConnected ? 'Live' : 'Demo Mode (Local)'}
            </span>
          </div>

        </div>

        {/* Top Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowExportModal(true)}
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
          <button
            onClick={() => setShowEntryTypeModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
              transition: 'all 0.2s ease'
            }}>
            <PlusCircle size={18} /> Add New Entry
          </button>
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 16px auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>

        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue (Sales)</span>
            <div style={{ padding: '5px', background: 'rgba(34, 197, 94, 0.12)', borderRadius: '6px', color: '#4ade80' }}>
              <TrendingUp size={14} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px', color: '#f8fafc' }}>
            ₹{totalSalesAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: '#4ade80' }}>
            <ArrowUpRight size={12} /> {filteredSales.length} total transaction entries
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Expenses (Purchases)</span>
            <div style={{ padding: '5px', background: 'rgba(239, 68, 68, 0.12)', borderRadius: '6px', color: '#f87171' }}>
              <ShoppingBag size={14} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px', color: '#f8fafc' }}>
            ₹{totalPurchaseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: '#f87171' }}>
            <ArrowDownRight size={12} /> {filteredPurchases.length} raw material & supply orders
          </div>
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Margin / Profit</span>
            <div style={{ padding: '5px', background: 'rgba(245, 158, 11, 0.12)', borderRadius: '6px', color: '#fbbf24' }}>
              <Database size={14} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '6px', color: netProfit >= 0 ? '#fbbf24' : '#f87171' }}>
            ₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Sales revenue minus purchase costs
          </div>
        </div>

      </div>

      {/* Toast Notification Pop-Up */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999999,
          background: '#1e293b',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '12px',
          padding: '12px 18px',
          color: '#f8fafc',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '420px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <Info size={20} style={{ color: '#60a5fa', flexShrink: 0 }} />
          <div style={{ fontSize: '13px', fontWeight: '500', flex: 1, lineHeight: '1.4' }}>
            {toastMessage}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '14px', gap: '4px' }}>
          <button
            onClick={() => setLedgerFilter('all')}
            style={{
              padding: '6px 12px',
              background: 'none',
              border: 'none',
              borderBottom: ledgerFilter === 'all' ? '2px solid #3b82f6' : '2px solid transparent',
              color: ledgerFilter === 'all' ? '#60a5fa' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
            All Entries ({sales.length + purchases.length})
          </button>
          <button
            onClick={() => setLedgerFilter('sales')}
            style={{
              padding: '6px 12px',
              background: 'none',
              border: 'none',
              borderBottom: ledgerFilter === 'sales' ? '2px solid #f59e0b' : '2px solid transparent',
              color: ledgerFilter === 'sales' ? '#fbbf24' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
            Sales Only ({sales.length})
          </button>
          <button
            onClick={() => setLedgerFilter('purchases')}
            style={{
              padding: '6px 12px',
              background: 'none',
              border: 'none',
              borderBottom: ledgerFilter === 'purchases' ? '2px solid #6366f1' : '2px solid transparent',
              color: ledgerFilter === 'purchases' ? '#818cf8' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
            Purchases Only ({purchases.length})
          </button>
          <button
            onClick={() => setLedgerFilter('trash')}
            style={{
              padding: '6px 12px',
              background: 'none',
              border: 'none',
              borderBottom: ledgerFilter === 'trash' ? '2px solid #ef4444' : '2px solid transparent',
              color: ledgerFilter === 'trash' ? '#f87171' : '#94a3b8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
            <Trash2 size={13} /> Trash Bin ({trash.length})
          </button>
        </div>

        {/* Filters and Date Pickers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '14px', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>Search Keyword</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by item, category, supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '6px 10px 6px 30px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px', outline: 'none' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>From Date</label>
            <CustomDatePicker
              value={filterStartDate}
              onChange={(e: any) => {
                const newStart = e.target.value;
                setFilterStartDate(newStart);
                if (filterEndDate && newStart > filterEndDate) {
                  setFilterEndDate(newStart);
                }
              }}
              placeholder="Start Date..."
              style={{ minHeight: '32px', padding: '4px 8px', fontSize: '12px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>To Date</label>
            <CustomDatePicker
              value={filterEndDate}
              min={filterStartDate}
              onChange={(e: any) => {
                const newEnd = e.target.value;
                if (!filterStartDate || newEnd >= filterStartDate) {
                  setFilterEndDate(newEnd);
                } else {
                  setFilterEndDate(filterStartDate);
                }
              }}
              placeholder="End Date..."
              style={{ minHeight: '32px', padding: '4px 8px', fontSize: '12px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>Entries Per Page</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{ width: '100%', padding: '6px 8px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px', height: '32px' }}>
              <option value={30}>30 per page</option>
              <option value={40}>40 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => { setSearchTerm(''); setFilterStartDate(''); setFilterEndDate(''); setLedgerFilter('all'); setPageSize(30); }}
              style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', height: '32px', transition: 'all 0.15s' }}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Unified Table View or Trash View */}
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
                          ₹{item.total_amount.toFixed(2)}
                        </td>
                        <td style={{ padding: '8px 10px', color: '#94a3b8', fontSize: '11px' }}>
                          {deletedDateFormatted}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => restoreFromTrash(tItem)}
                              title="Restore Entry back to ledger"
                              style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#4ade80', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600' }}>
                              <RotateCcw size={12} /> Restore
                            </button>
                            <button
                              onClick={() => setPermanentDeleteTarget(tItem)}
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
                  <th style={{ padding: '8px 10px' }}>Type</th>
                  <th style={{ padding: '8px 10px' }}>Date</th>
                  <th style={{ padding: '8px 10px' }}>Item / Description</th>
                  <th style={{ padding: '8px 10px' }}>Category</th>
                  <th style={{ padding: '8px 10px' }}>Qty</th>
                  <th style={{ padding: '8px 10px' }}>Unit Rate</th>
                  <th style={{ padding: '8px 10px' }}>Total Amount</th>
                  <th style={{ padding: '8px 10px' }}>Details / Status</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
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
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>{sale.quantity}</td>
                          <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>₹{sale.unit_price.toFixed(2)}</td>
                          <td style={{ padding: '8px 10px', fontWeight: '800', color: '#4ade80' }}>+₹{sale.total_amount.toFixed(2)}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '11px', color: '#cbd5e1' }}>
                              {sale.payment_method}
                            </span>
                            {sale.notes && <span style={{ display: 'block', fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{sale.notes}</span>}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => openSaleModal(sale)}
                                title="Edit Entry"
                                style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fbbf24', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '600' }}>
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'sale', item: sale })}
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
                            {purchase.item_name}
                            <span style={{ display: 'block', fontSize: '10px', color: '#818cf8', fontWeight: '500' }}>Via {purchase.supplier}</span>
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ padding: '2px 8px', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', borderRadius: '4px', fontSize: '11px' }}>
                              {purchase.category}
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>{purchase.quantity}</td>
                          <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>₹{purchase.unit_price.toFixed(2)}</td>
                          <td style={{ padding: '8px 10px', fontWeight: '800', color: '#f87171' }}>-₹{purchase.total_amount.toFixed(2)}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              background: purchase.payment_status === 'Paid' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: purchase.payment_status === 'Paid' ? '#4ade80' : '#f87171'
                            }}>
                              {purchase.payment_status}
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => openPurchaseModal(purchase)}
                                title="Edit Entry"
                                style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#818cf8', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: '600' }}>
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'purchase', item: purchase })}
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
            Showing <b>{filteredUnified.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</b> to <b>{Math.min(currentPage * pageSize, filteredUnified.length)}</b> of <b>{filteredUnified.length}</b> entries
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

      </div>

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
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Quantity</label>
                  <input
                    type="number" min="1" required
                    placeholder="Enter Qty..."
                    value={saleForm.quantity}
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSaleForm({ ...saleForm, quantity: val === '' ? '' : Number(val) });
                    }}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
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
                <span>₹{((Number(saleForm.quantity) || 0) * (Number(saleForm.unit_price) || 0)).toFixed(2)}</span>
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
                  <AutoSuggestInput
                    required
                    placeholder="e.g. Flour 50kg"
                    value={purchaseForm.item_name}
                    onChange={(val) => setPurchaseForm({ ...purchaseForm, item_name: val })}
                    options={existingPurchaseItemNames}
                    maxSuggestions={5}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Supplier Vendor</label>
                  <AutoSuggestInput
                    required
                    placeholder="e.g. GrainCo Ltd"
                    value={purchaseForm.supplier}
                    onChange={(val) => setPurchaseForm({ ...purchaseForm, supplier: val })}
                    options={existingSuppliers}
                    maxSuggestions={5}
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
                    placeholder="Enter Qty..."
                    value={purchaseForm.quantity}
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPurchaseForm({ ...purchaseForm, quantity: val === '' ? '' : Number(val) });
                    }}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Unit Cost (₹)</label>
                  <input
                    type="number" step="0.01" min="0" required
                    placeholder="Enter Price..."
                    value={purchaseForm.unit_price}
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPurchaseForm({ ...purchaseForm, unit_price: val === '' ? '' : Number(val) });
                    }}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(99,102,241,0.1)', borderRadius: '10px', color: '#818cf8', fontWeight: '700' }}>
                <span>Total Purchase Cost:</span>
                <span>₹{((Number(purchaseForm.quantity) || 0) * (Number(purchaseForm.unit_price) || 0)).toFixed(2)}</span>
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
                  disabled={(Number(purchaseForm.quantity) || 0) * (Number(purchaseForm.unit_price) || 0) <= 0}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: ((Number(purchaseForm.quantity) || 0) * (Number(purchaseForm.unit_price) || 0) > 0)
                      ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                      : '#374151',
                    border: 'none',
                    borderRadius: '10px',
                    color: ((Number(purchaseForm.quantity) || 0) * (Number(purchaseForm.unit_price) || 0) > 0) ? '#fff' : '#9ca3af',
                    fontWeight: '700',
                    cursor: ((Number(purchaseForm.quantity) || 0) * (Number(purchaseForm.unit_price) || 0) > 0) ? 'pointer' : 'not-allowed',
                    opacity: ((Number(purchaseForm.quantity) || 0) * (Number(purchaseForm.unit_price) || 0) > 0) ? 1 : 0.65
                  }}>
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
              Move {deleteTarget.type === 'sale' ? 'Sale' : 'Purchase'} Entry to Trash?
            </h3>

            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
              Are you sure you want to move <b>"{deleteTarget.item.item_name}"</b> to Trash? It can be restored anytime within 20 days.
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
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-Screen Modal - Permanent Delete Confirmation for Trash Item */}
      {permanentDeleteTarget && (
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
                onClick={() => setPermanentDeleteTarget(null)}
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={confirmPermanentDelete}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }}>
                Erase Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-Screen Modal - Select Entry Type (Sale or Purchase) */}
      {showEntryTypeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999, padding: '20px' }}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '28px', padding: '36px 32px', width: '100%', maxWidth: '520px', textAlign: 'center', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.85)' }}>

            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', background: 'linear-gradient(135deg, #f59e0b 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Create New Ledger Record
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px', lineHeight: '1.5' }}>
              Select the type of financial transaction you want to record.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

              {/* Option 1: Sale Entry */}
              <button
                onClick={() => {
                  setShowEntryTypeModal(false);
                  openSaleModal();
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

              {/* Option 2: Purchase Entry */}
              <button
                onClick={() => {
                  setShowEntryTypeModal(false);
                  openPurchaseModal();
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
      )}

      {/* Pop-Screen Modal - Select Export Type (Sales Only, Purchases Only, or Both) */}
      {showExportModal && (
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
      )}

    </div>
  );
}
