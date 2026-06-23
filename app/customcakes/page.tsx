'use client';
import { useSite } from '@/context/SiteContext';
import BakerCustomCakesView from '@/components/baker/CustomCakesView';
import BurgerPartyOrdersView from '@/components/burger/PartyOrdersView';

export default function CustomCakesPage() {
  const { activeSite } = useSite();

  if (activeSite === 'burger') {
    return <BurgerPartyOrdersView />;
  }
  return <BakerCustomCakesView />;
}