import { useNavigate } from "react-router-dom";
import { LuArrowRight, LuCircleCheck } from "react-icons/lu";
import { motion } from "framer-motion";

const CtaBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-10 sm:p-16 text-center shadow-xl border border-slate-800">
          <div className="relative max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Free Forever Starter Plan</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to put your name on it?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg mx-auto font-normal">
              Join over 1,400,000 job seekers who built clean, interview-winning resumes with Resuma. Build and download your resume completely free.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-colors cursor-pointer"
              >
                <span>Build Your Resume Free</span>
                <LuArrowRight className="w-4 h-4 text-slate-900" />
              </motion.button>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <LuCircleCheck className="w-3.5 h-3.5 text-emerald-400" />
                ATS-tested layouts
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <LuCircleCheck className="w-3.5 h-3.5 text-emerald-400" />
                Ready in under 10 minutes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <LuCircleCheck className="w-3.5 h-3.5 text-emerald-400" />
                High-resolution vector PDF
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
