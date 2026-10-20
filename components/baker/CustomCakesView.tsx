'use client';
import { useState } from 'react';

export default function BakerCustomCakesView() {
  const WHATSAPP_NUMBER = '918146767522';
  const BRAND_COLOR = '#7A1A40'; // Baker Plum
  const ACCENT_COLOR = 'var(--brand-accent)';

  // Guided wizard step state: 1 -> 2 -> 3
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Weight & Portion States (Pills + Custom Input)
  const [selectedWeight, setSelectedWeight] = useState('1 Kg');
  const [customWeight, setCustomWeight] = useState('');
  const [selectedTiers, setSelectedTiers] = useState('Single Tier');

  // 2. Shape Selection (Pills + Custom Input)
  const [selectedShape, setSelectedShape] = useState('Classic Round');
  const [customShape, setCustomShape] = useState('');

  // 3. Flavor Selection (Pills + Custom Input)
  const [selectedFlavor, setSelectedFlavor] = useState('Belgian Chocolate Truffle');
  const [customFlavor, setCustomFlavor] = useState('');

  // 4. Theme & Event Details
  const [selectedTheme, setSelectedTheme] = useState('Minimalist Gold Foil');
  const [customTheme, setCustomTheme] = useState('');
  const [cakeMessage, setCakeMessage] = useState('');
  const [occasionDate, setOccasionDate] = useState('');

  // Presets for quick selection
  const WEIGHT_PRESETS = [
    { label: '0.5 Kg', serves: '3 - 4 guests' },
    { label: '1 Kg', serves: '6 - 8 guests' },
    { label: '1.5 Kg', serves: '10 - 12 guests' },
    { label: '2 Kg', serves: '14 - 18 guests' },
    { label: '3 Kg', serves: '20 - 25 guests' },
    { label: '4+ Kg (Grand)', serves: '30+ guests' }
  ];

  const TIER_OPTIONS = ['Single Tier', '2 Tiers', '3 Tiers', 'Tall / Bento Style'];

  const SHAPE_PRESETS = [
    { name: 'Classic Round', icon: 'fa-circle', desc: 'Timeless round shape with smooth finish' },
    { name: 'Heart Shaped', icon: 'fa-heart', desc: 'Romantic silhouette contoured to perfection' },
    { name: 'Square / Geometric', icon: 'fa-square', desc: 'Modern sharp corners & clean borders' },
    { name: 'Number / Alphabet Cut', icon: 'fa-hashtag', desc: 'Custom shaped like age or initials (e.g. 25, S)' },
    { name: 'Multi-Tier Sculpted', icon: 'fa-crown', desc: 'Stacked tiered architectural bakes' }
  ];

  const FLAVOR_PRESETS = [
    { name: 'Belgian Chocolate Truffle', tag: 'Bestseller', desc: 'Dense dark cocoa fudge with silky ganache' },
    { name: 'Rich Red Velvet Cheese', tag: 'Classic', desc: 'Crimson cocoa sponge with whipped cream cheese' },
    { name: 'Fresh Seasonal Fruit', tag: 'Light & Fresh', desc: 'Vanilla sponge loaded with seasonal fruit cuts' },
    { name: 'Lotus Biscoff Crunch', tag: 'Trending', desc: 'Belgian speculoos spread & caramel biscuit crumble' },
    { name: 'Royal Butterscotch Praline', tag: 'Crunchy', desc: 'Golden caramel glaze with handmade nut praline' },
    { name: 'Blueberry Cheesecake Cream', tag: 'Gourmet', desc: 'Whipped vanilla cream with wild blueberry compote' },
    { name: 'Dutch Chocolate Hazelnut', tag: 'Nutty', desc: 'Nutella-infused ganache with roasted hazelnut crunch' },
    { name: 'Rasmalai / Indian Fusion', tag: 'Festive', desc: 'Cardamom saffron sponge soaked in sweet milk rabdi' }
  ];

  const THEME_PRESETS = [
    { name: 'Minimalist Gold Foil', desc: 'Pastel palette with edible gold leaf foil brushstrokes' },
    { name: 'Fresh Floral Elegance', desc: 'Natural fresh roses, baby breaths & botanical touch' },
    { name: '3D Character / Kids Theme', desc: 'Handcrafted toys, superhero, or cartoon figurines' },
    { name: 'Vintage Lambeth Piping', desc: 'Victorian ornate frills, swirls, and intricate borders' },
    { name: 'Edible Photo Sugar Print', desc: 'High-definition printed edible photo sheet' },
    { name: 'I Have Instagram / Pinterest Photos', desc: 'Send your exact reference photo on WhatsApp!' }
  ];

  // Resolved final values
  const effectiveWeight = selectedWeight === 'Custom' 
    ? (customWeight.trim() ? `${customWeight.trim()} (Custom)` : 'Custom Weight')
    : selectedWeight;

  const effectiveShape = selectedShape === 'Custom' 
    ? (customShape.trim() ? `${customShape.trim()} (Custom)` : 'Custom Shape')
    : selectedShape;

  const effectiveFlavor = selectedFlavor === 'Custom' 
    ? (customFlavor.trim() ? `${customFlavor.trim()} (Custom)` : 'Custom Flavor')
    : selectedFlavor;

  const effectiveTheme = selectedTheme === 'Custom'
    ? (customTheme.trim() ? `${customTheme.trim()} (Custom)` : 'Custom Theme')
    : selectedTheme;

  const handleSendToWhatsApp = () => {
    let msg = `*New Custom Cake Enquiry - The Baker Bro*\n\n`;
    msg += `⚖️ *Weight / Size:* ${effectiveWeight} (${selectedTiers})\n`;
    msg += `📐 *Cake Shape:* ${effectiveShape}\n`;
    msg += `🍫 *Flavor Choice:* ${effectiveFlavor}\n`;
    msg += `🎨 *Design Theme:* ${effectiveTheme}\n`;
    if (cakeMessage.trim()) {
      msg += `✍️ *Message on Cake:* "${cakeMessage.trim()}"\n`;
    }
    if (occasionDate) {
      msg += `📅 *Date of Event:* ${occasionDate}\n`;
    }
    msg += `\n*Purity:* 100% Eggless Pure Veg\n`;
    msg += `\nPlease let me know availability and pricing!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDirectWhatsAppConsult = () => {
    const msg = `Hi The Baker Bro,\n\nI want to discuss a custom cake order for my celebration in Jalandhar. Can you please guide me with ideas and pricing?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-24 overflow-hidden relative z-10 bg-cream-bg text-charcoal">
      
      {/* Ambient background decoration */}
      <div className="absolute right-[-10%] top-[5%] w-96 h-96 opacity-[0.03] pointer-events-none float-animation">
        <i className="fas text-[14rem] fa-birthday-cake" style={{ color: ACCENT_COLOR }}></i>
      </div>

      {/* Hero Header */}
      <section className="relative pt-12 pb-8 md:pt-20 md:pb-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-plum/5 border border-accent-gold/40 text-brand-plum font-extrabold text-[10px] sm:text-xs uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            100% Pure Eggless Custom Bakery
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5.5xl font-black mb-4 tracking-tight font-serif-heading text-charcoal leading-tight">
            Build Your Cake <br className="hidden sm:inline" />
            <span 
              className="text-transparent bg-clip-text pb-1 inline-block"
              style={{ backgroundImage: `linear-gradient(135deg, ${BRAND_COLOR} 30%, ${ACCENT_COLOR} 100%)` }}
            >
              Exactly Your Way
            </span>
          </h1>

          <p className="font-semibold text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed text-charcoal/65 mb-6">
            Choose or type your exact weight (KG), custom shape, and favorite flavor. Complete freedom to customize every detail for your celebration!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={handleDirectWhatsAppConsult}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-accent-gold/30 text-charcoal font-bold text-xs uppercase tracking-wider shadow-xs hover:border-brand-primary cursor-pointer transition-all"
            >
              <i className="fab fa-whatsapp text-emerald-600 text-sm"></i>
              <span>Direct WhatsApp Help</span>
            </button>
            <span className="text-[11px] font-semibold text-charcoal/50">or personalize step-by-step below 👇</span>
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
                ? 'bg-brand-plum text-white shadow-xs' 
                : 'text-charcoal/70 hover:bg-black/5'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
              currentStep === 1 ? 'bg-accent-gold text-charcoal' : 'bg-charcoal/10 text-charcoal'
            }`}>1</span>
            <span className="hidden sm:inline truncate">Weight & Shape</span>
            <span className="sm:hidden">Weight</span>
          </button>

          <i className="fas fa-chevron-right text-[10px] text-accent-gold-dark/60 shrink-0"></i>

          {/* Step 2 Button */}
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStep === 2 
                ? 'bg-brand-plum text-white shadow-xs' 
                : 'text-charcoal/70 hover:bg-black/5'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
              currentStep === 2 ? 'bg-accent-gold text-charcoal' : 'bg-charcoal/10 text-charcoal'
            }`}>2</span>
            <span className="hidden sm:inline truncate">Flavor Choice</span>
            <span className="sm:hidden">Flavor</span>
          </button>

          <i className="fas fa-chevron-right text-[10px] text-accent-gold-dark/60 shrink-0"></i>

          {/* Step 3 Button */}
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentStep === 3 
                ? 'bg-brand-plum text-white shadow-xs' 
                : 'text-charcoal/70 hover:bg-black/5'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
              currentStep === 3 ? 'bg-accent-gold text-charcoal' : 'bg-charcoal/10 text-charcoal'
            }`}>3</span>
            <span className="hidden sm:inline truncate">Theme & WhatsApp</span>
            <span className="sm:hidden">Theme</span>
          </button>

        </div>
      </div>

      {/* Main Interactive Wizard Box */}
      <section className="max-w-4xl mx-auto px-4 relative z-20">
        <div className="rounded-3xl p-6 sm:p-10 shadow-xl border bg-cream-light border-accent-gold/30">
          
          {/* ================= STEP 1: WEIGHT (KG) & SHAPE ================= */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-accent-gold/20 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark block mb-1">
                  Step 1 of 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-serif-heading text-charcoal">
                  How Much Cake Do You Need?
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 font-medium mt-1">
                  Select a common weight or type your own required KG.
                </p>
              </div>

              {/* 1A. Select or Type KG */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-charcoal/80 mb-3">
                  Cake Weight (Choose or Type)
                </label>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-3.5">
                  {WEIGHT_PRESETS.map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => {
                        setSelectedWeight(w.label);
                        setCustomWeight('');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedWeight === w.label
                          ? 'border-brand-plum bg-brand-plum text-white font-extrabold shadow-sm'
                          : 'bg-[#FAF6F0] border-accent-gold/25 text-charcoal hover:border-brand-primary'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-black">{w.label}</div>
                      <div className={`text-[10px] font-medium mt-0.5 ${selectedWeight === w.label ? 'text-white/80' : 'text-charcoal/50'}`}>
                        {w.serves}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Weight Write-in Box */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-accent-gold/25 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-extrabold text-charcoal shrink-0 flex items-center gap-2">
                    <i className="fas fa-pen-nib text-brand-plum text-xs"></i>
                    <span>Or Type Exact KG:</span>
                  </span>
                  <div className="flex-1 relative">
                    <input 
                      type="text"
                      placeholder="e.g. 1.25 Kg, 5 Kg, 7.5 Kg, 10 Kg..."
                      value={customWeight}
                      onChange={(e) => {
                        setCustomWeight(e.target.value);
                        setSelectedWeight('Custom');
                      }}
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-accent-gold/30 outline-none focus:border-brand-plum text-charcoal"
                    />
                  </div>
                  {customWeight && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Custom: {customWeight}
                    </span>
                  )}
                </div>
              </div>

              {/* 1B. Tier Count */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-charcoal/80 mb-2.5">
                  Tier Structure
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TIER_OPTIONS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedTiers(tier)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                        selectedTiers === tier
                          ? 'border-brand-plum bg-brand-plum/10 text-brand-plum ring-1 ring-brand-plum'
                          : 'bg-[#FAF6F0] border-accent-gold/25 text-charcoal/70 hover:border-brand-primary'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1C. Shape Choice */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-charcoal/80 mb-3">
                  Cake Shape (Select or Custom)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {SHAPE_PRESETS.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        setSelectedShape(s.name);
                        setCustomShape('');
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                        selectedShape === s.name
                          ? 'border-brand-plum bg-brand-plum/5 ring-1 ring-brand-plum'
                          : 'bg-[#FAF6F0] border-accent-gold/25 hover:border-brand-primary'
                      }`}
                    >
                      <i className={`fas ${s.icon} text-brand-plum text-base pt-0.5`}></i>
                      <div>
                        <h4 className="font-extrabold text-xs text-charcoal">{s.name}</h4>
                        <p className="text-[10px] text-charcoal/60 font-medium leading-relaxed mt-0.5">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Shape Input */}
                <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-accent-gold/25 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-extrabold text-charcoal shrink-0 flex items-center gap-2">
                    <i className="fas fa-shapes text-brand-plum text-xs"></i>
                    <span>Custom Shape / Cut:</span>
                  </span>
                  <input 
                    type="text"
                    placeholder="e.g. Hexagon, Butterfly, Guitar, Football, Car shaped..."
                    value={customShape}
                    onChange={(e) => {
                      setCustomShape(e.target.value);
                      setSelectedShape('Custom');
                    }}
                    className="flex-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-accent-gold/30 outline-none focus:border-brand-plum text-charcoal"
                  />
                  {customShape && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Custom: {customShape}
                    </span>
                  )}
                </div>
              </div>

              {/* Step 1 Footer */}
              <div className="flex justify-end pt-4 border-t border-accent-gold/15">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-brand-plum text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-plum-dark transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continue to Flavors</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: FLAVOR SELECTION ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-accent-gold/20 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark block mb-1">
                  Step 2 of 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-serif-heading text-charcoal">
                  Pick or Specify Your Flavor
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 font-medium mt-1">
                  100% Eggless pure vegetarian recipes. Choose a signature flavor or write your own custom combination!
                </p>
              </div>

              {/* Flavor Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {FLAVOR_PRESETS.map((flavor) => (
                  <button
                    key={flavor.name}
                    type="button"
                    onClick={() => {
                      setSelectedFlavor(flavor.name);
                      setCustomFlavor('');
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedFlavor === flavor.name
                        ? 'border-brand-plum bg-brand-plum/5 ring-1 ring-brand-plum'
                        : 'bg-[#FAF6F0] border-accent-gold/25 hover:border-brand-primary'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-accent-gold-dark block mb-1">
                        {flavor.tag}
                      </span>
                      <h4 className="font-extrabold text-xs text-charcoal mb-1">
                        {flavor.name}
                      </h4>
                      <p className="text-[10px] text-charcoal/60 leading-relaxed font-medium">
                        {flavor.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-accent-gold/15 flex items-center justify-between text-[10px] font-bold">
                      <span className={selectedFlavor === flavor.name ? 'text-brand-plum' : 'text-charcoal/40'}>
                        {selectedFlavor === flavor.name ? '✓ Selected' : 'Select'}
                      </span>
                      <i className={`fas ${selectedFlavor === flavor.name ? 'fa-check-circle text-brand-plum' : 'fa-circle text-charcoal/20'}`}></i>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Flavor Write-in Box */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-accent-gold/25 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-extrabold text-charcoal shrink-0 flex items-center gap-2">
                  <i className="fas fa-blender text-brand-plum text-xs"></i>
                  <span>Custom Flavor / Dual Flavor:</span>
                </span>
                <input 
                  type="text"
                  placeholder="e.g. Half Chocolate & Half Vanilla, Mango Mousse, Coffee Mocha, Pistachio..."
                  value={customFlavor}
                  onChange={(e) => {
                    setCustomFlavor(e.target.value);
                    setSelectedFlavor('Custom');
                  }}
                  className="flex-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-accent-gold/30 outline-none focus:border-brand-plum text-charcoal"
                />
                {customFlavor && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Custom: {customFlavor}
                  </span>
                )}
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
                  className="px-6 py-3 rounded-xl bg-brand-plum text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-plum-dark transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Continue to Theme</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: THEME, DETAILS & WHATSAPP ================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-accent-gold/20 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark block mb-1">
                  Step 3 of 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-serif-heading text-charcoal">
                  Design Theme & Celebration Details
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/60 font-medium mt-1">
                  Pick a theme style or describe your vision. Send reference photos directly to WhatsApp!
                </p>
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {THEME_PRESETS.map((theme) => (
                  <button
                    key={theme.name}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(theme.name);
                      setCustomTheme('');
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedTheme === theme.name
                        ? 'border-brand-plum bg-brand-plum/5 ring-1 ring-brand-plum'
                        : 'bg-[#FAF6F0] border-accent-gold/25 hover:border-brand-primary'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-xs text-charcoal mb-1">
                        {theme.name}
                      </h4>
                      <p className="text-[10px] text-charcoal/60 leading-relaxed font-medium">
                        {theme.desc}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-accent-gold/15 flex items-center justify-between text-[10px] font-bold">
                      <span className={selectedTheme === theme.name ? 'text-brand-plum' : 'text-charcoal/40'}>
                        {selectedTheme === theme.name ? '✓ Picked' : 'Pick'}
                      </span>
                      <i className={`fas ${selectedTheme === theme.name ? 'fa-check-circle text-brand-plum' : 'fa-circle text-charcoal/20'}`}></i>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Theme Input */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-accent-gold/25 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-extrabold text-charcoal shrink-0 flex items-center gap-2">
                  <i className="fas fa-paint-roller text-brand-plum text-xs"></i>
                  <span>Custom Theme / Idea:</span>
                </span>
                <input 
                  type="text"
                  placeholder="e.g. Cocomelon, Barbie, Cricket Stadium, Harry Potter, Neon Disco..."
                  value={customTheme}
                  onChange={(e) => {
                    setCustomTheme(e.target.value);
                    setSelectedTheme('Custom');
                  }}
                  className="flex-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-accent-gold/30 outline-none focus:border-brand-plum text-charcoal"
                />
                {customTheme && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Custom: {customTheme}
                  </span>
                )}
              </div>

              {/* Optional Custom Cake Message & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-charcoal/70 mb-1.5">
                    Message / Name on Cake (Optional)
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Happy Birthday Nishant!"
                    value={cakeMessage}
                    onChange={(e) => setCakeMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-accent-gold/30 bg-[#FAF6F0] text-xs font-semibold text-charcoal outline-none focus:border-brand-plum"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-charcoal/70 mb-1.5">
                    Celebration Date (Optional)
                  </label>
                  <input 
                    type="date"
                    value={occasionDate}
                    onChange={(e) => setOccasionDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-accent-gold/30 bg-[#FAF6F0] text-xs font-semibold text-charcoal outline-none focus:border-brand-plum"
                  />
                </div>
              </div>

              {/* Order Summary & WhatsApp Direct Button */}
              <div className="mt-6 rounded-2xl bg-[#FAF6F0] border border-accent-gold/30 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent-gold/20 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold-dark block">
                      Your Customized Cake Summary
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-charcoal font-serif-heading mt-0.5">
                      {effectiveWeight} ({selectedTiers}) • {effectiveShape}
                    </h3>
                    <p className="text-xs text-charcoal/65 font-medium mt-1">
                      Flavor: <strong className="text-charcoal">{effectiveFlavor}</strong> • Theme: <strong className="text-charcoal">{effectiveTheme}</strong>
                      {cakeMessage ? ` • Message: "${cakeMessage}"` : ''}
                      {occasionDate ? ` • Date: ${occasionDate}` : ''}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                      <i className="fab fa-whatsapp text-xs"></i>
                      <span>Pricing on WhatsApp</span>
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
                    <span>Send Requirements & Discuss Price</span>
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
                  💬 Have an Instagram/Pinterest reference photo? Attach it directly in WhatsApp after clicking!
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
            <i className="fas fa-leaf text-emerald-700 text-lg mb-2 block"></i>
            <h4 className="font-extrabold text-xs text-charcoal uppercase tracking-wider mb-1">100% Eggless Purity</h4>
            <p className="text-[11px] text-charcoal/60 font-medium">Pure vegetarian recipes baked with Belgian chocolate, dairy cream, and zero gelatin.</p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-light border border-accent-gold/25 text-center">
            <i className="fas fa-clock text-brand-plum text-lg mb-2 block"></i>
            <h4 className="font-extrabold text-xs text-charcoal uppercase tracking-wider mb-1">24-48 Hr Lead Time</h4>
            <p className="text-[11px] text-charcoal/60 font-medium">Custom sculptures & multi-tier designs require 1-2 days advance notice for best results.</p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-light border border-accent-gold/25 text-center">
            <i className="fas fa-truck text-accent-gold-dark text-lg mb-2 block"></i>
            <h4 className="font-extrabold text-xs text-charcoal uppercase tracking-wider mb-1">Safe City Delivery</h4>
            <p className="text-[11px] text-charcoal/60 font-medium">Delivered securely in heavy-duty temperature-retaining cake boxes within Jalandhar.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
