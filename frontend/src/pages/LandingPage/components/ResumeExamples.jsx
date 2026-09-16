import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuBriefcase, LuArrowRight, LuCheck } from "react-icons/lu";

const EXAMPLES = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    level: "Mid to Senior Level",
    summary:
      "Full-stack software engineer with 5+ years building distributed cloud applications and high-throughput microservices. Experienced in React, Node.js, and automated CI/CD workflows.",
    bullets: [
      "Architected real-time notification engine supporting 2.5M concurrent users with 99.98% uptime.",
      "Refactored legacy REST endpoints into GraphQL, cutting frontend network payload by 42%.",
      "Mentored 6 junior engineers and introduced automated testing, reducing bug escape rate by 30%.",
    ],
    skills: ["React & TypeScript", "Node.js", "PostgreSQL", "Docker & Kubernetes", "AWS"],
    template: "clarity",
    layoutName: "Clarity (2-Column)",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    level: "Director & Senior Lead",
    summary:
      "Customer-centric product manager with 7+ years driving B2B SaaS roadmaps from discovery to global launch. Expert in user research, A/B testing, and cross-functional leadership.",
    bullets: [
      "Owned end-to-end launch of enterprise billing portal, generating $4.2M net-new ARR in year one.",
      "Conducted 50+ customer discovery interviews to define core workflow requirements.",
      "Championed agile sprint cadences across engineering, design, and product marketing.",
    ],
    skills: ["Product Strategy", "User Journey Mapping", "A/B Experimentation", "SQL & Analytics", "Roadmapping"],
    template: "vanguard",
    layoutName: "Vanguard (Executive)",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    level: "Mid Level",
    summary:
      "Analytical data specialist with 4+ years turning complex datasets into executive dashboards and actionable business insights. Proficient in SQL, Python, and Tableau.",
    bullets: [
      "Built automated revenue forecasting dashboards saving finance team 15 hours weekly.",
      "Identified user drop-off points in onboarding funnel, increasing signup conversion by 18%.",
      "Queried multi-terabyte data warehouses to track cohort retention and lifetime value.",
    ],
    skills: ["Advanced SQL", "Python (Pandas)", "Tableau & PowerBI", "Statistical Modeling", "ETL Pipelines"],
    template: "meridian",
    layoutName: "Meridian (Timeline)",
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    level: "Growth & Brand Lead",
    summary:
      "Performance marketing strategist with 6+ years scaling demand generation and customer acquisition across organic and paid channels. Passionate about storytelling and conversion rate optimization.",
    bullets: [
      "Managed $800K annual advertising budget across Meta and Google, delivering 3.8x ROAS.",
      "Grew organic search traffic by 125% year-over-year through targeted content clusters.",
      "Produced quarterly webinar series generating 4,500+ qualified enterprise leads.",
    ],
    skills: ["Paid Search (SEM)", "SEO Optimization", "HubSpot & Marketo", "Content Strategy", "Google Analytics"],
    template: "leafish",
    layoutName: "Leafish (Sidebar Accent)",
  },
  {
    id: "registered-nurse",
    title: "Registered Nurse (RN)",
    level: "Clinical Specialist",
    summary:
      "Compassionate, BLS/ACLS certified Registered Nurse with 5+ years providing high-acuity patient care in fast-paced ICU and emergency department environments.",
    bullets: [
      "Delivered direct clinical care to 15+ acute patients per shift, maintaining zero medication errors.",
      "Collaborated with multidisciplinary physician teams on patient stabilization and recovery protocols.",
      "Educated patients and family members on post-discharge care plans and rehabilitation.",
    ],
    skills: ["Acute Patient Care", "Medication Admin", "BLS & ACLS Certified", "Epic EMR", "Emergency Triage"],
    template: "onyx",
    layoutName: "Onyx (Modern Compact)",
  },
];

const ResumeExamples = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(EXAMPLES[0]);

  const handleUseExample = (templateId) => {
    navigate("/dashboard", { state: { preferredTemplate: templateId } });
  };

  return (
    <section id="examples" className="py-24 relative bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <LuBriefcase className="w-3.5 h-3.5 text-slate-600" />
            <span>Role-Specific Guides</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Real resume examples for your role.
          </h2>

          <p className="text-base text-slate-600">
            See how successful professionals format their career history, write quantifiable bullet points, and choose the right template.
          </p>

          {/* Role selector chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {EXAMPLES.map((ex) => {
              const isSelected = selectedRole.id === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => setSelectedRole(ex)}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {ex.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Example Card with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Curated Field Guide
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedRole.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedRole.level} · Recommended Layout:{" "}
                  <span className="text-slate-800 font-bold">
                    {selectedRole.layoutName}
                  </span>
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUseExample(selectedRole.template)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>Use this layout</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Professional Summary Example
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/70 font-normal">
                "{selectedRole.summary}"
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quantified Achievement Bullets
              </h4>
              <div className="space-y-2.5">
                {selectedRole.bullets.map((bullet, i) => (
                  <div
                    key={i}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <LuCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Badges */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Skills for ATS Keyword Matching
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRole.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ResumeExamples;
