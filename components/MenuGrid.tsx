'use client';
import { useSite } from '@/context/SiteContext';
import BakerMenuGrid from './baker/MenuGrid';
import BurgerMenuGrid from './burger/MenuGrid';
import { MenuItem } from '@/hooks/types';

interface MenuGridProps {
  filteredMenu: MenuItem[];
  isLoading: boolean;
  whatsappNumber: string;
}

export default function MenuGrid(props: MenuGridProps) {
  const { activeSite } = useSite();

  if (activeSite === 'burger') {
    return <BurgerMenuGrid {...props} />;
  }
  return <BakerMenuGrid {...props} />;
}