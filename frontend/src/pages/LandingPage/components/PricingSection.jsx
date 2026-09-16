import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCheck, LuArrowRight, LuTag } from "react-icons/lu";
import { motion } from "framer-motion";

const PricingSection = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  const handleSelectPlan = () => {
    navigate("/dashboard");
  };

  return (
    <section id="pricing" className="py-24 relative bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <LuTag className="w-3.5 h-3.5 text-slate-600" />
            <span>Honest & Transparent</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Simple pricing to get you hired.
          </h2>

          <p className="text-base text-slate-600">
            Build and download your first resume completely free. Upgrade only when you want unlimited tailored versions, AI bullet writer, and matching cover letters.
          </p>

          {/* Billing Interval Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span
              className={`text-xs font-bold transition-colors ${
                !isAnnual ? "text-slate-900" : "text-slate-500"
              }`}
            >
              Monthly Billing
            </span>

            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-slate-900 p-1 transition-colors relative cursor-pointer"
              aria-label="Toggle annual billing"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span
              className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isAnnual ? "text-slate-900" : "text-slate-500"
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Save 40%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Clean Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Tier 1: Free Forever */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter Plan
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Free Forever
                </h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">$0</span>
                <span className="text-xs text-slate-500 font-medium">
                  / forever
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Everything you need to build and download a professional, ATS-tested resume for your next job application.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                {[
                  "1 Active Resume",
                  "Access to core ATS templates",
                  "Standard typography & color themes",
                  "High-resolution vector PDF export",
                  "100% free with no watermarks",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <LuCheck className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSelectPlan}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Start for Free
              </motion.button>
            </div>
          </div>

          {/* Tier 2: Pro Job Seeker (Featured) */}
          <div className="p-8 rounded-3xl bg-white border-2 border-slate-900 shadow-[0_12px_40px_rgb(0,0,0,0.08)] relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wider uppercase shadow-sm">
              Most Popular
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Pro Plan
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Active Job Seeker
                </h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">
                  {isAnnual ? "$9" : "$15"}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / month {isAnnual ? "(billed annually)" : "(billed monthly)"}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Tailor a custom resume for every job you apply to and double your interview callback rate.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                {[
                  "Unlimited resumes & cover letters",
                  "AI bullet suggestions & rewrite assistant",
                  "ATS X-Ray scanner & keyword checker",
                  "Single-page fit auto-balancing",
                  "Private web link & printable QR code",
                  "Vector PDF, plain text, and JSON exports",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-slate-800 font-medium">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <LuCheck className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSelectPlan}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Pro</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Tier 3: Lifetime Access */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lifetime Pass
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Pay Once, Own Forever
                </h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">$69</span>
                <span className="text-xs text-slate-500 font-medium">
                  / one-time payment
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Ideal for professionals who want long-term career support without recurring monthly subscriptions.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                {[
                  "All Pro features included forever",
                  "No recurring bills or expiration",
                  "Lifetime access to all future templates",
                  "Priority customer support",
                  "Full data backup & instant export",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <LuCheck className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSelectPlan}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                Get Lifetime Access
              </motion.button>
            </div>
          </div>
        </div>

        {/* Reassurance Strip */}
        <div className="mt-12 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-6">
          <span>7-day money-back guarantee</span>
          <span>•</span>
          <span>Cancel anytime with 1 click</span>
          <span>•</span>
          <span>Secure checkout via Stripe</span>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
