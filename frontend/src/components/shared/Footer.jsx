import { Link } from "react-router-dom";
import { FiGithub } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="text-sm bg-slate-50/90 border-t border-slate-200/70 text-slate-600 py-5 mt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span>Made by Usman. Visit</span>
          <a
            href="https://github.com/Genie-Usman"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-purple-600 transition-colors inline-flex items-center gap-1 font-medium"
            title="Usman on GitHub"
          >
            <FiGithub className="w-4 h-4" />
          </a>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <Link
            to="/privacy"
            className="hover:text-purple-600 transition-colors font-medium hover:underline"
          >
            Privacy Policy
          </Link>
          <span>·</span>
          <span>© {new Date().getFullYear()} Resuma AI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
