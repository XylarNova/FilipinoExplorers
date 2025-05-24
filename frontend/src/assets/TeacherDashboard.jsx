import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';


const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode setting from local storage
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

  // Persist dark mode setting to local storage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const mainBgClass = darkMode ? "bg-gray-900" : "bg-white";
  const sidebarBgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const sidebarBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";

  return (
    <div className={`flex h-screen w-full ${mainBgClass}`}>
      
      {/* Sidebar */}
      <TeacherSidebar />


      {/* Main Content */}
      <main className={`flex-1 ${mainBgClass} pt-10 px-10`}>
        <h1 className={`text-[40px] font-bold font-['Fredoka'] ${textClass} mb-8`}>
          QUICK ACTIONS
        </h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/class-creation')}
            className="bg-[#06D7A0] text-black border-[20px] border-[#289A7C] font-['Fredoka'] font-bold text-[15px] py-2 px-6 rounded-lg shadow hover:opacity-90 transition"
          >
            Create Class
          </button>
          <button 
            onClick={() => navigate('/game-creation')}
            className="bg-[#06D7A0] text-black border-[20px] border-[#289A7C] font-['Fredoka'] font-bold text-[15px] py-2 px-6 rounded-lg shadow hover:opacity-90 transition"
          >
            Create Game
          </button>
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

export default TeacherDashboard;
