'use client';
import { useSite } from '@/context/SiteContext';
import BakerContactView from '@/components/baker/ContactView';
import BurgerContactView from '@/components/burger/ContactView';

export default function ContactPage() {
  const { activeSite } = useSite();

  if (activeSite === 'burger') {
    return <BurgerContactView />;
  }
  return <BakerContactView />;
}