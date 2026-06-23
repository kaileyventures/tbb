'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export type SiteMode = 'baker' | 'burger';

interface SiteContextType {
  activeSite: SiteMode;
  toggleSite: () => void;
  setSite: (mode: SiteMode) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [activeSite, setActiveSite] = useState<SiteMode>('baker');

  useEffect(() => {
    const saved = localStorage.getItem('thebakerbro_site_mode');
    if (saved === 'burger') {
      setActiveSite('burger');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-site', activeSite);
  }, [activeSite]);

  const toggleSite = () => {
    setActiveSite((prev) => {
      const next = prev === 'baker' ? 'burger' : 'baker';
      localStorage.setItem('thebakerbro_site_mode', next);
      return next;
    });
  };

  const setSite = (mode: SiteMode) => {
    setActiveSite(mode);
    localStorage.setItem('thebakerbro_site_mode', mode);
  };

  return (
    <SiteContext.Provider value={{ activeSite, toggleSite, setSite }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
