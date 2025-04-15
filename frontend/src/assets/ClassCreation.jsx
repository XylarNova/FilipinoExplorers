import React, { useState } from 'react';
import Logo from './images/logo.png';
import Dashboard from './images/Navigation/DashboardIcon.png';
import Profile from './images/Navigation/ProfileIcon.png';
import ClassIcon from './images/Navigation/ClassIcon.png';
import GameEditor from './images/Navigation/GameEditorIcon.png';
import LogOut from './images/Navigation/LogOutIcon.png';

const ClassCreation = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Dynamic class names based on dark mode
  const mainBgClass = darkMode ? "bg-gray-900" : "bg-white";
  const sidebarBgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const sidebarBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";
  
  return (
    <div className={`flex h-screen w-full ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      
      {/* Left Sidebar */}
      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-r ${sidebarBorderClass} pt-8`}>
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img src={Logo} alt="Filipino Explorer Logo" className="w-40" />
        </div>
        {/* Navigation */}
        <nav className="space-y-6 pl-6">
          <div className={`flex items-center space-x-4 font-bold text-lg ${textClass}`}>
            <img src={Dashboard} alt="Dashboard" className="w-6 h-6" />
            <span>Dashboard</span>
          </div>
          <div className={`flex items-center space-x-4 font-bold text-lg ${textClass}`}>
            <img src={Profile} alt="My Profile" className="w-6 h-6" />
            <span>My Profile</span>
          </div>
          <div className={`flex items-center space-x-4 font-bold text-lg ${textClass}`}>
            <img src={ClassIcon} alt="Class" className="w-6 h-6" />
            <span>Class</span>
          </div>
          <div className={`flex items-center space-x-4 font-bold text-lg ${textClass}`}>
            <img src={GameEditor} alt="Game Editor" className="w-6 h-6" />
            <span>Game Editor</span>
          </div>
          <div className={`flex items-center space-x-4 font-bold text-lg ${textClass}`}>
            <img src={LogOut} alt="Log Out" className="w-6 h-6" />
            <span>Log Out</span>
          </div>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className={`flex-1 ${mainBgClass} pt-10 px-10`}>
        <h1 className={`text-[40px] font-bold font-['Fredoka'] ${textClass} mb-8`}>
          Create Class Form
        </h1>
      </main>
      
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
    </div>
  );
};

export default ClassCreation;