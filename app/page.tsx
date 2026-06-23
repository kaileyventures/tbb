'use client';
import { useState, useMemo, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import MenuGrid from '@/components/MenuGrid';
import BentoHighlights from '@/components/BentoHighlights';
import { useGoogleSheet } from '@/hooks/useGoogleSheet';
import { useSite } from '@/context/SiteContext';
import { BURGER_MENU_ITEMS } from '@/constants/burgerMenu';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { activeSite } = useSite();
  
  const WHATSAPP_NUMBER = '918146767522'; 
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS59v3B6G2HjCi-IrJMRPfN9pFF4iunYlsNuARl7CKmp-OfNn_XEoOEf-eLlTp86gS6a5_bT2FWq71o/pub?gid=0&single=true&output=csv';

  const { menuItems: sheetMenuItems, isLoading: sheetLoading } = useGoogleSheet(SHEET_CSV_URL);

  // Reset active category on site toggle
  useEffect(() => {
    setActiveCategory('all');
    setSearchQuery('');
  }, [activeSite]);

  // Determine active menu items and loading state
  const isBurger = activeSite === 'burger';
  const menuItems = isBurger ? BURGER_MENU_ITEMS : sheetMenuItems;
  const isLoading = isBurger ? false : sheetLoading;

  // Dynamically extract unique categories or set static fast food ones
  const dynamicCategories = useMemo(() => {
    if (isBurger) {
      return [
        { id: 'all', label: 'All Cravings' },
        { id: 'burgers', label: 'Burgers' },
        { id: 'pizzas', label: 'Pizzas' },
        { id: 'sandwiches', label: 'Sandwiches' },
        { id: 'noodles', label: 'Noodles' },
        { id: 'marine drinks', label: 'Marine Drinks' }
      ];
    }

    const uniqueCategories = new Set<string>();
    menuItems.forEach(item => {
      if (item.category && item.category.trim() !== '') {
        uniqueCategories.add(item.category.trim());
      }
    });

    const extractedCategories = Array.from(uniqueCategories).map(cat => ({
      id: cat.toLowerCase(),
      label: cat
    }));

    return [{ id: 'all', label: 'All Delights' }, ...extractedCategories];
  }, [menuItems, isBurger]);

  // Advanced Dual-filtering with exact dynamic matching
  const filteredMenu = menuItems.filter(item => {
    const sheetCategory = item.category ? item.category.toString().toLowerCase().trim() : '';
    const selectedCategory = activeCategory.toLowerCase().trim();
    
    const matchesCategory = selectedCategory === 'all' || sheetCategory === selectedCategory;

    // Search target checks both name and description
    const searchTarget = `${item.name || ''} ${item.desc || ''}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <HeroSection 
        categories={dynamicCategories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        menuItems={menuItems}
      />

      <MenuGrid 
        filteredMenu={filteredMenu} 
        isLoading={isLoading} 
        whatsappNumber={WHATSAPP_NUMBER} 
      />

      <BentoHighlights />
    </>
  );
}