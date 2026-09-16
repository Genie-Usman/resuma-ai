import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  LuStar,
  LuQuote,
  LuCircleCheck,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

// Swiper core styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const REVIEWS = [
  {
    name: "Marcus Chen",
    role: "Senior Cloud Engineer",
    outcome: "Hired at Amazon",
    initials: "MC",
    content:
      "I was applying for months with a messy Word resume and getting zero callbacks. Switched to the Clarity template on Resuma AI, used the bullet assistant to quantify my achievements, and had 3 interviews lined up within 10 days.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Product Marketing Manager",
    outcome: "Hired at Stripe",
    initials: "SJ",
    content:
      "The single-page fit tool is a lifesaver. Normally when you add one sentence, your resume spills into an awkward second page with two lonely lines. Resuma balanced the margins cleanly, and the matching cover letter was spot-on.",
    rating: 5,
  },
  {
    name: "David Okafor",
    role: "Financial Analyst",
    outcome: "Hired at Deloitte",
    initials: "DO",
    content:
      "Unlike other resume builders that trap you with a hidden paywall screen right after you spend an hour writing, Resuma is honest, fast, and gives you a real, vector PDF that passes applicant tracking systems.",
    rating: 5,
  },
  {
    name: "Elena Rostova",
    role: "UX Research Lead",
    outcome: "Hired at Figma",
    initials: "ER",
    content:
      "As a designer, I am extremely particular about typography and grid spacing. Resuma is the only online tool that respects true typographic hierarchy. It looks like it was typeset by a professional designer.",
    rating: 5,
  },
  {
    name: "Michael Torres",
    role: "Clinical Specialist",
    outcome: "Hired at Mayo Clinic",
    initials: "MT",
    content:
      "Transitioning hospitals required an ATS-compliant resume that clearly listed my certifications and ICU patient hours. Resuma made formatting effortless. Highly recommend to any healthcare professional.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const swiperRef = useRef(null);

  return (
    <section className="py-24 relative bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Slider Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              <LuStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Real Candidate Outcomes</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Loved by job seekers who got hired.
            </h2>

            <p className="text-base text-slate-600">
              Read how professionals turned frustrating application processes into interview invitations.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Previous testimonial"
            >
              <LuChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Next testimonial"
            >
              <LuChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="!pb-12"
          >
            {REVIEWS.map((rev) => (
              <SwiperSlide key={rev.name} className="h-auto">
                <div className="h-full p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-4">
                    {/* Stars & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400 gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <LuStar
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <LuQuote className="w-5 h-5 text-slate-300" />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      "{rev.content}"
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {rev.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{rev.name}</span>
                        <LuCircleCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-xs font-semibold text-slate-900">
                        {rev.outcome}
                      </div>
                      <div className="text-[11px] text-slate-500">{rev.role}</div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Verification Strip */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-slate-900">4.9 / 5.0</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Candidate Satisfaction Rating
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">1.4M+</div>
            <div className="text-xs text-slate-500 mt-0.5">Resumes Built</div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">100%</div>
            <div className="text-xs text-slate-500 mt-0.5">
              ATS Compliant Layouts
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">&lt; 10 min</div>
            <div className="text-xs text-slate-500 mt-0.5">Average Time to Build</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
