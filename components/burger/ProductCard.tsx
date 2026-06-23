'use client';
import { useState } from 'react';
import ProductModal from './ProductModal';
import { MenuItem } from '@/hooks/types';

export default function BurgerProductCard({ item, whatsappNumber }: { item: MenuItem, whatsappNumber: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BRAND_COLOR = 'var(--brand-primary)'; // Dynamic Burger Red/Orange
  const GOLD_COLOR = 'var(--brand-accent)';

  // --- Smart Image Parsing Logic ---
  const rawImageString = item.images || item.image || '';
  
  let parsedImages: string[] = [];
  
  if (typeof rawImageString === 'string' && rawImageString.trim() !== '') {
    parsedImages = rawImageString.split(',').map(url => url.trim()).filter(url => url !== '');
  } else if (Array.isArray(rawImageString) && rawImageString.length > 0) {
    parsedImages = rawImageString;
  }

  // Fallback if no valid image is found
  if (parsedImages.length === 0) {
    parsedImages = ['https://via.placeholder.com/600x400?text=Image+Coming+Soon'];
  }

  const displayPrice = (item.variantOptions && item.variantOptions.length > 0) ? item.variantOptions[0].price : item.price;

  return (
    <>
      <div 
        className="bg-cream-light rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-accent-gold/20 group flex flex-col transition-all duration-500 luxury-card cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        
        {/* Image Container with Zoom effect */}
        <div className="relative aspect-[4/3] w-auto overflow-hidden m-3 rounded-2xl">
          <img 
            src={parsedImages[0]} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity"></div>
          
          {/* Elegant Quick View Overlay */}
          <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span 
              className="bg-cream-light/95 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 border border-accent-gold/40 flex items-center gap-2"
              style={{ color: BRAND_COLOR }}
            >
              <i className="fas fa-eye text-xs text-accent-gold-dark"></i>Quick View
            </span>
          </div>

          {/* Wax seal / ribbon badge */}
          {item.badge && item.badge.trim() !== '' && (
            <span 
              className="absolute top-3 left-3 px-3 py-1 text-accent-gold font-bold text-[9px] uppercase tracking-wider rounded-lg shadow-md z-20 border border-accent-gold/30 line-clamp-1 max-w-[80%]"
              style={{ backgroundColor: BRAND_COLOR }}
            >
              {item.badge}
            </span>
          )}
          
          {/* 100% Pure Veg leaf indicator */}
          <span 
            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center z-20 border border-green-500/30"
            title="100% Pure Vegetarian"
          >
            <i className="fas fa-leaf text-[10px] text-green-600"></i>
          </span>
        </div>
        
        {/* Card Content details */}
        <div className="px-5 pb-5 pt-2 flex flex-col flex-1">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 
              className="text-base sm:text-lg font-black text-charcoal leading-snug line-clamp-2 flex-1 font-serif-heading transition-colors duration-300 group-hover:text-brand-primary"
            >
              {item.name}
            </h3>
            <span 
              className="text-base sm:text-xl font-black shrink-0 font-sans text-brand-primary"
            >
              {displayPrice}
            </span>
          </div>
          
          <p className="text-xs text-charcoal/50 font-semibold mb-4 flex-1 line-clamp-2 leading-relaxed">{item.desc}</p>
          
          {/* CTA Button */}
          <button 
            className="w-full py-3 bg-transparent text-charcoal font-bold rounded-xl flex items-center justify-center gap-2 border border-accent-gold/50 group-hover:bg-brand-primary group-hover:text-white group-hover:border-transparent transition-all duration-300 text-xs uppercase tracking-widest cursor-pointer active:scale-[0.98]"
            style={{ 
              '--hover-bg': BRAND_COLOR
            } as React.CSSProperties}
          >
            <span>View & Order</span>
          </button>
        </div>
      </div>

      <ProductModal 
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        whatsappNumber={whatsappNumber}
        images={parsedImages}
        brandColor={BRAND_COLOR}
        accentColor={GOLD_COLOR}
      />
    </>
  );
}
