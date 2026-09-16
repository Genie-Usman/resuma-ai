import { LuUsers, LuClock, LuBriefcase, LuShieldCheck } from "react-icons/lu";
import { motion } from "framer-motion";

const METRICS = [
  {
    value: "1,400,000+",
    label: "Resumes Created",
    sublabel: "By job seekers across 120+ industries",
    icon: LuUsers,
  },
  {
    value: "10 Minutes",
    label: "Average Build Time",
    sublabel: "From blank to ready-to-send",
    icon: LuClock,
  },
  {
    value: "3x More",
    label: "Interview Responses",
    sublabel: "Reported vs unformatted documents",
    icon: LuBriefcase,
  },
  {
    value: "100% Free",
    label: "To Start Building",
    sublabel: "Start building immediately with zero barriers",
    icon: LuShieldCheck,
  },
];

const MetricsBar = () => {
  return (
    <section className="relative -mt-6 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)]"
        >
          {METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="flex flex-col items-center sm:items-start text-center sm:text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {metric.value}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800">
                  {metric.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {metric.sublabel}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsBar;
