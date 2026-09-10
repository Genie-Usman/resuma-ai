import { useContext } from "react";
import { UserContext } from "../../context/userContext";

// Components
import Header from "../shared/Header";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-[#fafafc] bg-[radial-gradient(ellipse_100%_45%_at_50%_-10%,rgba(147,40,231,0.07),rgba(255,255,255,0))] text-slate-800 antialiased selection:bg-purple-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header activeMenu={activeMenu} />
        {user && <main className="pt-1 pb-16">{children}</main>}
      </div>
    </div>
  );
};

export default DashboardLayout;
