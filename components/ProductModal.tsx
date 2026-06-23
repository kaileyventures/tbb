'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem } from '@/hooks/types';
import { useSite } from '@/context/SiteContext';

interface ProductModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
  images: string[];
  brandColor?: string;
  accentColor?: string;
}

export default function ProductModal({ 
  item, 
  isOpen, 
  onClose, 
  whatsappNumber, 
  images,
  brandColor = '#7A1A40'
}: ProductModalProps) {
  const { activeSite } = useSite();
  const isBurger = activeSite === 'burger';
  const brandName = isBurger ? 'The Burger Bro' : 'The Baker Bro';

  const [mounted, setMounted] = useState(false);
  const [activeVarIdx, setActiveVarIdx] = useState(0);
  const [customWeight, setCustomWeight] = useState('');
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setCurrentImageIdx(0);
        setActiveVarIdx(0);
        setCustomWeight('');
      }, 0);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const hasVariants = !!(item.variantOptions && item.variantOptions.length > 0);
  const activeVariant = (item.variantOptions && item.variantOptions.length > 0) ? item.variantOptions[activeVarIdx] : null;
  const isCustomSelected = !!(activeVariant && activeVariant.label.toLowerCase().includes('custom'));
  const displayPrice = activeVariant ? activeVariant.price : item.price;
  
  const displayVariantLabel = isCustomSelected 
    ? `Custom Weight: ${customWeight ? customWeight + ' Kg' : 'Not specified'}` 
    : (activeVariant ? activeVariant.label : '');

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextImage();
    if (distance < -50) prevImage();
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleWhatsAppOrder = () => {
    if (isCustomSelected && !customWeight.trim()) {
      alert("Please enter your required custom weight before ordering.");
      return;
    }
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const itemDetail = displayVariantLabel ? `*${item.name}* (${displayVariantLabel})` : `*${item.name}*`;
    const message = `Hi ${brandName},\n\nI want to order:\n${itemDetail} - ${displayPrice}\n\nProduct Link: ${pageUrl}\n\nPlease let me know the availability and final pricing.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = { title: `${brandName} - ${item.name}`, text: `Check out this delicious ${item.name}!`, url: pageUrl };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log('Error sharing:', err); }
    } else {
      navigator.clipboard.writeText(pageUrl);
      alert('Product link copied to clipboard!');
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center bg-charcoal/80 backdrop-blur-sm sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl bg-cream-light rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[92vh] md:max-h-[85vh] animate-in slide-in-from-bottom-10 duration-500 border border-accent-gold/20">
        
        {/* Left: Premium Image Slider */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-full relative bg-[#FAF6F0] shrink-0 overflow-hidden group border-b md:border-b-0 md:border-r border-accent-gold/15">
          <div 
            className="flex w-full h-full transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing"
            style={{ transform: `translateX(-${currentImageIdx * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((img, idx) => (
              <div key={idx} className="w-full h-full shrink-0 relative">
                <img src={img} alt={item.name} className="w-full h-full object-cover select-none pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream-light/90 shadow-md flex items-center justify-center text-charcoal hover:scale-105 active:scale-95 transition-all z-30 border border-accent-gold/25 cursor-pointer"
                style={{ color: brandColor }}
              >
                <i className="fas fa-chevron-left text-xs"></i>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream-light/90 shadow-md flex items-center justify-center text-charcoal hover:scale-105 active:scale-95 transition-all z-30 border border-accent-gold/25 cursor-pointer"
                style={{ color: brandColor }}
              >
                <i className="fas fa-chevron-right text-xs"></i>
              </button>

              {/* Slider Dots */}
              <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(idx); }}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentImageIdx === idx ? 'w-6' : 'w-1.5 bg-white/70'}`}
                    style={{ backgroundColor: currentImageIdx === idx ? brandColor : undefined }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Content details panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col overflow-y-auto bg-cream-light relative">
          
          {/* Modal actions / close / share */}
          <div className="flex justify-between items-start gap-4 mb-4 border-b border-accent-gold/15 pb-5 shrink-0">
            <h2 className="text-2xl md:text-3.5xl font-black text-charcoal leading-tight pr-2 font-serif-heading">{item.name}</h2>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleShare} 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm bg-brand-plum/5 text-brand-plum hover:bg-brand-plum/10 cursor-pointer border border-accent-gold/20"
              >
                <i className="fas fa-share-alt text-sm"></i>
              </button>
              <button 
                onClick={onClose} 
                className="w-10 h-10 bg-accent-gold/10 text-charcoal/80 hover:bg-accent-gold/20 rounded-full flex items-center justify-center transition-colors shadow-sm border border-accent-gold/20 cursor-pointer"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
          </div>
          
          {/* Pricing details */}
          <div className="text-3xl font-black mb-4 shrink-0 text-brand-plum font-sans">
            {displayPrice}
          </div>
          
          {/* Description */}
          <div className="text-xs sm:text-sm text-charcoal/60 font-semibold mb-6 shrink-0 leading-relaxed">{item.desc}</div>

          {/* Variants Selector */}
          {hasVariants && (
            <div className="mb-8 p-5 bg-cream-bg rounded-2xl border border-accent-gold/20 shrink-0">
              <label className="block text-[10px] font-extrabold text-charcoal/40 uppercase tracking-widest mb-3">Select Size / Weight</label>
              <div className="flex flex-wrap gap-2">
                {item.variantOptions?.map((opt: { label: string; price: string }, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveVarIdx(i);
                      if (!opt.label.toLowerCase().includes('custom')) setCustomWeight('');
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 border bg-cream-light shadow-sm cursor-pointer"
                    style={{ 
                      borderColor: activeVarIdx === i ? brandColor : 'rgba(217, 179, 130, 0.3)',
                      color: activeVarIdx === i ? brandColor : '#4b5563',
                      boxShadow: activeVarIdx === i ? `0 0 0 2px rgba(122, 26, 64, 0.1)` : 'none'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Custom Weight inputs block */}
              {isCustomSelected && (
                <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                  <input
                    type="number"
                    placeholder="Enter required weight in Kg (e.g. 2.5)"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(e.target.value)}
                    className="w-full text-xs sm:text-sm px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-plum/20 bg-cream-light text-charcoal font-semibold border-accent-gold/30 transition-all shadow-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Order Button */}
          <div className="mt-auto pt-6 border-t border-accent-gold/15 shrink-0">
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full py-4 bg-[#25D366] text-white font-extrabold rounded-xl flex items-center justify-center space-x-3 hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] text-base cursor-pointer"
            >
              <i className="fab fa-whatsapp text-2xl"></i>
              <span className="uppercase tracking-widest text-sm">Order on WhatsApp</span>
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-[10px] font-extrabold text-charcoal/40 uppercase tracking-widest">
              <span>{isBurger ? '100% Pure Veg' : '100% Eggless'}</span>
              <span>•</span>
              <span>{isBurger ? 'Hot & Fresh' : 'Freshly Baked'}</span>
              <span>•</span>
              <span>Ex-Radisson Standards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}