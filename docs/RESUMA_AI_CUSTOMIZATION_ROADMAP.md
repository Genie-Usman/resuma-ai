# 🚀 Resuma AI — Feature & Customization Roadmap

A comprehensive guide and specification document outlining planned customizations, studio tools, AI enhancements, and architectural extensions for **Resuma AI**.

---

## 📑 Table of Contents
1. [Visual Styling & Typography Customizer](#1-visual-styling--typography-customizer)
2. [Canvas & Page Layout Intelligence](#2-canvas--page-layout-intelligence)
3. [Content Flexibility & Custom Sections](#3-content-flexibility--custom-sections)
4. [AI Intelligence & ATS Optimization](#4-ai-intelligence--ats-optimization)
5. [Export, Sharing & Version Management](#5-export-sharing--version-management)
6. [Prioritization & Implementation Matrix](#6-prioritization--implementation-matrix)

---

## 1. Visual Styling & Typography Customizer

### 1.1 Google Fonts Integration & Typography Engine (✅ Implemented)
* **Goal**: Enable users to change the resume's font family across all templates with live previews, live Google Fonts API catalog search (1,900+ fonts), and synchronized headless vector PDF export.
* **Integrated Capabilities**:
  * **Curated Fast-Picks**: Instant 0ms loading for top ATS-friendly fonts (*Inter, Roboto, Montserrat, Poppins, Open Sans, Lato, Outfit, Plus Jakarta Sans, Merriweather, Lora, Playfair Display, EB Garamond, JetBrains Mono, Fira Code*).
  * **Google Web Fonts API Search**: Searchable access to all 1,900+ Google Fonts via developer API key, cached in `sessionStorage` for snappy performance.
  * **Dynamic On-Demand Loading**: Automatically injects Google Font stylesheets into `document.head` as fonts are previewed or selected.
  * **Headless Chromium PDF Synchronization**: The print service (`/print/:id`) preloads the active Google Font and awaits `document.fonts.ready` before Puppeteer triggers `#print-ready`, ensuring 100% WYSIWYG vector fidelity.
  * **Studio Canvas Integration**: Sleek toolbar dropdown `[ 🔤 Font ▾ ]` positioned in the canvas top control bar with live font previews in the dropdown, category tabs (*All, Sans, Serif, Mono*), and search filtering.
  * **Full History & Persistence**: Changing fonts supports global Undo/Redo (`Ctrl+Z` / `Ctrl+Y`) and persists automatically to MongoDB in `metadata.typography.font.family`.

### 1.2 Global Density & Spacing Scale (✅ Implemented)
* **Goal**: Provide a quick preset switcher to adjust content density across all templates in real-time.
* **Integrated Options**:
  * **🗜️ Compact (`0.92x`)**: `line-height: 1.28`, tight section margins (`0.55rem`), font scale `92%`. Ideal for fitting awkward multi-page spills back onto a single page.
  * **📄 Standard (`1.0x`)**: `line-height: 1.5`, balanced section margins (`1.0rem`), standard scale `100%`.
  * **📖 Spacious (`1.05x`)**: `line-height: 1.65`, relaxed section margins (`1.25rem`), font scale `104%`. Fills out page space for concise or student profiles.
* **CSS & Engine Implementation**:
  * Scoped classes (`.resume-density-compact`, `.resume-density-normal`, `.resume-density-spacious`) in `frontend/src/index.css`.
  * Real-time pagination re-calculation via `usePageCalculator`.
  * Persistence to MongoDB in `metadata.typography.density` and `metadata.typography.lineHeight`.
  * Global Undo/Redo (`Ctrl+Z` / `Ctrl+Y`) and headless PDF export synchronization.

### 1.3 Page Margin Adjuster (✅ Implemented)
* **Goal**: Allow users to adjust physical page margins on the A4 sheet in real-time.
* **Integrated Presets**:
  * **Narrow (`12mm` / `0.47in`)**: Maximizes printable canvas area (`padding: 12px`). Ideal when paired with Compact density to pull long content onto 1 page.
  * **Standard (`18mm` / `0.7in`)**: Recommended balanced default (`padding: 20px`).
  * **Wide (`24mm` / `0.95in`)**: Elegant, editorial look for executive or concise profiles (`padding: 28px`).
* **Implementation Details**:
  * Directly controllable via the **Display Dropdown** on the canvas toolbar with 3-segment preset buttons (`Narrow`, `Standard`, `Wide`).
  * Scoped CSS classes (`.resume-margin-narrow`, `.resume-margin-standard`, `.resume-margin-wide`) in `frontend/src/index.css`.
  * Auto-recalculates page heights and cutoff guides in real-time via `usePageCalculator`.
  * Full Undo/Redo (`Ctrl+Z` / `Ctrl+Y`) and auto-save persistence to MongoDB in `metadata.page.margin` & `metadata.page.marginPreset`.
  * Automatically propagates to `/print/:id` ensuring 100% WYSIWYG fidelity in downloaded vector PDFs.

### 1.4 Custom Color Palette Builder & Contrast Checker (✅ Implemented)
* **Goal**: Expand beyond preset color palettes with a custom color picker and real-time WCAG 2.2 accessibility scoring.
* **Features**:
  * **Interactive Hex & Native Color Wheel**: Pick colors visually or type exact 6-digit hex values (`#RRGGBB`) with real-time uppercase normalization.
  * **Real-time WCAG 2.2 Relative Luminance Math**: Computes relative luminance ($L = 0.2126R + 0.7152G + 0.0722B$) and exact contrast ratio ($L_1+0.05 / L_2+0.05$).
  * **Accessibility Readability Badges**:
    * `AAA` ($\ge 7.0:1$): Exemplary contrast badge.
    * `AA` ($\ge 4.5:1$): Full compliance badge for normal body text.
    * `AA Large` ($\ge 3.0:1$): Approved for large section headers and bold titles.
    * `Fail` ($< 3.0:1$): Low contrast warning with diagnostic advice.
  * **3 Core Color Roles**:
    * **Primary Accent** (`metadata.theme.primary`): Section headers, icons, bullets, timeline markers.
    * **Neutral Dark** (`metadata.theme.text`): Body paragraphs, bullet text, descriptions.
    * **Paper Background** (`metadata.theme.background`): Pure White (`#FFFFFF`), Crisp Ivory (`#FAFAF9`), Soft Cream (`#FDFBF7`), Cool Slate (`#F8FAFC`).
  * **Curated Executive Quick-Picks**: 12 corporate/tech executive accent swatches (Navy, Cobalt, Deep Indigo, Emerald, Teal, Slate, Crimson, Burgundy, Royal Violet, Bronze, Amber Gold, Charcoal).
  * **Canvas Top Bar Integration**: Quick `[ 🟢 Theme ]` button on the canvas bar displaying the active accent color for instant one-click access.
  * **Undo/Redo & Auto-Save**: Immediate snapshot recording (`isStructural = true`) so color changes can be undone/redone via `Ctrl+Z` / `Ctrl+Y` and auto-saved to MongoDB.
  * **CSS Custom Variable Cascade**: Emits `--resume-color-bg`, `--resume-color-text`, and `--resume-color-primary` on the resume container.

### 1.5 Section Header Decorator Styles (✅ Implemented)
* **Goal**: Customize how section headers (e.g., "Work Experience", "Education") render across all 12 templates.
* **Styles**:
  * `Default`: Preserves the template author's original intended header style.
  * `Underline`: Thin horizontal colored rule (`border-bottom: 2px solid var(--resume-color-primary)`) stretching across the section title.
  * `Left Accent Bar`: Thick vertical colored accent bar (`border-left: 3.5px solid var(--resume-color-primary)`) on the left of the title.
  * `Pill / Badge`: Subtle tinted background badge (`color-mix` accent tint with rounded corners and border) framing the section title.
  * `Minimal Uppercase`: Clean, contemporary tracked uppercase typography style (`letter-spacing: 0.08em; text-transform: uppercase`) with no lines or badges.
* **Implementation & UI**:
  * Scoped CSS classes (`.resume-header-default`, `.resume-header-underline`, `.resume-header-left-bar`, `.resume-header-pill`, `.resume-header-minimal`) in `frontend/src/index.css`.
  * Inherits active primary accent color dynamically via `--resume-color-primary`.
  * Seamlessly integrated into `[ ⚙ Display ▾ ]` on the canvas toolbar with tactile selection pills.
  * Full Undo/Redo (`Ctrl+Z` / `Ctrl+Y`) and auto-save persistence to MongoDB in `metadata.typography.headerStyle`.
  * Headless vector PDF sync ensures downloaded PDFs match the selected header decorator with 100% WYSIWYG fidelity.

---

## 2. Canvas & Page Layout Intelligence

### 2.1 "Shrink to 1 Page" (Smart Auto-Fit) (✅ Implemented)
* **Problem**: Users often have 2 to 4 orphan lines spilling over onto Page 2.
* **Solution**: A single-click optimization algorithm:
  * Measures total sheet overflow height against exact A4 height (`1123px`).
  * Real-time synchronous DOM probing determines the least-invasive configuration:
    1. Evaluates margin reduction: `wide` -> `standard`.
    2. Evaluates density compression: `spacious` / `normal` -> `compact` (`0.92x`, line-height `1.28`, section margin `0.55rem`).
    3. Evaluates printable margin expansion: `narrow` (`12mm` / `0.47in`).
    4. Evaluates micro font scale: down to safe threshold `0.85x` (~`9.5pt`) using CSS variable `--resume-font-scale`.
  * Stops immediately as soon as total document height $\le 1123\text{px}$.
  * Takes an atomic undo snapshot (`isStructural = true`), allowing `Ctrl+Z` to revert in a single keystroke.
  * Auto-saves to MongoDB and syncs with Puppeteer headless vector PDF export.
  * Features dedicated `[ ✨ Shrink to 1 Page ]` button in the top canvas bar (with pulsing amber alert when near 1 page) and inside `[ ⚙ Display ▾ ]`.
  * Toast notification: *"✨ Optimized! Content fitted cleanly onto 1 page."*

### 2.2 Paper Size Standard Switcher (A4 vs. US Letter) (✅ Implemented)
* **Problem**: North American job applications prefer US Letter (`8.5" x 11"` / `816px x 1056px`), while international applications mandate A4 (`210mm x 297mm` / `794px x 1123px`).
* **Implementation & Studio 2.0 Integration**:
  * **Dynamic Paper Geometry**:
    * **A4 Standard**: `210 × 297 mm` (`794 × 1123 px` at 96 DPI, aspect ratio ~`1.414`)
    * **US Letter Standard**: `8.5 × 11 in` (`816 × 1056 px` at 96 DPI, aspect ratio `1.294`)
  * **Studio 2.0 Activity Rail & Contextual Drawer**: Integrated into the dedicated **`Design & Formatting`** drawer with tactile switcher cards (`[ 📄 A4 Paper ]` vs `[ 📄 US Letter ]`).
  * **Canvas & Pagination Engine**: `usePageCalculator(sheetContentRef, paperFormat)` recalculates page count, break positions, and overflow metrics against the active paper dimensions.
  * **Auto-Fit Recalibration**: `handleShrinkToOnePage` auto-calibrates candidate probing against the active paper height (`1056px` for US Letter, `1123px` for A4).
  * **Puppeteer Vector PDF Sync**: Puppeteer headless export passes `format: "Letter"` or `"A4"` with `@page { size: letter portrait }` or `A4 portrait` in `PrintResume.jsx` ensuring 100% WYSIWYG vector fidelity.
  * **Undo/Redo & Auto-Save**: Managed in `metadata.page.format` via `updatePaperFormat` with single-keystroke `Ctrl+Z` / `Ctrl+Y` rollback.

### 2.3 Section Visibility (Soft-Hide / Archive)
* **Goal**: Let users hide sections without permanently deleting content.
* **UI**: An eye toggle (`LuEye` / `LuEyeOff`) next to each section header in the edit form.
* **Use Case**: Quickly toggling off "Publications" or "Online Profiles" when tailoring a resume for a traditional corporate role, then turning it back on for a tech role.

### 2.4 Section Title Renaming
* **Goal**: Provide flexibility for unconventional career profiles.
* **Capability**: Click on any section title in the editor to rename it:
  * *"Work Experience"* ➔ *"Professional Experience"*, *"Relevant Experience"*, or *"Clinical Practice"*
  * *"Projects"* ➔ *"Open Source & Key Projects"*, *"Case Studies"*, or *"Portfolio"*
  * *"Online Profiles"* ➔ *"Links & Repositories"*

---

## 3. Content Flexibility & Custom Sections

### 3.1 Custom / Additional Sections
* **Goal**: Support specialized professions (academics, lawyers, freelancers, nurses).
* **Section Types**:
  * **Standard Timeline** (Organization, Role, Dates, Description, Bullets) — e.g., *Volunteer Work, Leadership, Freelance Engagements*.
  * **Simple List** (Title, Issuer, Date, Credential URL) — e.g., *Certifications, Awards & Honors, Patents*.
  * **Publication List** (Paper Title, Journal/Conference, Year, DOI/Link) — e.g., *Publications, Speaking Engagements*.
  * **Language Matrix** (Language name + visual proficiency dots/bars: *Native, Fluent, Professional, Conversational*).

### 3.2 Discreet QR Code Generator
* **Goal**: Bridge the physical paper resume and digital portfolio.
* **Capability**:
  * Generate a crisp vector QR code in the contact details header.
  * Options to point to:
    * LinkedIn Profile URL
    * GitHub Profile URL
    * Personal Portfolio / Website
  * Toggleable size (discreet 18mm x 18mm with optional subtitle *"Scan for Portfolio"*).

### 3.3 Flexible Date Formatting
* **Goal**: Allow users to adhere to regional or company date norms.
* **Options**:
  * `Jan 2022 – Present` (Short month + Year)
  * `January 2022 – Present` (Full month + Year)
  * `2022 – Present` (Year only — popular for experienced senior executives)
  * `01/2022 – Present` (Numeric)

---

## 4. AI Intelligence & ATS Optimization

### 4.1 Target Job Description (JD) Matcher & Keyword Gap Analysis
* **Workflow**:
  1. User pastes a target Job Description (JD) into the AI modal.
  2. Gemini extracts:
     * **Core Required Skills & Tech Stack**
     * **Domain Keywords & Buzzwords**
     * **Years of Experience & Seniority Level**
  3. Real-time ATS match percentage computed:
     * High Match (Green): Found in resume.
     * Missing Keyword (Amber/Red): Found in JD but missing in resume.
  4. One-click "Add to Skills" or "Suggest Bullet Point" integration.

### 4.2 In-Line AI Bullet Point Polisher (STAR Method)
* **Feature**: An "✨ AI Polish" button next to each work experience / project bullet point.
* **Modes**:
  * **Quantify & Metrics**: Turns vague statements into quantified results (*"Managed customer inquiries"* ➔ *"Resolved 85+ daily customer inquiries maintaining a 98.4% CSAT rating"*).
  * **Action-Verb Kick**: Replaces passive words (*"Responsible for..."*, *"Worked on..."*) with high-impact power verbs (*"Spearheaded..."*, *"Architected..."*, *"Streamlined..."*).
  * **STAR Method**: Structures the bullet around **S**ituation, **T**ask, **A**ction, **R**esult.

### 4.3 Multi-Tone Professional Summary Generator
* **Feature**: Generate 3 targeted variations of the executive summary based on work experience:
  1. **Leadership / Executive**: Emphasizes strategic vision, team growth, and P&L/business impact.
  2. **Technical Specialist**: Emphasizes architecture, system scale, cutting-edge tooling, and latency/uptime.
  3. **Growth / Impact**: Emphasizes rapid delivery, user acquisition, conversion metrics, and adaptability.

### 4.4 Matched Cover Letter Generator
* **Feature**: Automatically generate a synchronized 1-page cover letter:
  * Uses the same header typography, template aesthetic, and accent color palette as the resume.
  * Tailors the narrative directly to the pasted job description and target company name.
  * Can be exported together as a 2-page package or standalone PDF.

---

## 5. Export, Sharing & Version Management

### 5.1 Editable Word / DOCX Export
* **Goal**: Support recruiters and agencies that explicitly require `.docx` submissions.
* **Implementation**:
  * Use `docx` npm library to convert resume schema JSON into native Word styles, tables, and bulleted lists.

### 5.2 Public Web Portfolio Link (`resuma.ai/p/:slug`)
* **Goal**: Allow users to share a beautiful responsive web version of their resume with a single link.
* **Features**:
  * Custom public URL slug (e.g., `resuma.ai/p/usman-fullstack`).
  * "Download PDF" button directly on the page.
  * View analytics (visitor count, country, referral source).
  * Optional password protection for sensitive contact info.

### 5.3 Resume Forking & Multi-Version Cloning
* **Goal**: Support managing multiple tailored resumes for different roles.
* **Features**:
  * "Duplicate Resume" action on the dashboard.
  * Master Profile sync: updating your primary email, phone, or core education updates all forked resumes automatically.

---

## 6. Prioritization & Implementation Matrix

| Feature | Category | User Value | Effort | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Paper Size Switcher (A4 vs. US Letter)** | Canvas | High | Low (1 day) | 🟢 Phase 1 |
| **Font Family & Sizing Customizer** | Visual | Very High | Medium (2 days) | 🟢 Phase 1 |
| **Section Visibility Toggles (Eye Icon)** | Layout | High | Low (1 day) | 🟢 Phase 1 |
| **Section Title Renaming** | Layout | High | Low (1 day) | 🟢 Phase 1 |
| **"Shrink to 1 Page" Auto-Fit Algorithm** | Canvas | Extremely High | Medium (2 days) | 🟡 Phase 2 |
| **JD Matcher & Keyword Gap Analysis** | AI Suite | Extremely High | Medium (3 days) | 🟡 Phase 2 |
| **Custom Sections (Certifications, Awards)** | Content | High | Medium (2 days) | 🟡 Phase 2 |
| **In-Line AI Bullet Point Polisher** | AI Suite | Very High | Low-Medium (2 days)| 🟡 Phase 2 |
| **Discreet Contact QR Code** | Content | Medium | Low (1 day) | 🔵 Phase 3 |
| **Public Portfolio Web Link** | Sharing | High | Medium (3 days) | 🔵 Phase 3 |
| **DOCX / Word Export** | Export | High | High (4 days) | 🔵 Phase 3 |
| **Matched Cover Letter Generator** | AI Suite | Very High | High (4 days) | 🟣 Phase 4 |

---

*Document created for **Resuma AI** engineering roadmap. All recommendations maintain strict ATS compliance and Puppeteer PDF pixel-perfection.*
