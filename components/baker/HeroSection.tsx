'use client';
import { useState, useRef, useEffect } from 'react';
import { MenuItem } from '@/hooks/types';

interface HeroSectionProps {
  categories: Array<{ id: string; label: string }>;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  menuItems: MenuItem[];
}

export default function BakerHeroSection({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  menuItems
}: HeroSectionProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  const BRAND_COLOR = 'var(--brand-primary)'; 
  const GOLD_COLOR = 'var(--brand-accent)'; 

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = searchQuery.length >= 2 
    ? menuItems
        .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5) 
    : [];

  return (
    <section className="relative z-40 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-14 md:pt-20 pb-16 md:pb-24 overflow-hidden">
      
      {/* Parallax background ambient icons */}
      <div 
        className="absolute right-[8%] top-[10%] w-32 h-32 md:w-56 md:h-56 opacity-[0.03] pointer-events-none spin-slow"
        style={{ 
          transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.03}deg)`
        }}
      >
        <i className="fas fa-snowflake text-[6rem] md:text-[10rem]" style={{ color: GOLD_COLOR }}></i>
      </div>
      <div 
        className="absolute left-[8%] bottom-[12%] w-24 h-24 md:w-40 md:h-40 opacity-[0.03] pointer-events-none"
        style={{ 
          transform: `translateY(${scrollY * -0.06}px) rotate(${scrollY * -0.02}deg)`
        }}
      >
        <i className="fas fa-cookie-bite text-[5rem] md:text-[8rem]" style={{ color: BRAND_COLOR }}></i>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col relative z-10 items-center text-center">
          
          {/* Top Brand Tag */}
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="h-px w-8 bg-accent-gold"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-accent-gold-dark">
              EST. 2017 • PANJAB
            </span>
            <span className="h-px w-8 bg-accent-gold"></span>
          </div>

          <span 
            className="inline-flex items-center py-1.5 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest mb-6 border shadow-sm"
            style={{ 
              backgroundColor: '#7A1A400A', 
              color: BRAND_COLOR, 
              borderColor: `${GOLD_COLOR}35` 
            }}
          >
            <i className="fas fa-star mr-2 text-xs" style={{ color: GOLD_COLOR }}></i> 
            Freshly Baked Everyday
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl lg:text-7.5xl font-black mb-5 tracking-tight leading-[1.05] md:leading-[1.1] text-charcoal font-serif-heading text-center">
            Where Sweetness <br className="hidden sm:block"/>
            <span 
              className="bg-clip-text text-transparent inline-block pb-2 relative"
              style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_COLOR} 30%, ${GOLD_COLOR} 100%)` }}
            >
              Meets Perfection
            </span>
          </h1>
          
          <p className="text-charcoal/60 text-sm sm:text-base md:text-lg max-w-xl font-semibold leading-relaxed mb-8 md:mb-10 text-center mx-auto">
            Experience Jalandhar&apos;s finest handcrafted 100% eggless delicacies. Exquisite custom wedding cakes, luxury pastries, and gourmet creations.
          </p>

          {/* Unified search bar */}
          <div ref={searchRef} className="w-full relative max-w-2xl px-2 sm:px-0">
            <div 
              className={`flex flex-row items-center bg-cream-light rounded-2xl border transition-all duration-500 shadow-md h-14 sm:h-16 ${
                isFocused ? 'shadow-xl scale-[1.01]' : 'border-accent-gold/25'
              }`}
              style={{ 
                borderColor: isFocused ? BRAND_COLOR : 'rgba(217, 179, 130, 0.3)',
                boxShadow: isFocused ? `0 10px 30px -10px rgba(122, 26, 64, 0.15), 0 0 0 3px rgba(217, 179, 130, 0.15)` : ''
              }}
            >
              
              {/* Category Dropdown */}
              <div className="w-[38%] sm:w-[32%] flex-shrink-0 border-r border-accent-gold/20 relative h-full">
                <select 
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full h-full appearance-none bg-transparent pl-4 sm:pl-5 pr-8 sm:pr-9 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-charcoal/80 outline-none cursor-pointer truncate"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[9px] sm:text-xs text-accent-gold-dark pointer-events-none"></i>
              </div>

              {/* Text Input */}
              <div className="flex-1 w-full flex items-center relative h-full">
                <i className="fas fa-search absolute left-3 sm:left-4.5 text-accent-gold text-xs sm:text-base"></i>
                <input 
                  type="text"
                  placeholder="Search wedding cakes, treats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  className="w-full h-full bg-transparent pl-8 sm:pl-11 pr-8 sm:pr-9 outline-none text-xs sm:text-sm font-semibold text-charcoal placeholder-charcoal/40"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 sm:right-4.5 text-charcoal/30 hover:text-brand-plum transition-colors flex items-center justify-center h-full cursor-pointer"
                  >
                    <i className="fas fa-times-circle text-xs sm:text-sm"></i>
                  </button>
                )}
              </div>
              
              {/* Search CTA */}
              <div className="hidden sm:flex items-center justify-center h-full pr-2 py-2">
                <button 
                  className="h-full text-white px-7 rounded-xl font-bold text-xs uppercase tracking-widest shimmer-btn shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Find
                </button>
              </div>
            </div>

            {/* Live Auto-Suggestions Dropdown */}
            {isFocused && searchQuery.length >= 2 && suggestions.length > 0 && (
              <div className="absolute top-full left-2 right-2 sm:left-0 sm:right-0 mt-3 bg-cream-light rounded-2xl shadow-2xl border border-accent-gold/20 overflow-hidden z-50 animate-in slide-in-from-top-3 fade-in duration-350">
                <div className="px-5 py-3 text-[10px] font-bold text-accent-gold-dark uppercase tracking-widest bg-brand-plum/5 border-b border-accent-gold/10">Suggestions</div>
                <ul>
                  {suggestions.map((item, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => {
                          setSearchQuery(item.name || '');
                          setIsFocused(false);
                        }}
                        className="w-full text-left px-5 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-charcoal/80 hover:bg-brand-plum/5 transition-all duration-200 border-b border-accent-gold/5 flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate pr-4 group-hover:text-brand-plum">{item.name}</span>
                        <i 
                          className="fas fa-arrow-right text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 shrink-0 text-accent-gold-dark"
                        ></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty State for Search */}
            {isFocused && searchQuery.length >= 2 && suggestions.length === 0 && (
              <div className="absolute top-full left-2 right-2 sm:left-0 sm:right-0 mt-3 bg-cream-light rounded-2xl shadow-2xl border border-accent-gold/20 p-6 text-center z-50">
                <p className="text-xs sm:text-sm text-charcoal/60 font-semibold">No items found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animated Mouse Scroll Down Indicator */}
      <div 
        className="hidden md:flex flex-col items-center justify-center absolute bottom-2 left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none"
        style={{ opacity: scrollY > 80 ? 0 : 0.7 }}
      >
        <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-charcoal/30 mb-2">Scroll to Explore</span>
        <div className="w-5 h-8 border-2 border-charcoal/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-accent-gold rounded-full animate-bounce"></div>
        </div>
      </div>

    </section>
  );
}
