import * as XLSX from 'xlsx';

// Helper to format YYYY-MM-DD into "DD-MMM-YYYY, DDD"
const formatDateFormatted = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('T')[0].split('-');
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

// Clean and map Sale / Purchase entry objects into human-readable Excel rows without id or created_at
const formatRowForExcel = (row: any, type?: 'sale' | 'purchase') => {
  const isSale = type === 'sale' || ('payment_method' in row && !('supplier' in row));

  if (isSale) {
    return {
      'Transaction Type': 'Sale ✨',
      'Date': formatDateFormatted(row.date),
      'Item Name': row.item_name || '',
      'Category': row.category || '',
      'Quantity': row.quantity || 0,
      'Unit Price (₹)': row.unit_price ? `₹${Number(row.unit_price).toFixed(2)}` : '₹0.00',
      'Total Amount (₹)': row.total_amount ? `₹${Number(row.total_amount).toFixed(2)}` : '₹0.00',
      'Payment Method': row.payment_method || '-',
      'Notes': row.notes || '-'
    };
  } else {
    return {
      'Transaction Type': 'Purchase 📦',
      'Date': formatDateFormatted(row.date),
      'Item / Raw Material': row.item_name || '',
      'Supplier / Vendor': row.supplier || '-',
      'Category': row.category || '',
      'Quantity': row.quantity || 0,
      'Unit Cost (₹)': row.unit_price ? `₹${Number(row.unit_price).toFixed(2)}` : '₹0.00',
      'Total Purchase Cost (₹)': row.total_amount ? `₹${Number(row.total_amount).toFixed(2)}` : '₹0.00',
      'Payment Status': row.payment_status || '-',
      'Notes': row.notes || '-'
    };
  }
};

export const exportSingleToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const type = sheetName.toLowerCase().includes('sale') ? 'sale' : 'purchase';
  const cleanedData = data.map(item => formatRowForExcel(item, type));

  const worksheet = XLSX.utils.json_to_sheet(cleanedData);

  // Set column widths auto-fitting content
  worksheet['!cols'] = [
    { wch: 18 }, // Type
    { wch: 22 }, // Date
    { wch: 28 }, // Item Name
    { wch: 22 }, // Category / Supplier
    { wch: 18 }, // Category
    { wch: 12 }, // Quantity
    { wch: 16 }, // Unit Price
    { wch: 20 }, // Total Amount
    { wch: 18 }, // Payment / Status
    { wch: 30 }  // Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportBothToExcel = (salesData: any[], purchasesData: any[], filename: string) => {
  if ((!salesData || salesData.length === 0) && (!purchasesData || purchasesData.length === 0)) {
    alert('No sales or purchase data available to export.');
    return;
  }

  const workbook = XLSX.utils.book_new();

  if (salesData && salesData.length > 0) {
    const cleanedSales = salesData.map(item => formatRowForExcel(item, 'sale'));
    const salesWorksheet = XLSX.utils.json_to_sheet(cleanedSales);
    salesWorksheet['!cols'] = [
      { wch: 18 }, { wch: 22 }, { wch: 28 }, { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 20 }, { wch: 18 }, { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(workbook, salesWorksheet, 'Sales Revenue ✨');
  }

  if (purchasesData && purchasesData.length > 0) {
    const cleanedPurchases = purchasesData.map(item => formatRowForExcel(item, 'purchase'));
    const purchasesWorksheet = XLSX.utils.json_to_sheet(cleanedPurchases);
    purchasesWorksheet['!cols'] = [
      { wch: 18 }, { wch: 22 }, { wch: 28 }, { wch: 22 }, { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 22 }, { wch: 18 }, { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(workbook, purchasesWorksheet, 'Purchases Expenses 📦');
  }

  XLSX.writeFile(workbook, `${filename}_FULL_REPORT_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
