import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { LuChevronLeft, LuChevronRight, LuArrowRight } from "react-icons/lu";
import { motion } from "framer-motion";

// Swiper core styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Template thumbnails
import CLARITY from "../../../assets/template_images/clarity.webp";
import VANGUARD from "../../../assets/template_images/vanguard.webp";
import MERIDIAN from "../../../assets/template_images/meridian.webp";
import ZENITH from "../../../assets/template_images/zenith.jpg";
import LEAFISH from "../../../assets/template_images/leafish.jpg";
import ONYX from "../../../assets/template_images/onyx.jpg";
import CHIKORITA from "../../../assets/template_images/chikorita.jpg";
import AZURILL from "../../../assets/template_images/azurill.jpg";

const TEMPLATES = [
  {
    id: "clarity",
    name: "Clarity",
    badge: "Most Popular",
    category: "executive",
    cols: "2-Column",
    thumbnail: CLARITY,
    description:
      "Crisp white layout with modern circular icon badges and an executive top summary. Ideal for senior specialists and directors.",
  },
  {
    id: "vanguard",
    name: "Vanguard",
    badge: "Executive",
    category: "executive",
    cols: "2-Column",
    thumbnail: VANGUARD,
    description:
      "Charcoal top header banner with dedicated career narrative and clean sidebar. Perfect for managers, leads, and consultants.",
  },
  {
    id: "meridian",
    name: "Meridian",
    badge: "Recommended",
    category: "modern",
    cols: "2-Column",
    thumbnail: MERIDIAN,
    description:
      "Timeline spine that maps your career progression with circular milestones. Excellent for engineers and technical specialists.",
  },
  {
    id: "zenith",
    name: "Zenith",
    badge: "Classic",
    category: "minimal",
    cols: "2-Column",
    thumbnail: ZENITH,
    description:
      "Professional left sidebar with high-contrast section headers. Balanced space for skills, software, and history.",
  },
  {
    id: "leafish",
    name: "Leafish",
    badge: "Creative",
    category: "modern",
    cols: "2-Column",
    thumbnail: LEAFISH,
    description:
      "Modern warm layout with clean typography. Gives equal weight to technical competencies and career accomplishments.",
  },
  {
    id: "onyx",
    name: "Onyx",
    badge: "Simple",
    category: "minimal",
    cols: "1-Column",
    thumbnail: ONYX,
    description:
      "Traditional single-column layout with highest ATS compatibility. Best for federal, legal, and academic applications.",
  },
  {
    id: "chikorita",
    name: "Chikorita",
    badge: "Fresh",
    category: "modern",
    cols: "2-Column",
    thumbnail: CHIKORITA,
    description:
      "Approachable modern aesthetic with spacious layout. Great for career changers, educators, and graduates.",
  },
  {
    id: "azurill",
    name: "Azurill",
    badge: "Compact",
    category: "minimal",
    cols: "2-Column",
    thumbnail: AZURILL,
    description:
      "High information density layout designed to fit extensive career histories into a compact, readable single page.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "executive", label: "Executive & 2-Col" },
  { id: "modern", label: "Modern & Tech" },
  { id: "minimal", label: "Clean & Simple" },
];

const TemplateShowcase = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const swiperRef = useRef(null);

  const filtered =
    activeCategory === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleUseTemplate = (templateId) => {
    navigate("/dashboard", { state: { preferredTemplate: templateId } });
  };

  return (
    <section id="templates" className="py-24 relative bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <span>Recruiter-Approved Layouts</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Choose a template that fits your career.
            </h2>

            <p className="text-base text-slate-600">
              Every template is built with standard margins, selectable text, and
              clean headings so hiring systems parse your information with 100%
              accuracy.
            </p>
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Previous template"
            >
              <LuChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Next template"
            >
              <LuChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Swiper Slider */}
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-14"
        >
          {filtered.map((tmpl) => (
            <SwiperSlide key={tmpl.id} className="h-auto">
              <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
                {/* Thumbnail Sheet */}
                <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={tmpl.thumbnail}
                    alt={tmpl.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-md shadow-xs">
                      {tmpl.badge}
                    </span>
                    <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-white/95 text-slate-800 shadow-2xs border border-slate-200/60">
                      {tmpl.cols}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUseTemplate(tmpl.id)}
                      className="w-full py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Use This Template
                    </motion.button>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-slate-900">
                        {tmpl.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ATS Safe
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Free to customize</span>
                    <button
                      onClick={() => handleUseTemplate(tmpl.id)}
                      className="font-bold text-slate-900 hover:text-indigo-600 inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Select</span>
                      <LuArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <span>Browse Full Template Library</span>
            <LuArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
