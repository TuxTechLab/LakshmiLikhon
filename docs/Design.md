# UI/UX Design

## 1. Design System

### Color Palette

#### Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#f8f9fa` | Page background |
| `--foreground` | `#212529` | Primary text |
| `--card` | `#ffffff` | Card background |
| `--primary` | `#4c6ef5` | Buttons, links, accents |
| `--secondary` | `#f1f3f5` | Secondary backgrounds |
| `--muted` | `#f1f3f5` | Muted backgrounds |
| `--muted-foreground` | `#868e96` | Secondary text |
| `--border` | `#dee2e6` | Borders |
| `--destructive` | `#e03131` | Errors, delete actions |

#### Dark Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#1a1b1e` | Page background |
| `--foreground` | `#e9ecef` | Primary text |
| `--card` | `#25262b` | Card background |
| `--primary` | `#748ffc` | Buttons, links, accents |
| `--secondary` | `#2c2e33` | Secondary backgrounds |
| `--border` | `#373a40` | Borders |
| `--destructive` | `#ff6b6b` | Errors, delete actions |

### Typography

| Element | Size | Weight | Font |
|---------|------|--------|------|
| H1 | 24px | 700 | Inter |
| H2 | 18px | 600 | Inter |
| Body | 14px | 400 | Inter |
| Small | 12px | 400 | Inter |
| Badge | 12px | 500 | Inter |

### Spacing Scale

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 48px |

### Border Radius

| Element | Radius |
|---------|--------|
| Button | 8px |
| Card | 12px |
| Input | 8px |
| Badge | 9999px (pill) |

## 2. Component Library

### Buttons

```
.btn-primary    → Primary actions (Save, Submit)
.btn-secondary  → Neutral actions (Cancel, Back)
.btn-destructive → Dangerous actions (Delete, Logout)
.btn-ghost      → Minimal actions (Links, Toggles)
```

### Cards

```
.card → Rounded-xl, border, shadow-sm, padding-6
       Hover: shadow-md transition
```

### Inputs

```
.input → Full width, rounded-lg, border, padding
         Focus: primary border + ring
         Disabled: opacity-50
```

### Badges

```
.badge → Inline-flex, rounded-full, small text
         Variants: success, warning, error, info
```

## 3. Page Layouts

### Dashboard (`/`)
```
┌──────────────────────────────────────────────┐
│  Navbar (sticky, blur backdrop)              │
├──────────────────────────────────────────────┤
│                                              │
│  Dashboard              [New Bill →]         │
│  Welcome back...                             │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐     │
│  │Total Bill│ │ Revenue  │ │Latest Bill│     │
│  │    25    │ │ Rs 50,000│ │ BILL-0025 │     │
│  └──────────┘ └──────────┘ └───────────┘     │
│                                              │
│  Recent Bills                    [View All →]│
│  ┌──────────────────────────────────────┐    │
│  │ BILL-0025  Customer A     Rs 2,500   │    │
│  │ BILL-0024  Customer B     Rs 1,800   │    │
│  │ BILL-0023  Customer C     Rs 3,200   │    │
│  └──────────────────────────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘
```

### Create Bill (`/bills/new`)

```bash
┌──────────────────────────────────────────────┐
│  Navbar                                      │
├──────────────────────────────────────────────┤
│                                              │
│  Create Bill                                 │
│                                              │
│  ┌─ Customer Information ─────────────────┐  │
│  │ Name: [___________] Phone: [_________] │  │
│  │ Address: [________________________]    │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─ Items ───────────────────── [+ Add] ──┐  │
│  │ ┌───────────────────────────────────┐  │  │
│  │ │ Item 1                    [Remove]│  │  │
│  │ │ Product: [_________] Qty: [__]    │  │  │
│  │ │ Price: [________] Total: Rs 500   │  │  │
│  │ └───────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌─ Summary ──────────────────────────────┐  │
│  │ Subtotal                    Rs 1,000   │  │
│  │ Discount (%) [10] %                    │  │
│  │ Discount Amount            - Rs 100    │  │
│  │ ─────────────────────────────────────  │  │
│  │ Grand Total                 Rs 900     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  [Save Bill]  [Cancel]                       │
│                                              │
└──────────────────────────────────────────────┘
```

### Bill View (`/bills/[id]`)

```bash
┌──────────────────────────────────────────────┐
│  Navbar                                      │
├──────────────────────────────────────────────┤
│                                              │
│  [← Back]                    [Print Bill 🖨] │
│                                              │
│  ┌───────────────────────────────────────┐   │
│  │           ABC                         │   │
│  │   XZS, SSS                            │   │
│  │   Phone: +91 9830000000               │   │
│  │   GSTIN: 22AAAAA0000A1Z5              │   │
│  ├───────────────────────────────────────┤   │
│  │ BILL-000001           Date: 13/09/26  │   │
│  │                                       │   │
│  │ Customer: John Doe                    │   │
│  │ Phone: +91 9876543210                 │   │
│  ├───────────────────────────────────────┤   │
│  │ Item        Qty    Price    Total     │   │
│  │ ───────────────────────────────────   │   │
│  │ Shirt        2     500     1,000      │   │
│  │ Pants        1     800       800      │   │
│  ├───────────────────────────────────────┤   │
│  │ Subtotal                1,800         │   │
│  │ Discount (10%)          - 180         │   │
│  │ ───────────────────────────────────   │   │
│  │ Grand Total             1,620         │   │
│  └───────────────────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

## 4. Animations

### Page Transitions

- **Entry**: Fade in (opacity 0→1) + Slide up (translateY 10px→0)
- **Duration**: 300ms
- **Easing**: ease-out

### Card Hover

- **Scale**: 1.0 → 1.02
- **Shadow**: sm → md
- **Duration**: 200ms

### Button Press

- **Scale**: 1.0 → 0.98
- **Duration**: 100ms

### List Items (Staggered)

- **Entry**: Fade in + slide up
- **Delay**: 50ms between items

### Toast Notifications

- **Entry**: Slide in from right (translateX 50px→0) + fade
- **Exit**: Slide out + fade
- **Duration**: 300ms
- **Auto-dismiss**: 3 seconds

### Loading Skeleton

- **Animation**: Pulse (opacity 0.5→1→0.5)
- **Duration**: 2 seconds infinite

## 5. Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Default | < 640px | Single column, stacked |
| sm | ≥ 640px | 2-column grid |
| md | ≥ 768px | Sidebar + content |
| lg | ≥ 1024px | Full layout |
| xl | ≥ 1280px | Max-width container |

## 6. Print Styles

```css
@media print {
  .no-print { display: none !important; }
  body { background: white; color: black; }
  .card { border: none; box-shadow: none; }
}
```

### Print Layout

- A4 paper optimized
- Business header with name, address, GSTIN
- Clean table layout for items
- No navigation, buttons, or UI chrome
- IST date/time displayed
- Professional invoice format
