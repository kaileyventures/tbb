'use client';
import Link from 'next/link';

export default function BakerAboutView() {
  const BRAND_PRIMARY = '#7A1A40'; // Baker Plum
  const BRAND_SECONDARY = 'var(--brand-accent)';

  return (
    <div className="min-h-screen bg-cream-bg text-charcoal pt-12 pb-24 relative z-10 overflow-hidden">
      
      {/* Decorative vectors in background */}
      <div className="absolute right-[-10%] top-[5%] w-72 h-72 opacity-5 pointer-events-none float-animation">
        <i className="fas text-[8rem] fa-seedling" style={{ color: BRAND_SECONDARY }}></i>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Editorial Header */}
        <div className="text-center mb-12 md:mb-20">
          <span 
            className="inline-flex items-center py-1.5 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest mb-4 border shadow-sm"
            style={{ 
              backgroundColor: `${BRAND_PRIMARY}0A`, 
              color: BRAND_PRIMARY, 
              borderColor: `${BRAND_SECONDARY}50` 
            }}
          >
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-charcoal mb-4 md:mb-6 tracking-tight font-serif-heading leading-tight">
            Baking Memories <br />
            <span 
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_PRIMARY} 30%, ${BRAND_SECONDARY} 100%)`, WebkitBackgroundClip: 'text' }}
            >Since 2017</span>
          </h1>
          <div className="w-12 h-0.5 bg-accent-gold mx-auto mb-6"></div>
          <p className="text-charcoal/60 font-semibold max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed px-2 md:px-0">
            What started as a passion for authentic baking has grown into Jalandhar's most loved destination for handcrafted, 100% eggless delights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Chef Editorial Profile */}
          <div className="md:col-span-8 bg-cream-light rounded-3xl p-6 sm:p-10 shadow-sm border border-accent-gold/25 transition-all duration-300 relative overflow-hidden group">
            <div 
              className="absolute top-0 right-0 w-28 h-28 rounded-bl-[100%] -z-0 opacity-[0.03] group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundColor: BRAND_PRIMARY }}
            ></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-10">
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-[#FAF6F0] rounded-full flex items-center justify-center border-2 border-accent-gold/40 shadow-lg overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/chef_gurdeep.png" 
                  alt="Head Baker Gurdeep - The Baker Bro" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="flex-1">
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest mb-3 border"
                  style={{ backgroundColor: `${BRAND_SECONDARY}1A`, color: '#857200', borderColor: `${BRAND_SECONDARY}50` }}
                >
                  <i className="fas fa-star" style={{ color: '#d97706' }}></i> Ex-Radisson
                </div>
                <h2 className="text-2xl md:text-3.5xl font-black text-charcoal mb-3 font-serif-heading">
                  Meet Head Baker Gurdeep
                </h2>
                <p className="text-charcoal/60 text-xs sm:text-sm md:text-base leading-relaxed font-semibold">
                  With years of elite culinary experience honed at the prestigious Radisson Hotel, Gurdeep brings 5-star hospitality standards, meticulous attention to detail, and a pinch of love to every batter he mixes.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Plaque */}
          <div className="md:col-span-4 bg-charcoal rounded-3xl p-6 sm:p-10 shadow-lg border border-accent-gold/20 flex flex-col justify-center relative overflow-hidden text-center sm:text-left transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute -right-5 -bottom-5 opacity-5 pointer-events-none">
              <i className="text-8xl text-white fas fa-birthday-cake"></i>
            </div>
            <div className="relative z-10 text-white">
              <h3 className="font-extrabold text-[10px] md:text-xs tracking-widest uppercase mb-1.5 opacity-70 text-accent-gold">Established</h3>
              <div className="text-5xl md:text-6xl font-black mb-3 font-serif-heading text-white">2017</div>
              <p className="text-white/60 text-xs md:text-sm font-semibold leading-relaxed">
                A gourmet journey that began with a single oven and a dream to bake pure vegetarian goodness.
              </p>
            </div>
          </div>

          {/* Feature 1 */}
          <div className="md:col-span-4 bg-cream-light rounded-3xl p-6 sm:p-8 border border-accent-gold/20 shadow-sm transition-all duration-300 hover:border-brand-primary group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <i className="fas fa-leaf text-xl"></i>
            </div>
            <h3 className="text-base sm:text-lg font-black text-charcoal mb-2 font-serif-heading">
              100% Eggless Purity
            </h3>
            <p className="text-charcoal/60 text-xs sm:text-sm font-semibold leading-relaxed">
              Pure vegetarian bakes without compromising on fluffy texture, moisture, and rich taste.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="md:col-span-4 bg-cream-light rounded-3xl p-6 sm:p-8 border border-accent-gold/20 shadow-sm transition-all duration-300 hover:border-accent-gold group">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${BRAND_SECONDARY}1A`, color: BRAND_PRIMARY }}
            >
              <i className="text-xl text-accent-gold-dark fas fa-gem"></i>
            </div>
            <h3 className="text-base sm:text-lg font-black text-charcoal mb-2 font-serif-heading">
              Elite Ingredients
            </h3>
            <p className="text-charcoal/60 text-xs sm:text-sm font-semibold leading-relaxed">
              From real Belgian chocolate to fresh local seasonal fruits, we source only the highest grade materials.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="md:col-span-4 bg-cream-light rounded-3xl p-6 sm:p-8 border border-accent-gold/20 shadow-sm transition-all duration-300 hover:border-brand-primary group">
            <div className="w-12 h-12 bg-brand-plum/5 text-brand-plum rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <i className="text-xl fas fa-hand-holding-heart"></i>
            </div>
            <h3 className="text-base sm:text-lg font-black text-charcoal mb-2 font-serif-heading">
              Handcrafted Artistry
            </h3>
            <p className="text-charcoal/60 text-xs sm:text-sm font-semibold leading-relaxed">
              No mass production lines. Every single cake is custom baked, assembled, and frosted by human hands.
            </p>
          </div>

        </div>

        {/* CTA Editorial Section */}
        <div 
          className="mt-12 md:mt-20 rounded-3xl p-8 sm:p-12 md:p-16 text-center border border-accent-gold/20 shadow-md relative overflow-hidden"
          style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_PRIMARY}0A, ${BRAND_SECONDARY}1A)` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(#D9B382_1px,transparent_1px)] [background-size:32px_32px] opacity-10"></div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-charcoal mb-4 font-serif-heading relative z-10">
            Taste the 5-Star Difference
          </h2>
          <p className="text-charcoal/60 font-semibold mb-8 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed relative z-10">
            Explore our menu crafted by Chef Gurdeep and experience premium quality bakery items right at your doorstep in Jalandhar.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link 
              href="/" 
              className="px-8 py-4 bg-brand-plum text-white font-extrabold rounded-xl shimmer-btn hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
            >
              <i className="fas fa-cake-candles"></i> Explore Menu
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-cream-light text-charcoal font-extrabold rounded-xl hover:bg-[#FDFBF8] transition-all border border-accent-gold/45 shadow-sm active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
            >
              <i className="fas fa-phone-alt text-brand-plum"></i> Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
