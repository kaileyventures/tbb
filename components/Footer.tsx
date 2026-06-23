'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const { activeSite } = useSite();
  const isBurger = activeSite === 'burger';
  
  const currentYear = new Date().getFullYear();
  const BRAND_COLOR = 'var(--brand-primary)';
  const HASHTAG = isBurger ? '#TheBurgerBro' : '#TheBakerBro';
  const brandName = isBurger ? 'The Burger Bro' : 'The Baker Bro';

  const CONTACTS = [
    { name: 'Gagan', number: '918146767522' },
    { name: 'Gurdeep', number: '917814351326' }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(HASHTAG);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppClick = (number: string) => {
    const message = encodeURIComponent(`Hi ${brandName}, I'd like to inquire about...`);
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    setShowWhatsApp(false);
  };

  return (
    <footer className="relative z-10 bg-cream-light border-t border-accent-gold/15 mt-16 sm:mt-24">
      <div className="container mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
        
        {/* Clickable Logo */}
        <Link href="/" className="inline-block mb-8 hover:opacity-80 transition-opacity active:scale-95 transform group">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-md scale-110 group-hover:bg-accent-gold/40 transition-colors"></div>
            <img 
              src={isBurger ? '/burger_logo.png' : 'https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png'} 
              alt={`${brandName} Logo`} 
              className="h-14 md:h-18 w-auto drop-shadow-sm mx-auto relative z-10 group-hover:scale-105 transition-transform duration-300 object-contain" 
            />
          </div>
        </Link>

        {/* Social Media & Tag Us Section */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-charcoal/40">Tag us on Instagram:</span>
            <div className="relative">
              <button 
                onClick={copyToClipboard}
                className="text-xs font-extrabold px-6 py-2.5 rounded-xl border shadow-sm transition-all active:scale-95 bg-cream-bg cursor-pointer"
                style={{ 
                  color: BRAND_COLOR, 
                  borderColor: copied ? BRAND_COLOR : 'rgba(217, 179, 130, 0.4)' 
                }}
              >
                {HASHTAG}
              </button>
              {copied && (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] py-1 px-2 rounded-lg animate-bounce">
                  Copied!
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <a 
              href="https://www.instagram.com/thebakerbro_" 
              target="_blank" 
              rel="noreferrer" 
              className="text-charcoal/40 hover:text-brand-plum text-2.5xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i className="fab fa-instagram"></i>
            </a>
            
            <a 
              href="https://www.facebook.com/thebakerbro_" 
              target="_blank" 
              rel="noreferrer" 
              className="text-charcoal/40 hover:text-[#1877F2] text-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <i className="fab fa-facebook-f"></i>
            </a>

            {/* WhatsApp with Contact Selection */}
            <div className="relative">
              <button 
                onClick={() => setShowWhatsApp(!showWhatsApp)}
                className="text-charcoal/40 hover:text-[#25D366] text-2.5xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <i className="fab fa-whatsapp"></i>
              </button>

              {showWhatsApp && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowWhatsApp(false)}></div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-44 bg-cream-light border border-accent-gold/20 rounded-2xl shadow-2xl z-20 overflow-hidden">
                    {CONTACTS.map((contact, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleWhatsAppClick(contact.number)}
                        className="w-full px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-charcoal/70 hover:bg-brand-plum/5 hover:text-[#25D366] border-b border-accent-gold/10 last:border-0 transition-colors cursor-pointer"
                      >
                        Chat with {contact.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Minimal Divider */}
        <div className="w-full max-w-md border-t border-accent-gold/15 mb-8"></div>

        {/* Copyright & Core Links */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full max-w-4xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-charcoal/40 gap-4 md:gap-0">
          <p>
            &copy; {currentYear} {brandName}. Handcrafted in Panjab.
          </p>
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link href="/contact" className="hover:text-brand-plum transition-colors">Contact</Link>
            <span className="text-accent-gold/40">|</span>
            <Link href="/about" className="hover:text-brand-plum transition-colors">About Us</Link>
            <span className="text-accent-gold/40">|</span>
            <Link href="/terms" className="hover:text-brand-plum transition-colors">Terms</Link>
            <span className="text-accent-gold/40">|</span>
            <Link href="/privacy" className="hover:text-brand-plum transition-colors">Privacy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}