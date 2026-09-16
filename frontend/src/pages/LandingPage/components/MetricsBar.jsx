import { motion } from "framer-motion";

const METRICS = [
  {
    value: "24,800+",
    label: "Resumes Built",
    sublabel: "Engineered for tech, finance & product roles",
  },
  {
    value: "98.4%",
    label: "ATS Pass Rate",
    sublabel: "Tested across Workday, Lever & Greenhouse",
  },
  {
    value: "12 Mins",
    label: "Average Build Time",
    sublabel: "From blank canvas to recruiter-ready PDF",
  },
  {
    value: "16+ Layouts",
    label: "Continuously Expanding",
    sublabel: "Single and two-column standards, updated regularly",
  },
];

const MetricsBar = () => {
  return (
    <section className="relative py-16 sm:py-20 border-y border-slate-200/80 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-0 lg:divide-x divide-slate-200/80">
          {METRICS.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col justify-between lg:px-8 first:lg:pl-0 last:lg:pr-0 group"
            >
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 block mb-2 select-none">
                  0{idx + 1}
                </span>
                <div className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight tabular-nums leading-none group-hover:text-slate-950 transition-colors">
                  {metric.value}
                </div>
              </div>
              <div className="mt-4 sm:mt-5">
                <div className="text-sm font-bold text-slate-900 tracking-tight">
                  {metric.label}
                </div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed font-normal max-w-[28ch]">
                  {metric.sublabel}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsBar;
