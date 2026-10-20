'use client';
import { useState } from 'react';

export default function BurgerPartyOrdersView() {
  const WHATSAPP_NUMBER = '918146767522';
  const BRAND_COLOR = 'var(--brand-primary)'; 
  const ACCENT_COLOR = 'var(--brand-accent)';

  // Guided wizard step state: 1 -> 2 -> 3
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Table / Gathering Size (Pills + Custom Input)
  const [selectedPartySize, setSelectedPartySize] = useState('Table of 8 - 12');
  const [customPartySize, setCustomPartySize] = useState('');
  const [diningStyle, setDiningStyle] = useState('Party Delivery at Home/Venue');

  // 2. Mains & Fast Food Courses (MULTI-SELECT with Quantities / Portions)
  const [selectedMains, setSelectedMains] = useState<string[]>([
    'Flame-Grilled Sliders Box',
    'Loaded Sourdough Pizzas'
  ]);
  const [customMain, setCustomMain] = useState('');

  // 3. Sides & Starters (MULTI-SELECT)
  const [selectedSides, setSelectedSides] = useState<string[]>([
    'Peri-Peri Crispy Fries Platter'
  ]);
  const [customSide, setCustomSide] = useState('');

  // 4. Marine Drinks & Shakes (MULTI-SELECT)
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([
    'Blue Lagoon Sparkling Pitcher'
  ]);
  const [customDrink, setCustomDrink] = useState('');

  // 5. Chef instructions, spice preference, date & time
  const [spicePreference, setSpicePreference] = useState('Medium Spicy');
  const [deliverySlot, setDeliverySlot] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [kitchenInstructions, setKitchenInstructions] = useState('');

  // Table / Gathering presets
  const PARTY_SIZE_PRESETS = [
    { label: 'Small Crew (4 - 6)', desc: 'Quick gang hangout or family treat' },
    { label: 'Table of 8 - 12', desc: 'Birthday celebration or game night' },
    { label: 'Big Table (15 - 25)', desc: 'Office team feast or party' },
    { label: 'Grand Party (30 - 50+)', desc: 'Large gathering / reunion feast' }
  ];

  const DINING_STYLES = [
    'Party Delivery at Home/Venue',
    'Pre-Order Takeaway / Pickup',
    'Bulk Catering Setup'
  ];

  const MAIN_COURSES = [
    { name: 'Flame-Grilled Sliders Box', desc: 'Mini gourmet veg cheese burgers with hot crisp buns', icon: 'fa-burger' },
    { name: 'Loaded Sourdough Pizzas', desc: 'Assorted medium sourdough pizzas with double melted mozzarella', icon: 'fa-pizza-slice' },
    { name: 'Grilled Multi-Decker Club Sandwiches', desc: 'Toasted triple-layer cheese club sandwich platters', icon: 'fa-bread-slice' },
    { name: 'Wok Street Hakka Noodles Tub', desc: 'Tossed Szechuan veggies, scallions, and spicy street noodles', icon: 'fa-bowl-rice' },
    { name: 'Crispy Veggie Sliders & Rolls', desc: 'Crispy paneer wraps & mini toasted bun rolls', icon: 'fa-hotdog' }
  ];

  const SIDES_STARTERS = [
    { name: 'Peri-Peri Crispy Fries Platter', desc: 'Jumbo tub of golden salted fries tossed in fiery peri-peri' },
    { name: 'Cheesy Garlic Bread Toasties', desc: 'Buttery toasted baguettes melted with herb mozzarella' },
    { name: 'Spicy Potato Wedges & Jalapeno Dip', desc: 'Seasoned potato wedges paired with creamy chipotle relish' },
    { name: 'Crispy Veg Spring Rolls Tub', desc: 'Crisp hand-rolled cabbage & sprout rolls with chili dip' }
  ];

  const DRINKS_COOLERS = [
    { name: 'Blue Lagoon Sparkling Pitcher', desc: 'Oceanic citrus Curacao soda chilled on crushed mint & ice' },
    { name: 'Fresh Mint Lime Mojito Dispenser', desc: 'Zesty muddled lime, mint leaves, and sweet cane cooler' },
    { name: 'Tangy Masala Street Soda Tub', desc: 'Desi spiced carbonated refresher with chaat masala kick' },
    { name: 'Iced Peach Lemonade Box', desc: 'Chilled sweet peach iced tea & sparkling lemonade' }
  ];

  const SPICE_OPTIONS = ['Mild / Zero Chili', 'Medium Spicy', 'Extra Spicy Hot', 'Spicy on the Side'];

  // Toggle multi-select
  const toggleSelection = (list: string[], setList: (items: string[]) => void, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter(i => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const effectivePartySize = selectedPartySize === 'Custom'
    ? (customPartySize.trim() ? `${customPartySize.trim()} (Custom Count)` : 'Custom Count')
    : selectedPartySize;

  const allMains = [...selectedMains];
  if (customMain.trim() && !allMains.includes(customMain.trim())) {
    allMains.push(`${customMain.trim()} (Custom)`);
  }

  const allSides = [...selectedSides];
  if (customSide.trim() && !allSides.includes(customSide.trim())) {
    allSides.push(`${customSide.trim()} (Custom)`);
  }

  const allDrinks = [...selectedDrinks];
  if (customDrink.trim() && !allDrinks.includes(customDrink.trim())) {
    allDrinks.push(`${customDrink.trim()} (Custom)`);
  }

  const handleSendToWhatsApp = () => {
    let msg = `*Captain Order Ticket (Bulk Party Feast) - The Burger Bro*\n\n`;
    msg += `📋 *Party Scale:* ${effectivePartySize}\n`;
    msg += `📍 *Order Type:* ${diningStyle}\n\n`;

    msg += `🍔 *Main Courses Ordered (${allMains.length}):*\n`;
    allMains.forEach(m => { msg += `  • ${m}\n`; });

    if (allSides.length > 0) {
      msg += `\n🍟 *Sides & Munchies (${allSides.length}):*\n`;
      allSides.forEach(s => { msg += `  • ${s}\n`; });
    }

    if (allDrinks.length > 0) {
      msg += `\n🥤 *Beverages & Coolers (${allDrinks.length}):*\n`;
      allDrinks.forEach(d => { msg += `  • ${d}\n`; });
    }

    msg += `\n🌶️ *Kitchen Spice Level:* ${spicePreference}\n`;

    if (eventDate) {
      msg += `📅 *Date of Event:* ${eventDate}\n`;
    }
    if (deliverySlot.trim()) {
      msg += `⏰ *Serving / Delivery Time:* ${deliverySlot.trim()}\n`;
    }
    if (kitchenInstructions.trim()) {
      msg += `👨‍🍳 *Special Instructions:* "${kitchenInstructions.trim()}"\n`;
    }

    msg += `\n*Kitchen Note:* 100% Vegetarian Fast Food kitchen.\n`;
    msg += `Please confirm table order availability and final bill estimate!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDirectWhatsAppConsult = () => {
    const msg = `Hi The Burger Bro,\n\nI want to place a bulk fast food order for my group. Can you please share combos and quote pricing?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-24 overflow-hidden relative z-10 bg-cream-bg text-charcoal">
      
      {/* Ambient background decoration */}
      <div className="absolute right-[-10%] top-[5%] w-96 h-96 opacity-[0.03] pointer-events-none float-animation">
        <i className="fas text-[14rem] fa-hamburger" style={{ color: ACCENT_COLOR }}></i>
      </div>
      <div className="absolute left-[-5%] top-[40%] w-72 h-72 opacity-[0.02] pointer-events-none float-animation" style={{ animationDelay: '-3s' }}>
        <i className="fas text-[10rem] fa-fire" style={{ color: BRAND_COLOR }}></i>
      </div>

      {/* Hero Header */}
      <section className="relative pt-12 pb-8 md:pt-20 md:pb-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-extrabold text-[10px] sm:text-xs uppercase tracking-widest mb-5 border shadow-xs"
            style={{ 
              backgroundColor: 'rgba(230, 57, 70, 0.08)',
              color: 'var(--brand-primary)',
              borderColor: 'rgba(251, 133, 0, 0.35)'
            }}
          >
            <i className="fas fa-clipboard-list text-xs"></i>
            <span>Party Platter Order Pad • 100% Veg Grill</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5.5xl font-black mb-4 tracking-tight font-serif-heading text-charcoal leading-tight">
            Take Your Table Order, <br className="hidden sm:inline" />
            <span 
              className="text-transparent bg-clip-text pb-1 inline-block"
              style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_COLOR} 30%, ${ACCENT_COLOR} 100%)` }}
            >
              The Burger Bro Style
            </span>
          </h1>

          <p className="font-semibold text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed text-charcoal/65 mb-6">
            Build your crew&apos;s feast ticket step-by-step. Pick your party size, stack multiple burgers, sourdough pizzas, sides, and marine sodas, then send your order straight to the kitchen counter.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={handleDirectWhatsAppConsult}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-accent-gold/30 text-charcoal font-bold text-xs uppercase tracking-wider shadow-xs hover:border-brand-primary cursor-pointer transition-all"
            >
              <i className="fab fa-whatsapp text-emerald-600 text-sm"></i>
              <span>Talk Directly to Captain</span>
            </button>
            <span className="text-[11px] font-semibold text-charcoal/50">or fill the kitchen order pad below 👇</span>
          </div>
        </div>
      </section>

      {/* Stepper Navigation */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="bg-cream-light border border-accent-gold/25 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-2">
          
          {/* Step 1 Button */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStep === 1 
                ? 'text-white shadow-xs' 
                : 'text-charcoal/70 hover:bg-black/5'
            }`}
            style={{ backgroundColor: currentStep === 1 ? 'var(--brand-primary)' : undefined }}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
              currentStep === 1 ? 'bg-accent-gold text-charcoal' : 'bg-charcoal/10 text-charcoal'
            }`}>1</span>
            <span className="hidden sm:inline truncate">Table Size & Setup</span>
            <span className="sm:hidden">Table</span>
          </button>

          <i className="fas fa-chevron-right text-[10px] text-accent-gold-dark/60 shrink-0"></i>

          {/* Step 2 Button */}
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStep === 2 
                ? 'text-white shadow-xs' 
                : 'text-charcoal/70 hover:bg-black/5'
            }`}
            style={{ backgroundColor: currentStep === 2 ? 'var(--brand-primary)' : undefined }}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
              currentStep === 2 ? 'bg-accent-gold text-charcoal' : 'bg-charcoal/10 text-charcoal'
            }`}>2</span>
            <span className="hidden sm:inline truncate">Mains & Starters</span>
            <span className="sm:hidden">Dishes</span>
          </button>

          <i className="fas fa-chevron-right text-[10px] text-accent-gold-dark/60 shrink-0"></i>

          {/* Step 3 Button */}
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStep === 3 
                ? 'text-white shadow-xs' 
                : 'text-charcoal/70 hover:bg-black/5'
            }`}
            style={{ backgroundColor: currentStep === 3 ? 'var(--brand-primary)' : undefined }}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
              currentStep === 3 ? 'bg-accent-gold text-charcoal' : 'bg-charcoal/10 text-charcoal'
            }`}>3</span>
            <span className="hidden sm:inline truncate">Drinks & Kitchen Ticket</span>
            <span className="sm:hidden">Ticket</span>
          </button>

        </div>
      </div>

      {/* Main Interactive Wizard Box */}
      <section className="max-w-4xl mx-auto px-4 relative z-20">
        <div className="rounded-3xl p-6 sm:p-10 shadow-xl border bg-cream-light border-accent-gold/30">
          
          {/* ================= STEP 1: PARTY / TABLE SIZE ================= */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-accent-gold/20 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark block mb-1">
                  Step 1 of 3 • Table Setup
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-serif-heading text-charcoal">
                  Select Your Gathering Scale
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 font-medium mt-1">
                  Tell the kitchen how large your table or gathering is so portions can be arranged accordingly.
                </p>
              </div>

              {/* Table Size Presets */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-charcoal/80 mb-3">
                  Table / Group Size
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3.5">
                  {PARTY_SIZE_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setSelectedPartySize(p.label);
                        setCustomPartySize('');
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedPartySize === p.label
                          ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/30'
                          : 'bg-[#FAF6F0] border-accent-gold/25 hover:border-brand-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-black text-charcoal">{p.label}</span>
                        <i className={`fas ${selectedPartySize === p.label ? 'fa-check-circle text-brand-primary' : 'fa-circle text-charcoal/20'}`}></i>
                      </div>
                      <p className="text-[11px] text-charcoal/60 font-medium leading-relaxed">{p.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Custom Headcount Input */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-accent-gold/25 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-extrabold text-charcoal shrink-0 flex items-center gap-2">
                    <i className="fas fa-pencil text-brand-primary text-xs"></i>
                    <span>Or Specify Exact Group Size:</span>
                  </span>
                  <input 
                    type="text"
                    placeholder="e.g. 18 friends, 35 office colleagues, 60 people..."
                    value={customPartySize}
                    onChange={(e) => {
                      setCustomPartySize(e.target.value);
                      setSelectedPartySize('Custom');
                    }}
                    className="flex-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-accent-gold/30 outline-none focus:border-brand-primary text-charcoal"
                  />
                  {customPartySize && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Custom: {customPartySize}
                    </span>
                  )}
                </div>
              </div>

              {/* Order / Dining Style */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-charcoal/80 mb-2.5">
                  Order Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DINING_STYLES.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setDiningStyle(style)}
                      className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        diningStyle === style
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary font-black'
                          : 'bg-[#FAF6F0] border-accent-gold/25 text-charcoal/70 hover:border-brand-primary'
                      }`}
                    >
                      <span>{style}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kitchen Spice Preference */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-charcoal/80 mb-2.5">
                  Spice Level For The Order
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SPICE_OPTIONS.map((spice) => (
                    <button
                      key={spice}
                      type="button"
                      onClick={() => setSpicePreference(spice)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        spicePreference === spice
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary font-black'
                          : 'bg-[#FAF6F0] border-accent-gold/25 text-charcoal/70 hover:border-brand-primary'
                      }`}
                    >
                      <i className={`fas fa-fire mr-1 text-[11px] ${spice === 'Extra Spicy Hot' ? 'text-red-600' : 'text-amber-500'}`}></i>
                      <span>{spice}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1 Footer */}
              <div className="flex justify-end pt-4 border-t border-accent-gold/15">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:brightness-110"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <span>Select Food Items</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: MAINS & STARTERS (MULTI-SELECT) ================= */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-accent-gold/20 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark block mb-1">
                    Step 2 of 3 • Table Order Pad
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedMains.length + selectedSides.length} Dishes Selected
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-serif-heading text-charcoal">
                  Add Your Dishes to the Ticket
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 font-medium mt-1">
                  Just like ordering at the counter, select multiple dishes for your table platter.
                </p>
              </div>

              {/* 2A. Primary Fast Food Courses */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-charcoal/80 flex items-center gap-2">
                    <span>1. Main Fast Food Courses</span>
                    <span className="text-[10px] font-bold text-accent-gold-dark lowercase">(tap to select multiple)</span>
                  </label>
                  <span className="text-[11px] font-bold text-charcoal/50">
                    {selectedMains.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {MAIN_COURSES.map((m) => {
                    const isChecked = selectedMains.includes(m.name);
                    return (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => toggleSelection(selectedMains, setSelectedMains, m.name)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isChecked
                            ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/30'
                            : 'bg-[#FAF6F0] border-accent-gold/25 hover:border-brand-primary'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <i className={`fas ${m.icon} text-brand-primary text-base`}></i>
                            <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-black ${
                              isChecked ? 'bg-brand-primary text-white' : 'border border-charcoal/20 bg-white'
                            }`}>
                              {isChecked ? '✓' : ''}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-xs text-charcoal mb-1">
                            {m.name}
                          </h4>
                          <p className="text-[10px] text-charcoal/60 leading-relaxed font-medium">
                            {m.desc}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-accent-gold/15 text-[10px] font-bold">
                          <span className={isChecked ? 'text-brand-primary' : 'text-charcoal/40'}>
                            {isChecked ? '✓ Added to Ticket' : '+ Add Dish'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Dish Write-In */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-accent-gold/25 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-extrabold text-charcoal shrink-0 flex items-center gap-2">
                    <i className="fas fa-plus text-brand-primary text-xs"></i>
                    <span>Special Main Dish Request:</span>
                  </span>
                  <input 
                    type="text"
                    placeholder="e.g. Cheese Burst Calzones, Corn Tacos, Szechuan Fried Rice..."
                    value={customMain}
                    onChange={(e) => setCustomMain(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-accent-gold/30 outline-none focus:border-brand-primary text-charcoal"
                  />
                  {customMain && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Added: {customMain}
                    </span>
                  )}
                </div>
              </div>

              {/* 2B. Sides & Starters */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-charcoal/80 flex items-center gap-2">
                    <span>2. Sides & Starters</span>
                    <span className="text-[10px] font-bold text-accent-gold-dark lowercase">(optional, select multiple)</span>
                  </label>
                  <span className="text-[11px] font-bold text-charcoal/50">
                    {selectedSides.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {SIDES_STARTERS.map((s) => {
                    const isChecked = selectedSides.includes(s.name);
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => toggleSelection(selectedSides, setSelectedSides, s.name)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isChecked
                            ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/30'
                            : 'bg-[#FAF6F0] border-accent-gold/25 hover:border-brand-primary'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-extrabold text-xs text-charcoal">
                              {s.name}
                            </h4>
                            <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-black shrink-0 ml-1.5 ${
                              isChecked ? 'bg-brand-primary text-white' : 'border border-charcoal/20 bg-white'
                            }`}>
                              {isChecked ? '✓' : ''}
                            </span>
                          </div>
                          <p className="text-[10px] text-charcoal/60 leading-relaxed font-medium">
                            {s.desc}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-1.5 border-t border-accent-gold/15 text-[10px] font-bold">
                          <span className={isChecked ? 'text-brand-primary' : 'text-charcoal/40'}>
                            {isChecked ? '✓ Added' : '+ Add Starter'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Side Write-In */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-accent-gold/25 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-extrabold text-charcoal shrink-0 flex items-center gap-2">
                    <i className="fas fa-plus text-brand-primary text-xs"></i>
                    <span>Other Starter or Dip:</span>
                  </span>
                  <input 
                    type="text"
                    placeholder="e.g. Extra Chipotle Dip Tub, Cheese Poppers, Nachos Bowl..."
                    value={customSide}
                    onChange={(e) => setCustomSide(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-accent-gold/30 outline-none focus:border-brand-primary text-charcoal"
                  />
                  {customSide && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Added: {customSide}
                    </span>
                  )}
                </div>
              </div>

              {/* Step 2 Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-accent-gold/15">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-accent-gold/30 text-charcoal font-bold text-xs uppercase tracking-wider hover:bg-black/5 transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:brightness-110"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  <span>Pick Drinks & Ticket</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: DRINKS, SCHEDULE & KITCHEN TICKET ================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-accent-gold/20 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark block mb-1">
                  Step 3 of 3 • Drinks & Final Order Pad
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-serif-heading text-charcoal">
                  Add Marine Drinks & Confirm Ticket
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 font-medium mt-1">
                  Pick your beverages and set serving time before handing the ticket to the kitchen on WhatsApp.
                </p>
              </div>

              {/* Drinks Grid */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-charcoal/80 mb-2.5">
                  Party Drinks & Coolers (Select Multiple)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {DRINKS_COOLERS.map((d) => {
                    const isChecked = selectedDrinks.includes(d.name);
                    return (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => toggleSelection(selectedDrinks, setSelectedDrinks, d.name)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isChecked
                            ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/30'
                            : 'bg-[#FAF6F0] border-accent-gold/25 hover:border-brand-primary'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-extrabold text-xs text-charcoal">
                              {d.name}
                            </h4>
                            <span className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[9px] font-black shrink-0 ml-1.5 ${
                              isChecked ? 'bg-brand-primary text-white' : 'border border-charcoal/20 bg-white'
                            }`}>
                              {isChecked ? '✓' : ''}
                            </span>
                          </div>
                          <p className="text-[10px] text-charcoal/60 leading-relaxed font-medium">
                            {d.desc}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-1.5 border-t border-accent-gold/15 text-[10px] font-bold">
                          <span className={isChecked ? 'text-brand-primary' : 'text-charcoal/40'}>
                            {isChecked ? '✓ Added' : '+ Add Drink'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Drink Write-In */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-accent-gold/25 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-extrabold text-charcoal shrink-0 flex items-center gap-2">
                    <i className="fas fa-wine-glass text-brand-primary text-xs"></i>
                    <span>Custom Shake / Beverage:</span>
                  </span>
                  <input 
                    type="text"
                    placeholder="e.g. Cold Coffee Dispenser, Oreo Shakes Tub, Chocolate Thickshakes..."
                    value={customDrink}
                    onChange={(e) => setCustomDrink(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-accent-gold/30 outline-none focus:border-brand-primary text-charcoal"
                  />
                  {customDrink && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Added: {customDrink}
                    </span>
                  )}
                </div>
              </div>

              {/* Event Date, Slot & Kitchen Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-charcoal/70 mb-1.5">
                    Order / Party Date
                  </label>
                  <input 
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-accent-gold/30 bg-[#FAF6F0] text-xs font-semibold text-charcoal outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-charcoal/70 mb-1.5">
                    Desired Serving Time
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 7:30 PM, Lunch Slot 1:00 PM..."
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-accent-gold/30 bg-[#FAF6F0] text-xs font-semibold text-charcoal outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-charcoal/70 mb-1.5">
                  Special Kitchen Notes (Allergies, Extra Cheese, Packaging)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Extra mayo packets, no onions in burgers, pack drinks separately..."
                  value={kitchenInstructions}
                  onChange={(e) => setKitchenInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-accent-gold/30 bg-[#FAF6F0] text-xs font-semibold text-charcoal outline-none focus:border-brand-primary"
                />
              </div>

              {/* Waiter / Captain Style Ticket Summary Card */}
              <div className="mt-6 rounded-2xl bg-white border border-dashed border-charcoal/20 p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-dashed border-charcoal/20 pb-4 mb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary block">
                      Captain&apos;s Order Pad • The Burger Bro
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-charcoal font-serif-heading">
                      {effectivePartySize} • {diningStyle}
                    </h3>
                    <div className="text-xs text-charcoal/80 font-medium space-y-1 pt-1.5">
                      <p>🍔 <strong>Mains:</strong> {allMains.join(', ')}</p>
                      {allSides.length > 0 && <p>🍟 <strong>Starters:</strong> {allSides.join(', ')}</p>}
                      {allDrinks.length > 0 && <p>🥤 <strong>Drinks:</strong> {allDrinks.join(', ')}</p>}
                      <p>🌶️ <strong>Spice:</strong> {spicePreference}</p>
                      {eventDate && <p>📅 <strong>Date:</strong> {eventDate} {deliverySlot ? `(${deliverySlot})` : ''}</p>}
                      {kitchenInstructions && <p>👨‍🍳 <strong>Kitchen Note:</strong> &quot;{kitchenInstructions}&quot;</p>}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                      <i className="fab fa-whatsapp text-xs"></i>
                      <span>Kitchen Price on WhatsApp</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSendToWhatsApp}
                    className="w-full sm:flex-1 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <i className="fab fa-whatsapp text-lg"></i>
                    <span>Punch Table Order to Kitchen on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-accent-gold/30 text-charcoal font-bold text-xs uppercase tracking-wider hover:bg-black/5 transition-all cursor-pointer"
                  >
                    Modify
                  </button>
                </div>
                <p className="text-[10px] text-center text-charcoal/50 font-semibold mt-3">
                  🔥 Order is packaged hot in thermal food boxes to maintain fresh crunch & warmth!
                </p>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* Trust Highlights */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-cream-light border border-accent-gold/25 text-center">
            <i className="fas fa-fire-burner text-amber-600 text-lg mb-2 block"></i>
            <h4 className="font-extrabold text-xs text-charcoal uppercase tracking-wider mb-1">Piping Hot Delivery</h4>
            <p className="text-[11px] text-charcoal/60 font-medium">Delivered directly in thermal foil party boxes so your burgers and fries stay crunchy.</p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-light border border-accent-gold/25 text-center">
            <i className="fas fa-leaf text-emerald-700 text-lg mb-2 block"></i>
            <h4 className="font-extrabold text-xs text-charcoal uppercase tracking-wider mb-1">100% Veg Kitchen</h4>
            <p className="text-[11px] text-charcoal/60 font-medium">Pure vegetarian oil, fresh vegetables, daily baked buns, and real mozzarella cheese.</p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-light border border-accent-gold/25 text-center">
            <i className="fas fa-clipboard-check text-brand-primary text-lg mb-2 block"></i>
            <h4 className="font-extrabold text-xs text-charcoal uppercase tracking-wider mb-1">Tailored Combos</h4>
            <p className="text-[11px] text-charcoal/60 font-medium">From casual group hangouts to large office parties, combos tailored with zero hassle.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
