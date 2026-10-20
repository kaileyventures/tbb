'use client';

import React from 'react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';

export default function TermsPage() {
  const { activeSite } = useSite();
  const isBurger = activeSite === 'burger';

  const brandName = isBurger ? 'The Burger Bro' : 'The Baker Bro';
  const brandThemeColor = isBurger ? 'var(--brand-primary)' : '#7A1A40';
  const brandAccent = 'var(--brand-accent)';
  const brandEmail = isBurger ? 'orders@theburgerbro.in' : 'contact@thebakerbro.in';
  const brandPhone = '+91 88722 00030';
  const brandCity = 'Jalandhar, Punjab, India';

  return (
    <div className="min-h-screen bg-cream-bg text-charcoal pt-12 pb-24 relative z-10 overflow-hidden">
      {/* Subtle Background glow */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-15"
        style={{ backgroundColor: brandThemeColor }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal/50 mb-8">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <span>/</span>
          <span style={{ color: brandThemeColor }}>Terms & Conditions</span>
        </div>

        {/* Editorial Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span 
            className="inline-flex items-center py-1.5 px-4 rounded-full font-bold text-[10px] uppercase tracking-widest mb-4 border shadow-xs"
            style={{ 
              backgroundColor: `${brandThemeColor}0A`, 
              color: brandThemeColor, 
              borderColor: `${brandAccent}50` 
            }}
          >
            <i className="fas fa-file-contract mr-2"></i> Legal & Customer Agreements
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal mb-4 tracking-tight font-serif-heading leading-tight">
            Terms of Service
          </h1>

          <div className="w-12 h-0.5 bg-accent-gold mx-auto mb-4"></div>

          <p className="text-charcoal/60 font-semibold text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Please review the terms and conditions that govern all orders, deliveries, and customized food preparations at <strong className="text-charcoal">{brandName}</strong>.
          </p>

          <p className="text-[11px] font-bold text-charcoal/40 uppercase tracking-wider mt-3">
            Last Updated: October 2026 • Effective in Jalandhar, Punjab
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-cream-light rounded-3xl p-6 sm:p-10 shadow-sm border border-accent-gold/25 space-y-8 text-sm sm:text-base leading-relaxed text-charcoal/80">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ backgroundColor: brandThemeColor }}
              >
                1
              </span>
              <h2 className="text-lg sm:text-xl font-black text-charcoal font-serif-heading">
                Acceptance of Terms
              </h2>
            </div>
            <p className="pl-11">
              By accessing our website, placing an order online via WhatsApp or our digital menu, or dining with us, you acknowledge and agree to be bound by these terms. If you do not agree with any part of these terms, please do not place an order.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ backgroundColor: brandThemeColor }}
              >
                2
              </span>
              <h2 className="text-lg sm:text-xl font-black text-charcoal font-serif-heading">
                100% Pure Vegetarian & Eggless Guarantee
              </h2>
            </div>
            <p className="pl-11">
              {isBurger ? (
                <>All fast food items, pizzas, burgers, fries, and beverages served by <strong>The Burger Bro</strong> are prepared strictly in our 100% vegetarian kitchen using pure vegetarian certified ingredients, oil, and sauces.</>
              ) : (
                <>All designer cakes, celebration pastries, gourmet breads, and desserts baked by <strong>The Baker Bro</strong> are handcrafted strictly without eggs (100% Eggless Purity), using premium imported ingredients and dairy.</>
              )}
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ backgroundColor: brandThemeColor }}
              >
                3
              </span>
              <h2 className="text-lg sm:text-xl font-black text-charcoal font-serif-heading">
                Order Placement & Confirmation
              </h2>
            </div>
            <div className="pl-11 space-y-2">
              <p>
                • <strong>Online & WhatsApp Orders:</strong> Orders initiated through this digital catalog are routed directly to our kitchen team via WhatsApp or phone. An order is deemed confirmed once our order captain verifies product availability, prep time, and delivery location.
              </p>
              <p>
                • <strong>Custom Cakes & Bulk Party Orders:</strong> Customized designer cakes and bulk party packages require advance notice (minimum 4 to 24 hours depending on complexity) and may require a partial advance deposit confirmed over WhatsApp.
              </p>
              <p>
                • <strong>Pricing & Availability:</strong> All prices are displayed in Indian Rupees (INR) and are inclusive of standard local preparation costs unless specified otherwise. We reserve the right to amend prices or substitute seasonal garnishes with prior notice.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ backgroundColor: brandThemeColor }}
              >
                4
              </span>
              <h2 className="text-lg sm:text-xl font-black text-charcoal font-serif-heading">
                Delivery Policy & Timeframes
              </h2>
            </div>
            <div className="pl-11 space-y-2">
              <p>
                We deliver across Jalandhar and surrounding nearby areas. While our kitchen endeavors to dispatch all hot fast food within 30-45 minutes and scheduled celebration cakes at the designated time slot, delivery timelines may occasionally be influenced by traffic, severe weather, or festival rush.
              </p>
              <p>
                Please ensure the delivery address and contact numbers provided are accurate. We cannot be held liable for delayed deliveries resulting from incorrect contact details or unreachable recipients.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ backgroundColor: brandThemeColor }}
              >
                5
              </span>
              <h2 className="text-lg sm:text-xl font-black text-charcoal font-serif-heading">
                Cancellations & Refunds
              </h2>
            </div>
            <div className="pl-11 space-y-2">
              <p>
                • <strong>Fresh Food / Kitchen Orders:</strong> Due to the perishable nature of fresh culinary preparations, orders cannot be cancelled once cooking or baking has commenced.
              </p>
              <p>
                • <strong>Custom Cakes:</strong> Cancellation requests for custom celebration cakes must be submitted at least 12 hours prior to the scheduled delivery slot.
              </p>
              <p>
                • <strong>Damaged or Incorrect Items:</strong> In the rare event of transit damage or an incorrect dish, please share a photo with our WhatsApp support line immediately upon receipt for an instant replacement or credit refund.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ backgroundColor: brandThemeColor }}
              >
                6
              </span>
              <h2 className="text-lg sm:text-xl font-black text-charcoal font-serif-heading">
                Contact & Dispute Resolution
              </h2>
            </div>
            <p className="pl-11">
              For any questions regarding these terms, your orders, or feedback, please contact us at:
            </p>
            <div className="pl-11 pt-2 space-y-1 text-xs sm:text-sm font-semibold">
              <p>📍 <strong>Location:</strong> {brandCity}</p>
              <p>📞 <strong>Phone:</strong> <a href={`tel:${brandPhone.replace(/\s+/g, '')}`} className="text-brand-plum underline">{brandPhone}</a></p>
              <p>✉️ <strong>Email:</strong> <a href={`mailto:${brandEmail}`} className="text-brand-plum underline">{brandEmail}</a></p>
            </div>
          </section>

        </div>

        {/* Return Button */}
        <div className="text-center mt-10">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-extrabold uppercase tracking-wider text-xs shadow-md transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: brandThemeColor }}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Return to Menu</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
