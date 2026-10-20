'use client';
import { useState, useEffect } from 'react';
import { MenuItem } from '@/hooks/types';
import ProductCard from './ProductCard';

interface MenuGridProps {
  filteredMenu: MenuItem[];
  isLoading: boolean;
  whatsappNumber: string;
}

export default function BakerMenuGrid({ filteredMenu, isLoading, whatsappNumber }: MenuGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const BRAND_COLOR = '#7A1A40'; // Baker Plum
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
          Fresh From Our Oven
        </span>
        
        <div className="flex items-center gap-3 sm:gap-4 justify-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight font-serif-heading">Our Menu</h2>
          
          <span 
            className="font-bold px-3 py-1 rounded-full border shadow-sm text-xs sm:text-sm transition-all duration-300 bg-brand-plum/5 text-brand-plum border-accent-gold/40"
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

      {/* Pagination Controls with Page Count & Smart Window */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col items-center justify-center gap-3 mt-12 md:mt-16">
          
          {/* Total Pages Count Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-light border border-accent-gold/25 text-[11px] font-extrabold uppercase tracking-wider text-charcoal/70 shadow-xs">
            <span>Page</span>
            <span className="text-brand-plum font-black">{currentPage}</span>
            <span>of</span>
            <span className="font-black text-charcoal">{totalPages}</span>
            <span className="text-charcoal/30">•</span>
            <span className="text-[10px] text-charcoal/50">{filteredMenu.length} items</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-accent-gold/20 shadow-xs cursor-pointer ${
                currentPage === 1 
                  ? 'opacity-35 pointer-events-none' 
                  : 'bg-cream-light text-charcoal hover:bg-brand-plum/10 hover:border-brand-plum'
              }`}
              aria-label="Previous Page"
            >
              <i className="fas fa-chevron-left text-xs"></i>
            </button>

            {/* Smart Window Pagination */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;

                return (
                  <div key={page} className="flex items-center gap-1.5 sm:gap-2">
                    {showEllipsis && (
                      <span className="w-6 text-center text-xs font-bold text-charcoal/40 select-none">
                        •••
                      </span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-xl text-xs font-extrabold transition-all border shadow-xs cursor-pointer ${
                        currentPage === page
                          ? 'text-white bg-brand-plum border-brand-plum'
                          : 'bg-cream-light text-charcoal border-accent-gold/20 hover:border-brand-plum'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-accent-gold/20 shadow-xs cursor-pointer ${
                currentPage === totalPages 
                  ? 'opacity-35 pointer-events-none' 
                  : 'bg-cream-light text-charcoal hover:bg-brand-plum/10 hover:border-brand-plum'
              }`}
              aria-label="Next Page"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
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
