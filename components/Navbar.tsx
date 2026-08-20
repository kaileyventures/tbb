'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { activeSite, setSite } = useSite();
  
  const WHATSAPP_NUMBER = '918146767522';
  const BRAND_COLOR = '#7A1A40'; // Dynamic mapped color

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
        { name: 'Admin Panel', path: '/admin' },
        { name: 'Contact', path: '/contact' },
        { name: 'About Us', path: '/about' }
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Party Orders', path: '/customcakes' },
        { name: 'Admin Panel', path: '/admin' },
        { name: 'Contact', path: '/contact' },
        { name: 'About Us', path: '/about' }
      ];

  const brandName = activeSite === 'baker' ? 'The Baker Bro' : 'The Burger Bro';

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 backdrop-blur-md border-b ${
        isScrolled 
          ? 'luxury-glass shadow-md py-3 border-accent-gold/20' 
          : 'bg-[#FAF6F0]/40 border-accent-gold/5 py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between relative z-20">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
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
          <div className="hidden md:flex items-center space-x-8 font-bold text-xs uppercase tracking-widest text-charcoal/80">
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Site Mode Switcher Toggle */}
            <div className="flex items-center bg-[#FAF6F0] border border-accent-gold/25 rounded-xl p-1 shadow-inner relative z-10 shrink-0">
              <button 
                onClick={() => setSite('baker')}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  activeSite === 'baker' 
                    ? 'bg-brand-plum text-white shadow-sm' 
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
              >
                <span>🍰</span>
                <span className="hidden xs:inline">Sweet</span>
              </button>
              <button 
                onClick={() => setSite('burger')}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  activeSite === 'burger' 
                    ? 'text-white shadow-sm' 
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
                style={activeSite === 'burger' ? { backgroundColor: 'var(--brand-primary)' } : undefined}
              >
                <span>🍔</span>
                <span className="hidden xs:inline">Spicy</span>
              </button>
            </div>

            {/* Desktop Order Button */}
            <button 
              onClick={handleGeneralOrder}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl shimmer-btn hover:brightness-110 transition-all active:scale-95 shadow-md uppercase text-[10px] tracking-widest cursor-pointer"
            >
              <i className="fab fa-whatsapp text-sm"></i>
              <span>Order Now</span>
            </button>
            
            {/* Mobile Hamburger Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-charcoal/80 hover:bg-brand-plum/5 rounded-xl transition-all focus:outline-none w-10 h-10 flex items-center justify-center cursor-pointer"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times text-lg' : 'fa-bars text-base'} transition-all`} style={{ color: `var(--brand-primary)` }}></i>
            </button>
          </div>
          
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-cream-light border-b border-accent-gold/10 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top z-10 ${
          isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 invisible'
        }`}
      >
        <div className="flex flex-col px-6 py-6 space-y-2 bg-[#FAF6F0]/95 backdrop-blur-md">
          {menuLinks.map((item) => (
            <Link 
              key={item.name}
              href={item.path} 
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
              <i className="fab fa-whatsapp text-lg"></i>
              <span>Place Your Order</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}