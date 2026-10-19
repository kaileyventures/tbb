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
  X,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Sparkles,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  CreditCard,
  Layers,
  Printer,
  ShoppingCart,
  Settings2,
  Tag
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

// Helper to format ISO timestamp or created_at into "DD-MMM-YYYY, hh:mm AM/PM" format
const formatEntryFullDateTime = (createdAt?: string, fallbackId?: string): string => {
  let d: Date | null = null;
  if (createdAt) {
    const parsed = new Date(createdAt);
    if (!isNaN(parsed.getTime())) d = parsed;
  }
  if (!d && fallbackId && !isNaN(Number(fallbackId)) && fallbackId.length >= 10) {
    const parsed = new Date(Number(fallbackId));
    if (!isNaN(parsed.getTime())) d = parsed;
  }
  if (!d) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return `${day}-${month}-${year}, ${timeStr}`;
};

// Helper to format numbers in Indian currency format (e.g., 1,00,00,000)
const formatIndianCurrency = (amount: number, showDecimals: boolean = true): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return showDecimals ? '0.00' : '0';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  });
};

// Helper to get current month start and end dates (YYYY-MM-DD)
const getCurrentMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const formatISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return {
    startDate: formatISO(start),
    endDate: formatISO(end),
    monthKey: `${year}-${String(month + 1).padStart(2, '0')}`
  };
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
  const [showSummaryMetrics, setShowSummaryMetrics] = useState<boolean>(false); // Default hidden as requested
  const [metricBreakdownTab, setMetricBreakdownTab] = useState<'payment' | 'category'>('payment');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Column Sorting State
  type SortField = 'type' | 'date' | 'item_name' | 'category' | 'quantity' | 'unit_price' | 'total_amount' | 'details' | 'createdTimestamp';
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

  // POS (Point of Sale) State
  const [showPosModal, setShowPosModal] = useState<boolean>(false);
  const [posDate, setPosDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [posCart, setPosCart] = useState<Array<{ name: string; category: string; price: number; qty: number }>>([]);
  const [posSearchTerm, setPosSearchTerm] = useState<string>('');
  const [posSelectedCategory, setPosSelectedCategory] = useState<string>('all');
  const [isProcessingPos, setIsProcessingPos] = useState<boolean>(false);
  const [lastPrintedBill, setLastPrintedBill] = useState<{ billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number } | null>(null);
  const [posRightTab, setPosRightTab] = useState<'slip' | 'history'>('slip');
  const [previewHistoryBill, setPreviewHistoryBill] = useState<{ billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number } | null>(null);

  // POS Product & Price Register State (editable table)
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

  // Helper to parse notes into bill_no, payment_method, and clean description
  const parsePurchaseNotes = (notesStr?: string) => {
    if (!notesStr) return { bill_no: '', payment_method: 'Cash', desc: '' };
    const match = notesStr.match(/^Bill:\s*(.*?)\s*\|\s*Method:\s*(.*?)(?:\s*\|\s*(.*))?$/i);
    if (match) {
      return {
        bill_no: match[1] === '-' ? '' : match[1].trim(),
        payment_method: match[2] === '-' ? 'Cash' : match[2].trim(),
        desc: (match[3] || '').trim()
      };
    }
    return { bill_no: '', payment_method: 'Cash', desc: notesStr.trim() };
  };

  // Standardize payment method names to eliminate case-sensitivity mismatches (e.g., "card" vs "Card")
  const normalizePaymentMethod = (method?: string): string => {
    if (!method || !method.trim()) return 'Cash';
    const trimmed = method.trim();
    const lower = trimmed.toLowerCase();
    if (lower === 'cash') return 'Cash';
    if (lower === 'card') return 'Card';
    if (lower === 'gpay' || lower === 'upi' || lower === 'gpay / upi' || lower === 'gpay/upi') return 'GPay / UPI';
    if (lower === 'bank transfer' || lower === 'bank') return 'Bank Transfer';
    if (lower === 'cheque') return 'Cheque';
    if (lower === 'current sale') return 'Current Sale';
    if (lower === 'pos') return 'POS';
    // Fallback: Capitalize first letter of each word
    return trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  // Form Fields - Purchase
  const [purchaseForm, setPurchaseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    item_name: '', // Company / Item Name
    supplier: '',  // Party / Supplier
    category: 'Raw Materials',
    amount: '' as string | number, // Direct amount
    payment_status: 'Paid' as const,
    bill_no: '',
    payment_method: 'Cash' as string,
    notes: ''
  });

  // Quick Data Entry State (Sale / Purchase toggle & saving indicator)
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

      // Compose structured notes field: "Bill: <bill_no> | Method: <payment_method> | <description>"
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

  // POS Catalog: derive unique items combining sales history, customProducts register, and bakery defaults
  const posCatalog = React.useMemo(() => {
    const itemMap = new Map<string, { name: string; category: string; price: number }>();
    
    // 1. First load default popular bakery items
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

    // 2. Override/enrich with previous sales history
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

    // 3. Override with User's Custom Product & Price Register (Highest Priority!)
    customProducts.forEach(item => {
      if (item.name && item.name.trim()) {
        itemMap.set(item.name.trim(), {
          name: item.name.trim(),
          category: item.category || 'Bakery',
          price: item.price
        });
      }
    });

    // 4. Calculate total quantity sold per product from the database (Sales history)
    const salesVolumeMap = new Map<string, number>();
    sales.forEach(s => {
      if (s.item_name && s.item_name.trim()) {
        const key = s.item_name.trim().toLowerCase();
        const qty = Number(s.quantity) || 1;
        salesVolumeMap.set(key, (salesVolumeMap.get(key) || 0) + qty);
      }
    });

    // Sort products by sales volume descending (highest sales first!)
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

  // Today's total sales & POS bill count (Count unique bills!)
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todaySalesStats = React.useMemo(() => {
    const todaySales = sales.filter(s => s.date === posDate);
    const total = todaySales.reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0);
    
    // Collect unique POS bill numbers to avoid counting each line item as a separate bill
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

  // Today's POS Bills History Grouping (for reprinting and viewing past bills)
  const todayPosBillsList = React.useMemo(() => {
    const billMap = new Map<string, { billNo: string; date: string; items: Array<{ name: string; price: number; qty: number }>; total: number; timestamp?: string }>();
    
    // Sort sales by id / date
    const todaySales = sales.filter(s => s.date === posDate);
    
    todaySales.forEach(s => {
      // Check if this sale is POS or has bill number
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

  // Next POS Bill Number for current date (Strictly serial: 001, 002, 003...)
  const nextPosBillNumber = React.useMemo(() => {
    const cleanDate = posDate.replace(/-/g, '').slice(2); // e.g. 261019
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

  // POS Cart Total
  const posCartTotal = React.useMemo(() => {
    return posCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }, [posCart]);

  // Toggle item in POS cart
  const handleTogglePosItem = (product: { name: string; category: string; price: number }) => {
    setPosCart(prev => {
      const idx = prev.findIndex(i => i.name === product.name);
      if (idx >= 0) {
        // Already selected -> unselect & remove from list
        return prev.filter(i => i.name !== product.name);
      } else {
        // Not selected -> add with qty 1
        return [...prev, { name: product.name, category: product.category, price: product.price, qty: 1 }];
      }
    });
  };

  // Change quantity for POS cart item
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

  // Change price for POS cart item
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

  // Print 3-Inch Thermal Slip using browser print window
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
          @page {
            size: 80mm auto; /* 3 inch width, dynamic length */
            margin: 0;
          }
          body {
            font-family: 'Courier New', Courier, monospace, system-ui;
            width: 72mm;
            margin: 4mm auto;
            color: #000;
            background: #fff;
            font-size: 11px;
            line-height: 1.3;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          .title { font-size: 16px; font-weight: 900; margin-bottom: 2px; letter-spacing: 0.5px; }
          .subtitle { font-size: 10px; margin-bottom: 6px; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          .double-divider { border-top: 2px double #000; margin: 6px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { border-bottom: 1px dashed #000; font-size: 10px; padding-bottom: 3px; }
          .footer { margin-top: 10px; font-size: 9px; text-align: center; }
          @media print {
            body { width: 100%; margin: 0; padding: 2mm 3mm; }
            .no-print { display: none; }
          }
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
          <tbody>
            ${itemsHtml}
          </tbody>
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

  // Save POS entries into Sales Table (with or without thermal print)
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

      // Prepend to sales state so table updates immediately
      setSales(prev => [...newSaleEntries, ...prev]);

      const billSnapshot = {
        billNo,
        date: posDate,
        items: itemsToSave.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        total: totalAmount
      };
      setLastPrintedBill(billSnapshot);

      if (shouldPrint) {
        // Trigger thermal print
        printThermalSlip(billSnapshot);
        triggerToast(`🎉 Bill ${billNo} saved to Sales & sent to Thermal Printer!`);
      } else {
        triggerToast(`✅ Bill ${billNo} saved to Sales successfully!`);
      }

      // Clear cart
      setPosCart([]);
    } catch (err: any) {
      console.error('POS Checkout Error:', err);
      triggerToast(`⚠️ POS Error: ${err?.message || 'Failed to process POS bill.'}`);
    } finally {
      setIsProcessingPos(false);
    }
  };



  // Extract unique available values dynamically from dataset (Only available data!)
  const availableCategories = React.useMemo(() => {
    const set = new Set<string>();
    if (ledgerFilter === 'all' || ledgerFilter === 'sales') {
      sales.forEach(s => s.category && set.add(s.category.trim()));
    }
    if (ledgerFilter === 'all' || ledgerFilter === 'purchases') {
      purchases.forEach(p => p.category && set.add(p.category.trim()));
    }
    return Array.from(set).filter(Boolean).sort();
  }, [sales, purchases, ledgerFilter]);

  const availableSuppliers = React.useMemo(() => {
    const set = new Set<string>();
    purchases.forEach(p => p.supplier && set.add(p.supplier.trim()));
    return Array.from(set).filter(Boolean).sort();
  }, [purchases]);

  const availablePaymentMethods = React.useMemo(() => {
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

  const availablePaymentStatuses = React.useMemo(() => {
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

  // Unified combined items type
  type UnifiedEntry =
    | { type: 'sale'; data: SaleEntry; id: string; date: string; createdTimestamp: number }
    | { type: 'purchase'; data: PurchaseEntry; id: string; date: string; createdTimestamp: number };

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

  const unifiedEntries: UnifiedEntry[] = [
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
      // createdTimestamp
      valA = a.createdTimestamp;
      valB = b.createdTimestamp;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredUnified = unifiedEntries.filter((item) => {
    // 1. Ledger type filter
    if (ledgerFilter === 'sales' && item.type !== 'sale') return false;
    if (ledgerFilter === 'purchases' && item.type !== 'purchase') return false;

    // 2. Date range filter
    if (filterStartDate && item.date < filterStartDate) return false;
    if (filterEndDate && item.date > filterEndDate) return false;

    // 3. Amount Range Filter
    const totalAmt = Number(item.data.total_amount) || 0;
    if (minAmount && totalAmt < Number(minAmount)) return false;
    if (maxAmount && totalAmt > Number(maxAmount)) return false;

    // 4. Category Filter
    if (selectedCategory !== 'all') {
      const cat = (item.data.category || '').toLowerCase();
      if (cat !== selectedCategory.toLowerCase()) return false;
    }

    if (item.type === 'sale') {
      const s = item.data;
      // If purchase-only supplier filter is active, sale doesn't match
      if (selectedSupplier !== 'all') return false;
      // If purchase-only status filter is active, sale doesn't match
      if (selectedPaymentStatus !== 'all') return false;
      // Payment Method
      if (selectedPaymentMethod !== 'all' && s.payment_method.toLowerCase() !== selectedPaymentMethod.toLowerCase()) return false;

      // Search term filter
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

      // Supplier Filter
      if (selectedSupplier !== 'all' && (!p.supplier || p.supplier.toLowerCase() !== selectedSupplier.toLowerCase())) return false;
      // Payment Method Filter
      if (selectedPaymentMethod !== 'all' && pMethod !== selectedPaymentMethod.toLowerCase()) return false;
      // Payment Status Filter
      if (selectedPaymentStatus !== 'all' && pStatus !== selectedPaymentStatus.toLowerCase()) return false;

      // Search term filter
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

  // Calculate total pages & Paginated slice
  const totalPages = Math.ceil(filteredUnified.length / pageSize) || 1;
  const paginatedEntries = filteredUnified.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset current page when filters or pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [ledgerFilter, searchTerm, filterStartDate, filterEndDate, selectedCategory, selectedSupplier, selectedPaymentMethod, selectedPaymentStatus, minAmount, maxAmount, pageSize]);

  const totalSalesAmount = filteredSales.reduce((acc: number, curr: SaleEntry) => acc + curr.total_amount, 0);
  const totalPurchaseAmount = filteredPurchases.reduce((acc: number, curr: PurchaseEntry) => acc + curr.total_amount, 0);
  const netProfit = totalSalesAmount - totalPurchaseAmount;

  // Breakdown by Payment Method for filtered records
  const salesByPaymentMethod = React.useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredSales.forEach(s => {
      const method = normalizePaymentMethod(s.payment_method);
      if (!map[method]) map[method] = { count: 0, total: 0 };
      map[method].count += 1;
      map[method].total += Number(s.total_amount) || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredSales]);

  const purchasesByPaymentMethod = React.useMemo(() => {
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

  // Breakdown by Category for filtered records
  const salesByCategory = React.useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredSales.forEach(s => {
      const cat = s.category || 'Uncategorized';
      if (!map[cat]) map[cat] = { count: 0, total: 0 };
      map[cat].count += 1;
      map[cat].total += Number(s.total_amount) || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredSales]);

  const purchasesByCategory = React.useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    filteredPurchases.forEach(p => {
      const cat = p.category || 'Raw Materials';
      if (!map[cat]) map[cat] = { count: 0, total: 0 };
      map[cat].count += 1;
      map[cat].total += Number(p.total_amount) || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [filteredPurchases]);

  // Extract unique months present across all sales and purchases
  const availableMonths = React.useMemo(() => {
    const monthSet = new Set<string>();
    [...sales, ...purchases].forEach(item => {
      if (item.date && item.date.length >= 7) {
        monthSet.add(item.date.slice(0, 7)); // 'YYYY-MM'
      }
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from(monthSet)
      .sort((a, b) => b.localeCompare(a)) // Latest month first
      .map(key => {
        const [yearStr, monthStr] = key.split('-');
        const monthIndex = parseInt(monthStr, 10) - 1;
        const label = `${monthNames[monthIndex] || monthStr} ${yearStr}`;
        return { key, label, year: parseInt(yearStr, 10), monthIndex };
      });
  }, [sales, purchases]);

  // Active filters counter
  const activeFilterCount = React.useMemo(() => {
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

  // Reset all filters function
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

  // Handler when user selects a specific month from the Month filter dropdown
  const handleMonthFilterChange = (monthKey: string) => {
    setSelectedMonthKey(monthKey);
    if (monthKey === 'all') {
      setFilterStartDate('');
      setFilterEndDate('');
    } else if (monthKey === 'custom') {
      // Keep existing manual date range
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
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Hide / Unhide Analytics Metrics Toggle Button (Default Hidden) */}
          <button
            type="button"
            onClick={() => setShowSummaryMetrics(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: showSummaryMetrics ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: showSummaryMetrics ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: showSummaryMetrics ? '#fbbf24' : '#94a3b8',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: showSummaryMetrics ? '0 2px 10px rgba(245, 158, 11, 0.2)' : 'none'
            }}>
            {showSummaryMetrics ? <EyeOff size={15} /> : <Eye size={15} />}
            <span>{showSummaryMetrics ? 'Hide Analytics' : 'Show Analytics'}</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}>
            <FileSpreadsheet size={15} /> Export to Excel
          </button>

          {/* POS Bill Print & Quick Sale Button */}
          <button
            onClick={() => {
              setPosDate(new Date().toISOString().slice(0, 10));
              setShowPosModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#fff',
              border: '1px solid rgba(196, 181, 253, 0.3)',
              padding: '9px 18px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(139, 92, 246, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(139, 92, 246, 0.4)';
            }}>
            <Printer size={16} /> POS Counter Sale
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
              padding: '9px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
              transition: 'all 0.2s ease'
            }}>
            <PlusCircle size={16} /> Add New Entry
          </button>
        </div>
      </div>

      {/* Collapsible Summary Metric Cards & Payment / Category Breakdown (Default Hidden) */}
      {showSummaryMetrics && (
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
            
            {/* 1. SALES / TOTAL REVENUE CARD with Embedded Category & Payment Breakdowns */}
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

              {/* Embedded Sales Breakdown (Switched by Top Tab) */}
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

            {/* 2. PURCHASES / TOTAL EXPENSES CARD with Embedded Category & Payment Breakdowns */}
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

              {/* Embedded Purchases Breakdown (Switched by Top Tab) */}
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
      )}

      {/* Always-Active Quick Data Entry Bar */}
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

        {/* Modernized Comprehensive & Compact Filter Control Bar */}
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
                  outline: 'none',
                  height: '32px'
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Quick Month Dropdown */}
            <div style={{ minWidth: '130px' }}>
              <select
                value={selectedMonthKey}
                onChange={(e) => handleMonthFilterChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px',
                  background: selectedMonthKey !== 'all' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.9)',
                  border: selectedMonthKey !== 'all' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: selectedMonthKey !== 'all' ? '#fbbf24' : '#f8fafc',
                  fontSize: '12px',
                  fontWeight: '600',
                  height: '32px',
                  outline: 'none',
                  cursor: 'pointer'
                }}>
                <option value="all">🗓️ All Months</option>
                {availableMonths.map(m => (
                  <option key={m.key} value={m.key}>
                    📅 {m.label}
                  </option>
                ))}
                {selectedMonthKey === 'custom' && (
                  <option value="custom">✏️ Custom Range</option>
                )}
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
                    padding: '6px 8px',
                    height: '32px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#f87171',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}>
                  <RotateCcw size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Advanced / Specific Field Filters Row (Dynamic, Collapsible) */}
          {showAdvancedFilters && (
            <div style={{
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '8px',
              alignItems: 'center'
            }}>
              {/* Category Filter (Dynamic from real data) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    background: selectedCategory !== 'all' ? 'rgba(59, 130, 246, 0.2)' : '#1e293b',
                    border: selectedCategory !== 'all' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: selectedCategory !== 'all' ? '#93c5fd' : '#f8fafc',
                    fontSize: '11px',
                    height: '30px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}>
                  <option value="all">All Categories ({availableCategories.length})</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Party / Supplier Filter (Purchase only or unified, dynamic) */}
              {ledgerFilter !== 'sales' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Party / Supplier</span>
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
                    <option value="all">All Suppliers ({availableSuppliers.length})</option>
                    {availableSuppliers.map(sup => (
                      <option key={sup} value={sup}>{sup}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Payment Method Filter (Dynamic from dataset) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment Method</span>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    background: selectedPaymentMethod !== 'all' ? 'rgba(245, 158, 11, 0.2)' : '#1e293b',
                    border: selectedPaymentMethod !== 'all' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: selectedPaymentMethod !== 'all' ? '#fde047' : '#f8fafc',
                    fontSize: '11px',
                    height: '30px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}>
                  <option value="all">All Methods ({availablePaymentMethods.length})</option>
                  {availablePaymentMethods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter (Purchases status: Paid / Pending / Partial) */}
              {ledgerFilter !== 'sales' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</span>
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
                    <option value="all">All Statuses ({availablePaymentStatuses.length})</option>
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
                          ₹{formatIndianCurrency(item.total_amount)}
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
                  <th className="sortable-header" onClick={() => handleSort('type')} style={{ padding: '8px 10px' }}>
                    Type {sortField === 'type' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('date')} style={{ padding: '8px 10px' }}>
                    Txn Date {sortField === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('item_name')} style={{ padding: '8px 10px' }}>
                    Item / Description {sortField === 'item_name' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('category')} style={{ padding: '8px 10px' }}>
                    Category {sortField === 'category' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('quantity')} style={{ padding: '8px 10px' }}>
                    Qty {sortField === 'quantity' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('unit_price')} style={{ padding: '8px 10px' }}>
                    Unit Rate {sortField === 'unit_price' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('total_amount')} style={{ padding: '8px 10px' }}>
                    Total Amount {sortField === 'total_amount' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('details')} style={{ padding: '8px 10px' }}>
                    Details / Status {sortField === 'details' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('createdTimestamp')} style={{ padding: '8px 10px' }}>
                    Entry Created {sortField === 'createdTimestamp' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
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
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>
                            {sale.quantity} <span style={{ fontSize: '11px', color: '#94a3b8' }}>{sale.unit || 'Pcs'}</span>
                          </td>
                          <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>₹{formatIndianCurrency(sale.unit_price)}</td>
                          <td style={{ padding: '8px 10px', fontWeight: '800', color: '#4ade80' }}>+₹{formatIndianCurrency(sale.total_amount)}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '11px', color: '#cbd5e1' }}>
                              {normalizePaymentMethod(sale.payment_method)}
                            </span>
                            {sale.notes && <span style={{ display: 'block', fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{sale.notes}</span>}
                          </td>
                          <td style={{ padding: '8px 10px', color: '#fbbf24', whiteSpace: 'nowrap', fontSize: '11px', fontWeight: '600' }}>
                            {formatEntryFullDateTime(sale.created_at, sale.id)}
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
                      const parsed = parsePurchaseNotes(purchase.notes);
                      const billNo = purchase.bill_no || parsed.bill_no;
                      const paymentMethod = normalizePaymentMethod(purchase.payment_method || parsed.payment_method);
                      const desc = parsed.desc;

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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span>{purchase.item_name}</span>
                              {billNo && (
                                <span style={{ padding: '1px 6px', background: 'rgba(129, 140, 248, 0.12)', border: '1px solid rgba(129, 140, 248, 0.3)', borderRadius: '4px', color: '#a5b4fc', fontSize: '10px', fontWeight: '600' }}>
                                  #{billNo}
                                </span>
                              )}
                            </div>
                            <span style={{ display: 'block', fontSize: '11px', color: '#818cf8', fontWeight: '600', marginTop: '2px' }}>
                              Party: {purchase.supplier}
                            </span>
                            {desc && <span style={{ display: 'block', fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{desc}</span>}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <span style={{ padding: '2px 8px', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8', borderRadius: '4px', fontSize: '11px' }}>
                              {purchase.category || 'Raw Materials'}
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>
                            {purchase.quantity || 1} <span style={{ fontSize: '11px', color: '#94a3b8' }}>{purchase.unit || 'Unit'}</span>
                          </td>
                          <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>₹{formatIndianCurrency(purchase.unit_price || purchase.total_amount)}</td>
                          <td style={{ padding: '8px 10px', fontWeight: '800', color: '#f87171' }}>-₹{formatIndianCurrency(purchase.total_amount)}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{
                                display: 'inline-block',
                                width: 'fit-content',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '700',
                                background: purchase.payment_status === 'Paid' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: purchase.payment_status === 'Paid' ? '#4ade80' : '#f87171'
                              }}>
                                {purchase.payment_status || 'Paid'}
                              </span>
                              <span style={{ fontSize: '10px', color: '#cbd5e1' }}>
                                Method: <b style={{ color: '#818cf8' }}>{paymentMethod}</b>
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '8px 10px', color: '#818cf8', whiteSpace: 'nowrap', fontSize: '11px', fontWeight: '600' }}>
                            {formatEntryFullDateTime(purchase.created_at, purchase.id)}
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#818cf8', marginBottom: '6px' }}>Party / Supplier *</label>
                  <AutoSuggestInput
                    required
                    placeholder="e.g. Murria Sale's"
                    value={purchaseForm.supplier}
                    onChange={(val) => setPurchaseForm({ ...purchaseForm, supplier: val })}
                    options={existingSuppliers}
                    maxSuggestions={5}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#818cf8', marginBottom: '6px' }}>Company / Item Name *</label>
                  <AutoSuggestInput
                    required
                    placeholder="e.g. Mogu, Coca cola, Paneer"
                    value={purchaseForm.item_name}
                    onChange={(val) => setPurchaseForm({ ...purchaseForm, item_name: val })}
                    options={existingPurchaseItemNames}
                    maxSuggestions={5}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Bill No.</label>
                  <input
                    type="text"
                    placeholder="e.g. MSC/035"
                    value={purchaseForm.bill_no}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, bill_no: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Payment Method</label>
                  <select
                    value={purchaseForm.payment_method}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, payment_method: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#818cf8', fontWeight: '600' }}>
                    <option value="Cash">Cash</option>
                    <option value="GPay">GPay / UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Current Sale">Current Sale</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#818cf8', marginBottom: '6px' }}>Amount (₹) *</label>
                  <input
                    type="number" step="0.01" min="0" required
                    placeholder="Enter total amount (₹)..."
                    value={purchaseForm.amount}
                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPurchaseForm({ ...purchaseForm, amount: val === '' ? '' : Number(val) });
                    }}
                    style={{ width: '100%', padding: '10px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: '700' }}
                  />
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>

              {/* Option 1: POS Counter Sale */}
              <button
                onClick={() => {
                  setShowEntryTypeModal(false);
                  setPosDate(new Date().toISOString().slice(0, 10));
                  setShowPosModal(true);
                }}
                style={{
                  background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.04) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
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
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#a78bfa')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)')}>

                <div style={{ width: '52px', height: '52px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4b5fd' }}>
                  <Printer size={26} />
                </div>

                <div>
                  <div style={{ color: '#c4b5fd', fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>
                    POS Counter Sale
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.3' }}>
                    Touch POS, 3-inch thermal slip print & auto-save
                  </div>
                </div>

              </button>

              {/* Option 2: Sale Entry */}
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

              {/* Option 3: Purchase Entry */}
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

      {/* ========================================================================= */}
      {/* 👑 MODERN ROYAL POS COUNTER SALE MODAL (3-INCH THERMAL PRINTER SUPPORT)  */}
      {/* ========================================================================= */}
      {showPosModal && (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                      The Baker Bro — POS Counter Sale
                    </h2>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#c4b5fd',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      3-Inch Thermal Ready
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    Tap product buttons to add/remove • Auto-records in Sales with payment method <b>POS</b>
                  </p>
                </div>
              </div>

              {/* Date Selector & Product Register Button & Bill No & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '150px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sale Date</span>
                  <CustomDatePicker
                    value={posDate}
                    onChange={(e: any) => setPosDate(e.target?.value || e)}
                    style={{ minHeight: '34px', padding: '4px 8px', fontSize: '12px', background: '#1e293b' }}
                  />
                </div>

                {/* Edit Products & Price Register Button */}
                <button
                  type="button"
                  onClick={() => setShowPriceRegisterModal(true)}
                  title="Open Products & Price Register"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
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

                <div style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Current Bill #</div>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#a78bfa', fontFamily: 'monospace' }}>{nextPosBillNumber}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPosModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    color: '#94a3b8',
                    width: '36px',
                    height: '36px',
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

            {/* Modal Body - 2 Columns: Left = Product Catalog Buttons | Right = Bill Summary & Today Sale Counter */}
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

                {/* Prompt instructions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94a3b8' }}>
                  <span>Tap a product to select (<b>highlighted</b>). Tap again to unselect & remove.</span>
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
                  {posCatalog
                    .filter(p => {
                      const matchesSearch = !posSearchTerm || p.name.toLowerCase().includes(posSearchTerm.toLowerCase());
                      const matchesCat = posSelectedCategory === 'all' || p.category === posSelectedCategory;
                      return matchesSearch && matchesCat;
                    })
                    .map((product, index) => {
                      const cartItem = posCart.find(i => i.name === product.name);
                      const isSelected = Boolean(cartItem);

                      // Dynamic tiering based on sales ranking:
                      // Top 2: Big prominent cards (span 2 cols)
                      // Next 4 (index 2..5): Medium cards
                      // Remaining (index >= 6): Compact cards
                      const isTop2 = index < 2;
                      const isNext4 = index >= 2 && index < 6;
                      const isSmall = index >= 6;

                      const gridColSpan = isTop2 ? 'span 2' : 'span 1';
                      const minHeight = isTop2 ? '118px' : isNext4 ? '98px' : '82px';

                      return (
                        <button
                          key={product.name}
                          type="button"
                          onClick={() => handleTogglePosItem(product)}
                          style={{
                            gridColumn: gridColSpan,
                            minHeight: minHeight,
                            background: isSelected
                              ? 'linear-gradient(145deg, rgba(139, 92, 246, 0.35) 0%, rgba(109, 40, 217, 0.25) 100%)'
                              : isTop2
                                ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
                                : isNext4
                                  ? 'linear-gradient(145deg, rgba(99, 102, 241, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)'
                                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                            border: isSelected
                              ? '2px solid #a855f7'
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
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                            position: 'relative',
                            boxShadow: isSelected
                              ? '0 4px 14px rgba(139, 92, 246, 0.25)'
                              : 'none'
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
                          
                          {/* Selection Checkmark */}
                          {isSelected && (
                            <div style={{
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
                              zIndex: 2
                            }}>
                              ✓
                            </div>
                          )}

                          {/* Top Category Tag */}
                          <div>
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
                            </div>

                            {/* Product Name (Increased Font Size) */}
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

                          {/* Price & Selected Qty footer */}
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
                            {isSelected && (
                              <span style={{
                                fontSize: isTop2 ? '12px' : '11px',
                                fontWeight: '800',
                                color: '#c4b5fd',
                                background: 'rgba(139, 92, 246, 0.35)',
                                padding: '1px 6px',
                                borderRadius: '6px'
                              }}>
                                x{cartItem.qty}
                              </span>
                            )}
                          </div>
                        </button>
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

                {/* TAB 1: ACTUAL 3-INCH THERMAL SLIP PREVIEW (Scroll is on the outer container, slip is pure realistic paper) */}
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
                    {/* Realistic Thermal Paper Receipt (Continuous strip like a real 3-inch roll printer) */}
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

                      {/* Items List (Natural flow, NO internal scrollbar, NO remove button inside slip) */}
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

                    {/* OPTION 1: SAVE ONLY (Record in Sales, do not open print dialog) */}
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

                    {/* OPTION 2: SAVE & PRINT (Record in Sales and trigger thermal printer) */}
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
                      {isProcessingPos ? 'Processing...' : 'Save & Print 3" Slip'}
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
      )}

      {/* ========================================================================= */}
      {/* 🏷️ DEDICATED PRODUCTS & PRICE REGISTER MODAL (EDITABLE TABLE)            */}
      {/* ========================================================================= */}
      {showPriceRegisterModal && (
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
      )}

    </div>
  );
}

