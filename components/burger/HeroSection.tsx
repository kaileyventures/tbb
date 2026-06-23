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

export default function BurgerHeroSection({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  menuItems
}: HeroSectionProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const tiltX = -(y / (box.height / 2)) * 18; 
    const tiltY = (x / (box.width / 2)) * 18;
    setTilt({ x: tiltX, y: tiltY });
  };

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
        <i className="fas fa-fire-alt text-[6rem] md:text-[10rem]" style={{ color: GOLD_COLOR }}></i>
      </div>
      <div 
        className="absolute left-[8%] bottom-[12%] w-24 h-24 md:w-40 md:h-40 opacity-[0.03] pointer-events-none"
        style={{ 
          transform: `translateY(${scrollY * -0.06}px) rotate(${scrollY * -0.02}deg)`
        }}
      >
        <i className="fas fa-hamburger text-[5rem] md:text-[8rem]" style={{ color: BRAND_COLOR }}></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Text & Search Content */}
        <div 
          className="flex flex-col relative z-10 lg:col-span-7 text-left items-start transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        >
          {/* Top Brand Tag */}
          <div className="flex items-center gap-3 mb-6 justify-start">
            <span className="h-px w-8 bg-accent-gold"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-accent-gold-dark">
              EST. 2017 • PANJAB
            </span>
            <span className="h-px w-8 bg-accent-gold"></span>
          </div>

          <span 
            className="inline-flex items-center py-1.5 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest mb-6 border shadow-sm"
            style={{ 
              backgroundColor: '#E639460A', 
              color: BRAND_COLOR, 
              borderColor: `${GOLD_COLOR}35` 
            }}
          >
            <i className="fas fa-star mr-2 text-xs" style={{ color: GOLD_COLOR }}></i> 
            100% Vegetarian Fast Food Kitchen
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6.5xl lg:text-7.5xl font-black mb-5 tracking-tight leading-[1.05] md:leading-[1.1] text-charcoal font-serif-heading text-left">
            Spicy, Cheesy, <br />
            <span 
              className="bg-clip-text text-transparent inline-block pb-2 relative"
              style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_COLOR} 30%, ${GOLD_COLOR} 100%)` }}
            >
              Irresistible!
              <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-accent-gold rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-charcoal/60 text-sm sm:text-base md:text-lg max-w-xl font-semibold leading-relaxed mb-8 md:mb-10 text-left">
            Welcome to The Burger Bro! Indulge in Jalandhar&apos;s finest veg burgers, gourmet pizzas, loaded sandwiches, noodles, and ocean-breeze sodas.
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
                  placeholder="Search burgers, pizzas, sides..."
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

        {/* Right Column: Burger Bro Parallax Presentation */}
        <div className="lg:col-span-5 relative flex justify-center items-center z-0 pt-10 lg:pt-0 min-h-[320px] sm:min-h-[460px]">
          {/* Glowing Backplates */}
          <div 
            className="absolute w-64 h-64 sm:w-[26rem] sm:h-[26rem] rounded-full blur-3xl opacity-25 -z-10 transition-transform duration-100 ease-out"
            style={{ 
              background: `radial-gradient(circle, ${GOLD_COLOR} 0%, transparent 70%)`,
              transform: `translateY(${scrollY * 0.08}px)`
            }}
          ></div>
          <div 
            className="absolute w-48 h-48 sm:w-80 sm:h-80 rounded-full blur-3xl opacity-15 -z-10 transition-transform duration-100 ease-out"
            style={{ 
              background: `radial-gradient(circle, ${BRAND_COLOR} 0%, transparent 70%)`,
              transform: `translateY(${scrollY * -0.02}px)`
            }}
          ></div>

          {/* Rotating Tray Mandala */}
          <div 
            className="absolute w-60 h-60 sm:w-88 sm:h-88 border border-dashed border-accent-gold/30 rounded-full spin-slow"
            style={{ transform: `translateY(${scrollY * 0.04}px)` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-accent-gold/40"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-accent-gold/40"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent-gold/40"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent-gold/40"></div>
          </div>

          {/* 3D Interactive Perspective Container */}
          <div 
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
            className="relative w-64 h-64 sm:w-84 sm:h-84 md:w-[26rem] md:h-[26rem] transition-all duration-300 ease-out cursor-pointer flex items-center justify-center"
            style={{ 
              transform: `translateY(${scrollY * -0.06}px) ${
                isHovered 
                  ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.04, 1.04, 1.04)` 
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
              }`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Inner depth layer 1: Shaded shadow */}
            <div 
              className="absolute inset-x-8 bottom-4 h-10 bg-charcoal/25 rounded-full blur-xl transition-all duration-300"
              style={{ 
                transform: 'translateZ(-20px) scale(0.9)',
                opacity: isHovered ? 0.8 : 0.6
              }}
            ></div>

            {/* Inner depth layer 2: Floating 3D Neon Board (No Image File!) */}
            <div 
              className="w-48 h-48 sm:w-68 sm:h-68 rounded-full flex flex-col items-center justify-center relative transition-transform duration-500 shadow-2xl"
              style={{ 
                transform: 'translateZ(55px)',
                transformStyle: 'preserve-3d',
                background: 'radial-gradient(circle, #2D2A26 60%, #1E1C1A 100%)',
                border: '6px double var(--brand-accent)'
              }}
            >
              {/* Neon Glow Circle */}
              <div className="absolute inset-0 rounded-full border border-dashed border-brand-plum animate-pulse opacity-45"></div>
              
              {/* Floating 3D Burger Emoji */}
              <div 
                className="text-7.5xl sm:text-8.5xl select-none filter drop-shadow-[0_15px_30px_rgba(251,133,0,0.4)] animate-bounce"
                style={{ 
                  transform: 'translateZ(30px)',
                  animationDuration: '3.5s'
                }}
              >
                🍔
              </div>

              {/* Circular Brand text simulation */}
              <div className="absolute bottom-4 sm:bottom-6 text-center select-none" style={{ transform: 'translateZ(15px)' }}>
                <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-[0.25em] text-accent-gold animate-pulse">
                  Grill Zone
                </span>
              </div>
            </div>

            {/* Inner depth layer 3: Pop-out Ingredients */}
            {/* Floating Chili */}
            <div 
              className="absolute top-[8%] left-[5%] text-2xl md:text-3.5xl filter drop-shadow-md select-none pointer-events-none float-animation"
              style={{ transform: 'translateZ(90px)', animationDelay: '0s' }}
            >
              🌶️
            </div>
            {/* Floating Cheese slice */}
            <div 
              className="absolute top-[18%] right-[5%] text-3xl md:text-4xl filter drop-shadow-md select-none pointer-events-none float-animation"
              style={{ transform: 'translateZ(110px)', animationDelay: '-1.5s' }}
            >
              🧀
            </div>
            {/* Floating Tomato */}
            <div 
              className="absolute bottom-[15%] left-[2%] text-2.5xl md:text-3.5xl filter drop-shadow-md select-none pointer-events-none float-animation"
              style={{ transform: 'translateZ(100px)', animationDelay: '-3s' }}
            >
              🍅
            </div>
            {/* Floating French Fries */}
            <div 
              className="absolute bottom-[10%] right-[3%] text-3xl md:text-4.5xl filter drop-shadow-md select-none pointer-events-none float-animation"
              style={{ transform: 'translateZ(120px)', animationDelay: '-4.5s' }}
            >
              🍟
            </div>
            {/* Floating Soft Drink */}
            <div 
              className="absolute top-[-5%] left-[38%] text-3xl md:text-4.5xl filter drop-shadow-md select-none pointer-events-none float-animation"
              style={{ transform: 'translateZ(80px)', animationDelay: '-2.5s' }}
            >
              🥤
            </div>
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
