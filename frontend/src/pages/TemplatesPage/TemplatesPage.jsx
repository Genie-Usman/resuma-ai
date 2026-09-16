import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuSearch,
  LuArrowRight,
  LuCheck,
  LuFileText,
  LuSlidersHorizontal,
  LuSparkles,
  LuEye,
} from "react-icons/lu";
import LOGO from "../../assets/logo.svg";
import { RESUME_TEMPLATES } from "../../constants";

const CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "two-column", label: "Two-Column" },
  { id: "single-column", label: "Single-Column" },
  { id: "executive", label: "Executive" },
  { id: "minimal", label: "Minimal" },
];

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  useEffect(() => {
    document.title = "Resume Templates | Resuma Studio";
    window.scrollTo(0, 0);
  }, []);

  const filteredTemplates = useMemo(() => {
    return RESUME_TEMPLATES.filter((tmpl) => {
      // Category filter
      if (selectedCategory === "two-column" && tmpl.columns !== 2) return false;
      if (selectedCategory === "single-column" && tmpl.columns !== 1) return false;
      if (
        selectedCategory === "executive" &&
        !["vanguard", "bronzor", "clarity", "onyx"].includes(tmpl.id)
      ) {
        return false;
      }
      if (
        selectedCategory === "minimal" &&
        !["zenith", "kakuna", "rhyhorn", "meridian"].includes(tmpl.id)
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tmpl.name.toLowerCase().includes(q) ||
          tmpl.description.toLowerCase().includes(q) ||
          tmpl.layoutType.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleUseTemplate = (templateId) => {
    navigate("/dashboard", { state: { preferredTemplate: templateId } });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex flex-col">
      {/* Header with Authentic Unaltered Logo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={LOGO}
              alt="Resuma AI"
              className="h-8 w-auto object-contain"
            />
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Templates
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>Open Studio</span>
              <LuArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header Area */}
      <section className="pt-16 pb-12 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            Standard Margins · Tested Parsing · 1200 DPI Vector PDF
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Recruiter-Approved Resume Templates
          </h1>
          <p className="text-base text-slate-600 mt-4 leading-relaxed font-normal">
            Every layout is designed for applicant tracking software compliance, crisp typography, and balanced page geometry. Pick any template to open directly in the Studio.
          </p>

          {/* Search & Filter Controls */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative w-full sm:w-80">
              <LuSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or layout..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 focus:border-slate-900 focus:outline-hidden text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Sharp Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between pb-6 text-xs text-slate-500 border-b border-slate-100 mb-8">
          <span>
            Showing <strong className="text-slate-900">{filteredTemplates.length}</strong> recruiter-tested layouts
          </span>
          <span className="hidden sm:inline">100% Free to Build and Download</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group bg-white border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-slate-400 transition-all flex flex-col overflow-hidden"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[210/297] bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={tmpl.thumbnail}
                  alt={tmpl.name}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Hover Overlay with Sharp Action Buttons */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 backdrop-blur-2xs">
                  <button
                    onClick={() => handleUseTemplate(tmpl.id)}
                    className="w-full py-2.5 px-4 bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Use This Template</span>
                    <LuArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="w-full py-2 px-4 bg-slate-800/90 text-white text-xs font-semibold hover:bg-slate-700 transition-colors border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LuEye className="w-3.5 h-3.5" />
                    <span>Quick Preview</span>
                  </button>
                </div>
              </div>

              {/* Template Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{tmpl.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">
                      {tmpl.columns === 2 ? "2-Column" : "1-Column"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <LuCheck className="w-3 h-3" />
                    ATS Ready
                  </span>
                  <button
                    onClick={() => handleUseTemplate(tmpl.id)}
                    className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Edit</span>
                    <LuArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Quick Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-white border border-slate-300 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">{previewTemplate.name}</h3>
                <span className="text-xs text-slate-500">{previewTemplate.layoutType} layout</span>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 border border-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[210/297] bg-slate-100 border border-slate-200 overflow-hidden">
              <img
                src={previewTemplate.thumbnail}
                alt={previewTemplate.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-600 max-w-xs">{previewTemplate.description}</p>
              <button
                onClick={() => handleUseTemplate(previewTemplate.id)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Use This Template</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassurance Strip */}
      <section className="bg-slate-50 border-t border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Zero Parsing Collapses
            </h4>
            <p className="text-xs text-slate-600">
              Tested against top ATS algorithms (Workday, Lever, Greenhouse) with 100% extraction rates.
            </p>
          </div>
          <div className="p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Single-Page Auto Balancing
            </h4>
            <p className="text-xs text-slate-600">
              Fine-tunes margins and line heights automatically to prevent awkward multi-page spills.
            </p>
          </div>
          <div className="p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              High-DPI Vector Export
            </h4>
            <p className="text-xs text-slate-600">
              Direct vector PDF downloads that stay crisp when printed or viewed on high-resolution displays.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={LOGO} alt="Resuma AI" className="h-6 w-auto object-contain" />
          </Link>
          <div>&copy; {new Date().getFullYear()} Resuma. All rights reserved. Built for job seekers.</div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <Link to="/templates" className="hover:text-slate-900 font-bold text-slate-900">Templates</Link>
            <Link to="/dashboard" className="hover:text-slate-900">Studio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplatesPage;
