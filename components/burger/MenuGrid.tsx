'use client';
import { useState, useEffect } from 'react';
import { MenuItem } from '@/hooks/types';
import ProductCard from './ProductCard';

interface MenuGridProps {
  filteredMenu: MenuItem[];
  isLoading: boolean;
  whatsappNumber: string;
}

export default function BurgerMenuGrid({ filteredMenu, isLoading, whatsappNumber }: MenuGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const BRAND_COLOR = 'var(--brand-primary)'; // Dynamic
  const GOLD_COLOR = 'var(--brand-accent)';

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  // Reset page index when filtered menu items change (e.g. search/category change)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [filteredMenu.length]);

  // Paginated items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMenu = filteredMenu.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Smooth scroll back to top of MenuGrid
    const element = document.getElementById('menu-heading');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative z-10 w-full px-4 sm:px-6 lg:px-12 xl:px-20 pb-20 md:pb-28">
      
      {/* Menu Header with Item Count Badge */}
      <div id="menu-heading" className="flex flex-col items-center justify-center gap-2 mb-10 md:mb-16 px-1 text-center scroll-mt-24">
        <span 
          className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent-gold-dark mb-1"
        >
          Sizzling from the Grill
        </span>
        
        <div className="flex items-center gap-3 sm:gap-4 justify-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight font-serif-heading">Burger Bro Grill</h2>
          
          <span 
            className="font-bold px-3 py-1 rounded-full border shadow-sm text-xs sm:text-sm transition-all duration-300"
            style={{ 
              color: BRAND_COLOR, 
              backgroundColor: `${BRAND_COLOR}0B`, 
              borderColor: `${GOLD_COLOR}60` 
            }}
          >
            {filteredMenu.length} {filteredMenu.length === 1 ? 'Delight' : 'Delights'}
          </span>
        </div>
        
        <div className="w-12 h-0.5 bg-accent-gold mt-4"></div>
      </div>
      
      {/* Loading State with Branded Spinner */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-20 md:py-28 gap-4">
          <div 
            className="animate-spin rounded-full h-10 w-10 md:h-14 md:w-14 border-2 border-t-2"
            style={{ borderColor: GOLD_COLOR, borderTopColor: BRAND_COLOR }}
          ></div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-charcoal/50">Preparing Gourmet Delights...</p>
        </div>
      ) : (
        /* Responsive Grid: 2 cols mobile, 3 tablet, 4 desktop */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-10 xl:gap-12 items-stretch">
          {paginatedMenu.map((item, idx) => (
            <ProductCard 
              key={item.id || idx} 
              item={item} 
              whatsappNumber={whatsappNumber} 
            />
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && filteredMenu.length === 0 && (
        <div className="text-center py-16 md:py-24 text-charcoal/50 font-semibold text-sm md:text-base bg-cream-light/60 rounded-3xl border border-dashed border-accent-gold/40 max-w-2xl mx-auto px-6">
          <i className="fas fa-cookie text-3xl text-accent-gold mb-3 block opacity-60"></i>
          No delicious items found in this category right now. Try searching for something else!
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-accent-gold/20 shadow-sm cursor-pointer ${
              currentPage === 1 
                ? 'opacity-40 pointer-events-none' 
                : 'bg-cream-light text-charcoal hover:bg-brand-primary/5 hover:border-brand-primary'
            }`}
          >
            <i className="fas fa-chevron-left text-xs"></i>
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-xl text-xs font-extrabold transition-all border shadow-sm cursor-pointer ${
                currentPage === page
                  ? 'text-white'
                  : 'bg-cream-light text-charcoal border-accent-gold/20'
              }`}
              style={{
                backgroundColor: currentPage === page ? BRAND_COLOR : undefined,
                borderColor: currentPage === page ? BRAND_COLOR : undefined
              }}
            >
              {page}
            </button>
          ))}

          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-accent-gold/20 shadow-sm cursor-pointer ${
              currentPage === totalPages 
                ? 'opacity-40 pointer-events-none' 
                : 'bg-cream-light text-charcoal hover:bg-brand-primary/5 hover:border-brand-primary'
            }`}
          >
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      )}

      {/* Gourmet reference note */}
      {!isLoading && filteredMenu.length > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-10 md:mt-14 text-center">
          <i className="fas fa-info-circle text-[10px] text-accent-gold-dark"></i>
          <p className="text-[10px] font-extrabold tracking-wider uppercase text-charcoal/40">
            Note: Images are for reference only; product design may vary.
          </p>
        </div>
      )}

    </section>
  );
}
