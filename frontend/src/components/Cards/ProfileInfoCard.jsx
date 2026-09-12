import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.clear();
    await clearUser();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 transition-all shadow-2xs">
      {/* User Avatar */}
      {user.profileImageURL ? (
        <img
          src={user.profileImageURL}
          alt={user.name || "User"}
          className="w-9 h-9 rounded-xl object-cover ring-1 ring-purple-500/20 shadow-2xs"
        />
      ) : (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs select-none ring-1 ring-white/50">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      )}

      {/* User Identity */}
      <div className="flex flex-col text-left pr-1">
        <span className="text-xs font-bold text-slate-900 tracking-tight leading-snug truncate max-w-[130px]">
          {user.name || "User"}
        </span>
        <span className="text-[10px] text-slate-400 font-medium leading-none">
          Personal Workspace
        </span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-slate-200" />

      {/* Modern Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
        title="Sign out of your account"
      >
        <LuLogOut className="text-sm" />
      </button>
    </div>
  );
};

export default ProfileInfoCard;
