<div align="center">
  <img src="https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png" alt="The Baker Bro Logo" width="200" />
  
  <h1>The Baker Bro | Premium Bakery Frontend</h1>
  
  [![Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://thebakerbro.vercel.app)
  [![Framework](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Styling](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Code Quality](https://img.shields.io/badge/Code_Style-Standard-f39f37?style=for-the-badge)](#)
</div>

<br />

The Baker Bro is a high-performance, mobile-first web interface designed to streamline customer inquiries and custom cake orders. Built with React/Next.js and styled via Tailwind CSS, the platform leverages direct-to-WhatsApp routing to eliminate cart-abandonment drop-offs.

## 🏗️ System Architecture

The codebase follows a highly scalable, feature-first modular pattern:

```text
src/
├── components/
│   ├── common/         # Reusable UI (Navbar, Footer, Buttons)
│   ├── features/       # Domain-specific components (CakeCards, OrderForms)
│   └── layouts/        # Page wrappers and strict layout containers
├── config/             # Centralized constants and environment mapping
├── hooks/              # Custom React hooks (e.g., useMediaQuery, useScroll)
├── pages/              # Route definitions
├── styles/             # Global CSS and utility classes
└── utils/              # Pure helper functions (WhatsApp URL generator)
