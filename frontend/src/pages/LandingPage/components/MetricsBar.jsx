import { motion } from "framer-motion";

const METRICS = [
  {
    value: "24,800+",
    label: "Resumes Built",
    sublabel: "Crafted for technical, finance & product roles",
  },
  {
    value: "98.4%",
    label: "ATS Extraction Rate",
    sublabel: "Tested against Workday, Lever & Greenhouse scanners",
  },
  {
    value: "12 Mins",
    label: "Average Completion",
    sublabel: "From blank canvas to recruiter-ready export",
  },
  {
    value: "Expanding",
    label: "Recruiter Standards",
    sublabel: "Single and multi-column layouts updated regularly",
  },
];

const MetricsBar = () => {
  return (
    <section className="relative py-14 sm:py-20 bg-gradient-to-b from-white via-slate-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified, Understated Editorial Proof Strip (No bubbly AI cards or pill badges) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                className="p-6 sm:p-7 lg:py-8 lg:px-7 hover:bg-slate-50/50 transition-colors duration-200 group flex flex-col justify-center"
              >
                <div className="text-3xl sm:text-[32px] lg:text-4xl font-black text-slate-900 tracking-tight tabular-nums leading-none group-hover:text-slate-950 transition-colors">
                  {metric.value}
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-slate-800 mt-2.5 tracking-tight">
                  {metric.label}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                  {metric.sublabel}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsBar;
