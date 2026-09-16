import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronDown, LuCircleHelp } from "react-icons/lu";

const FAQS = [
  {
    q: "Is Resuma really free to build and download?",
    a: "Yes. You can build, customize, and download a complete, professional resume in high-resolution vector PDF with zero upfront barriers. We believe everyone deserves a great resume to start their career. Premium options are available if you need unlimited tailored versions and AI writing assistance.",
  },
  {
    q: "Will company hiring software (ATS) be able to read my resume?",
    a: "Yes. Every template uses standard chronological headings (Work Experience, Education, Skills) and clean vector fonts. They are tested to ensure company applicant tracking systems like Workday, Greenhouse, and Lever parse your text with 100% accuracy.",
  },
  {
    q: "How does Resuma differ from copy-pasting from ChatGPT?",
    a: "While ChatGPT only generates unformatted raw text, Resuma designs your complete physical resume. You get instant bullet enhancements, real-time single-page layout balancing, matching cover letters, and an ATS-tested vector PDF all in one integrated studio.",
  },
  {
    q: "What if my resume spills into a second page with just two lines?",
    a: "We built a one-click 'Single-Page Fit' tool. It automatically fine-tunes line height, margin padding, and font metrics by fractions of a millimeter so your resume fits cleanly on exactly one page without looking crammed.",
  },
  {
    q: "Can I synchronize a matching cover letter?",
    a: "Yes. In the studio editor, you can toggle between your resume and a synchronized cover letter with the exact same header layout, font styling, and color theme.",
  },
  {
    q: "Can I customize the fonts, colors, and margins?",
    a: "Yes. With our visual Studio drawers, you can choose curated color swatches, Google typography, and adjust margins. You can also reorder sections with simple drag-and-drop.",
  },
  {
    q: "Is my private career information secure?",
    a: "100%. We never sell your personal data or share your resume with third-party recruiters. Your documents are private and encrypted.",
  },
];

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-24 relative bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <LuCircleHelp className="w-3.5 h-3.5 text-slate-600" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-slate-600">
            Clear, straightforward answers about building, formatting, and downloading your resume.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.q}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgb(0,0,0,0.02)] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 text-white bg-slate-900"
                        : "text-slate-400 bg-slate-100"
                    }`}
                  >
                    <LuChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqAccordion;
