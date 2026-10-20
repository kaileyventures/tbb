'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const { activeSite, setSite } = useSite();
  
  const WHATSAPP_NUMBER = '918146767522';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-dismiss hint after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleGeneralOrder = () => {
    const message = activeSite === 'baker'
      ? `Hi The Baker Bro,\n\nI would like to inquire and place a bakery order. Please assist me.`
      : `Hi The Burger Bro,\n\nI would like to inquire and place a fast food order. Please assist me.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const menuLinks = activeSite === 'baker'
    ? [
        { name: 'Home', path: '/' },
        { name: 'Custom Cakes', path: '/customcakes' },
        { name: 'Contact', path: '/contact' },
        { name: 'About Us', path: '/about' }
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Party Orders', path: '/customcakes' },
        { name: 'Contact', path: '/contact' },
        { name: 'About Us', path: '/about' }
      ];

  const brandName = activeSite === 'baker' ? 'The Baker Bro' : 'The Burger Bro';

  return (
    <header className="sticky top-0 z-50">
      
      {/* Top Brand Switcher Ribbon Banner */}
      <div 
        className="text-white text-[10px] sm:text-xs font-bold py-1.5 px-4 transition-colors duration-500 shadow-xs flex items-center justify-between"
        style={{ 
          background: activeSite === 'baker' 
            ? 'linear-gradient(90deg, #530F2A 0%, #7A1A40 50%, #B45309 100%)' 
            : 'linear-gradient(90deg, #7A1A40 0%, #E63946 50%, #FB8500 100%)' 
        }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="truncate">
              {activeSite === 'baker' ? (
                <span>Currently Viewing: <strong>The Baker Bro (Cakes & Bakery)</strong></span>
              ) : (
                <span>Currently Viewing: <strong>The Burger Bro (Fast Food & Shakes)</strong></span>
              )}
            </span>
          </div>

          <button
            onClick={() => {
              setSite(activeSite === 'baker' ? 'burger' : 'baker');
              setShowHint(false);
            }}
            className="shrink-0 ml-3 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all text-white font-extrabold uppercase tracking-wider text-[9px] sm:text-[10px] flex items-center gap-1.5 cursor-pointer border border-white/25 active:scale-95"
          >
            <span>{activeSite === 'baker' ? 'Switch to Burger Bro' : 'Switch to Baker Bro'}</span>
            <span>{activeSite === 'baker' ? '🍔 ➔' : '🍰 ➔'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className={`transition-all duration-500 backdrop-blur-md border-b ${
          isScrolled 
            ? 'luxury-glass shadow-md py-2.5 sm:py-3 border-accent-gold/20' 
            : 'bg-[#FAF6F0]/90 border-accent-gold/15 py-3 sm:py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between relative z-20">
            
            {/* Logo Image & Brand Name (Original Logos Restored) */}
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
              <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-sm scale-110 group-hover:bg-accent-gold/40 transition-colors duration-300"></div>
                  <img 
                    src={activeSite === 'burger' ? '/burger_logo.png' : 'https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png'} 
                    alt="Brand Logo" 
                    className="h-10 sm:h-12 w-auto relative z-10 drop-shadow-sm group-hover:scale-105 transition-all duration-500 object-contain" 
                  />
                </div>
                <span 
                  className="text-xl sm:text-2xl font-black whitespace-nowrap tracking-tight font-serif-heading transition-colors duration-300"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  {brandName}
                </span>
              </Link>
            </div>
            
            {/* Desktop Links with Sliding Underline */}
            <div className="hidden md:flex items-center space-x-7 font-bold text-xs uppercase tracking-widest text-charcoal/80">
              {menuLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.path} 
                  className="relative py-2 hover:text-brand-plum transition-colors group/link"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-gold group-hover/link:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Site Mode Switcher Toggle */}
              <div className="relative">
                {showHint && (
                  <div className="hidden sm:flex absolute -bottom-10 right-0 z-30 bg-charcoal text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-xl whitespace-nowrap items-center gap-1.5 border border-accent-gold/30 animate-bounce">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold"></span>
                    <span>Tap here to switch kitchen & menu!</span>
                    <button 
                      onClick={() => setShowHint(false)} 
                      className="ml-1 text-white/50 hover:text-white"
                      aria-label="Close hint"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div 
                  className="flex items-center bg-[#FAF6F0] border-2 rounded-xl p-1 shadow-xs shrink-0"
                  style={{ borderColor: 'rgba(217, 179, 130, 0.45)' }}
                >
                  {/* Baker Button */}
                  <button 
                    onClick={() => {
                      setSite('baker');
                      setShowHint(false);
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      activeSite === 'baker' 
                        ? 'bg-brand-plum text-white shadow-sm' 
                        : 'text-charcoal/60 hover:text-charcoal hover:bg-black/5'
                    }`}
                    title="Switch to The Baker Bro (Cakes & Bakery)"
                  >
                    <span>🍰</span>
                    <span>Bakery</span>
                  </button>

                  {/* Burger Button */}
                  <button 
                    onClick={() => {
                      setSite('burger');
                      setShowHint(false);
                    }}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      activeSite === 'burger' 
                        ? 'text-white shadow-sm' 
                        : 'text-charcoal/60 hover:text-charcoal hover:bg-black/5'
                    }`}
                    style={activeSite === 'burger' ? { backgroundColor: 'var(--brand-primary)' } : undefined}
                    title="Switch to The Burger Bro (Burgers & Fast Food)"
                  >
                    <span>🍔</span>
                    <span>Burgers</span>
                  </button>
                </div>
              </div>

              {/* Desktop Order Button */}
              <button 
                onClick={handleGeneralOrder}
                className="hidden sm:flex items-center gap-2 px-4 sm:px-5 py-2.5 text-white font-bold rounded-xl shimmer-btn hover:brightness-110 transition-all active:scale-95 shadow-md uppercase text-[10px] tracking-widest cursor-pointer"
              >
                <i className="fab fa-whatsapp text-sm text-green-400"></i>
                <span>Order Now</span>
              </button>
              
              {/* Mobile Hamburger Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-charcoal/80 hover:bg-brand-plum/5 rounded-xl transition-all focus:outline-none w-10 h-10 flex items-center justify-center cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times text-lg' : 'fa-bars text-base'} transition-all`} style={{ color: `var(--brand-primary)` }}></i>
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div 
          className={`md:hidden absolute top-full left-0 w-full bg-cream-light border-b border-accent-gold/10 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top z-10 ${
            isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 invisible'
          }`}
        >
          <div className="flex flex-col px-6 py-6 space-y-2 bg-[#FAF6F0]/95 backdrop-blur-md">
            
            {/* Mobile Switch Brand Card */}
            <div className="p-3.5 mb-2 rounded-2xl bg-white border border-accent-gold/30 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent-gold-dark block">Kitchen Brand</span>
                <span className="text-xs font-black text-charcoal">{brandName}</span>
              </div>
              <button
                onClick={() => {
                  setSite(activeSite === 'baker' ? 'burger' : 'baker');
                  setIsMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <span>Switch to {activeSite === 'baker' ? 'Burger Bro 🍔' : 'Baker Bro 🍰'}</span>
              </button>
            </div>

            {menuLinks.map((item) => (
              <Link 
                key={item.name}
                href={item.path} 
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-bold uppercase tracking-wider text-charcoal/85 py-3 border-b border-accent-gold/10 last:border-0 hover:text-brand-plum hover:pl-2 transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4">
              <button 
                onClick={handleGeneralOrder}
                className="w-full px-6 py-3.5 text-white font-bold rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest shimmer-btn shadow-md cursor-pointer"
              >
                <i className="fab fa-whatsapp text-lg text-green-400"></i>
                <span>Place Your Order</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}