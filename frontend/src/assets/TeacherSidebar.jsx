import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Logo from './images/logo.png';
import Dashboard from './images/Navigation/DashboardIcon.png';
import Profile from './images/Navigation/ProfileIcon.png';
import ClassIcon from './images/Navigation/ClassIcon.png';
import GameEditor from './images/Navigation/GameEditorIcon.png';
import LogOut from './images/Navigation/LogOutIcon.png';
import CollapseMenuIcon from './images/Buttons and Other/collapseMenu.png';

const TeacherSidebar = ({ darkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const bgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const borderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";

  const items = [
    { icon: Dashboard, label: "Dashboard", path: "/teacher-dashboard" },
    { icon: Profile, label: "My Profile", path: "/profile-teacher" },
    { icon: ClassIcon, label: "Classes", path: "/teacher-classlist" },
    { icon: GameEditor, label: "Game Editor", path: "/gamebank" },
    { icon: LogOut, label: "Log Out", path: "/" },
  ];

  return (
    <aside className={`transition-all duration-300 ${bgClass} ${borderClass} border-r shadow-md pt-6 ${collapsed ? "w-[90px]" : "w-[292px]"}`}>
      <div className="flex items-center justify-between px-4 mb-6">
        {!collapsed && <img src={Logo} alt="Logo" className="w-40" />}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500">
          <img
            src={CollapseMenuIcon}
            alt="Toggle Menu"
            className={`w-6 h-6 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="space-y-6 px-4">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-4 cursor-pointer font-bold text-lg hover:opacity-100 ${textClass} ${location.pathname === item.path ? "opacity-100" : "opacity-70"}`}
            onClick={() => {
              if (item.label === 'Log Out') localStorage.removeItem("token");
              navigate(item.path);
            }}
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default TeacherSidebar;
