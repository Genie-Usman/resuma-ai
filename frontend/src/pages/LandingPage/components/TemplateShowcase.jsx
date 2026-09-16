import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Keyboard } from "swiper/modules";
import { LuChevronLeft, LuChevronRight, LuArrowRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

// Swiper core & effect styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

// All 16 authentic template thumbnails
import CLARITY from "../../../assets/template_images/clarity.webp";
import VANGUARD from "../../../assets/template_images/vanguard.webp";
import MERIDIAN from "../../../assets/template_images/meridian.webp";
import ZENITH from "../../../assets/template_images/zenith.jpg";
import LEAFISH from "../../../assets/template_images/leafish.jpg";
import ONYX from "../../../assets/template_images/onyx.jpg";
import CHIKORITA from "../../../assets/template_images/chikorita.jpg";
import AZURILL from "../../../assets/template_images/azurill.jpg";
import BRONZOR from "../../../assets/template_images/bronzor.jpg";
import DITTO from "../../../assets/template_images/ditto.jpg";
import GENGAR from "../../../assets/template_images/gengar.jpg";
import GLALIE from "../../../assets/template_images/glalie.jpg";
import KAKUNA from "../../../assets/template_images/kakuna.jpg";
import NOSEPASS from "../../../assets/template_images/nosepass.jpg";
import PIKACHU from "../../../assets/template_images/pikachu.jpg";
import RHYHORN from "../../../assets/template_images/rhyhorn.jpg";

const TEMPLATES = [
  {
    id: "clarity",
    name: "Clarity",
    style: "Executive 2-Column",
    tagline: "Crisp white geometry with top executive summary",
    thumbnail: CLARITY,
  },
  {
    id: "vanguard",
    name: "Vanguard",
    style: "Leadership Banner",
    tagline: "Charcoal header with dedicated career narrative",
    thumbnail: VANGUARD,
  },
  {
    id: "meridian",
    name: "Meridian",
    style: "Technical Timeline",
    tagline: "Vertical milestone spine designed for engineers",
    thumbnail: MERIDIAN,
  },
  {
    id: "zenith",
    name: "Zenith",
    style: "Classic Sidebar",
    tagline: "High-contrast left column for deep skill trees",
    thumbnail: ZENITH,
  },
  {
    id: "leafish",
    name: "Leafish",
    style: "Modern Balanced",
    tagline: "Equal weight for competencies and achievements",
    thumbnail: LEAFISH,
  },
  {
    id: "onyx",
    name: "Onyx",
    style: "Single Column Standard",
    tagline: "Highest ATS compatibility for legal & corporate roles",
    thumbnail: ONYX,
  },
  {
    id: "chikorita",
    name: "Chikorita",
    style: "Fresh & Approachable",
    tagline: "Spacious layout ideal for career changers",
    thumbnail: CHIKORITA,
  },
  {
    id: "azurill",
    name: "Azurill",
    style: "High Density Grid",
    tagline: "Engineered to fit extensive history into 1 page",
    thumbnail: AZURILL,
  },
  {
    id: "bronzor",
    name: "Bronzor",
    style: "Compact Technical",
    tagline: "Monospace skill grouping with clean hierarchy",
    thumbnail: BRONZOR,
  },
  {
    id: "ditto",
    name: "Ditto",
    style: "Adaptive Minimalist",
    tagline: "Distraction-free typographic flow for specialists",
    thumbnail: DITTO,
  },
  {
    id: "gengar",
    name: "Gengar",
    style: "High Contrast Dark Accent",
    tagline: "Bold contrast borders for creative engineers",
    thumbnail: GENGAR,
  },
  {
    id: "glalie",
    name: "Glalie",
    style: "Geometric Crisp",
    tagline: "Precise lines and clean section divides",
    thumbnail: GLALIE,
  },
  {
    id: "kakuna",
    name: "Kakuna",
    style: "Structured Corporate",
    tagline: "Strict margins and recruiter-vetted order",
    thumbnail: KAKUNA,
  },
  {
    id: "nosepass",
    name: "Nosepass",
    style: "Analytical Sidebar",
    tagline: "Quantifiable metric badges and project sections",
    thumbnail: NOSEPASS,
  },
  {
    id: "pikachu",
    name: "Pikachu",
    style: "Clean Accent",
    tagline: "Modern punchy highlights with classic structure",
    thumbnail: PIKACHU,
  },
  {
    id: "rhyhorn",
    name: "Rhyhorn",
    style: "Solid Columnar",
    tagline: "Authoritative structure for operations & leadership",
    thumbnail: RHYHORN,
  },
];

const TemplateShowcase = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(1);
  const swiperRef = useRef(null);

  const activeTemplate = TEMPLATES[activeIndex] || TEMPLATES[0];

  const handleUseTemplate = (templateId) => {
    navigate("/dashboard", { state: { preferredTemplate: templateId } });
  };

  return (
    <section
      id="templates"
      className="relative py-14 sm:py-18 bg-[#0c0d11] text-white overflow-hidden border-b border-slate-800"
    >
      {/* Background Architectural Wireframe Grid */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-15">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
        >
          <defs>
            <pattern
              id="theaterGrid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#theaterGrid)" />
        </svg>
      </div>

      {/* Subtle Center Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[650px] h-[350px] bg-radial from-indigo-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Strict Page Width Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* ========================================================= */}
        {/* HEADER: Scaled Down & Balanced Editorial Typography       */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-[1.08]">
              Same story.
              <br />
              <span className="text-slate-400">A different look.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Sixteen recruiter-tested layouts. Pick the standard that matches
              your seniority. You can adjust typography, color palettes, and
              margins directly in the studio.
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3D COVERFLOW: Contained Within Page Width, Unrounded Resumes */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden w-full py-2">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            initialSlide={1}
            slideToClickedSlide={true}
            keyboard={{ enabled: true }}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 160,
              modifier: 1,
              slideShadows: true,
            }}
            modules={[EffectCoverflow, Navigation, Keyboard]}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full py-4"
          >
            {TEMPLATES.map((tmpl, idx) => {
              const isActive = idx === activeIndex;
              return (
                <SwiperSlide
                  key={tmpl.id}
                  className="!w-[200px] sm:!w-[240px] md:!w-[265px] select-none"
                >
                  {/* Physical Paper Document Canvas: Sharp 90-Degree Unrounded Corners */}
                  <div
                    className={`relative rounded-none overflow-hidden transition-all duration-300 ${
                      isActive
                        ? "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)] ring-1 ring-white/25"
                        : "opacity-70 hover:opacity-85 shadow-lg ring-1 ring-white/10"
                    }`}
                  >
                    {/* Strict A4 Aspect Ratio Paper Sheet */}
                    <div className="relative aspect-[1/1.414] bg-white overflow-hidden rounded-none">
                      <img
                        src={tmpl.thumbnail}
                        alt={tmpl.name}
                        className="w-full h-full object-cover object-top pointer-events-none"
                        loading={idx < 4 ? "eager" : "lazy"}
                      />

                      {/* Active Center Slide Interactive Overlay */}
                      {isActive && (
                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                          <button
                            onClick={() => handleUseTemplate(tmpl.id)}
                            className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>Use {tmpl.name}</span>
                            <LuArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM CONTROLS: Scaled Down Arrow Navigation & Meta      */}
        {/* ========================================================= */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800/80">
          {/* Active Template Meta */}
          <div className="text-center sm:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTemplate.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {activeTemplate.name}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                  <span className="font-semibold text-slate-300">
                    {activeTemplate.style}
                  </span>
                  <span>·</span>
                  <span>{activeTemplate.tagline}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls: < [Counter] > [CTA] */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Previous template"
            >
              <LuChevronLeft className="w-4 h-4" />
            </button>

            {/* Compact Counter */}
            <div className="font-mono text-xs font-bold text-slate-300 px-3 py-1.5 rounded-md bg-slate-900/60 border border-slate-800 tabular-nums">
              {activeIndex + 1} / {TEMPLATES.length}
            </div>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Next template"
            >
              <LuChevronRight className="w-4 h-4" />
            </button>

            {/* Compact CTA */}
            <button
              onClick={() => handleUseTemplate(activeTemplate.id)}
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-98"
            >
              <span>Customize Template</span>
              <LuArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
