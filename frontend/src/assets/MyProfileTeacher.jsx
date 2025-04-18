import React, { useState } from 'react';
import Logo from './images/logo.png';
import Dashboard from './images/Navigation/DashboardIcon.png';
import Profile from './images/Navigation/ProfileIcon.png';
import ClassIcon from './images/Navigation/ClassIcon.png';
import GameEditor from './images/Navigation/GameEditorIcon.png';
import LogOut from './images/Navigation/LogOutIcon.png';

const MyProfileTeacher = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const mainBgClass = darkMode ? "bg-gray-900" : "bg-white";
  const sidebarBgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const sidebarBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";

  return (
    <div className={`flex h-screen w-full ${mainBgClass}`}>
      
      {/* Left Sidebar */}
      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-r ${sidebarBorderClass} pt-8`}>
        <div className="mb-10 flex justify-center">
          <img src={Logo} alt="Filipino Explorer Logo" className="w-40" />
        </div>
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
        <div className="flex gap-10">
          
          {/* Account Details Box */}
          <div className="pt-10">
            <div className="w-[247px] h-[230px] bg-[#FDFBEE] rounded-[20px] border-[5px] border-[#A29068] shadow-lg p-4">
                <h2 className="text-[25px] text-[#073A4D] font-['Poppins'] font-extrabold mb-4 text-center">
                Account Details
                </h2>
                <div className="flex flex-col gap-4 items-center">
                <button className="w-[190px] h-[49px] bg-[#57B4BA] text-black text-[24px] font-['Inter'] font-bold rounded-[10px]">
                    My Profile
                </button>
                <button className="w-[190px] h-[49px] bg-[#57B4BA] text-black text-[24px] font-['Inter'] font-bold rounded-[10px]">
                    My Account
                </button>
                </div>
            </div>
          </div>

          {/* Personal Information Box */}
          <div className="pt-10">
            <div className="w-[676px] h-[615px] bg-[#FDFBEE] rounded-[20px] border-[5px] border-[#A29068] shadow-lg p-8">
                <h2 className="text-[40px] text-[#073A4D] font-['Poppins'] font-bold mb-10 text-center">
                Personal Information
                </h2>

                <div className="flex items-start justify-center gap-12">
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                    <div className="w-[120px] h-[120px] rounded-full bg-gray-300 overflow-hidden shadow-md">
                    <img
                        src="https://via.placeholder.com/120"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <button className="mt-2 text-sm text-blue-500 underline">Change Photo</button>
                </div>

                {/* First and Last Name Fields */}
                <div className="flex flex-col gap-6">
                    {/* Firstname */}
                    <div className="flex flex-col">
                    <label className="text-black text-opacity-50 font-['Inter'] font-bold text-[16px] mb-2">
                        Firstname
                    </label>
                    <input
                        type="text"
                        value="Juan"
                        className="w-[350px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                    />
                    </div>

                    {/* Lastname */}
                    <div className="flex flex-col">
                    <label className="text-black text-opacity-50 font-['Inter'] font-bold text-[16px] mb-2">
                        Lastname
                    </label>
                    <input
                        type="text"
                        value="Dela Cruz"
                        className="w-[350px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                    />
                    </div>
                </div>
                </div>

                {/* School Field */}
                <div className="mt-10 flex flex-col items-start px-6">
                <label className="text-black text-opacity-50 font-['Inter'] font-bold text-[16px] mb-2">
                    School
                </label>
                <input
                    type="text"
                    value="Sampaguita National High School"
                    className="w-[550px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                />
                </div>

                {/* Email Field + Update Button */}
                <div className="mt-8 px-6">
                <div className="flex flex-col">
                    <label className="text-black text-opacity-50 font-['Inter'] font-bold text-[16px] mb-2">
                    Email
                    </label>
                    <input
                    type="email"
                    value="juan.delacruz@email.com"
                    className="w-[550px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <button className="w-[121px] h-[44px] bg-[#0AD4A1] text-black text-[24px] font-['Inter'] font-semibold rounded-[20px]">
                    Update
                    </button>
                </div>
                </div>
            </div>
          </div>
        </div>
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

export default MyProfileTeacher;
