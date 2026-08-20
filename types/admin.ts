export interface SaleEntry {
  id: string;
  date: string;
  item_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_method: 'Cash' | 'Card' | 'UPI' | 'Bank Transfer';
  notes?: string;
  created_at?: string;
}

export interface PurchaseEntry {
  id: string;
  date: string;
  item_name: string;
  supplier: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_status: 'Paid' | 'Pending' | 'Partial';
  notes?: string;
  created_at?: string;
}

export interface TrashEntry {
  id: string;
  original_type: 'sale' | 'purchase';
  item: SaleEntry | PurchaseEntry;
  deleted_at: string; // ISO string when moved to trash
}
