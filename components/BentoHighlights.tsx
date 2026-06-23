'use client';
import { useSite } from '@/context/SiteContext';
import BakerBentoHighlights from './baker/BentoHighlights';
import BurgerBentoHighlights from './burger/BentoHighlights';

export default function BentoHighlights() {
  const { activeSite } = useSite();

  if (activeSite === 'burger') {
    return <BurgerBentoHighlights />;
  }
  return <BakerBentoHighlights />;
}