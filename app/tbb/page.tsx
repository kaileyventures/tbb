'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SaleEntry, PurchaseEntry, TrashEntry } from '@/types/admin';
import { supabase } from '@/context/supabase';
import { Trash2 } from 'lucide-react';
import { Info, X } from 'lucide-react';

// Subcomponents & Helpers
import {
  formatDateFormatted,
  formatIndianCurrency,
  getCurrentMonthRange,
  parsePurchaseNotes,
  normalizePaymentMethod
} from '@/components/admin/adminUtils';
import { AdminAuth } from '@/components/admin/AdminAuth';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { QuickEntryBar } from '@/components/admin/QuickEntryBar';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { AdminTable, UnifiedEntry, SortField } from '@/components/admin/AdminTable';
import { SaleModal } from '@/components/admin/modals/SaleModal';
import { PurchaseModal } from '@/components/admin/modals/PurchaseModal';
import {
  DeleteConfirmModal,
  PermanentDeleteConfirmModal,
  EntryTypeModal,
  ExportModal
} from '@/components/admin/modals/DialogModals';
import { PosModal } from '@/components/admin/modals/PosModal';
import { PriceRegisterModal } from '@/components/admin/modals/PriceRegisterModal';

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

  // Filters & Search & Pagination State (Default date range = current month)
  const currentMonthInit = getCurrentMonthRange();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStartDate, setFilterStartDate] = useState(currentMonthInit.startDate);
  const [filterEndDate, setFilterEndDate] = useState(currentMonthInit.endDate);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(currentMonthInit.monthKey);
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'sales' | 'purchases' | 'trash'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [showSummaryMetrics, setShowSummaryMetrics] = useState<boolean>(false);
  const [metricBreakdownTab, setMetricBreakdownTab] = useState<'payment' | 'category'>('payment');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Column Sorting State
  const [sortField, setSortField] = useState<SortField>('createdTimestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Helper to toggle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Modal States
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showEntryTypeModal, setShowEntryTypeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingSale, setEditingSale] = useState<SaleEntry | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseEntry | null>(null);

  // Delete Confirmation State
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

  // POS State
  const [showPosModal, setShowPosModal] = useState<boolean>(false);
  const [posDate, setPosDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [posCart, setPosCart] = useState<Array<{ name: string; category: string; price: number; qty: number }>>([]);
  const [posSearchTerm, setPosSearchTerm] = useState<string>('');
  const [posSelectedCategory, setPosSelectedCategory] = useState<string>('all');
  const [isProcessingPos, setIsProcessingPos] = useState<boolean>(false);
  const [lastPrintedBill, setLastPrintedBill] = useState<{ billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number } | null>(null);
  const [posRightTab, setPosRightTab] = useState<'slip' | 'history'>('slip');

  // POS Product & Price Register State
  const [showPriceRegisterModal, setShowPriceRegisterModal] = useState<boolean>(false);
  const [customProducts, setCustomProducts] = useState<Array<{ name: string; category: string; price: number }>>([]);
  const [newProductForm, setNewProductForm] = useState<{ name: string; category: string; price: string }>({ name: '', category: 'Cakes', price: '' });
  const [registerSearchTerm, setRegisterSearchTerm] = useState<string>('');

  // Form Fields - Sale
  const [saleForm, setSaleForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    item_name: '',
    category: 'Cakes',
    quantity: '' as string | number,
    unit: 'Pcs' as string,
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
    amount: '' as string | number,
    payment_status: 'Paid' as const,
    bill_no: '',
    payment_method: 'Cash' as string,
    notes: ''
  });

  // Quick Data Entry State
  const [quickEntryType, setQuickEntryType] = useState<'sale' | 'purchase'>('sale');
  const [isSavingQuickEntry, setIsSavingQuickEntry] = useState(false);

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
        unit: sale.unit || 'Pcs',
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
        unit: 'Pcs',
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
      const parsed = parsePurchaseNotes(purchase.notes);
      setPurchaseForm({
        date: purchase.date,
        item_name: purchase.item_name,
        supplier: purchase.supplier,
        category: purchase.category || 'Raw Materials',
        amount: purchase.total_amount || purchase.unit_price || '',
        payment_status: purchase.payment_status as any,
        bill_no: purchase.bill_no || parsed.bill_no || '',
        payment_method: purchase.payment_method || parsed.payment_method || 'Cash',
        notes: parsed.desc || ''
      });
    } else {
      setEditingPurchase(null);
      setPurchaseForm({
        date: new Date().toISOString().slice(0, 10),
        item_name: '',
        supplier: '',
        category: 'Raw Materials',
        amount: '',
        payment_status: 'Paid',
        bill_no: '',
        payment_method: 'Cash',
        notes: ''
      });
    }
    setShowPurchaseModal(true);
  };

  // Save (Create or Update) Sale Entry
  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingQuickEntry(true);

    try {
      const qty = Number(saleForm.quantity) || 0;
      const price = Number(saleForm.unit_price) || 0;
      const total_amount = qty * price;

      const payloadForm = {
        ...saleForm,
        quantity: qty,
        unit_price: price,
        total_amount
      };

      if (editingSale) {
        // UPDATE
        const updatedEntry: SaleEntry = { ...editingSale, ...payloadForm };
        if (supabase) {
          const { unit, ...dbPayload } = payloadForm;
          const { error: updateErr } = await supabase.from('sales').update(dbPayload).eq('id', editingSale.id);
          if (updateErr) {
            console.error('Supabase Sale Update Error:', updateErr);
            triggerToast(`⚠️ Warning: Updated locally but Supabase error: ${updateErr.message}`);
          }
        }
        setSales(prev => prev.map(s => s.id === editingSale.id ? updatedEntry : s));
        triggerToast(`✏️ Sale entry "${saleForm.item_name}" updated successfully.`);
      } else {
        // CREATE
        let newEntry: SaleEntry = { id: Date.now().toString(), ...payloadForm };
        if (supabase) {
          const { id, unit, ...payload } = newEntry;
          const { data, error } = await supabase.from('sales').insert([payload]).select();
          if (error) {
            console.error('Supabase Sale Insert Error:', error);
            triggerToast(`⚠️ Saved locally, but Supabase error: ${error.message}`);
          } else if (data && data.length > 0) {
            newEntry = { ...newEntry, ...data[0] };
          }
        }
        setSales(prev => [newEntry, ...prev]);
        triggerToast(`✅ Sale entry "${saleForm.item_name}" added successfully.`);
      }

      setShowSaleModal(false);
      setEditingSale(null);
      setSaleForm(prev => ({
        ...prev,
        item_name: '',
        quantity: '',
        unit_price: '',
        notes: ''
      }));
    } catch (err: any) {
      console.error('Error saving sale entry:', err);
      triggerToast(`⚠️ Save Error: ${err?.message || 'Failed to save entry.'}`);
    } finally {
      setIsSavingQuickEntry(false);
    }
  };

  // Save (Create or Update) Purchase Entry
  const handleSavePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingQuickEntry(true);

    try {
      const amt = Number(purchaseForm.amount) || 0;
      const billNoStr = purchaseForm.bill_no?.trim() || '-';
      const methodStr = purchaseForm.payment_method?.trim() || 'Cash';
      const descStr = purchaseForm.notes?.trim() || '';

      const structuredNotes = `Bill: ${billNoStr} | Method: ${methodStr}${descStr ? ` | ${descStr}` : ''}`;

      const dbPayload = {
        date: purchaseForm.date,
        item_name: purchaseForm.item_name.trim(),
        supplier: purchaseForm.supplier.trim(),
        category: purchaseForm.category || 'Raw Materials',
        quantity: 1,
        unit_price: amt,
        total_amount: amt,
        payment_status: purchaseForm.payment_status,
        notes: structuredNotes
      };

      if (editingPurchase) {
        // UPDATE
        const updatedEntry: PurchaseEntry = {
          ...editingPurchase,
          ...dbPayload,
          bill_no: purchaseForm.bill_no?.trim() || '',
          payment_method: methodStr
        };

        if (supabase) {
          const { error: updateErr } = await supabase.from('purchases').update(dbPayload).eq('id', editingPurchase.id);
          if (updateErr) {
            console.error('Supabase Purchase Update Error:', updateErr);
            triggerToast(`⚠️ Warning: Updated locally but Supabase error: ${updateErr.message}`);
          }
        }
        setPurchases(prev => prev.map(p => p.id === editingPurchase.id ? updatedEntry : p));
        triggerToast(`✏️ Purchase entry "${purchaseForm.item_name}" updated successfully.`);
      } else {
        // CREATE
        let newEntry: PurchaseEntry = {
          id: Date.now().toString(),
          ...dbPayload,
          bill_no: purchaseForm.bill_no?.trim() || '',
          payment_method: methodStr
        };

        if (supabase) {
          const { id, ...insertPayload } = newEntry;
          const { data, error } = await supabase.from('purchases').insert([insertPayload]).select();
          if (error) {
            console.error('Supabase Purchase Insert Error:', error);
            triggerToast(`⚠️ Saved locally, but Supabase error: ${error.message}`);
          } else if (data && data.length > 0) {
            newEntry = { ...newEntry, ...data[0] };
          }
        }
        setPurchases(prev => [newEntry, ...prev]);
        triggerToast(`✅ Purchase entry "${purchaseForm.item_name}" added successfully.`);
      }

      setShowPurchaseModal(false);
      setEditingPurchase(null);
      setPurchaseForm(prev => ({
        ...prev,
        item_name: '',
        supplier: '',
        amount: '',
        bill_no: '',
        payment_method: 'Cash',
        notes: ''
      }));
    } catch (err: any) {
      console.error('Error saving purchase entry:', err);
      triggerToast(`⚠️ Save Error: ${err?.message || 'Failed to save entry.'}`);
    } finally {
      setIsSavingQuickEntry(false);
    }
  };

  // Load custom product register from localStorage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('tbb_pos_custom_products');
      if (savedProducts) {
        setCustomProducts(JSON.parse(savedProducts));
      }
    } catch (e) {
      console.error('Error loading custom products:', e);
    }
  }, []);

  // Save custom product register to localStorage
  const saveCustomProducts = (newProducts: Array<{ name: string; category: string; price: number }>) => {
    setCustomProducts(newProducts);
    try {
      localStorage.setItem('tbb_pos_custom_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error('Error saving custom products:', e);
    }
  };

  // Add or Update product in register
  const handleSaveProductRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) return;
    const priceNum = Math.max(0, Number(newProductForm.price) || 0);
    const existingIdx = customProducts.findIndex(p => p.name.toLowerCase() === newProductForm.name.trim().toLowerCase());
    let updated: Array<{ name: string; category: string; price: number }>;
    if (existingIdx >= 0) {
      updated = customProducts.map((p, idx) => idx === existingIdx ? { ...p, category: newProductForm.category, price: priceNum } : p);
      triggerToast(`✏️ Product "${newProductForm.name}" updated in Price Register!`);
    } else {
      updated = [...customProducts, { name: newProductForm.name.trim(), category: newProductForm.category, price: priceNum }];
      triggerToast(`✅ Product "${newProductForm.name}" added to Price Register!`);
    }
    saveCustomProducts(updated);
    setNewProductForm({ name: '', category: 'Cakes', price: '' });
  };

  // Delete product from register
  const handleDeleteProductRegister = (name: string) => {
    const updated = customProducts.filter(p => p.name !== name);
    saveCustomProducts(updated);
    triggerToast(`🗑️ Product "${name}" deleted from register.`);
  };

  // POS Catalog
  const posCatalog = useMemo(() => {
    const itemMap = new Map<string, { name: string; category: string; price: number }>();
    
    const defaultBakery = [
      { name: 'Chocolate Truffle Cake', category: 'Cakes', price: 550 },
      { name: 'Red Velvet Cake', category: 'Cakes', price: 650 },
      { name: 'Black Forest Cake', category: 'Cakes', price: 500 },
      { name: 'Pineapple Cake', category: 'Cakes', price: 450 },
      { name: 'Almond Croissant', category: 'Pastries', price: 120 },
      { name: 'Butter Croissant', category: 'Pastries', price: 90 },
      { name: 'Chocolate Mousse', category: 'Pastries', price: 150 },
      { name: 'Red Velvet Cupcake Set', category: 'Cupcakes', price: 450 },
      { name: 'Choco Chip Cupcake', category: 'Cupcakes', price: 80 },
      { name: 'Blueberry Muffin', category: 'Pastries', price: 110 },
      { name: 'Garlic Loaf Bread', category: 'Breads', price: 80 },
      { name: 'Multi-Grain Bread', category: 'Breads', price: 70 },
      { name: 'Paneer Puff', category: 'Snacks', price: 45 },
      { name: 'Cheese Straws', category: 'Snacks', price: 130 },
      { name: 'Cappuccino / Hot Coffee', category: 'Beverages', price: 120 },
    ];
    defaultBakery.forEach(item => itemMap.set(item.name, item));

    sales.forEach(s => {
      if (s.item_name && s.item_name.trim()) {
        const name = s.item_name.trim();
        const price = Number(s.unit_price) || 0;
        const existing = itemMap.get(name);
        itemMap.set(name, {
          name,
          category: s.category || (existing ? existing.category : 'Bakery'),
          price: price > 0 ? price : (existing ? existing.price : 100)
        });
      }
    });

    customProducts.forEach(item => {
      if (item.name && item.name.trim()) {
        itemMap.set(item.name.trim(), {
          name: item.name.trim(),
          category: item.category || 'Bakery',
          price: item.price
        });
      }
    });

    const salesVolumeMap = new Map<string, number>();
    sales.forEach(s => {
      if (s.item_name && s.item_name.trim()) {
        const key = s.item_name.trim().toLowerCase();
        const qty = Number(s.quantity) || 1;
        salesVolumeMap.set(key, (salesVolumeMap.get(key) || 0) + qty);
      }
    });

    const allProducts = Array.from(itemMap.values()).map(p => ({
      ...p,
      salesCount: salesVolumeMap.get(p.name.toLowerCase()) || 0
    }));

    allProducts.sort((a, b) => {
      if (b.salesCount !== a.salesCount) {
        return b.salesCount - a.salesCount;
      }
      return a.name.localeCompare(b.name);
    });

    return allProducts;
  }, [sales, customProducts]);

  // Today's stats & history
  const todaySalesStats = useMemo(() => {
    const todaySales = sales.filter(s => s.date === posDate);
    const total = todaySales.reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0);
    
    const uniqueBillSet = new Set<string>();
    todaySales.forEach(s => {
      const billMatch = (s.notes || '').match(/Bill #(POS-[^ (]+)/i);
      if (billMatch) {
        uniqueBillSet.add(billMatch[1]);
      } else if ((s.payment_method || '').toUpperCase() === 'POS') {
        uniqueBillSet.add(`SALE-${s.id}`);
      }
    });

    return {
      total,
      count: todaySales.length,
      posBills: uniqueBillSet.size
    };
  }, [sales, posDate]);

  const todayPosBillsList = useMemo(() => {
    const billMap = new Map<string, { billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number }>();
    const todaySales = sales.filter(s => s.date === posDate);
    
    todaySales.forEach(s => {
      const billMatch = (s.notes || '').match(/Bill #(POS-[^ (]+)/i);
      const isPos = (s.payment_method || '').toUpperCase() === 'POS' || Boolean(billMatch);
      if (!isPos) return;

      const billNo = billMatch ? billMatch[1] : `SALE-${s.id}`;
      const item = {
        name: s.item_name || 'Bakery Item',
        price: Number(s.unit_price) || Number(s.total_amount) || 0,
        qty: Number(s.quantity) || 1
      };

      if (!billMap.has(billNo)) {
        billMap.set(billNo, {
          billNo,
          date: s.date,
          items: [item],
          total: Number(s.total_amount) || (item.price * item.qty)
        });
      } else {
        const existing = billMap.get(billNo)!;
        existing.items.push(item);
        existing.total += Number(s.total_amount) || (item.price * item.qty);
      }
    });

    return Array.from(billMap.values());
  }, [sales, posDate]);

  const nextPosBillNumber = useMemo(() => {
    const cleanDate = posDate.replace(/-/g, '').slice(2);
    const prefix = `POS-${cleanDate}-`;

    let maxSerial = 0;
    const todaySales = sales.filter(s => s.date === posDate);

    todaySales.forEach(s => {
      if (s.notes) {
        const match = s.notes.match(/Bill #POS-\d+-(\d+)/i);
        if (match && match[1]) {
          const serialNum = parseInt(match[1], 10);
          if (!isNaN(serialNum) && serialNum > maxSerial) {
            maxSerial = serialNum;
          }
        }
      }
    });

    return `${prefix}${String(maxSerial + 1).padStart(3, '0')}`;
  }, [sales, posDate]);

  const posCartTotal = useMemo(() => {
    return posCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [posCart]);

  const handleTogglePosItem = (product: { name: string; category: string; price: number }) => {
    setPosCart(prev => {
      const idx = prev.findIndex(i => i.name === product.name);
      if (idx >= 0) {
        return prev.filter(i => i.name !== product.name);
      } else {
        return [...prev, { name: product.name, category: product.category, price: product.price, qty: 1 }];
      }
    });
  };

  const updatePosQty = (name: string, delta: number) => {
    setPosCart(prev => {
      return prev.map(item => {
        if (item.name === name) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean) as Array<{ name: string; category: string; price: number; qty: number }>;
    });
  };

  const updatePosPrice = (name: string, newPrice: number) => {
    setPosCart(prev => {
      return prev.map(item => {
        if (item.name === name) {
          return { ...item, price: Math.max(0, newPrice) };
        }
        return item;
      });
    });
  };

  const printThermalSlip = (billData: { billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number }) => {
    const printWindow = window.open('', '_blank', 'width=380,height=600');
    if (!printWindow) {
      triggerToast('⚠️ Please allow popups to print the thermal receipt.');
      return;
    }

    const itemsHtml = billData.items.map(item => `
      <tr>
        <td style="padding: 4px 0; text-align: left; font-size: 11px; word-break: break-word;">${item.name}</td>
        <td style="padding: 4px 0; text-align: center; font-size: 11px;">${item.qty}</td>
        <td style="padding: 4px 0; text-align: right; font-size: 11px;">${formatIndianCurrency(item.price)}</td>
        <td style="padding: 4px 0; text-align: right; font-size: 11px; font-weight: bold;">${formatIndianCurrency(item.qty * item.price)}</td>
      </tr>
    `).join('');

    const formattedDate = formatDateFormatted(billData.date);
    const currentTimeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${billData.billNo}</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { font-family: 'Courier New', Courier, monospace, system-ui; width: 72mm; margin: 4mm auto; color: #000; background: #fff; font-size: 11px; line-height: 1.3; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { border-bottom: 1px dashed #000; font-size: 10px; padding-bottom: 3px; }
          @media print { body { width: 100%; margin: 0; padding: 2mm 3mm; } }
        </style>
      </head>
      <body>
        <div class="divider"></div>
        <div style="font-size: 10px; display: flex; justify-content: space-between;">
          <span><b>Bill No:</b> ${billData.billNo}</span>
          <span><b>Pay:</b> POS</span>
        </div>
        <div style="font-size: 10px; display: flex; justify-content: space-between;">
          <span><b>Date:</b> ${formattedDate}</span>
          <span>${currentTimeStr}</span>
        </div>
        <div class="divider"></div>
        <table>
          <thead>
            <tr>
              <th style="text-align: left;">Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Amt</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div class="divider"></div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 900; padding: 2px 0;">
          <span>TOTAL PAYABLE:</span>
          <span>₹${formatIndianCurrency(billData.total)}</span>
        </div>
        <div class="divider"></div>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSaveAndPrintPos = async (shouldPrint: boolean = true) => {
    if (posCart.length === 0) {
      triggerToast('⚠️ Please select at least one product.');
      return;
    }

    setIsProcessingPos(true);
    const billNo = nextPosBillNumber;
    const itemsToSave = [...posCart];
    const totalAmount = posCartTotal;

    try {
      const newSaleEntries: SaleEntry[] = [];
      const timestampBase = Date.now();

      for (let i = 0; i < itemsToSave.length; i++) {
        const item = itemsToSave[i];
        const saleEntry: SaleEntry = {
          id: (timestampBase + i).toString(),
          date: posDate,
          item_name: item.name,
          category: item.category || 'Bakery',
          quantity: item.qty,
          unit: 'Unit',
          unit_price: item.price,
          total_amount: item.qty * item.price,
          payment_method: 'POS',
          notes: `Bill #${billNo} (POS Thermal)`
        };

        if (supabase) {
          const { id, unit, ...payload } = saleEntry;
          const { data, error } = await supabase.from('sales').insert([payload]).select();
          if (error) {
            console.error('Supabase POS Sale Error:', error);
          } else if (data && data.length > 0) {
            newSaleEntries.push({ ...saleEntry, ...data[0] });
            continue;
          }
        }
        newSaleEntries.push(saleEntry);
      }

      setSales(prev => [...newSaleEntries, ...prev]);

      const billSnapshot = {
        billNo,
        date: posDate,
        items: itemsToSave.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        total: totalAmount
      };
      setLastPrintedBill(billSnapshot);

      if (shouldPrint) {
        printThermalSlip(billSnapshot);
        triggerToast(`🎉 Bill ${billNo} saved to Sales & sent to Thermal Printer!`);
      } else {
        triggerToast(`✅ Bill ${billNo} saved to Sales successfully!`);
      }

      setPosCart([]);
    } catch (err: any) {
      console.error('POS Checkout Error:', err);
      triggerToast(`⚠️ POS Error: ${err?.message || 'Failed to process POS bill.'}`);
    } finally {
      setIsProcessingPos(false);
    }
  };

  // Available filter dropdown options
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    if (ledgerFilter === 'all' || ledgerFilter === 'sales') {
      sales.forEach(s => s.category && set.add(s.category.trim()));
    }
    if (ledgerFilter === 'all' || ledgerFilter === 'purchases') {
      purchases.forEach(p => p.category && set.add(p.category.trim()));
    }
    return Array.from(set).filter(Boolean).sort();
  }, [sales, purchases, ledgerFilter]);

  const availableSuppliers = useMemo(() => {
    const set = new Set<string>();
    purchases.forEach(p => p.supplier && set.add(p.supplier.trim()));
    return Array.from(set).filter(Boolean).sort();
  }, [purchases]);

  const availablePaymentMethods = useMemo(() => {
    const set = new Set<string>();
    if (ledgerFilter === 'all' || ledgerFilter === 'sales') {
      sales.forEach(s => s.payment_method && set.add(normalizePaymentMethod(s.payment_method)));
    }
    if (ledgerFilter === 'all' || ledgerFilter === 'purchases') {
      purchases.forEach(p => {
        const parsed = parsePurchaseNotes(p.notes);
        const m = p.payment_method || parsed.payment_method;
        if (m) set.add(normalizePaymentMethod(m));
      });
    }
    return Array.from(set).filter(Boolean).sort();
  }, [sales, purchases, ledgerFilter]);

  const availablePaymentStatuses = useMemo(() => {
    const set = new Set<string>();
    purchases.forEach(p => p.payment_status && set.add(p.payment_status.trim()));
    return Array.from(set).filter(Boolean).sort();
  }, [purchases]);

  const filteredSales = sales.filter((s: SaleEntry) => {
    const matchesSearch = !searchTerm || s.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStart = !filterStartDate || s.date >= filterStartDate;
    const matchesEnd = !filterEndDate || s.date <= filterEndDate;
    const matchesCategory = selectedCategory === 'all' || s.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || s.payment_method.toLowerCase() === selectedPaymentMethod.toLowerCase();
    const matchesMinAmount = !minAmount || s.total_amount >= Number(minAmount);
    const matchesMaxAmount = !maxAmount || s.total_amount <= Number(maxAmount);

    return matchesSearch && matchesStart && matchesEnd && matchesCategory && matchesPaymentMethod && matchesMinAmount && matchesMaxAmount;
  });

  const filteredPurchases = purchases.filter((p: PurchaseEntry) => {
    const parsed = parsePurchaseNotes(p.notes);
    const pMethod = (p.payment_method || parsed.payment_method || 'Cash').toLowerCase();
    const pStatus = (p.payment_status || 'Paid').toLowerCase();

    const matchesSearch = !searchTerm || p.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.payment_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.notes && p.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.bill_no && p.bill_no.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStart = !filterStartDate || p.date >= filterStartDate;
    const matchesEnd = !filterEndDate || p.date <= filterEndDate;
    const matchesCategory = selectedCategory === 'all' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSupplier = selectedSupplier === 'all' || (p.supplier && p.supplier.toLowerCase() === selectedSupplier.toLowerCase());
    const matchesPaymentMethod = selectedPaymentMethod === 'all' || pMethod === selectedPaymentMethod.toLowerCase();
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || pStatus === selectedPaymentStatus.toLowerCase();
    const matchesMinAmount = !minAmount || p.total_amount >= Number(minAmount);
    const matchesMaxAmount = !maxAmount || p.total_amount <= Number(maxAmount);

    return matchesSearch && matchesStart && matchesEnd && matchesCategory && matchesSupplier && matchesPaymentMethod && matchesPaymentStatus && matchesMinAmount && matchesMaxAmount;
  });

  const getTimestamp = (item: SaleEntry | PurchaseEntry): number => {
    if (item.created_at) {
      const t = new Date(item.created_at).getTime();
      if (!isNaN(t)) return t;
    }
    if (item.id && !isNaN(Number(item.id))) {
      return Number(item.id);
    }
    const d = new Date(item.date).getTime();
    return isNaN(d) ? 0 : d;
  };

  const unifiedEntries: UnifiedEntry[] = useMemo(() => {
    return [
      ...sales.map(s => ({ type: 'sale' as const, data: s, id: `sale-${s.id}`, date: s.date, createdTimestamp: getTimestamp(s) })),
      ...purchases.map(p => ({ type: 'purchase' as const, data: p, id: `pur-${p.id}`, date: p.date, createdTimestamp: getTimestamp(p) }))
    ].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'type') {
        valA = a.type;
        valB = b.type;
      } else if (sortField === 'date') {
        valA = a.date;
        valB = b.date;
      } else if (sortField === 'item_name') {
        valA = a.data.item_name.toLowerCase();
        valB = b.data.item_name.toLowerCase();
      } else if (sortField === 'category') {
        valA = a.data.category.toLowerCase();
        valB = b.data.category.toLowerCase();
      } else if (sortField === 'quantity') {
        valA = Number(a.data.quantity) || 0;
        valB = Number(b.data.quantity) || 0;
      } else if (sortField === 'unit_price') {
        valA = Number(a.data.unit_price) || 0;
        valB = Number(b.data.unit_price) || 0;
      } else if (sortField === 'total_amount') {
        valA = Number(a.data.total_amount) || 0;
        valB = Number(b.data.total_amount) || 0;
      } else if (sortField === 'details') {
        valA = a.type === 'sale' ? (a.data as SaleEntry).payment_method : (a.data as PurchaseEntry).payment_status;
        valB = b.type === 'sale' ? (b.data as SaleEntry).payment_method : (b.data as PurchaseEntry).payment_status;
      } else {
        valA = a.createdTimestamp;
        valB = b.createdTimestamp;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sales, purchases, sortField, sortOrder]);

  const filteredUnified = useMemo(() => {
    return unifiedEntries.filter((item) => {
      if (ledgerFilter === 'sales' && item.type !== 'sale') return false;
      if (ledgerFilter === 'purchases' && item.type !== 'purchase') return false;

      if (filterStartDate && item.date < filterStartDate) return false;
      if (filterEndDate && item.date > filterEndDate) return false;

      const totalAmt = Number(item.data.total_amount) || 0;
      if (minAmount && totalAmt < Number(minAmount)) return false;
      if (maxAmount && totalAmt > Number(maxAmount)) return false;

      if (selectedCategory !== 'all') {
        const cat = (item.data.category || '').toLowerCase();
        if (cat !== selectedCategory.toLowerCase()) return false;
      }

      if (item.type === 'sale') {
        const s = item.data;
        if (selectedSupplier !== 'all') return false;
        if (selectedPaymentStatus !== 'all') return false;
        if (selectedPaymentMethod !== 'all' && s.payment_method.toLowerCase() !== selectedPaymentMethod.toLowerCase()) return false;

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return s.item_name.toLowerCase().includes(term) ||
            s.category.toLowerCase().includes(term) ||
            s.payment_method.toLowerCase().includes(term) ||
            (s.notes && s.notes.toLowerCase().includes(term));
        }
        return true;
      } else {
        const p = item.data;
        const parsed = parsePurchaseNotes(p.notes);
        const pMethod = (p.payment_method || parsed.payment_method || 'Cash').toLowerCase();
        const pStatus = (p.payment_status || 'Paid').toLowerCase();

        if (selectedSupplier !== 'all' && (!p.supplier || p.supplier.toLowerCase() !== selectedSupplier.toLowerCase())) return false;
        if (selectedPaymentMethod !== 'all' && pMethod !== selectedPaymentMethod.toLowerCase()) return false;
        if (selectedPaymentStatus !== 'all' && pStatus !== selectedPaymentStatus.toLowerCase()) return false;

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return p.item_name.toLowerCase().includes(term) ||
            p.supplier.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.payment_status.toLowerCase().includes(term) ||
            (p.notes && p.notes.toLowerCase().includes(term)) ||
            (p.bill_no && p.bill_no.toLowerCase().includes(term));
        }
        return true;
      }
    });
  }, [unifiedEntries, ledgerFilter, filterStartDate, filterEndDate, minAmount, maxAmount, selectedCategory, selectedSupplier, selectedPaymentStatus, selectedPaymentMethod, searchTerm]);

  const totalPages = Math.ceil(filteredUnified.length / pageSize) || 1;
  const paginatedEntries = filteredUnified.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [ledgerFilter, searchTerm, filterStartDate, filterEndDate, selectedCategory, selectedSupplier, selectedPaymentMethod, selectedPaymentStatus, minAmount, maxAmount, pageSize]);

  const totalSalesAmount = filteredSales.reduce((acc: number, curr: SaleEntry) => acc + curr.total_amount, 0);
  const totalPurchaseAmount = filteredPurchases.reduce((acc: number, curr: PurchaseEntry) => acc + curr.total_amount, 0);
  const netProfit = totalSalesAmount - totalPurchaseAmount;

  const salesByPaymentMethod = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredSales.forEach(s => {
      const method = normalizePaymentMethod(s.payment_method);
      if (!map[method]) map[method] = { count: 0, total: 0 };
      map[method].count += 1;
      map[method].total += Number(s.total_amount) || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredSales]);

  const purchasesByPaymentMethod = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredPurchases.forEach(p => {
      const parsed = parsePurchaseNotes(p.notes);
      const method = normalizePaymentMethod(p.payment_method || parsed.payment_method);
      if (!map[method]) map[method] = { count: 0, total: 0 };
      map[method].count += 1;
      map[method].total += Number(p.total_amount) || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredPurchases]);

  const salesByCategory = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredSales.forEach(s => {
      const cat = s.category || 'Uncategorized';
      if (!map[cat]) map[cat] = { count: 0, total: 0 };
      map[cat].count += 1;
      map[cat].total += Number(s.total_amount) || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredSales]);

  const purchasesByCategory = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredPurchases.forEach(p => {
      const cat = p.category || 'Raw Materials';
      if (!map[cat]) map[cat] = { count: 0, total: 0 };
      map[cat].count += 1;
      map[cat].total += Number(p.total_amount) || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredPurchases]);

  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>();
    [...sales, ...purchases].forEach(item => {
      if (item.date && item.date.length >= 7) {
        monthSet.add(item.date.slice(0, 7));
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from(monthSet)
      .sort((a, b) => b.localeCompare(a))
      .map(key => {
        const [yearStr, monthStr] = key.split('-');
        const monthIndex = parseInt(monthStr, 10) - 1;
        const label = `${monthNames[monthIndex] || monthStr} ${yearStr}`;
        return { key, label, year: parseInt(yearStr, 10), monthIndex };
      });
  }, [sales, purchases]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedMonthKey !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (selectedSupplier !== 'all') count++;
    if (selectedPaymentMethod !== 'all') count++;
    if (selectedPaymentStatus !== 'all') count++;
    if (minAmount || maxAmount) count++;
    return count;
  }, [searchTerm, selectedMonthKey, selectedCategory, selectedSupplier, selectedPaymentMethod, selectedPaymentStatus, minAmount, maxAmount]);

  const handleResetFilters = () => {
    const def = getCurrentMonthRange();
    setSearchTerm('');
    setFilterStartDate(def.startDate);
    setFilterEndDate(def.endDate);
    setSelectedMonthKey(def.monthKey);
    setSelectedCategory('all');
    setSelectedSupplier('all');
    setSelectedPaymentMethod('all');
    setSelectedPaymentStatus('all');
    setMinAmount('');
    setMaxAmount('');
    setLedgerFilter('all');
    setPageSize(30);
    setSortField('createdTimestamp');
    setSortOrder('desc');
  };

  const handleMonthFilterChange = (monthKey: string) => {
    setSelectedMonthKey(monthKey);
    if (monthKey === 'all') {
      setFilterStartDate('');
      setFilterEndDate('');
    } else if (monthKey === 'custom') {
      // Keep manual range
    } else {
      const [y, m] = monthKey.split('-').map(Number);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0);
      const formatISO = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      setFilterStartDate(formatISO(start));
      setFilterEndDate(formatISO(end));
    }
  };

  const existingSaleItemNames = Array.from(new Set(sales.map(s => s.item_name)));
  const existingPurchaseItemNames = Array.from(new Set(purchases.map(p => p.item_name)));
  const existingSuppliers = Array.from(new Set(purchases.map(p => p.supplier)));

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tbb_admin_auth');
    setInputPassword('');
    triggerToast('🔒 Dashboard locked successfully.');
  };

  if (!isAuthenticated) {
    return (
      <AdminAuth
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        authError={authError}
        handlePasswordSubmit={handlePasswordSubmit}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif', padding: '32px 24px' }}>

      {/* Header Bar */}
      <AdminHeader
        isSupabaseConnected={isSupabaseConnected}
        showSummaryMetrics={showSummaryMetrics}
        setShowSummaryMetrics={setShowSummaryMetrics}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenPosModal={() => {
          setPosDate(new Date().toISOString().slice(0, 10));
          setShowPosModal(true);
        }}
        onLogout={handleLogout}
      />

      {/* Summary Analytics Metrics */}
      <AdminAnalytics
        showSummaryMetrics={showSummaryMetrics}
        metricBreakdownTab={metricBreakdownTab}
        setMetricBreakdownTab={setMetricBreakdownTab}
        filteredSales={filteredSales}
        filteredPurchases={filteredPurchases}
        totalSalesAmount={totalSalesAmount}
        totalPurchaseAmount={totalPurchaseAmount}
        netProfit={netProfit}
        salesByPaymentMethod={salesByPaymentMethod}
        purchasesByPaymentMethod={purchasesByPaymentMethod}
        salesByCategory={salesByCategory}
        purchasesByCategory={purchasesByCategory}
      />

      {/* Always-Active Quick Data Entry Bar */}
      <QuickEntryBar
        quickEntryType={quickEntryType}
        setQuickEntryType={setQuickEntryType}
        isSavingQuickEntry={isSavingQuickEntry}
        saleForm={saleForm}
        setSaleForm={setSaleForm}
        purchaseForm={purchaseForm}
        setPurchaseForm={setPurchaseForm}
        handleSaveSale={handleSaveSale}
        handleSavePurchase={handleSavePurchase}
        existingSaleItemNames={existingSaleItemNames}
        existingPurchaseItemNames={existingPurchaseItemNames}
        existingSuppliers={existingSuppliers}
      />

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
      <div style={{ maxWidth: '1400px', margin: '0 auto', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}>

        {/* Ledger Filter Tabs */}
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

        {/* Filter Bar */}
        <AdminFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedMonthKey={selectedMonthKey}
          availableMonths={availableMonths}
          handleMonthFilterChange={handleMonthFilterChange}
          filterStartDate={filterStartDate}
          setFilterStartDate={setFilterStartDate}
          filterEndDate={filterEndDate}
          setFilterEndDate={setFilterEndDate}
          setSelectedMonthKey={setSelectedMonthKey}
          pageSize={pageSize}
          setPageSize={setPageSize}
          showAdvancedFilters={showAdvancedFilters}
          setShowAdvancedFilters={setShowAdvancedFilters}
          activeFilterCount={activeFilterCount}
          handleResetFilters={handleResetFilters}
          ledgerFilter={ledgerFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={availableCategories}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          availableSuppliers={availableSuppliers}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          availablePaymentMethods={availablePaymentMethods}
          selectedPaymentStatus={selectedPaymentStatus}
          setSelectedPaymentStatus={setSelectedPaymentStatus}
          availablePaymentStatuses={availablePaymentStatuses}
          minAmount={minAmount}
          setMinAmount={setMinAmount}
          maxAmount={maxAmount}
          setMaxAmount={setMaxAmount}
        />

        {/* Unified Table & Trash Table */}
        <AdminTable
          ledgerFilter={ledgerFilter}
          trash={trash}
          paginatedEntries={paginatedEntries}
          filteredUnifiedCount={filteredUnified.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          onRestoreFromTrash={restoreFromTrash}
          onPermanentDeleteTarget={(item) => setPermanentDeleteTarget(item)}
          onEditSale={openSaleModal}
          onDeleteSale={(sale) => setDeleteTarget({ type: 'sale', item: sale })}
          onEditPurchase={openPurchaseModal}
          onDeletePurchase={(purchase) => setDeleteTarget({ type: 'purchase', item: purchase })}
        />

      </div>

      {/* Sale Modal */}
      <SaleModal
        showSaleModal={showSaleModal}
        setShowSaleModal={setShowSaleModal}
        editingSale={editingSale}
        setEditingSale={setEditingSale}
        saleForm={saleForm}
        setSaleForm={setSaleForm}
        handleSaveSale={handleSaveSale}
        existingSaleItemNames={existingSaleItemNames}
      />

      {/* Purchase Modal */}
      <PurchaseModal
        showPurchaseModal={showPurchaseModal}
        setShowPurchaseModal={setShowPurchaseModal}
        editingPurchase={editingPurchase}
        setEditingPurchase={setEditingPurchase}
        purchaseForm={purchaseForm}
        setPurchaseForm={setPurchaseForm}
        handleSavePurchase={handleSavePurchase}
        existingPurchaseItemNames={existingPurchaseItemNames}
        existingSuppliers={existingSuppliers}
      />

      {/* Move to Trash Confirm Modal */}
      <DeleteConfirmModal
        deleteTarget={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      {/* Permanent Delete Confirm Modal */}
      <PermanentDeleteConfirmModal
        permanentDeleteTarget={permanentDeleteTarget}
        onCancel={() => setPermanentDeleteTarget(null)}
        onConfirm={confirmPermanentDelete}
      />

      {/* Select Entry Type Modal */}
      <EntryTypeModal
        showEntryTypeModal={showEntryTypeModal}
        setShowEntryTypeModal={setShowEntryTypeModal}
        onOpenPos={() => {
          setPosDate(new Date().toISOString().slice(0, 10));
          setShowPosModal(true);
        }}
        onOpenSaleModal={() => openSaleModal()}
        onOpenPurchaseModal={() => openPurchaseModal()}
      />

      {/* Export Options Modal */}
      <ExportModal
        showExportModal={showExportModal}
        setShowExportModal={setShowExportModal}
        filteredSales={filteredSales}
        filteredPurchases={filteredPurchases}
      />

      {/* POS Modal */}
      <PosModal
        showPosModal={showPosModal}
        setShowPosModal={setShowPosModal}
        posDate={posDate}
        setPosDate={setPosDate}
        posCatalog={posCatalog}
        nextPosBillNumber={nextPosBillNumber}
        posSearchTerm={posSearchTerm}
        setPosSearchTerm={setPosSearchTerm}
        posSelectedCategory={posSelectedCategory}
        setPosSelectedCategory={setPosSelectedCategory}
        posCart={posCart}
        setPosCart={setPosCart}
        handleTogglePosItem={handleTogglePosItem}
        updatePosQty={updatePosQty}
        updatePosPrice={updatePosPrice}
        posCartTotal={posCartTotal}
        todaySalesStats={todaySalesStats}
        posRightTab={posRightTab}
        setPosRightTab={setPosRightTab}
        todayPosBillsList={todayPosBillsList}
        printThermalSlip={printThermalSlip}
        handleSaveAndPrintPos={handleSaveAndPrintPos}
        isProcessingPos={isProcessingPos}
        lastPrintedBill={lastPrintedBill}
        onOpenPriceRegister={() => setShowPriceRegisterModal(true)}
      />

      {/* Price & Product Register Modal */}
      <PriceRegisterModal
        showPriceRegisterModal={showPriceRegisterModal}
        setShowPriceRegisterModal={setShowPriceRegisterModal}
        posCatalog={posCatalog}
        registerSearchTerm={registerSearchTerm}
        setRegisterSearchTerm={setRegisterSearchTerm}
        customProducts={customProducts}
        newProductForm={newProductForm}
        setNewProductForm={setNewProductForm}
        handleSaveProductRegister={handleSaveProductRegister}
        handleDeleteProductRegister={handleDeleteProductRegister}
        saveCustomProducts={saveCustomProducts}
      />

    </div>
  );
}
