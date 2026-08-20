<div align="center">
  <img src="https://res.cloudinary.com/dxojtisjb/image/upload/v1773550589/baker_edp4me.png" alt="The Baker Bro Logo" width="180" />
  
  <h1>🥐 The Baker Bro — Financial Ledger & Bakery Management System</h1>
  
  <p><b>A high-performance, real-time dual Sales & Purchase management system with Supabase synchronization, auto-purging Trash recovery, and Indian Numbering System formatting.</b></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.1.7-black?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-Realtime_PostgreSQL-3FCF8E?style=flat&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Lucide_Icons-0.475.0-F59E0B?style=flat&logo=lucide&logoColor=white" alt="Lucide Icons" />
    <img src="https://img.shields.io/badge/Font-Manrope-4A5568?style=flat" alt="Font Manrope" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="License" />
  </p>
</div>

---

## 🌟 Key Features

- **⚡ Always-Active Quick Data Entry Bar**: Enter sales or purchases seamlessly without extra clicks, featuring mode switching (`Sale` / `Purchase`), live total cost calculation, dynamic unit conversion, and non-blocking background saving states (`⏳ Saving...`).
- **📊 Real-time Financial Metrics**: Live calculation of Total Revenue (Sales), Total Expenses (Purchases), and Net Profit formatted in **Indian Numbering System** (`₹1,00,00,000`).
- **📅 Dual Timestamping System**:
  - **`TXN DATE`**: Custom date selector for recording past or future transaction dates.
  - **`ENTRY CREATED`**: Immutable system creation timestamp showing exact date & time (`DD-MMM-YYYY, hh:mm AM/PM`) recorded in the database.
- **🔄 Interactive Column Sorting**: Sort every single table column (`Type`, `Txn Date`, `Item`, `Category`, `Qty`, `Unit Rate`, `Total Amount`, `Status`, `Entry Created`) in ascending (`▲`) or descending (`▼`) order with one click.
- **🗑️ Trash Bin & Auto-Purging System**: Soft-delete entries safely into a dedicated Trash Bin with full **Restore** and **Permanent Erase** options. Entries are automatically purged after 20 days.
- **📦 Multi-Unit Support**: Native dropdown selectors for standard culinary and packaging units: `Pcs`, `KG`, `Grams`, `Packet`, `Unit`, `Litre`, `Box`.
- **📊 Excel Export**: Clean binary Excel sheet export formatted in Indian currency format (`toLocaleString('en-IN')`).
- **🎨 Glassmorphic & Responsive Aesthetics**: Designed with smooth micro-animations (`transform`, `brightness`), dark glassmorphic panels, and Google `Manrope` font typography enforced globally.

---

## 🏗️ Technical Architecture

The architecture follows a clean, single-page application structure powered by Next.js App Router, React 19 Client State, and Supabase PostgreSQL:

```text
d:/MasterApp/tbb/
├── app/
│   ├── globals.css           # Design tokens, Manrope font defaults, micro-animations & resets
│   ├── layout.tsx            # Root Next.js layout configuring Google Manrope font variable
│   ├── page.tsx              # Public storefront application
│   └── tbb/
│       └── page.tsx          # Main Admin Financial Ledger & Dashboard Application
├── components/
│   ├── AutoSuggestInput.tsx  # Dynamic auto-complete dropdown component with z-index floating overlay
│   └── CustomDatePicker.tsx  # Accessible date selector formatted as "DD-MMM-YYYY, DDD"
├── types/
│   └── admin.ts              # TypeScript interfaces for SaleEntry, PurchaseEntry, TrashEntry, QuantityUnit
├── utils/
│   ├── excelExport.ts        # XLSX export generator supporting Indian currency formatting & units
│   └── supabase.ts           # Supabase client singleton initialization
├── public/                   # Static media assets & images
├── .env.local                # Environment secrets (Supabase credentials & Admin password)
└── README.md                 # System documentation
```

---

## 📐 System Flow & Data Lifecycle

```mermaid
flowchart TD
    %% Styling Definitions
    classDef userNode fill:#F59E0B,stroke:#D97706,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef actionNode fill:#1E293B,stroke:#475569,stroke-width:1px,color:#F8FAFC;
    classDef stateNode fill:#0F172A,stroke:#6366F1,stroke-width:2px,color:#818CF8;
    classDef dbNode fill:#064E3B,stroke:#10B981,stroke-width:2px,color:#34D399,font-weight:bold;
    classDef trashNode fill:#7F1D1D,stroke:#EF4444,stroke-width:2px,color:#FCA5A5;

    User(["👤 Admin User"]) --> AuthCheck{"🔒 Authenticated?"}
    
    AuthCheck -- No --> PasswordScreen["Enter Secret Admin Password<br/><i>NEXT_PUBLIC_ADMIN_PASSWORD</i>"]
    PasswordScreen -- Validate --> AuthCheck

    AuthCheck -- Yes --> Dashboard["🖥️ Admin Dashboard (app/tbb/page.tsx)"]
    
    subgraph QuickEntry ["⚡ Always-Active Quick Data Entry Bar"]
        Dashboard --> ToggleType["Select Entry Mode<br/>(Sale / Purchase)"]
        ToggleType --> FillFields["Input Date, Item Name, Category,<br/>Qty, Unit, Unit Price, Status/Method"]
        FillFields --> ClickSave["Click 'Add Sale' or 'Add Purchase'"]
    end

    subgraph Processing ["⚙️ Data Processing & State Synchronization"]
        ClickSave --> CalcTotal["Calculate Total Amount<br/>(Qty × Unit Price)"]
        CalcTotal --> FormatIndian["Apply Indian Currency Format<br/>(1,00,00,000)"]
        FormatIndian --> OmitUnit["Omit UI 'unit' property from DB Payload"]
        OmitUnit --> SaveLocal["Update React Client State<br/>(Instant Optimistic UI)"]
        SaveLocal --> SaveDB["Async PostgreSQL Request<br/>(supabase.from('sales'/'purchases'))"]
    end

    SaveDB --> DBResponse{"Database Operation?"}
    DBResponse -- Success --> ToastSuccess["Show Success Toast Notification<br/>(✅ Entry Added / ✏️ Entry Updated)"]
    DBResponse -- Error --> ToastWarn["Show Graceful Warning Toast<br/>(⚠️ Saved locally, DB fallback)"]

    subgraph LedgerView ["📊 Active Ledger & Trash Lifecycle"]
        Dashboard --> SortFilter["Filter by Keyword / Date / Type<br/>Click Column Header to Sort (▲/▼)"]
        SortFilter --> LedgerTable["Render Paginated Ledger Table"]
        
        LedgerTable --> ClickDelete["Click 'Delete Entry'"]
        ClickDelete --> SoftDelete["Move Record to Trash State & LocalStorage"]
        SoftDelete --> AutoPurge{"Item Older Than 20 Days?"}
        AutoPurge -- Yes --> EraseEntry["🔥 Auto-Purge Permanently"]
        AutoPurge -- No --> TrashBin["🗑️ Retain in Trash Bin"]
        TrashBin --> Restore["Click 'Restore' -> Re-insert to Active Ledger"]
    end

    subgraph ExportSection ["📥 Reporting & Export"]
        Dashboard --> ClickExport["Click 'Export to Excel'"]
        ClickExport --> ExcelGen["Generate XLSX Sheet<br/>with Unit & Indian Currency Formatting"]
    end

    class User userNode;
    class ClickSave,ClickDelete,ClickExport,Restore actionNode;
    class Dashboard,LedgerTable,TrashBin stateNode;
    class SaveDB dbNode;
    class EraseEntry trashNode;
```

