import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './images/logo.png';
import Dashboard from './images/Navigation/DashboardIcon.png';
import Profile from './images/Navigation/ProfileIcon.png';
import Modules from './images/Navigation/ClassIcon.png';
import LogOut from './images/Navigation/LogOutIcon.png';
import Children from './images/Log in and sign up/Profile.png';
import WordOfTheDay from './WordOfTheDay';


const MyAccountStudent = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    studentId: '',
    email: '',
    lastPasswordChange: null,
  });
  const [activeTab, setActiveTab] = useState('account'); // default tab

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
          setUserData({
          studentId: response.data.customStudentId || 'FE-STUD-YYYY-0000',
          email: response.data.email,
          lastPasswordChange: response.data.lastPasswordChange,
        });
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) setDarkMode(storedDarkMode === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const mainBgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const sidebarBgClass = darkMode ? 'bg-gray-800' : 'bg-[#FDFBEE]';
  const sidebarBorderClass = darkMode ? 'border-gray-700' : 'border-[#CEC9A8]';
  const textClass = darkMode ? 'text-white' : 'text-[#213547]';

  return (
    <div className={`flex h-screen w-full ${mainBgClass}`}>
      {/* Sidebar */}
      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-r ${sidebarBorderClass} pt-8`}>
        <div className="mb-10 flex justify-center">
          <img src={Logo} alt="Filipino Explorer Logo" className="w-40" />
        </div>
        <nav className="space-y-6 pl-6">
          {[{ icon: Dashboard, label: 'Dashboard', path: '/student-dashboard' },
            { icon: Profile, label: 'My Profile', path: '/profile-student' },
            { icon: Modules, label: 'Modules', path: '/modules' },
            { icon: LogOut, label: 'Log Out', path: '/logout' }].map((item, idx) => (
            <div key={idx} className={`flex items-center space-x-4 font-bold text-lg cursor-pointer ${textClass}`} onClick={() => navigate(item.path)}>
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="mt-8 px-6">
          <WordOfTheDay darkMode={darkMode} />
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${mainBgClass} pt-10 px-10`}>
        <div className="flex gap-10">
          {/* Sidebar Card with buttons */}
          <div className="pt-10">
            <div className={`w-[247px] h-[230px] ${sidebarBgClass} rounded-[20px] border-[5px] ${sidebarBorderClass} shadow-lg p-4`}>
              <h2 className={`text-[25px] ${textClass} font-['Poppins'] font-extrabold mb-4 text-center`}>Account Details</h2>
              <div className="flex flex-col gap-4 items-center">
                <button
                    onClick={() => navigate('/profile-student')}
                    className={`w-[190px] h-[49px] bg-gray-300 text-black text-[24px] font-bold rounded-[10px]`}
                    >
                    My Profile
               </button>
                <button
                  className={`w-[190px] h-[49px] bg-[#57B4BA] text-black text-[24px] font-bold rounded-[10px]`}
                >
                  My Account
                </button>
              </div>
            </div>
          </div>

          {/* My Account Form */}
        <div className="pt-10">
        <div className={`w-[676px] h-[615px] ${sidebarBgClass} rounded-[20px] border-[5px] ${sidebarBorderClass} shadow-lg p-8 relative`}>
          <h2 className={`text-[40px] ${textClass} font-['Poppins'] font-bold mb-10 text-center`}>
            Account Information
          </h2>

          <div className="flex flex-col items-center gap-8">
            {/* Student ID */}
            <div className="flex flex-col">
              <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>
                Student ID
              </label>
              <input
                type="text"
                value={userData.studentId}
                disabled
                className="w-[350px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>
                Password
              </label>
              <input
                type="password"
                value="************"
                disabled
                className="w-[350px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
              />
              <p className="text-sm text-gray-600 mt-2 font-['Inter']">
                Last changed: {userData.lastPasswordChange ? new Date(userData.lastPasswordChange).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            {/* Change Password Button */}
            <button
              onClick={() => navigate('/change-password')}
              className="w-[180px] h-[44px] bg-[#0AD4A1] text-black text-[20px] font-['Inter'] font-semibold rounded-[20px] mt-4"
            >
              Change Password
            </button>

            {/* Centered Children Image */}
            <img
              src={Children}
              alt="Children"
              className="mt-1 w-[500px] h-[150px] object-contain"
            />
          </div>
        </div>
      </div>

        </div>
      </main>

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`rounded-full p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 12.707a8 8 0 10-11.586 0 8 8 0 0011.586 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 3V1h2v2h2V1h2v2h2v2h-2v2h-2V5h-2V3H9z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default MyAccountStudent;
