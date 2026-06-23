'use client';
import { useSite } from '@/context/SiteContext';
import BakerAboutView from '@/components/baker/AboutView';
import BurgerAboutView from '@/components/burger/AboutView';

export default function AboutPage() {
  const { activeSite } = useSite();

  if (activeSite === 'burger') {
    return <BurgerAboutView />;
  }
  return <BakerAboutView />;
}