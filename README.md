<div align="center">
  <img src="https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png" alt="The Baker Bro Logo" width="180" />
  
  <h1>🥐 The Baker Bro — Financial Ledger, POS & Bakery Management System</h1>
  
  <p><b>A high-performance, real-time dual Sales & Purchase management system with 3-Inch Thermal POS, Supabase synchronization, auto-purging Trash recovery, and Indian Numbering System formatting.</b></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.x-black?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-Realtime_PostgreSQL-3FCF8E?style=flat&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Lucide_Icons-Latest-F59E0B?style=flat&logo=lucide&logoColor=white" alt="Lucide Icons" />
    <img src="https://img.shields.io/badge/Architecture-Modular_Components-8B5CF6?style=flat" alt="Architecture" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="License" />
  </p>
</div>

---

## 🌟 Key Features

### 🧾 1. POS Counter & Thermal Billing
- **One-Tap Billing**: Touch-friendly product grid to quickly add items to the cart.
- **3-Inch Thermal Receipts**: Print realistic 80mm receipts directly from any browser.
- **Auto Bill Numbering**: Clean serial numbers generated automatically (`POS-YYMMDD-001`).
- **Bill History & Re-print**: View today's past bills and re-print receipts anytime.

### 💰 2. Sales & Expense Ledger
- **Fast Inline Entry**: Add Sales or Purchases directly from the top bar in seconds without slow popups.
- **Party & Supplier Tracking**: Keep clear records of suppliers, bills, and purchase costs.
- **Multi-Unit Support**: Choose appropriate units like `Pcs`, `KG`, `Grams`, `Packet`, `Litre`, `Box`.
- **Payment Method Tracking**: Log payments via UPI, Cash, Card, Bank Transfer, or POS.

### 📈 3. Financial Analytics & Reports
- **Real-Time Overview**: Live revenue, expense, and net profit calculations.
- **Payment & Category Insights**: Visual breakdown showing where money is coming from and where it's going.
- **Indian Currency Format**: All numbers formatted cleanly in Indian numbering (`₹1,00,000`).
- **Excel Export**: Download formatted `.xlsx` reports (Sales only, Purchases only, or complete books).

### 🔍 4. Search, Filtering & Data Safety
- **Instant Search**: Find any transaction by item name, bill number, supplier, or note.
- **Date & Month Filters**: Switch between current month, custom date ranges, or specific months in one click.
- **Trash Bin Recovery**: Deleted entries are kept safe in Trash for 20 days before permanent deletion.
- **Password Protected**: Secure dashboard access to protect business financial data.

---

## 🏗️ Technical Architecture & Modular Directory Structure

The application has been modularized into focused, reusable components adhering to clean code standards without altering core business logic:

```text
tbb/
├── app/
│   ├── globals.css                # Global styles, variables, typography & resets
│   ├── layout.tsx                 # Root layout with context providers
│   ├── page.tsx                   # Storefront landing page
│   ├── about/                     # About Us page
│   ├── contact/                   # Contact page
│   ├── customcakes/               # Custom cake ordering page
│   └── tbb/
│       └── page.tsx               # Admin Coordinator (State, Supabase Sync & Workflows)
├── components/
│   ├── admin/                     # Modular Admin Dashboard Components
│   │   ├── adminUtils.ts          # Pure utility helpers (currency, dates, note parsers)
│   │   ├── AdminAuth.tsx          # Password gatekeeper screen
│   │   ├── AdminHeader.tsx        # Top navigation, status indicator & header actions
│   │   ├── AdminAnalytics.tsx     # Revenue, expense, profit & breakdown cards
│   │   ├── QuickEntryBar.tsx      # Inline Sale & Purchase fast entry form
│   │   ├── AdminFilters.tsx       # Search, date range, month filter & advanced filter drawer
│   │   ├── AdminTable.tsx         # Unified ledger table, trash bin & pagination
│   │   └── modals/
│   │       ├── SaleModal.tsx          # Add / Edit Sale entry modal
│   │       ├── PurchaseModal.tsx      # Add / Edit Purchase entry modal
│   │       ├── DialogModals.tsx       # Delete confirmations, entry selector & export dialogs
│   │       ├── PosModal.tsx           # POS touch counter & thermal print view
│   │       └── PriceRegisterModal.tsx # Editable product & rate register
│   ├── baker/                     # Baker storefront views
│   ├── burger/                    # Burger & fast food storefront views
│   ├── AutoSuggestInput.tsx       # Floating auto-complete input
│   ├── CustomDatePicker.jsx       # Standardized date selector
│   ├── Navbar.tsx                 # Site navigation bar
│   └── Footer.tsx                 # Site footer
├── context/
│   ├── SiteContext.tsx            # Active brand state (Baker vs Burger)
│   └── supabase.ts                # Supabase client initialization
├── types/
│   └── admin.ts                   # TypeScript interfaces (SaleEntry, PurchaseEntry, TrashEntry)
├── utils/
│   └── excelExport.ts             # Excel (.xlsx) export utility
└── README.md                      # System documentation
```

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone <repository-url>
cd tbb
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the storefront or [http://localhost:3000/tbb](http://localhost:3000/tbb) for the Admin Dashboard.

### 4. Production Build Check
```bash
npx tsc --noEmit
npm run build
```
