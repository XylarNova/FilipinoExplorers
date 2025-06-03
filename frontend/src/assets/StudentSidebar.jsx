import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./images/logo.png";
import Dashboard from "./images/Navigation/DashboardIcon.png";
import Profile from "./images/Navigation/ProfileIcon.png";
import Modules from "./images/Navigation/ClassIcon.png";
import LogOut from "./images/Navigation/LogOutIcon.png";
import WordOfTheDay from "./WordOfTheDay";

const StudentSidebar = ({ darkMode }) => {
  const navigate = useNavigate();

  const sidebarBgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const sidebarBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-r ${sidebarBorderClass} pt-8`}>
      <div className="mb-10 flex justify-center">
        <img src={Logo} alt="Filipino Explorer Logo" className="w-40" />
      </div>
      <nav className="space-y-6 pl-6">
        {[ 
          { icon: Dashboard, label: "Dashboard", path: "/student-dashboard" },
          { icon: Profile, label: "My Profile", path: "/profile-student" },
          { icon: Modules, label: "Modules", path: "/student-modules" },
          { icon: LogOut, label: "Log Out", action: handleLogout }
        ].map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center space-x-4 font-bold text-lg cursor-pointer ${textClass}`}
            onClick={() => item.action ? item.action() : navigate(item.path)}
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="mt-10 px-6">
        <WordOfTheDay darkMode={darkMode} />
      </div>
    </aside>
  );
};

export default StudentSidebar;
