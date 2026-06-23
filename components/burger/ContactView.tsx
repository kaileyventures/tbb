'use client';

export default function BurgerContactView() {
  const BRAND_PRIMARY = 'var(--brand-primary)'; // Dynamic Burger Red/Orange
  const BRAND_SECONDARY = 'var(--brand-accent)';

  const openWhatsApp = (phone: string) => {
    window.open(`https://wa.me/91${phone.replace(/-/g, '')}`, '_blank');
  };

  const callNumber = (phone: string) => {
    window.open(`tel:+91${phone.replace(/-/g, '')}`, '_self');
  };

  return (
    <div className="min-h-screen bg-cream-bg pt-12 pb-24 relative z-10 overflow-hidden">
      
      {/* Background Blobs with Brand Colors */}
      <div 
        className="absolute top-0 left-0 w-64 h-64 md:w-[30rem] md:h-[30rem] rounded-full blur-2xl md:blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5"
        style={{ backgroundColor: BRAND_PRIMARY }}
      ></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <span 
            className="inline-flex items-center py-1.5 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest mb-4 border"
            style={{ 
              backgroundColor: `${BRAND_PRIMARY}0A`, 
              color: BRAND_PRIMARY, 
              borderColor: `${BRAND_SECONDARY}50` 
            }}
          >
            Reach Out To Us
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-charcoal mb-4 tracking-tight font-serif-heading">
            Let&apos;s <span 
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_PRIMARY})` }}
            >Talk</span>
          </h1>
          <div className="w-12 h-0.5 bg-accent-gold mx-auto mb-6"></div>
          <p className="text-charcoal/60 font-semibold max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
            Got a party order in mind, need a hot fresh delivery, or just want to say hi? Reach out to our team directly or visit our food zone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          <div className="space-y-6">
            
            {/* Gurdeep Card */}
            <div className="bg-cream-light rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl border border-accent-gold/20 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-brand-primary" style={{ backgroundColor: BRAND_PRIMARY }}></div>
              <div className="flex items-center gap-4 md:gap-6">
                <div 
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-inner shrink-0 relative"
                  style={{ backgroundColor: `${BRAND_PRIMARY}0A` }}
                >
                  {/* Chef Hat Vector illustration */}
                  <svg className="w-10 h-10 md:w-14 md:h-14 relative z-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 48C12 48 18 52 32 52C46 52 52 48 52 48" stroke={BRAND_PRIMARY} strokeWidth="3" strokeLinecap="round"/>
                    <path d="M16 40C16 28 20 20 32 20C44 20 48 28 48 40" stroke={BRAND_PRIMARY} strokeWidth="3" strokeLinecap="round"/>
                    <path d="M26 12C20 12 18 16 18 16" stroke={BRAND_PRIMARY} strokeWidth="3" strokeLinecap="round"/>
                    <path d="M38 12C44 12 46 16 46 16" stroke={BRAND_PRIMARY} strokeWidth="3" strokeLinecap="round"/>
                    <rect x="22" y="40" width="20" height="8" rx="2" fill={BRAND_PRIMARY} stroke={BRAND_PRIMARY} strokeWidth="2"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-black text-charcoal font-serif-heading truncate">Gurdeep</h3>
                  <p 
                    className="text-[10px] md:text-xs font-extrabold tracking-widest uppercase mt-1 truncate"
                    style={{ color: BRAND_PRIMARY }}
                  >
                    Head Chef & Grills
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => callNumber('7814351326')} 
                  className="flex-1 py-3.5 bg-cream-bg text-charcoal font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#FAF6F0] transition-colors border border-accent-gold/45 text-xs uppercase tracking-widest cursor-pointer active:scale-95"
                >
                  <i className="fas fa-phone-alt text-brand-primary" style={{ color: BRAND_PRIMARY }}></i> Call Direct
                </button>
                <button 
                  onClick={() => openWhatsApp('7814351326')} 
                  className="flex-1 py-3.5 bg-[#25D366] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-md shadow-green-500/20 text-xs uppercase tracking-widest cursor-pointer active:scale-95"
                >
                  <i className="fab fa-whatsapp text-lg"></i> WhatsApp
                </button>
              </div>
            </div>

            {/* Gagan Card */}
            <div className="bg-cream-light rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl border border-accent-gold/20 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-accent-gold-dark"></div>
              <div className="flex items-center gap-4 md:gap-6">
                <div 
                  className="w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-inner shrink-0"
                  style={{ backgroundColor: `${BRAND_SECONDARY}1A`, color: '#857200' }}
                >
                  <i className="fas fa-store text-2xl md:text-3xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-black text-charcoal font-serif-heading truncate">Gagan</h3>
                  <p 
                    className="text-[10px] md:text-xs font-extrabold tracking-widest uppercase mt-1 truncate text-accent-gold-dark"
                  >
                    Store Operations Manager
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => callNumber('8146767522')} 
                  className="flex-1 py-3.5 bg-cream-bg text-charcoal font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#FAF6F0] transition-colors border border-accent-gold/45 text-xs uppercase tracking-widest cursor-pointer active:scale-95"
                >
                  <i className="fas fa-phone-alt text-brand-primary" style={{ color: BRAND_PRIMARY }}></i> Call Direct
                </button>
                <button 
                  onClick={() => openWhatsApp('8146767522')} 
                  className="flex-1 py-3.5 bg-[#25D366] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-md shadow-green-500/20 text-xs uppercase tracking-widest cursor-pointer active:scale-95"
                >
                  <i className="fab fa-whatsapp text-lg"></i> WhatsApp
                </button>
              </div>
            </div>
            
          </div>

          {/* Map Section */}
          <div className="bg-cream-light rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-accent-gold/20 flex flex-col h-full transition-all duration-300">
            <div className="p-6 md:p-8 flex flex-col flex-1">
              
              <div className="flex items-start gap-4 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border"
                  style={{ backgroundColor: `${BRAND_PRIMARY}0A`, color: BRAND_PRIMARY, borderColor: `${BRAND_SECONDARY}50` }}
                >
                  <i className="fas fa-store"></i>
                </div>
                <div>
                  <h3 className="font-black text-lg text-charcoal mb-1 font-serif-heading">
                    The Burger Bro Kitchen
                  </h3>
                  <p className="text-charcoal/60 text-xs sm:text-sm font-semibold leading-relaxed">
                    Come smell the fresh grills. Jalandhar, Punjab, India.
                  </p>
                </div>
              </div>

              <div className="w-full flex-1 min-h-[220px] md:min-h-[260px] bg-cream-bg rounded-2xl overflow-hidden relative border border-accent-gold/20 group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.807656037764!2d75.543624!3d31.30906089999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5ad94030e4c7%3A0xdbb2dd45f4d7c51f!2sThe%20Burger%20Bro!5e0!3m2!1sen!2sin!4v1773987637073!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
                ></iframe>
                <div className="absolute inset-0 bg-transparent pointer-events-none md:hidden"></div>
              </div>
            </div>
            
            <div className="p-5 md:p-6 bg-cream-bg border-t border-accent-gold/20">
              <a 
                href="https://maps.app.goo.gl/yV9nL2Q1aR4cZtYf8" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-4 text-white font-extrabold rounded-xl flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-95 text-xs uppercase tracking-widest"
                style={{ backgroundColor: BRAND_PRIMARY }}
              >
                <i className="fas fa-location-arrow"></i> Get Google Maps Directions
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
