// Helper to format YYYY-MM-DD into "DD-MMM-YYYY, DDD" format (e.g. 20-Aug-2026, Thu)
export const formatDateFormatted = (dateStr: string) => {
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
export const formatEntryFullDateTime = (createdAt?: string, fallbackId?: string): string => {
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
export const formatIndianCurrency = (amount: number, showDecimals: boolean = true): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return showDecimals ? '0.00' : '0';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  });
};

// Helper to get current month start and end dates (YYYY-MM-DD)
export const getCurrentMonthRange = () => {
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

// Helper to parse notes into bill_no, payment_method, and clean description
export const parsePurchaseNotes = (notesStr?: string) => {
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
export const normalizePaymentMethod = (method?: string): string => {
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
