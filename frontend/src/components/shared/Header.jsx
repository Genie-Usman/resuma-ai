import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

// Assets
import LOGO from "../../assets/logo.svg";

// Components
import ProfileInfoCard from "../Cards/ProfileInfoCard";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  return (
    <header className="flex justify-between items-center mb-8 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <img
          src={LOGO}
          alt="Resuma AI"
          className="w-[135px] cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate("/")}
        />
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200/60">
          Studio
        </span>
      </div>

      {/* Account Button */}
      {user ? (
        <ProfileInfoCard />
      ) : (
        <Link
          className="bg-purple-600 text-xs font-semibold text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors cursor-pointer shadow-xs"
          to="/auth/login"
        >
          Sign In
        </Link>
      )}
    </header>
  );
};

export default Header;
