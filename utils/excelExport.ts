import * as XLSX from 'xlsx';

export const exportSingleToExcel = (data: any[], filename: string, sheetName: string = 'Sheet1') => {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
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
    const salesWorksheet = XLSX.utils.json_to_sheet(salesData);
    XLSX.utils.book_append_sheet(workbook, salesWorksheet, 'Sales');
  }

  if (purchasesData && purchasesData.length > 0) {
    const purchasesWorksheet = XLSX.utils.json_to_sheet(purchasesData);
    XLSX.utils.book_append_sheet(workbook, purchasesWorksheet, 'Purchases');
  }

  XLSX.writeFile(workbook, `${filename}_FULL_REPORT_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
