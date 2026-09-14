# Resuma AI Studio 2.0 — Architecture & Design Specification

> **Aesthetic Philosophy**: Move from a cramped, multi-pane collision to a calm, focused, and joyful workspace inspired by Zety, Figma, and Canva. The resume canvas is the hero, and all controls reside in dedicated, non-intrusive drawers.

---

## 1. Information Architecture & The 4 Workspace Modes

Instead of cramming the section organizer, the form editor, the canvas preview, and 8 canvas dropdown menus into a single view, Studio 2.0 separates the workspace into **4 intentional modes** accessible via a sleek **68px Left Activity Rail**:

```
┌──────┬────────────────────────┬──────────────────────────────────────────┬───────────┐
│ RAIL │ ACTIVE DRAWER / FORM   │ EXPANSIVE CANVAS WORKSPACE               │ DOCK      │
│      │                        │                                          │           │
│ 📝   │ [Content Form]         │ Top Bar: Title · Undo · Redo · Saved     │ ⬇ Export  │
│ Cont │ or                     │ Canvas:  Page · Format · Zoom · Guides   │ 🔗 Share  │
│      │ [Templates Drawer]     │                                          │           │
│ 🎨   │ or                     │             ┌────────────────┐           │ ───────── │
│ Tmps │ [Design Drawer]        │             │  A4 / LETTER   │           │           │
│      │ or                     │             │  RESUME SHEET  │           │ ⭕ 94     │
│ 🎛️   │ [AI & Audit Drawer]    │             │  (LIVE PREVIEW)│           │ ATS Score │
│ Dsgn │                        │             └────────────────┘           │           │
│      │                        │                                          │           │
│ ✨   │                        │                                          │           │
│ AI   │                        │                                          │           │
└──────┴────────────────────────┴──────────────────────────────────────────┴───────────┘
```

### The 4 Rail Tabs:

| Tab | Icon | Purpose | Content when Active |
| :--- | :--- | :--- | :--- |
| **1. Content** | `📝` `LuFileText` | Form editing & section management | Opens the Section Navigator + Active Section Form. Can be toggled between Split view (Form + Canvas) and Full Form focus. |
| **2. Templates** | `🎨` `LuPalette` | Visual template picker & color themes | Slides open a 380px drawer with 10 executive color swatches + custom color wheel (with WCAG contrast badges) and a 2-column grid of all 12 templates with live visual previews. |
| **3. Formatting** | `🎛️` `LuSlidersHorizontal` | Design, typography, layout & paper specs | Slides open a 380px drawer containing: Single-click Smart Auto-Fit (`[ ✨ Shrink to 1 Page ]`), Google Fonts catalog, Paper Size standard switcher (`A4` vs `US Letter`), Density scale (`Compact`, `Normal`, `Spacious`), Page Margins (`Narrow`, `Standard`, `Wide`), and Header Decorator styles. |
| **4. AI & Audit** | `✨` `LuSparkles` | ATS optimization & content enhancements | Slides open a 380px drawer with the circular ATS Score ring (`94 / 100`), category checklists (Content, Formatting, Impact verbs), and 1-click bullet point improver. |

---

## 2. Screen Real-Estate & Pixel Economics

### On a Standard 1920 × 1080 Display:
- **Left Activity Rail**: `68px` fixed.
- **Contextual Drawer**: `380px` (or `0px` when collapsed).
- **Remaining Canvas Width**: `1472px` (plenty of room for 100% 1:1 scale A4 at `794px` or US Letter at `816px` with zero horizontal scrolling and generous negative space).

### On a 1440 × 900 MacBook / Laptop Display:
- **Left Activity Rail**: `68px`.
- **Contextual Drawer**: `360px`.
- **Canvas Width**: `1012px` (comfortably fits the full 794px sheet at ~90%–100% zoom with full visibility of margins and padding).

### Collapsible Drawer Behavior:
- Every drawer features a clear **`✕` Close Drawer** button at the top-right.
- Clicking the active rail icon again toggles the drawer closed.
- When closed, the canvas expands to `calc(100vw - 68px)` with smooth CSS easing (`transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 3. Detailed Component Breakdown

### 3.1 Studio Top Navigation Bar (Header)
Clean, calm, professional desktop header (`height: 56px`, `bg-white/95`, `backdrop-blur-md`, `border-b border-slate-200/80`):
- **Left Section**:
  - `← Back to Dashboard` link with tooltip.
  - Subtle vertical divider.
  - Document Title with inline click-to-edit pencil icon (e.g. `Senior Full-Stack Engineer Resume ✎`).
  - Real-time Cloud Save Status badge (`✓ Saved` in soft emerald / `Saving...` spinner).
- **Center Section**:
  - Tactile Undo / Redo buttons (`↶ Undo` / `↷ Redo`) with disabled states when history stack is empty.
  - Tooltips with hotkeys (`Ctrl+Z` / `Ctrl+Y`).
- **Right Section**:
  - Primary CTA: **`[ ⬇ Download PDF ]`** (high-contrast gradient button, one-click vector PDF generation).
  - Secondary CTA: **`[ 🔗 Share ]`** (public link & recruiter permissions).
  - More options `...` dropdown: JSON Resume export, duplicate, delete.

---

### 3.2 Left Activity Rail (`StudioActivityRail.jsx`)
Vertical dark navigation rail (`width: 68px`, `bg-slate-950`, `border-r border-slate-800`):
- Resuma AI brand glyph at top (`h-9 w-9` rounded-xl with vibrant gradient).
- Vertical stack of nav tabs:
  - Each item: `w-12 h-14` flex column with icon (`text-lg`) and crisp sublabel (`text-[10px] font-semibold`).
  - Inactive state: `text-slate-400 hover:text-white hover:bg-slate-850`.
  - Active state: `text-purple-400 bg-purple-950/60 border-l-2 border-purple-500`.
- Bottom rail:
  - Keyboard shortcuts modal trigger (`?`).
  - User avatar with account dropdown.

---

### 3.3 Contextual Slide-Out Drawers

#### Drawer A: `TemplatesDrawer.jsx`
- **Header**: `Templates & Colors` + close `✕` button.
- **Section 1: Curated & Custom Color Themes**:
  - Row of 10 circular swatches (Hex/HSL) representing top executive palettes.
  - Custom Color Wheel button: opens popover with Hex input + native color picker + live WCAG contrast badge (`AAA 12.4:1` / `AA 7.1:1`).
- **Section 2: All 12 Resume Templates**:
  - 2-column scrollable grid.
  - High-resolution visual thumbnail cards with template name (`Azurill`, `Bronzor`, `Chikorita`, `Ditto`, `Gengar`, `Glalie`, `Kakuna`, `Leafish`, `Nosepass`, `Onyx`, `Pikachu`, `Rhyhorn`).
  - Active card features a bold purple border, ring shadow, and `✓ Active` pill badge.
  - Clicking any template switches the live resume immediately with atomic snapshot.

#### Drawer B: `DesignDrawer.jsx`
- **Header**: `Design & Formatting` + close `✕` button.
- **Section 1: Smart Auto-Fit ("Shrink to 1 Page")**:
  - If `pageCount > 1`: Eye-catching alert card with diagnostics:
    - *"Your content spills onto Page 2 by ~4 lines. One click auto-tunes margins, density, and font scale to fit cleanly on 1 page."*
    - Single-click action button: `[ ✨ Shrink to 1 Page ]`.
  - If `pageCount === 1`: Discreet green badge: *"Your resume already fits cleanly on 1 page."*
- **Section 2: Typography (Google Fonts)**:
  - Current font family display card.
  - Live search input (`Search 1,900+ Google Fonts...`).
  - Category filter pills (`All`, `Sans-Serif`, `Serif`, `Monospace`).
  - Curated fast-pick pills (`Inter`, `Outfit`, `Plus Jakarta Sans`, `Merriweather`, `Lora`, `JetBrains Mono`, `DM Sans`, `Nunito`).
- **Section 3: Paper Size Standard Switcher (Section 2.2)**:
  - 2 tactile toggle cards:
    - `[ 📄 A4 Paper ]` — `210 × 297 mm` (International Standard)
    - `[ 📄 US Letter ]` — `8.5 × 11 in` (North America Standard)
  - Seamlessly updates canvas width/height, pagination break guides, and headless Puppeteer export format (`A4` vs `Letter`).
- **Section 4: Density & Line Spacing (Section 1.2)**:
  - 3 tactile cards:
    - `Compact (0.92x)` — Line-height 1.28, Section gap 0.55rem
    - `Standard (1.0x)` — Line-height 1.50, Section gap 0.85rem
    - `Spacious (1.05x)` — Line-height 1.65, Section gap 1.15rem
- **Section 5: Page Margins (Section 1.3)**:
  - 3 tactile cards:
    - `Narrow (12mm / 0.47in)`
    - `Standard (18mm / 0.70in)`
    - `Wide (24mm / 0.95in)`
- **Section 6: Section Header Decorators (Section 1.5)**:
  - 5 tactile preview cards:
    - `Default` (clean typography)
    - `Underline` (`― Line`)
    - `Left Accent Bar` (`| Bar`)
    - `Pill Badge` (`⬭ Badge`)
    - `Minimal Uppercase` (`ABC`)

#### Drawer C: `AiAuditDrawer.jsx`
- **Header**: `AI Intelligence & ATS Audit` + close `✕` button.
- Circular ATS Score ring (e.g. `94 / 100`) with colored progress arc and rating pill (`Excellent`, `Good`, `Needs Work`).
- Category breakdowns:
  - Content Quality (Impact metrics, bullet clarity).
  - ATS Formatting (Section headers, contact links).
  - Keyword density & job matching.
- Action triggers:
  - `[ 🎯 Match Against Job Description ]`
  - `[ ⚡ Enhance All Bullet Points ]`

#### Drawer D: Content Editor (`Content` Mode)
- **Header**: `Resume Content` + section selector.
- Re-architected into an ergonomic dual-panel or accordion:
  - Section selector list with drag-and-drop handles (`Work Experience`, `Education`, `Skills`, `Projects`, etc.).
  - Active section form with generous input fields, rich text bullet points, and AI prompt triggers.
  - Mode toggle: `Split View` (Form alongside Canvas) vs `Form Focus` (expanded full width for distraction-free writing) vs `Canvas Only`.

---

### 3.4 Expansive Canvas Workspace (`ResumeCanvas.jsx`)

The canvas is stripped of all 8 overlapping toolbar buttons. It now presents a peaceful, studio-grade document presentation:

- **Top Floating Control Bar (Minimal & Clean)**:
  - Left: **Document Dimensions & Page Count**:
    - `[ 📄 1 Page · A4 ]` or `[ 📄 2 Pages · US Letter ]`.
  - Center: **View Options**:
    - `Continuous` vs `Cards` view mode.
    - `✂️ Cutoff Guides` toggle.
  - Right: **Smooth Zoom**:
    - `[ − ]` Zoom Out
    - `[ 100% ]` Zoom percentage indicator
    - `[ + ]` Zoom In
    - `[ ⛶ ]` Auto-Fit to column width
- **Center Canvas Sheet**:
  - Centered document sheet with realistic drop shadow (`shadow-2xl ring-1 ring-black/5`).
  - Dynamic width/height reacting smoothly to A4 (`794px × 1123px`) or US Letter (`816px × 1056px`).
- **Floating Bottom-Right Widget**:
  - Circular ATS score pill: `[ 🟢 94 ATS Score ]` (clicking slides open the AI & Audit drawer).

---

## 4. State Management & Undo/Redo Architecture

All drawer mutations leverage the existing atomic snapshot pipeline in `useResumeData.js`:
- Template selection: `setResumeDataState` with `recordSnapshot(true)`.
- Color theme: `recordSnapshot(true)`.
- Typography / Google Font: `updateFontFamily` (`recordSnapshot(true)`).
- Density: `updateDensity` (`recordSnapshot(true)`).
- Page Margin: `updatePageMargin` (`recordSnapshot(true)`).
- Header Style: `updateHeaderStyle` (`recordSnapshot(true)`).
- Paper Size: `updatePaperFormat` (`recordSnapshot(true)`).
- Smart Auto-Fit: `shrinkToSinglePage` (`recordSnapshot(true)`).

Pressing `Ctrl+Z` (or clicking Undo in the top header) instantly reverts ANY customization in 1 keystroke, and auto-saves to MongoDB seamlessly.
