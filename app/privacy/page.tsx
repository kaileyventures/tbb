'use client';

import React from 'react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';

export default function PrivacyPage() {
  const { activeSite } = useSite();
  const isBurger = activeSite === 'burger';

  const brandName = isBurger ? 'The Burger Bro' : 'The Baker Bro';
  const brandThemeColor = isBurger ? 'var(--brand-primary)' : '#7A1A40';
  const brandAccent = 'var(--brand-accent)';
  const brandEmail = isBurger ? 'privacy@theburgerbro.in' : 'privacy@thebakerbro.in';
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
          <span style={{ color: brandThemeColor }}>Privacy Policy</span>
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
            <i className="fas fa-shield-alt mr-2"></i> Data Protection & Privacy
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal mb-4 tracking-tight font-serif-heading leading-tight">
            Privacy Policy
          </h1>

          <div className="w-12 h-0.5 bg-accent-gold mx-auto mb-4"></div>

          <p className="text-charcoal/60 font-semibold text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Your trust is our utmost priority. Learn how <strong className="text-charcoal">{brandName}</strong> handles, respects, and protects your personal information.
          </p>

          <p className="text-[11px] font-bold text-charcoal/40 uppercase tracking-wider mt-3">
            Last Updated: October 2026 • Compliant with Indian Digital Data Protection Norms
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
                Information We Collect
              </h2>
            </div>
            <div className="pl-11 space-y-2">
              <p>
                When you interact with our digital menu, submit custom cake requests, or place orders via WhatsApp, we may collect the following details strictly necessary to fulfill your order:
              </p>
              <p>
                • <strong>Contact Details:</strong> Customer name, mobile phone number, and delivery address.
              </p>
              <p>
                • <strong>Order Customization Details:</strong> Flavor preferences, dietary instructions (e.g. 100% eggless, extra spicy), custom cake messaging, and event delivery dates.
              </p>
              <p>
                • <strong>Technical & Browser Data:</strong> Anonymous browsing metrics such as device type and preferred brand view (Burger Bro vs. Baker Bro) stored locally in your browser for a seamless user experience.
              </p>
            </div>
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
                How We Use Your Information
              </h2>
            </div>
            <div className="pl-11 space-y-2">
              <p>Your details are used solely for the following legitimate service purposes:</p>
              <p>• Preparing, baking, packaging, and dispatching your food orders accurately.</p>
              <p>• Communicating delivery status, delivery partner location, and payment confirmations via WhatsApp or phone call.</p>
              <p>• Maintaining your custom order requests, cake weight specifications, and anniversary/birthday reminder preferences if requested.</p>
              <p>• We <strong>never</strong> sell, rent, or trade your personal information to third-party marketing companies.</p>
            </div>
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
                WhatsApp & External Communication
              </h2>
            </div>
            <p className="pl-11">
              Our website facilitates direct, private communication between you and our kitchen captains using WhatsApp. When you click on WhatsApp order buttons, you are transferred to WhatsApp&apos;s end-to-end encrypted messaging service, governed by Meta&apos;s privacy policy. We only maintain chat records needed to execute your culinary order.
            </p>
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
                Cookies & Local Storage
              </h2>
            </div>
            <p className="pl-11">
              We use minimal browser localStorage only to remember your current shopping cart items and your preferred site tab ({brandName}) so that your preferences are not lost when you refresh or navigate across pages. We do not use third-party tracking or advertising cookies.
            </p>
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
                Data Security & Storage
              </h2>
            </div>
            <p className="pl-11">
              We implement industry-standard encryption, SSL/TLS protocols, and operational controls to safeguard your data. Any delivery partner only receives the minimum necessary information (customer name, delivery address, and contact number) required to complete the delivery.
            </p>
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
                Your Privacy Rights & Contact
              </h2>
            </div>
            <p className="pl-11">
              You have the right to request access to any personal information we hold or ask us to delete your delivery records at any time. For privacy inquiries or requests, contact our privacy officer:
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
