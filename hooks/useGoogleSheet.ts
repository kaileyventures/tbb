import { useState, useEffect } from 'react';
import { MenuItem } from './types';

export function useGoogleSheet(sheetUrl: string) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${sheetUrl}&t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
        });
        
        const csvText = await response.text();
        const rows = csvText.split('\n');
        
        if (rows.length <= 1 || rows[0].trim() === '') {
          setMenuItems([]);
          setIsLoading(false);
          return;
        }

        const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
        
        const parsedData = rows.slice(1).map(row => {
          const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const item: Record<string, string | Array<{ label: string; price: string }>> = {};
          
          headers.forEach((header, index) => {
            item[header] = values[index] ? values[index].replace(/^"|"$/g, '').trim() : '';
          });

          const variantsStr = (item.variants as string) || '';
          if (variantsStr && variantsStr.trim() !== '') {
            item.variantOptions = variantsStr.split('|').map((v: string) => {
              const [label, price] = v.split(':');
              return { 
                label: label ? label.trim() : '', 
                price: price ? price.trim() : '' 
              };
            });
          } else {
            item.variantOptions = [];
          }

          return item as unknown as MenuItem;
        }).filter(item => item.name && item.name.trim() !== ''); 
        
        setMenuItems(parsedData);
      } catch (err) {
        console.error("Error fetching menu from Google Sheets", err);
        const errorMsg = err instanceof Error ? err.message : "Failed to load menu";
        setError(errorMsg);
        setMenuItems([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheetData();
  }, [sheetUrl]);

  return { menuItems, isLoading, error };
}