'use client';
import { useState } from 'react';

export default function BurgerPartyOrdersView() {
  const WHATSAPP_NUMBER = '918146767522';
  const BRAND_COLOR = 'var(--brand-primary)'; // Dynamic Burger Red/Orange
  const ACCENT_COLOR = 'var(--brand-accent)';

  // States for interactive customizer selection
  const [option1, setOption1] = useState('Slider Box (12 Pcs)');
  const [option2, setOption2] = useState('Ocean Blue Lagoon Tub');
  const [option3, setOption3] = useState('Peri-Peri Cheesy Fries');

  const OPTIONS_1 = [
    { name: 'Slider Box (12 Pcs)', desc: '12 flame-grilled mini veg burgers with fries & dip', price: 1899, emoji: '🍔' },
    { name: 'Loaded Pizza Platter', desc: '4 medium double-cheese sourdough pizzas of choice', price: 2499, emoji: '🍕' },
    { name: 'Sandwich Catering Tray', desc: '16 slices of grilled multi-decker cheese club sandwiches', price: 1599, emoji: '🥪' },
    { name: 'Chinese Noodle Tub', desc: 'Bulk street-style Szechuan noodles with spring rolls', price: 1499, emoji: '🍜' }
  ];

  const OPTIONS_2 = [
    { name: 'Ocean Blue Lagoon Tub', desc: '5 Litres of sparkling Curacao soda with mint', price: 399, emoji: '🥤' },
    { name: 'Classic Lime Mojito Pitcher', desc: '5 Litres of muddled citrus mojito with cane syrup', price: 299, emoji: '🍹' },
    { name: 'Masala Soda Tub', desc: '5 Litres of tangy spiced Indian street soda', price: 199, emoji: '🥤' },
    { name: 'Sparkling Lemonade Box', desc: '5 Litres of fresh zesty lemonade on ice', price: 249, emoji: '🍋' }
  ];

  const OPTIONS_3 = [
    { name: 'Peri-Peri Cheesy Fries', desc: 'Massive platter of hot fries with cheese dip', price: 199, emoji: '🍟' },
    { name: 'Loaded Garlic Bread', desc: '12 slices of buttery toasted mozzarella garlic bread', price: 249, emoji: '🧄' },
    { name: 'Extra Cheese Relish', desc: 'Tubs of liquid cheddar and spicy jalapeno sauce', price: 99, emoji: '🧀' },
    { name: 'Hot Hakka Noodle Side', desc: 'Regular portion bowl of garlic Hakka noodles', price: 149, emoji: '🍜' }
  ];

  const item1 = OPTIONS_1.find(o => o.name === option1) || OPTIONS_1[0];
  const item2 = OPTIONS_2.find(o => o.name === option2) || OPTIONS_2[0];
  const item3 = OPTIONS_3.find(o => o.name === option3) || OPTIONS_3[0];
  const estimatedTotal = item1.price + item2.price + item3.price;

  const handleCustomOrder = () => {
    const message = `Hi The Burger Bro,\n\nI'm interested in ordering a Custom Party Platter/Catering pack. Can you please share your platter menu and process?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCompileDesignOrder = () => {
    const message = `Hi The Burger Bro,\n\nI'm interested in booking a Custom Party Platter with these configurations:\n- Base Platter: *${option1}* (₹${item1.price})\n- Drink Option: *${option2}* (₹${item2.price})\n- Add-on: *${option3}* (₹${item3.price})\n\n*Estimated Total: ₹${estimatedTotal}*\n\nPlease let me know availability and pricing.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const STEPS = [
    {
      step: '01',
      title: 'Configure Platter',
      desc: 'Pick your sliders box, sourdough pizzas, and mocktail combinations. Chef Gurdeep scales the quantity to suit your guest count.',
      icon: 'fa-box-open'
    },
    {
      step: '02',
      title: 'Volume & Time',
      desc: 'Finalize the number of servings, delivery slot, and specific spice level choices (mild, medium, extra hot).',
      icon: 'fa-calendar-alt'
    },
    {
      step: '03',
      title: 'Hot Delivery',
      desc: 'Freshly prepared and packaged in insulated, leak-proof party boxes, delivered piping hot to your Jalandhar event.',
      icon: 'fa-truck-loading'
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen pb-24 overflow-hidden relative z-10 bg-cream-bg text-charcoal transition-colors duration-500">
      
      {/* Ambient background decoration shapes */}
      <div className="absolute right-[-10%] top-[5%] w-96 h-96 opacity-[0.03] pointer-events-none float-animation">
        <i className="fas text-[14rem] fa-hamburger" style={{ color: ACCENT_COLOR }}></i>
      </div>
      <div className="absolute left-[-5%] top-[40%] w-72 h-72 opacity-[0.02] pointer-events-none float-animation" style={{ animationDelay: '-3s' }}>
        <i className="fas text-[10rem] fa-fire" style={{ color: BRAND_COLOR }}></i>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 md:pt-28 md:pb-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span 
            className="inline-flex items-center py-1.5 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest mb-6 border shadow-sm bg-brand-primary/5 text-brand-primary border-accent-gold/40"
            style={{ color: BRAND_COLOR }}
          >
            Hot, Cheesy, Tailored
          </span>
          
          <h1 className="text-4xl md:text-7.5xl font-black mb-6 tracking-tight font-serif-heading leading-none text-charcoal">
            Your Feast, <br />
            <span 
              className="inline-block text-transparent bg-clip-text pb-2 mt-2"
              style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_COLOR} 30%, ${ACCENT_COLOR} 100%)`, WebkitBackgroundClip: 'text' }}
            >
              Our Expertise
            </span>
          </h1>
          
          <div className="w-12 h-0.5 bg-accent-gold mx-auto mb-6"></div>
          
          <p className="font-semibold text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 text-charcoal/60">
            Celebrate your group hangouts, birthdays, and parties in Jalandhar with our premium vegetarian fast food platters, tailored to satisfy your entire crew.
          </p>
          
          <button 
            onClick={handleCustomOrder}
            className="group inline-flex items-center gap-3 px-8 py-4 text-white font-extrabold rounded-2xl shimmer-btn shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer text-xs uppercase tracking-widest"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            <i className="fab fa-whatsapp text-lg text-green-400"></i>
            <span>Consult Catering Studio</span>
            <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1.5 transition-transform"></i>
          </button>
        </div>
      </section>

      {/* Interactive Custom Builder Section */}
      <section className="max-w-5xl mx-auto px-4 py-10 relative z-20">
        <div className="rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-xl border relative overflow-hidden bg-cream-light border-accent-gold/25 transition-colors duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(#D9B382_1px,transparent_1px)] [background-size:28px_28px] opacity-10"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Designer selectors */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark mb-1 block">Interactive Builder</span>
                <h2 className="text-2xl sm:text-3xl font-black font-serif-heading text-charcoal">
                  Configure Your Party Combo
                </h2>
                <div className="w-8 h-0.5 bg-accent-gold mt-3"></div>
              </div>

              {/* Selector 1: Platter / Structure */}
              <div className="space-y-3">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-charcoal/40">
                  1. Base Fast Food Platter
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OPTIONS_1.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setOption1(opt.name)}
                      className={`p-4 rounded-2xl text-left transition-all border shadow-sm cursor-pointer flex gap-3 items-start relative group ${
                        option1 === opt.name
                          ? 'text-white border-transparent'
                          : 'bg-[#FAF6F0] text-charcoal border-accent-gold/20 hover:border-brand-primary'
                      }`}
                      style={{ backgroundColor: option1 === opt.name ? BRAND_COLOR : undefined }}
                    >
                      <span className="text-2xl pt-0.5 select-none">{opt.emoji}</span>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-xs tracking-wide uppercase">{opt.name}</h4>
                        <p className={`text-[10px] font-medium leading-relaxed mt-1 ${option1 === opt.name ? 'text-white/80' : 'text-charcoal/50'}`}>{opt.desc}</p>
                      </div>
                      <span className={`absolute top-3 right-3 text-xs font-bold font-sans ${option1 === opt.name ? 'text-white' : 'text-charcoal/80'}`}>₹{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: Theme / Drinks */}
              <div className="space-y-3">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-charcoal/40">
                  2. Marine Drink Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OPTIONS_2.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setOption2(opt.name)}
                      className={`p-4 rounded-2xl text-left transition-all border shadow-sm cursor-pointer flex gap-3 items-start relative group ${
                        option2 === opt.name
                          ? 'text-white border-transparent'
                          : 'bg-[#FAF6F0] text-charcoal border-accent-gold/20 hover:border-brand-primary'
                      }`}
                      style={{ backgroundColor: option2 === opt.name ? BRAND_COLOR : undefined }}
                    >
                      <span className="text-2xl pt-0.5 select-none">{opt.emoji}</span>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-xs tracking-wide uppercase">{opt.name}</h4>
                        <p className={`text-[10px] font-medium leading-relaxed mt-1 ${option2 === opt.name ? 'text-white/80' : 'text-charcoal/50'}`}>{opt.desc}</p>
                      </div>
                      <span className={`absolute top-3 right-3 text-xs font-bold font-sans ${option2 === opt.name ? 'text-white' : 'text-charcoal/80'}`}>₹{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 3: Flavor / Add-ons */}
              <div className="space-y-3">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-charcoal/40">
                  3. Hot Sides & Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {OPTIONS_3.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setOption3(opt.name)}
                      className={`p-4 rounded-2xl text-left transition-all border shadow-sm cursor-pointer flex gap-3 items-start relative group ${
                        option3 === opt.name
                          ? 'text-white border-transparent'
                          : 'bg-[#FAF6F0] text-charcoal border-accent-gold/20 hover:border-brand-primary'
                      }`}
                      style={{ backgroundColor: option3 === opt.name ? BRAND_COLOR : undefined }}
                    >
                      <span className="text-2xl pt-0.5 select-none">{opt.emoji}</span>
                      <div className="flex-1">
                        <h4 className="font-extrabold text-xs tracking-wide uppercase">{opt.name}</h4>
                        <p className={`text-[10px] font-medium leading-relaxed mt-1 ${option3 === opt.name ? 'text-white/80' : 'text-charcoal/50'}`}>{opt.desc}</p>
                      </div>
                      <span className={`absolute top-3 right-3 text-xs font-bold font-sans ${option3 === opt.name ? 'text-white' : 'text-charcoal/80'}`}>₹{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Simulated Paper Ticket */}
            <div className="lg:col-span-5 flex flex-col h-full justify-between relative">
              
              <div className="bg-white text-charcoal rounded-3xl p-6 sm:p-8 border border-neutral-300 shadow-xl flex flex-col justify-between flex-grow relative overflow-hidden font-mono min-h-[360px]">
                
                {/* Dotted Paper Tear Header */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-neutral-200 flex justify-between overflow-hidden">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-[#FAF6F0] -translate-y-1.5 flex-shrink-0"></div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <div className="text-center border-b border-dashed border-neutral-400 pb-4 mb-4">
                    <h3 className="font-black uppercase tracking-wider text-sm">The Burger Bro</h3>
                    <p className="text-[8px] font-bold tracking-widest uppercase mt-0.5">JALANDHAR KITCHEN</p>
                    <p className="text-[7px] font-semibold opacity-60 mt-1">ORDER ID: #GF-BURGER-{currentYear}</p>
                  </div>
                  
                  <div className="space-y-4 text-xs font-semibold">
                    <div className="flex justify-between items-start gap-3">
                      <span>BASE: {option1}</span>
                      <span className="shrink-0">₹{item1.price}.00</span>
                    </div>
                    <div className="flex justify-between items-start gap-3">
                      <span>DRINK: {option2}</span>
                      <span className="shrink-0">₹{item2.price}.00</span>
                    </div>
                    <div className="flex justify-between items-start gap-3 border-b border-dashed border-neutral-300 pb-4">
                      <span>ADDON: {option3}</span>
                      <span className="shrink-0">₹{item3.price}.00</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-dashed border-neutral-400 pt-4">
                  <div className="flex justify-between items-center text-sm font-black mb-6">
                    <span className="uppercase tracking-wider">TOTAL ESTIMATED</span>
                    <span className="text-lg">₹{estimatedTotal}.00</span>
                  </div>

                  <button
                    onClick={handleCompileDesignOrder}
                    className="w-full py-3.5 bg-[#25D366] text-white font-extrabold rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all cursor-pointer shadow-md hover:shadow-lg text-xs uppercase tracking-wider font-sans border-0"
                  >
                    <i className="fab fa-whatsapp text-base"></i>
                    <span>Send Catering Receipt</span>
                  </button>
                  <p className="text-[7px] font-semibold text-center opacity-40 mt-3 uppercase tracking-wider select-none">TERMS: final confirmation on WhatsApp call</p>
                </div>
                
                {/* Dotted Paper Tear Footer */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-neutral-200 flex justify-between overflow-hidden">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-[#FAF6F0] translate-y-1.5 flex-shrink-0"></div>
                  ))}
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </section>

      {/* Connected Pathway Stepper timeline */}
      <section className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark block mb-2">Our Method</span>
          <h3 className="text-2xl sm:text-3xl font-black text-charcoal font-serif-heading">
            The Catering Process
          </h3>
          <div className="w-8 h-0.5 bg-accent-gold mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative">
          
          {/* Timeline Path line connection (Desktop Only) */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-accent-gold/20 -z-10"></div>

          {STEPS.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-base border-2 shadow-md relative z-10"
                style={{ backgroundColor: BRAND_COLOR, borderColor: ACCENT_COLOR }}
              >
                {step.step}
              </div>

              <h4 className="text-base sm:text-lg font-black text-charcoal font-serif-heading pt-1">{step.title}</h4>
              <p className="text-xs sm:text-sm leading-relaxed font-semibold max-w-xs text-charcoal/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Plaque */}
      <section className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <div className="bg-charcoal rounded-[2rem] overflow-hidden relative border border-accent-gold/20 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(#D9B382_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold mb-3">
                Catering Capabilities
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight font-serif-heading">
                Any Volume. <br />
                Any Combo. <br />
                Any Event.
              </h2>
              <ul className="space-y-4 mb-10 text-white">
                {['Hot-box delivery for up to 100 guests', 'Live Counter setup available', 'Custom mocktail bar setup options', 'Tailored spice profiles per plate'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80 font-bold text-xs uppercase tracking-wider">
                    <i className="fas fa-check-circle text-accent-gold"></i>
                    {item}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={handleCustomOrder}
                className="w-full sm:w-max px-8 py-4 bg-cream-light text-charcoal font-bold rounded-xl hover:bg-[#FDFBF8] transition-colors flex items-center justify-center gap-3 shadow-lg border border-accent-gold/30 cursor-pointer text-xs uppercase tracking-widest"
              >
                Get a Quote
              </button>
            </div>
            
            <div 
              className="relative min-h-[300px] flex items-center justify-center overflow-hidden border-t lg:border-t-0 lg:border-l border-accent-gold/15 bg-gradient-to-br from-brand-plum-dark/40 to-accent-gold/10"
            >
              <i className="text-[12rem] text-white/[0.02] absolute animate-pulse fas fa-pizza-slice"></i>
              <div className="relative z-10 text-center p-8">
                 <div className="bg-cream-light/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl max-w-sm">
                    <p className="text-white/90 font-bold italic leading-relaxed text-sm sm:text-base">
                      "We ordered 50 slider boxes and mocktail pitchers for our house party. Everything was delivered piping hot, crisp, and was highly praised by all guests!"
                    </p>
                    <p className="text-xs uppercase tracking-wider mt-5 font-extrabold" style={{ color: ACCENT_COLOR }}>
                      - House Party Host, Jalandhar
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines Note plaques */}
      <section className="max-w-3xl mx-auto px-4 py-8 relative z-10 text-center">
        <h3 className="text-xl sm:text-2xl font-black mb-6 font-serif-heading text-charcoal">Catering Guidelines</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-3" style={{ color: BRAND_COLOR, backgroundColor: `${BRAND_COLOR}0A`, borderColor: `${BRAND_COLOR}20` }}>
            <i className="fas fa-calendar-check text-base text-accent-gold-dark shrink-0"></i>
            <span>Please book larger catering orders at least <strong className="font-extrabold">12 to 24 hours</strong> in advance to ensure fresh prep.</span>
          </div>
          <div 
            className="p-4 sm:p-5 rounded-2xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-3 text-charcoal/80"
            style={{ backgroundColor: `${ACCENT_COLOR}15`, borderColor: `${ACCENT_COLOR}35` }}
          >
            <i className="fas fa-truck text-base text-accent-gold-dark shrink-0"></i>
            <span>Delivered in heavy-duty food warming boxes directly within Jalandhar limits.</span>
          </div>
        </div>
      </section>

    </div>
  );
}
