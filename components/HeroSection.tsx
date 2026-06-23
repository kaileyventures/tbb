'use client';
import { useSite } from '@/context/SiteContext';
import BakerHeroSection from './baker/HeroSection';
import BurgerHeroSection from './burger/HeroSection';
import { MenuItem } from '@/hooks/types';

interface HeroSectionProps {
  categories: Array<{ id: string; label: string }>;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  menuItems: MenuItem[];
}

export default function HeroSection(props: HeroSectionProps) {
  const { activeSite } = useSite();

  if (activeSite === 'burger') {
    return <BurgerHeroSection {...props} />;
  }
  return <BakerHeroSection {...props} />;
}