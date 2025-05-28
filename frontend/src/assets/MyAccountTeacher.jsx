import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';
import axiosInstance from '../utils/axiosInstance';


const MyAccountTeacher = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    teacherId: '',
    classCount: 0,
    lastPasswordChange: null,
  });

useEffect(() => {
  // Fetch teacher details
  axiosInstance.get('/auth/user')
    .then((response) => {
      setUserData(prev => ({
        ...prev,
        teacherId: response.data.customTeacherId || 'FE-TEACH-YYYY-0000',
        lastPasswordChange: response.data.lastPasswordChange,
      }));
    })
    .catch((error) => {
      console.error('Error fetching teacher details:', error);
    });

  // Fetch class count
  axiosInstance.get('/classroom/count-by-teacher')
    .then((res) => {
      setUserData(prev => ({ ...prev, classCount: res.data }));
    })
    .catch((error) => {
      console.error('Error fetching class count:', error);
    });

  // Dark mode settings
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
      <TeacherSidebar />

      {/* Main Content */}
      <main className={`flex-1 ${mainBgClass} pt-10 px-10`}>
        <div className="flex gap-10">
          {/* Sidebar Buttons */}
          <div className="pt-10">
            <div className={`w-[247px] h-[230px] ${sidebarBgClass} rounded-[20px] border-[5px] ${sidebarBorderClass} shadow-lg p-4`}>
              <h2 className={`text-[25px] ${textClass} font-['Poppins'] font-extrabold mb-4 text-center`}>Account Details</h2>
              <div className="flex flex-col gap-4 items-center">
                <button
                    onClick={() => navigate('/profile-teacher')}
                    className="w-[190px] h-[49px] bg-[#57B4BA] text-black text-[24px] font-['Inter'] font-bold rounded-[10px]">
                    My Profile
                    </button>

                    <button
                    onClick={() => navigate('/my-account-teacher')}
                    className="w-[190px] h-[49px] bg-[#57B4BA] text-black text-[24px] font-['Inter'] font-bold rounded-[10px]">
                    My Account
                    </button>

              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="pt-10">
            <div className={`w-[676px] h-[615px] ${sidebarBgClass} rounded-[20px] border-[5px] ${sidebarBorderClass} shadow-lg p-8 relative`}>
              <h2 className={`text-[40px] ${textClass} font-['Poppins'] font-bold mb-10 text-center`}>
                Account Information
              </h2>

              <div className="flex flex-col items-center gap-8">
                {/* Teacher ID */}
                <div className="flex flex-col">
                  <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    value={userData.teacherId}
                    disabled
                    className="w-[350px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                  />
                </div>

                {/* Number of Classes */}
                <div className="flex flex-col">
                  <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>
                    Number of Classes
                  </label>
                  <input
                    type="text"
                    value={userData.classCount}
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

export default MyAccountTeacher;
