'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
        isScrolled 
          ? 'luxury-glass shadow-md py-2.5 sm:py-3 border-accent-gold/20' 
          : 'bg-[#FAF6F0]/95 border-accent-gold/15 py-3 sm:py-4'
      }`}
    >
      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between relative z-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center cursor-pointer group shrink-0 min-w-0">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-sm scale-110 group-hover:bg-accent-gold/40 transition-colors duration-300"></div>
                <img 
                  src={activeSite === 'burger' ? '/burger_logo.png' : 'https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png'} 
                  alt="Brand Logo" 
                  className="h-9 sm:h-11 md:h-12 w-auto relative z-10 drop-shadow-sm group-hover:scale-105 transition-all duration-300 object-contain" 
                />
              </div>
              <span 
                className="text-base sm:text-xl md:text-2xl font-black whitespace-nowrap tracking-tight font-serif-heading transition-colors duration-300"
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
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            
            {/* Responsive Brand Switcher Toggle */}
            <div 
              className="flex items-center bg-[#FAF6F0] border rounded-xl p-0.5 sm:p-1 shadow-xs shrink-0"
              style={{ borderColor: 'rgba(217, 179, 130, 0.45)' }}
            >
              {/* Baker Button */}
              <button 
                onClick={() => setSite('baker')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                  activeSite === 'baker' 
                    ? 'bg-brand-plum text-white shadow-sm' 
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
                title="The Baker Bro"
                aria-label="Switch to Bakery"
              >
                <span className="text-xs sm:text-sm">🍰</span>
                <span className="hidden sm:inline">Bakery</span>
              </button>

              {/* Burger Button */}
              <button 
                onClick={() => setSite('burger')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                  activeSite === 'burger' 
                    ? 'text-white shadow-sm' 
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
                style={activeSite === 'burger' ? { backgroundColor: 'var(--brand-primary)' } : undefined}
                title="The Burger Bro"
                aria-label="Switch to Burgers"
              >
                <span className="text-xs sm:text-sm">🍔</span>
                <span className="hidden sm:inline">Burgers</span>
              </button>
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
              className="md:hidden p-1.5 sm:p-2 text-charcoal/80 hover:bg-brand-plum/5 rounded-xl transition-all focus:outline-none w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Toggle Menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times text-base sm:text-lg' : 'fa-bars text-sm sm:text-base'} transition-all`} style={{ color: `var(--brand-primary)` }}></i>
            </button>
          </div>
          
        </div>
      </div>

      {/* Modern Luxury Mobile Drawer */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-[#FAF6F0] border-b border-accent-gold/20 shadow-2xl transition-all duration-300 ease-out origin-top z-50 ${
          isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-4 sm:p-5 space-y-4">
          
          {/* Modern Dual-Brand Switcher Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-accent-gold/25 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-accent-gold-dark">
                Explore Our Twin Kitchens
              </span>
              <span className="text-[9px] font-bold text-charcoal/50 bg-[#FAF6F0] px-2 py-0.5 rounded-md border border-accent-gold/20">
                1-Tap Switch
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#FAF6F0] p-1 rounded-xl border border-accent-gold/20">
              {/* Baker Option */}
              <button
                onClick={() => {
                  setSite('baker');
                  setIsMenuOpen(false);
                }}
                className={`py-2.5 px-2 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  activeSite === 'baker'
                    ? 'bg-brand-plum text-white shadow-xs'
                    : 'text-charcoal/65 hover:text-charcoal'
                }`}
              >
                <span className="text-base">🍰</span>
                <span className="text-[11px] uppercase tracking-wide">The Baker Bro</span>
                <span className="text-[8px] font-medium opacity-80">100% Eggless Cakes</span>
              </button>

              {/* Burger Option */}
              <button
                onClick={() => {
                  setSite('burger');
                  setIsMenuOpen(false);
                }}
                className={`py-2.5 px-2 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  activeSite === 'burger'
                    ? 'text-white shadow-xs'
                    : 'text-charcoal/65 hover:text-charcoal'
                }`}
                style={activeSite === 'burger' ? { backgroundColor: 'var(--brand-primary)' } : undefined}
              >
                <span className="text-base">🍔</span>
                <span className="text-[11px] uppercase tracking-wide">The Burger Bro</span>
                <span className="text-[8px] font-medium opacity-80">100% Pure Veg</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {menuLinks.map((item) => (
              <Link 
                key={item.name}
                href={item.path} 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between text-sm font-extrabold uppercase tracking-wider text-charcoal/85 py-3 px-3 rounded-xl hover:bg-white hover:text-brand-plum transition-all duration-200"
              >
                <span>{item.name}</span>
                <i className="fas fa-chevron-right text-[10px] text-accent-gold-dark/60"></i>
              </Link>
            ))}
          </div>
          
          {/* WhatsApp Direct Order Button */}
          <div className="pt-2">
            <button 
              onClick={handleGeneralOrder}
              className="w-full py-3.5 text-white font-extrabold rounded-xl flex items-center justify-center gap-2.5 uppercase tracking-widest text-xs shimmer-btn shadow-md cursor-pointer"
            >
              <i className="fab fa-whatsapp text-base text-green-400"></i>
              <span>Direct WhatsApp Order</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}