import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import { LuArrowRight, LuMenu, LuX } from "react-icons/lu";
import { motion } from "framer-motion";
import LOGO from "../../../assets/logo.svg";

const LandingNavbar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Templates", href: "/templates" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "ATS Scanner", href: "/#ats-scanner" },
    { label: "Features", href: "/#features" },
    { label: "Examples", href: "/#examples" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ];

  const handleCta = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Authentic Brand Logo - Clean, Unaltered */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={LOGO}
            alt="Resuma AI"
            className="h-8 sm:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
          />
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
            Studio
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-slate-100/80 border border-slate-200/80 px-3 py-1.5 rounded-full backdrop-blur-md">
          {navLinks.map((link) => (
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-xs lg:text-[13px] font-semibold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-full hover:bg-white transition-all"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-xs lg:text-[13px] font-semibold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-full hover:bg-white transition-all"
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Dashboard
            </button>
          ) : (
            <Link
              to="/auth/login"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCta}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm cursor-pointer tracking-tight"
          >
            <span>{user ? "Open Studio" : "Build Your Resume"}</span>
            <LuArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={handleCta}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900"
          >
            Start Free
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg bg-slate-100 border border-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <LuX className="w-5 h-5" /> : <LuMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-5 shadow-xl">
          <div className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 py-1.5"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleCta();
                }}
                className="w-full text-center py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white"
              >
                {user ? "Go to Dashboard" : "Build Your Resume"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
