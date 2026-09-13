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

### 1.2 Global Density & Spacing Scale
* **Goal**: Provide a slider or preset switcher to quickly adjust content density.
* **Options**:
  * **Compact**: `line-height: 1.3`, smaller section margins (`8px`), font size scale `0.9x`. Perfect for fitting content onto a single page.
  * **Standard (Default)**: `line-height: 1.5`, section margins (`14px`), standard scale `1.0x`.
  * **Spacious**: `line-height: 1.65`, section margins (`20px`), font scale `1.05x`. Ideal for students or professionals with concise summaries.
* **CSS Implementation**:
  * Use CSS custom properties: `--resume-line-height`, `--resume-section-gap`, `--resume-font-scale`.

### 1.3 Page Margin Adjuster
* **Goal**: Allow users to adjust physical page margins on the A4/Letter sheet.
* **Presets**:
  * **Narrow** (`12mm` / `0.47in`): Maximizes printable area.
  * **Standard** (`18mm` / `0.7in`): Recommended for balanced aesthetic.
  * **Wide** (`24mm` / `0.95in`): Elegant, editorial look for lighter content.
* **PDF Sync**: Passed directly to Puppeteer `@page { margin: ... }` in `backend/services/pdfService.js` to ensure 100% WYSIWYG fidelity.

### 1.4 Custom Color Palette Builder & Contrast Checker
* **Goal**: Expand beyond preset color palettes with a custom color picker.
* **Features**:
  * **Hex / HSL Picker**: Allows picking exact corporate or personal brand colors.
  * **Real-time WCAG Contrast Checker**: Automatically warns if the selected accent color produces insufficient contrast against white paper (minimum 4.5:1 ratio for body text, 3:1 for large headers).
  * **Color Roles**: Primary Accent (headers, icons), Secondary Accent (dates, subtitles), Neutral Dark (body text).

### 1.5 Section Header Decorator Styles
* **Goal**: Customize how section headers (e.g., "Work Experience", "Education") render.
* **Styles**:
  * `Underline` (thin colored line across the width)
  * `Left Accent Bar` (thick vertical colored bar to the left of the title)
  * `Pill / Badge` (subtle light-tinted background badge)
  * `Minimal Uppercase` (clean tracked uppercase with no lines)

---

## 2. Canvas & Page Layout Intelligence

### 2.1 "Shrink to 1 Page" (Smart Auto-Fit)
* **Problem**: Users often have 2 to 4 orphan lines spilling over onto Page 2.
* **Solution**: A single-click optimization algorithm:
  * Measures total sheet overflow height.
  * Incrementally micro-tunes:
    * Font size (`-0.25pt` increments down to a safe minimum of `9.5pt`).
    * Section vertical margins (`-1px` increments).
    * Line height (`-0.05` increments down to `1.25`).
  * Stops immediately when total document height $\le 1123\text{px}$ (exact A4 height).
  * Toast notification: *"Optimized! All content now fits cleanly on 1 page."*

### 2.2 Paper Size Standard Switcher (A4 vs. US Letter)
* **Problem**: North American job applications prefer US Letter (`8.5" x 11"` / `816px x 1056px`), while international applications mandate A4 (`210mm x 297mm` / `794px x 1123px`).
* **Solution**:
  * Add a paper size toggle in the Canvas `Display` dropdown:
    * `A4 Paper (210 × 297 mm)`
    * `US Letter (8.5 × 11 in)`
  * Updates both the preview canvas dimensions and Puppeteer's PDF generation options (`format: 'A4'` vs `format: 'Letter'`).

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
