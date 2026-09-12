import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LuShieldCheck,
  LuLock,
  LuFileText,
  LuSparkles,
  LuCookie,
  LuUserCheck,
  LuTrash2,
  LuArrowLeft,
  LuExternalLink,
  LuServer,
  LuEyeOff,
} from "react-icons/lu";
import Footer from "../../components/shared/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "overview",
      icon: LuShieldCheck,
      title: "1. Overview & Data Sovereignty",
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            At <strong>Resuma AI</strong>, we believe your professional story and personal credentials belong
            exclusively to you. We are firmly committed to protecting your privacy, maintaining data transparency,
            and giving you full sovereign control over your resumes and career assets.
          </p>
          <p>
            This Privacy Policy details what information we collect when you use Resuma AI, how that data is
            processed to render and format resumes, our zero-data-selling pledge, and your rights under global
            privacy regulations including GDPR and CCPA.
          </p>
        </div>
      ),
    },
    {
      id: "data-collection",
      icon: LuFileText,
      title: "2. Information We Collect",
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>To provide our resume building, formatting, and export services, we collect:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Account Information:</strong> Your name, email address, and hashed authentication credentials
              when registering directly, or profile identifiers and avatars provided through Google OAuth or LinkedIn OAuth.
            </li>
            <li>
              <strong>Resume Content:</strong> Professional summaries, employment history, educational background,
              technical skills, certifications, awards, projects, contact details, and optional profile pictures you
              choose to upload.
            </li>
            <li>
              <strong>Document Preferences:</strong> Template themes, accent colors, typography selections, column
              layouts, and visibility toggles configured within the Studio.
            </li>
            <li>
              <strong>Operational Logs:</strong> Anonymized server logs, error reports, and connection telemetry
              necessary to maintain service reliability and server performance.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "ai-transparency",
      icon: LuSparkles,
      title: "3. Artificial Intelligence & Google Gemini",
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            Resuma AI leverages <strong>Google Gemini</strong> to provide automated resume bullet point enhancement,
            professional summary drafting, and tone optimization.
          </p>
          <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-xl text-purple-950 text-xs font-medium space-y-2">
            <p className="flex items-center gap-1.5 font-bold text-purple-900">
              <LuSparkles className="text-purple-600 shrink-0" />
              Our Strict AI Processing Guarantees:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Zero Model Training:</strong> Your resume data is never used to train, retrain, or fine-tune public AI models.</li>
              <li><strong>Secure Proxy:</strong> Prompts are dispatched exclusively via authenticated, encrypted backend API calls—never exposed in the client browser.</li>
              <li><strong>Opt-In Generation:</strong> AI features only execute when explicitly triggered by you (e.g., clicking "AI Rewrite" or "Optimize").</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "cookies-security",
      icon: LuCookie,
      title: "4. Authentication & HttpOnly Cookie Security",
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            We adhere to modern web security principles. Unlike legacy applications that store authentication tokens
            in client-side <code className="bg-slate-100 text-purple-700 px-1.5 py-0.5 rounded text-xs">localStorage</code>,
            Resuma AI delivers session JWTs via <strong>HttpOnly, SameSite=Lax, Secure cookies</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>XSS Immunity:</strong> JavaScript code running in the browser cannot read or extract your authentication cookie, effectively shielding your account against Cross-Site Scripting (XSS) attacks.
            </li>
            <li>
              <strong>CSRF Mitigations:</strong> Strict SameSite cookie flags and origin verification safeguard against Cross-Site Request Forgery.
            </li>
            <li>
              <strong>Zero Third-Party Advertising Trackers:</strong> We do not use advertising cookies, behavior profiling trackers, or invasive cross-site pixels.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "pdf-export",
      icon: LuServer,
      title: "5. Headless Vector PDF Export Architecture",
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            Our high-resolution, one-click Vector PDF downloads are generated on-demand by an isolated, headless
            Chromium microservice.
          </p>
          <p>
            When you request a PDF, your resume layout is rendered in an ephemeral, sandboxed browser process. The
            resulting vector stream is returned directly as a download attachment to your device. Generated PDF buffers
            are not archived or persisted on our generation worker servers after transmission.
          </p>
        </div>
      ),
    },
    {
      id: "data-sharing",
      icon: LuEyeOff,
      title: "6. Data Sharing & Third-Party Service Providers",
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            We <strong>never sell, monetize, or broker</strong> your personal information or resume contents to data
            aggregators, recruitment agencies, or advertisers. We transmit data only to essential operational infrastructure:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>MongoDB Atlas:</strong> Encrypted-at-rest cloud database storage for user account records and resume JSON structures.</li>
            <li><strong>Cloudinary:</strong> Secure cloud storage for resume thumbnails and uploaded profile pictures.</li>
            <li><strong>Google & LinkedIn OAuth:</strong> Authenticated federated sign-in token validation.</li>
            <li><strong>Google Gemini API:</strong> Ephemeral inference for requested AI resume bullet rewrites and tone adjustments.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "user-rights",
      icon: LuUserCheck,
      title: "7. Your Rights & Data Portability (GDPR & CCPA)",
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>Regardless of your geographic location, you enjoy full data sovereignty:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Right to Access:</strong> View all resume drafts and account metadata in your personal Dashboard.</li>
            <li><strong>Right to Export & Portability:</strong> Resuma AI provides 1-click JSON Resume export compliant with the open-source JSON Resume standard, allowing you to take your structured data anywhere.</li>
            <li><strong>Right to Rectification:</strong> Edit, modify, or reorganize any resume field at any time in real time.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Deleting a resume permanently deletes all corresponding database records, thumbnails, and cached assets.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "retention",
      icon: LuTrash2,
      title: "8. Data Retention & Permanent Deletion",
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            We store your resume documents only for as long as your account remains active. If you choose to delete
            a resume from your Dashboard, all associated database records, layouts, and uploaded thumbnails are
            purged immediately.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] bg-[radial-gradient(ellipse_100%_45%_at_50%_-10%,rgba(147,40,231,0.07),rgba(255,255,255,0))] text-slate-800 antialiased flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="h-16 shrink-0 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group transition-all"
            title="Resuma AI Home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-base font-black bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 bg-clip-text text-transparent">
              Resuma AI
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs hover:shadow-md transition-all"
            >
              <LuArrowLeft className="text-xs" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 border border-purple-200/60 text-purple-800 text-xs font-semibold mb-4">
            <LuLock className="text-xs text-purple-600" />
            <span>Privacy & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Resuma AI Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Transparency, zero data selling, and complete user ownership of career records.
          </p>
          <div className="mt-4 text-xs text-slate-400 font-medium">
            Effective Date: September 2026 · Version 2.4
          </div>
        </div>

        {/* Quick Nav Anchor Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-slate-200/80">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50/50 transition-all shadow-2xs"
            >
              {sec.title.split(". ")[1]}
            </a>
          ))}
        </div>

        {/* Policy Section Cards */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                    <Icon className="text-lg" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {section.title}
                  </h2>
                </div>
                {section.content}
              </section>
            );
          })}
        </div>

        {/* Contact Support Card */}
        <div className="mt-10 p-6 sm:p-8 bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold tracking-tight">Questions about your data?</h3>
            <p className="text-purple-200 text-xs sm:text-sm max-w-md">
              We are committed to open communication. If you have any inquiries regarding our privacy standards or wish to request data deletion, please get in touch.
            </p>
          </div>
          <a
            href="https://github.com/Genie-Usman"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-50 transition-all shadow-xs shrink-0"
          >
            <span>Contact Support</span>
            <LuExternalLink className="text-xs" />
          </a>
        </div>
      </main>

      {/* Global Shared Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
