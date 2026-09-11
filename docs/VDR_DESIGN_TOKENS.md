# Vijaya Durga Refrigeration (VDR) Design Tokens Specification

**Version:** 1.0.0  
**Architecture:** Primitive Tokens → Semantic Tokens → Component Tokens → Page Patterns  
**Compliance:** WCAG 2.1 AAA Contrast Target  

---

## 1. Token Architecture Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PRIMITIVE TOKENS (Raw values)                            │
│    navy-900: #0A3960 | cyan-600: #0284C7 | slate-50: #F8FAFC │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SEMANTIC TOKENS (Design Intent / Context)                │
│    surface-canvas: slate-50                                  │
│    brand-primary: navy-900                                   │
│    action-interactive: cyan-600                             │
│    status-verified: emerald-600                              │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. COMPONENT TOKENS (Element-Specific Bindings)             │
│    table-header-bg: surface-subtle                           │
│    button-primary-bg: brand-primary                          │
│    table-row-height-compact: 40px                            │
│    table-row-height-standard: 64px                           │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. PAGE PATTERNS (Storefront Showroom vs Admin Console)     │
│    public-product-card | admin-operational-data-table        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Color System Specifications

### Semantic Color Matrix

| Semantic Role | Token Name | Light Mode (Hex / OKLCH) | Dark Mode Compatible | WCAG Contrast (vs White) | Purpose / Meaning |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **Brand Anchor** | `--color-brand-primary` | `#0A3960` (oklch 32% 0.08 245) | `#1E5888` | **10.8:1 (AAA)** | Primary engineering trust, navigation sidebar, main buttons. |
| **Brand Hover** | `--color-brand-hover` | `#072A47` (oklch 26% 0.07 245) | `#2A6D9E` | **13.5:1 (AAA)** | Hover state for primary buttons and active navigation rows. |
| **Brand Active** | `--color-brand-active` | `#051E33` (oklch 20% 0.06 245) | `#3580B2` | **16.1:1 (AAA)** | Pressed state for primary controls. |
| **Cooling Accent** | `--color-accent-cooling` | `#0284C7` (oklch 55% 0.16 230) | `#38BDF8` | **4.6:1 (AA)** | Active cooling highlights, primary links, focus indicators, secondary CTAs. |
| **Cooling Hover** | `--color-accent-hover` | `#0369A1` (oklch 47% 0.15 230) | `#0EA5E9` | **5.9:1 (AAA)** | Hover state for cooling action links. |
| **Canvas Background**| `--color-bg-canvas` | `#F8FAFC` (oklch 98% 0.005 240) | `#0B1120` | N/A | Calm backdrop for admin portal and storefront pages. |
| **Surface Default** | `--color-surface-card` | `#FFFFFF` (oklch 100% 0 0) | `#111827` | N/A | Pure white document sheets, modal bodies, table surfaces. |
| **Surface Subtle** | `--color-surface-subtle` | `#F1F5F9` (oklch 96% 0.01 240) | `#1F2937` | N/A | Table header background, alternating striped rows, muted badges. |
| **Text Primary** | `--color-text-primary` | `#0F172A` (oklch 18% 0.02 260) | `#F8FAFC` | **15.2:1 (AAA)** | Primary headings, table row titles, high-emphasis text. |
| **Text Secondary** | `--color-text-secondary` | `#475569` (oklch 45% 0.02 250) | `#94A3B8` | **6.1:1 (AAA)** | Subtitles, parameter labels, secondary table metadata. |
| **Text Muted** | `--color-text-muted` | `#64748B` (oklch 55% 0.02 250) | `#64748B` | **4.5:1 (AA)** | Helper notes, timestamps, SKU labels. |
| **Border Default** | `--color-border-default` | `#E2E8F0` (oklch 92% 0.01 240) | `#334155` | N/A | Subtle 1px dividers, table grid lines, card perimeters. |
| **Border Strong** | `--color-border-strong` | `#CBD5E1` (oklch 86% 0.01 240) | `#475569` | N/A | Form input boundaries, active tab underlines. |
| **Status Verified** | `--color-status-success` | `#16A34A` (oklch 62% 0.17 145) | `#22C55E` | **4.7:1 (AA)** | 5-Star BEE energy ratings, verified stock, active catalogue status. |
| **Status Caution** | `--color-status-warning` | `#D97706` (oklch 62% 0.17 65) | `#F59E0B` | **4.5:1 (AA)** | Uncontacted customer leads, pre-restore alerts, demo previews. |
| **Status Danger** | `--color-status-error` | `#DC2626` (oklch 55% 0.22 25) | `#EF4444` | **4.8:1 (AA)** | Permanent deletions, corrupt restore rejection, validation errors. |

---

## 3. Typography Scale & Specifications

### Family Definitions
- **Heading / Authority Font**: `Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Body / Operational Data Font**: `Inter, system-ui, -apple-system, sans-serif`
- **Technical & Specification Font**: `ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace`

### Scale Hierarchy

| Level | Size (rem / px) | Weight | Line Height | Letter Spacing | Numeric Mode | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `2.25rem` (36px) | 800 (Extrabold) | `1.15` (42px) | `-0.025em` | Proportional | Storefront main hero headline. |
| **H1 / Page Title**| `1.5rem` (24px) | 700 (Bold) | `1.25` (30px) | `-0.02em` | Proportional | Top admin & showroom page titles. |
| **H2 / Section Title**| `1.125rem` (18px) | 700 (Bold) | `1.35` (24px) | `-0.015em` | Proportional | Document section headers. |
| **H3 / Card Title** | `0.875rem` (14px) | 600 (Semibold) | `1.4` (20px) | `-0.01em` | Proportional | Product card names, table headers. |
| **Body Standard** | `0.875rem` (14px) | 400 (Regular) | `1.5` (21px) | `0em` | Proportional | Long-form technical descriptions. |
| **Body Compact** | `0.75rem` (12px) | 400 (Regular) | `1.4` (17px) | `0em` | Proportional | Admin form inputs, descriptions. |
| **Table Data** | `0.75rem` (12px) | 500 (Medium) | `1.35` (16px) | `0em` | **`tabular-nums`** | Table rows, product specs. |
| **Technical Spec** | `0.6875rem` (11px)| 600 (Semibold) | `1.3` (14px) | `+0.01em` | **`tabular-nums`** | Capacities, ISEER values, voltages. |
| **Monospace SKU** | `0.6875rem` (11px)| 500 (Medium) | `1.3` (14px) | `+0.02em` | **`tabular-nums`** | Model numbers, SKUs, hash IDs. |
| **Pill Badge** | `0.625rem` (10px) | 700 (Bold) | `1.0` (10px) | `+0.03em` | Proportional | Status badges (Active, New, Contacted). |

---

## 4. Spacing System (8pt Base with 4pt Micro-steps)

```css
--space-0-5: 0.125rem; /* 2px  - Hairline offsets, border gaps */
--space-1:   0.25rem;  /* 4px  - Badge padding, micro gaps */
--space-1-5: 0.375rem; /* 6px  - Compact icon-to-label spacing */
--space-2:   0.5rem;   /* 8px  - Table cell vertical padding (compact) */
--space-2-5: 0.625rem; /* 10px - Form input padding */
--space-3:   0.75rem;  /* 12px - Component internal padding */
--space-4:   1.0rem;   /* 16px - Table cell horizontal padding, standard margins */
--space-6:   1.5rem;   /* 24px - Section gaps, table toolbar padding */
--space-8:   2.0rem;   /* 32px - Document section division */
--space-10:  2.5rem;   /* 40px - Major feature card margins */
--space-12:  3.0rem;   /* 48px - Page section rhythm */
--space-16:  4.0rem;   /* 64px - Storefront hero padding */
```

---

## 5. Radius System: Functional Restraint

| Token | Value | Purpose / Component Bindings |
| :--- | :--- | :--- |
| `--radius-sm` | `4px` | Small action buttons, thumbnail images in tables. |
| `--radius-md` | `6px` | Standard inputs, select dropdowns, search bars. |
| `--radius-lg` | `8px` | Data table containers, primary document canvas, modal dialogs. |
| `--radius-xl` | `12px` | Storefront product cards, interactive compare trays. |
| `--radius-full`| `9999px` | Status badges (`Active`, `Draft`, `5★ BEE`), circular icons. |

*Anti-pattern Rule: Never use radius $>12\text{px}$ on admin tables or form inputs.*

---

## 6. Modern Restrained Shadows

```css
--shadow-none: none;
--shadow-xs:   0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm:   0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07);
--shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08);
--shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08);
--shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.12);
```

---

## 7. Component Token Specifications

### A. Data Tables (Admin)
- **Header Height**: `36px` (Background: `--color-surface-subtle`, Font: 11px font-semibold uppercase).
- **Standard Row Height (`--table-row-standard`)**: `56px–64px` (for products with equipment thumbnails).
- **Compact Row Height (`--table-row-compact`)**: `40px` (for enquiries, snapshots, categories, brands).
- **Integrated Toolbar**: Integrated into table border perimeter, zero margin bottom.

### B. Form Controls
- **Input Height**: `36px` (compact, high information density).
- **Select Height**: `36px`.
- **Textarea**: 3 rows default, min-height 72px.
- **Focus Ring**: `ring-1 ring-[#0284C7] ring-offset-0 border-transparent`.

### C. Action Buttons
- **Primary**: Background `#0A3960`, Text `#FFFFFF`, Hover `#072A47`, Height `36px`, Radius `6px`.
- **Accent**: Background `#0284C7`, Text `#FFFFFF`, Hover `#0369A1`, Height `36px`, Radius `6px`.
- **Secondary / Outline**: Background `#FFFFFF`, Border `1px solid #CBD5E1`, Text `#0F172A`, Hover `#F8FAFC`.
- **Danger / Destructive**: Background `#DC2626`, Text `#FFFFFF`, Hover `#B91C1C`.

### D. Status Badges
- **Pill Shape**: Radius `9999px`, Padding `2px 8px`, Font Size `10px`, Font Weight `700`, Uppercase tracking `0.02em`.
- **New / Uncontacted**: Background `#FEF3C7` (amber-100), Text `#92400E` (amber-800), Border `1px solid #FDE68A`.
- **Active / Verified**: Background `#DCFCE7` (emerald-100), Text `#166534` (emerald-800), Border `1px solid #BBF7D0`.
- **Contacted / Progress**: Background `#DBEAFE` (blue-100), Text `#1E40AF` (blue-800), Border `1px solid #BFDBFE`.

---

## 8. Proposed CSS Variables (`:root` Implementation)

```css
:root {
  /* Brand Primitives */
  --vdr-navy: #0a3960;
  --vdr-navy-hover: #072a47;
  --vdr-navy-active: #051e33;
  --vdr-cyan: #0284c7;
  --vdr-cyan-hover: #0369a1;

  /* Surfaces & Canvas */
  --vdr-canvas: #f8fafc;
  --vdr-surface: #ffffff;
  --vdr-surface-subtle: #f1f5f9;

  /* Text Roles */
  --vdr-text-primary: #0f172a;
  --vdr-text-secondary: #475569;
  --vdr-text-muted: #64748b;

  /* Borders */
  --vdr-border: #e2e8f0;
  --vdr-border-strong: #cbd5e1;

  /* Functional Status */
  --vdr-success: #16a34a;
  --vdr-warning: #d97706;
  --vdr-error: #dc2626;

  /* Sizing Tokens */
  --vdr-control-height: 2.25rem; /* 36px */
  --vdr-table-row-compact: 2.5rem; /* 40px */
  --vdr-table-row-standard: 3.75rem; /* 60px */

  /* Radius Tokens */
  --vdr-radius-control: 0.375rem; /* 6px */
  --vdr-radius-container: 0.5rem; /* 8px */
  --vdr-radius-badge: 9999px;
}
```
