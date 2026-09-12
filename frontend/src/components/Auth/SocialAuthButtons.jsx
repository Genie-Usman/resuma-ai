import { BASE_URL, API_PATHS } from "../../utils/apiPaths";

const SocialAuthButtons = ({ mode = "sign-in" }) => {
  const handleGoogleAuth = () => {
    const backendUrl = (BASE_URL || "").replace(/\/+$/, "");
    window.location.href = `${backendUrl}${API_PATHS.AUTH.GOOGLE_AUTH}`;
  };

  const handleLinkedInAuth = () => {
    const backendUrl = (BASE_URL || "").replace(/\/+$/, "");
    window.location.href = `${backendUrl}${API_PATHS.AUTH.LINKEDIN_AUTH}`;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 active:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
          title="Sign in securely with your Google account"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="group-hover:text-slate-900 transition-colors">
            Google
          </span>
        </button>

        {/* LinkedIn OAuth Button */}
        <button
          type="button"
          onClick={handleLinkedInAuth}
          className="flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 active:bg-slate-100 text-[#0A66C2] text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
          title="Sign in securely with your LinkedIn profile"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75a1.75 1.75 0 0 0-1.76 1.75c0 .97.79 1.76 1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
          </svg>
          <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
            LinkedIn
          </span>
        </button>
      </div>

      {/* Modern Horizontal Divider */}
      <div className="relative flex items-center py-2">
        <div className="grow border-t border-slate-200" />
        <span className="shrink mx-3 text-[11px] uppercase tracking-wider text-slate-400 font-medium select-none">
          Or with email
        </span>
        <div className="grow border-t border-slate-200" />
      </div>
    </div>
  );
};

export default SocialAuthButtons;
