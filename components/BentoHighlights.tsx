import { useSite } from '@/context/SiteContext';

export default function BentoHighlights() {
  const { activeSite } = useSite();
  const BRAND_COLOR = 'var(--brand-primary)';
  const isBurger = activeSite === 'burger';

  return (
    <section className="relative z-10 container mx-auto px-4 sm:px-6 pb-20 md:pb-28">
      <div className="flex flex-col items-center mb-8 md:mb-12">
        <span 
          className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent-gold-dark mb-2"
        >
          {isBurger ? 'Our Standards' : 'Our Standards'}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-charcoal text-center font-serif-heading">
          {isBurger ? 'Why The Burger Bro?' : 'Why The Baker Bro?'}
        </h2>
        <div className="w-12 h-0.5 bg-accent-gold mt-4"></div>
      </div>
      
      {/* 2 Columns on Mobile, 3 on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        
        {/* Card 1 - Fast Delivery / Hot Grill Express */}
        <div 
          className="col-span-1 bg-cream-light rounded-2xl md:rounded-3xl p-5 md:p-10 flex flex-col justify-center items-center text-center group cursor-pointer border border-accent-gold/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-accent-gold/50"
        >
          <div 
            className="w-12 h-12 md:w-20 md:h-20 flex-shrink-0 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: `${BRAND_COLOR}0A` }}
          >
            <i className={`text-lg md:text-3xl fas ${isBurger ? 'fa-fire-alt' : 'fa-truck-fast'}`} style={{ color: BRAND_COLOR }}></i>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <h4 className="font-bold text-charcoal mb-2 text-base md:text-xl leading-tight font-serif-heading">
              {isBurger ? 'Hot Grill Express' : 'Fast Delivery'}
            </h4>
            <p className="text-[11px] sm:text-xs md:text-sm text-charcoal/60 font-semibold leading-relaxed line-clamp-3 md:line-clamp-none">
              {isBurger 
                ? 'Sizzling hot burgers and fresh pizzas, delivered directly to your doorstep in under 45 minutes.'
                : 'Fresh out of the oven, delivered at your doorstep under 45 mins locally.'}
            </p>
          </div>
        </div>

        {/* Card 2 - 100% Vegetarian / Eggless */}
        <div 
          className="col-span-1 bg-cream-light rounded-2xl md:rounded-3xl p-5 md:p-10 flex flex-col justify-center items-center text-center group cursor-pointer border border-accent-gold/20 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-accent-gold/50"
        >
          <div 
            className="w-12 h-12 md:w-20 md:h-20 flex-shrink-0 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: 'rgba(217, 179, 130, 0.1)' }}
          >
            <i className="fas fa-leaf text-lg md:text-3xl" style={{ color: '#857200' }}></i>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <h4 className="font-bold text-charcoal mb-2 text-base md:text-xl leading-tight font-serif-heading">
              {isBurger ? '100% Vegetarian' : '100% Eggless'}
            </h4>
            <p className="text-[11px] sm:text-xs md:text-sm text-charcoal/60 font-semibold leading-relaxed line-clamp-3 md:line-clamp-none">
              {isBurger
                ? 'Prepared in a strictly 100% vegetarian kitchen with designated tools, ensuring absolute purity.'
                : 'Pure vegetarian baking recipes that deliver the exact same rich, fluffy, and delicious taste.'}
            </p>
          </div>
        </div>

        {/* Card 3 - Premium Quality / Gourmet Flavors (Gradient Highlight) */}
        <div 
          className="col-span-2 md:col-span-1 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-row md:flex-col items-center justify-start md:justify-center text-white shadow-lg relative overflow-hidden group cursor-pointer border border-accent-gold/10"
          style={{ background: `linear-gradient(135deg, ${BRAND_COLOR}, var(--brand-primary-dark))` }}
        >
          <div className="absolute top-[-25%] right-[-15%] w-32 md:w-48 h-32 md:h-48 bg-white/5 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"></div>
          
          <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center mr-4 md:mr-0 relative z-10 md:mb-6 group-hover:scale-110 transition-transform duration-300 rounded-full bg-white/10">
            <i className={`text-2xl md:text-4xl text-accent-gold fas ${isBurger ? 'fa-cheese' : 'fa-certificate'}`}></i>
          </div>
          
          <div className="flex-1 text-left md:text-center relative z-10">
            <h4 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 md:mb-3 leading-tight font-serif-heading text-accent-gold">
              {isBurger ? 'Gourmet Flavors' : 'Premium Quality'}
            </h4>
            <p className="text-[11px] sm:text-xs md:text-sm font-medium text-white/80 leading-relaxed line-clamp-2 md:line-clamp-none">
              {isBurger
                ? 'Crafted daily with custom spice blends, sourdough bread bases, and fresh local Jalandhar ingredients.'
                : 'Handcrafted daily with elite ingredients like Belgian chocolate and fresh local fruits.'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}