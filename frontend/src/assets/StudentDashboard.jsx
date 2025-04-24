import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "./images/logo.png";
import Dashboard from "./images/Navigation/DashboardIcon.png";
import Profile from "./images/Navigation/ProfileIcon.png";
import Modules from "./images/Navigation/ClassIcon.png";
import LogOut from "./images/Navigation/LogOutIcon.png";
import JoinClass from "./images/Dashboard/JoinClass.png";
import WordOfTheDay from "./WordOfTheDay";  // Import the WordOfTheDay component

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [firstName, setFirstName] = useState("");  // Add state for first name

  // Load dark mode setting from local storage
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

  // Retrieve first name from local storage
  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstname");  // Get first name from local storage
    if (storedFirstName) {
      setFirstName(storedFirstName);  // Set first name in the state
    }
  }, []);

  // Persist dark mode setting to local storage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const mainBgClass = darkMode ? "bg-gray-900" : "bg-white";
  const sidebarBgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const sidebarBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";
  const mainBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";

  return (
    <div className={`flex h-screen w-full ${mainBgClass}`}>
      {/* Sidebar */}
      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-r ${sidebarBorderClass} pt-8`}>
        <div className="mb-10 flex justify-center">
          <img src={Logo} alt="Filipino Explorer Logo" className="w-40" />
        </div>
        <nav className="space-y-6 pl-6">
          {[ 
            { icon: Dashboard, label: "Dashboard", path: "/student-dashboard" },
            { icon: Profile, label: "My Profile", path: "/profile-student" },
            { icon: Modules, label: "Modules", path: "/" },
            { icon: LogOut, label: "Log Out", path: "/logout" }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-4 font-bold text-lg cursor-pointer ${textClass}`}
              onClick={() => navigate(item.path)}
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Word of the Day in the Sidebar */}
        <div className="mt-8 px-6">
          <WordOfTheDay />  {/* Word of the Day component inside the sidebar */}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${mainBgClass} pt-10 px-10`}>
        <div className={`w-full h-full ${sidebarBgClass} border-[5px] ${sidebarBorderClass} rounded-[20px]`}>
          <h1 className={`text-[40px] font-bold font-['Poppins'] ${textClass} mb-8 pt-6 pl-6`}>
            Magandang Araw {firstName || "Student"}, {/* Use first name from local storage */}
          </h1>

          <img src={JoinClass} alt="Join Class Button" className="absolute left-[370px] top-[170px] w-[150px] h-[40px]" />
        </div>
      </main>

      {/* Right Sidebar - Timeline */}
      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-l ${sidebarBorderClass} pt-10 px-6 relative`}>
        {/* Dark Mode Toggle Button */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={toggleDarkMode}
            className={`rounded-full p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        <h2 className={`text-[30px] font-bold font-['Fredoka'] ${textClass} mb-4`}>
          Timeline
        </h2>
        {/* Add timeline content here */}
      </aside>
    </div>
  );
};

export default StudentDashboard;
