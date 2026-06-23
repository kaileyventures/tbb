'use client';
import { useSite } from '@/context/SiteContext';
import BakerProductCard from './baker/ProductCard';
import BurgerProductCard from './burger/ProductCard';
import { MenuItem } from '@/hooks/types';

export default function ProductCard({ item, whatsappNumber }: { item: MenuItem, whatsappNumber: string }) {
  const { activeSite } = useSite();

  if (activeSite === 'burger') {
    return <BurgerProductCard item={item} whatsappNumber={whatsappNumber} />;
  }
  return <BakerProductCard item={item} whatsappNumber={whatsappNumber} />;
}