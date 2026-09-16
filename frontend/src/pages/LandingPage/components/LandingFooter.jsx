import { Link } from "react-router-dom";
import { FiGithub } from "react-icons/fi";
import LOGO from "../../../assets/logo.svg";

const LandingFooter = () => {
  return (
    <footer className="relative bg-slate-50 border-t border-slate-200/80 pt-16 pb-12 overflow-hidden select-none">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80">
          {/* Brand Info Column - Authentic Unaltered Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src={LOGO}
                alt="Resuma AI"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed font-normal">
              A clean, modern resume builder designed to help professionals craft interview-winning, ATS-friendly resumes in minutes.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/Genie-Usman"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-2xs"
                title="GitHub"
              >
                <FiGithub className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Templates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Templates
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#templates" className="hover:text-slate-900 transition-colors">
                  Clarity (2-Column)
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-slate-900 transition-colors">
                  Vanguard (Executive)
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-slate-900 transition-colors">
                  Meridian (Timeline)
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-slate-900 transition-colors">
                  Zenith (Minimal)
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-slate-900 transition-colors">
                  All Templates
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                  AI Bullet Assistant
                </a>
              </li>
              <li>
                <a href="#ats-scanner" className="hover:text-slate-900 transition-colors">
                  ATS X-Ray Scanner
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Matching Cover Letter
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Single-Page Fit
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-slate-900 transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#examples" className="hover:text-slate-900 transition-colors">
                  Resume Examples
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-slate-900 transition-colors">
                  Help & FAQ
                </a>
              </li>
              <li>
                <Link to="/auth/login" className="hover:text-slate-900 transition-colors">
                  Sign In to Studio
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Resuma. All rights reserved. Built for job seekers everywhere.
          </div>

          <div className="flex items-center gap-6">
            <a href="#templates" className="hover:text-slate-900 transition-colors">
              Templates
            </a>
            <a href="#ats-scanner" className="hover:text-slate-900 transition-colors">
              ATS Checker
            </a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
