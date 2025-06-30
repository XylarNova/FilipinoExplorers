import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentSidebar from "./StudentSidebar";

import Children from './images/Log in and sign up/Profile.png';
import Boy1 from './images/Profile Pictures/boy1.png';
import Boy2 from './images/Profile Pictures/boy2.png';
import Boy3 from './images/Profile Pictures/boy3.png';
import Girl1 from './images/Profile Pictures/girl1.png';
import Girl2 from './images/Profile Pictures/girl2.png';
import Girl3 from './images/Profile Pictures/girl3.png';

const profileImages = [
  { label: 'Boy 1', src: Boy1 },
  { label: 'Boy 2', src: Boy2 },
  { label: 'Boy 3', src: Boy3 },
  { label: 'Girl 1', src: Girl1 },
  { label: 'Girl 2', src: Girl2 },
  { label: 'Girl 3', src: Girl3 },
];

const MyProfileStudent = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    school: '',
    email: '',
    profilePictureUrl: '',
  });
  const [selectedImage, setSelectedImage] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setUserData(response.data);
        setSelectedImage(response.data.profilePictureUrl);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setErrorMessage('Error fetching user data.');
      });

    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) setDarkMode(storedDarkMode === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const isChanged = selectedImage !== userData.profilePictureUrl;

  const mainBgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const sidebarBgClass = darkMode ? 'bg-gray-800' : 'bg-[#FDFBEE]';
  const sidebarBorderClass = darkMode ? 'border-gray-700' : 'border-[#CEC9A8]';
  const textClass = darkMode ? 'text-white' : 'text-[#213547]';

  const handleSave = () => {
    setLoading(true);
    setErrorMessage('');

    const formData = {
      ...userData,
      profilePictureUrl: selectedImage,
    };

    axios
      .put('http://localhost:8080/api/auth/user/update', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
        alert('Profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setLoading(false);
        if (error.response) {
          setErrorMessage(error.response.data.message || 'Error updating profile.');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      });
  };

  return (
    <div className={`flex h-screen w-full ${mainBgClass}`}>
      <StudentSidebar darkMode={darkMode} />

      <main className={`flex-1 ${mainBgClass} pt-10 px-10`}>
        <div className="flex gap-10">
          <div className="pt-10">
            <div className={`w-[247px] h-[230px] ${sidebarBgClass} rounded-[20px] border-[5px] ${sidebarBorderClass} shadow-lg p-4`}>
              <h2 className={`text-[25px] ${textClass} font-['Poppins'] font-extrabold mb-4 text-center`}>Account Details</h2>
              <div className="flex flex-col gap-4 items-center">
                <button
                  className={`w-[190px] h-[49px] ${activeTab === 'profile' ? 'bg-[#57B4BA]' : 'bg-gray-300'} text-black text-[24px] font-bold rounded-[10px]`}
                  onClick={() => setActiveTab('profile')}
                >
                  My Profile
                </button>
                <button
                  onClick={() => navigate('/account-student')}
                  className={`w-[190px] h-[49px] bg-gray-300 text-black text-[24px] font-bold rounded-[10px]`}
                >
                  My Account
                </button>
              </div>
            </div>
          </div>

          <div className="pt-10">
            <div className={`w-[676px] h-[615px] ${sidebarBgClass} rounded-[20px] border-[5px] ${sidebarBorderClass} shadow-lg p-8 relative`}>
              <h2 className={`text-[40px] ${textClass} font-['Poppins'] font-bold mb-10 text-center`}>Personal Information</h2>

              <div className="flex items-start justify-center gap-12">
                <div className="flex flex-col items-center">
                  <div className="w-[120px] h-[120px] rounded-full bg-gray-300 overflow-hidden shadow-md">
                    <img
                      src={selectedImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setShowImagePicker(!showImagePicker)}
                    className="mt-2 text-sm text-blue-500 underline"
                  >
                    Pick Profile Picture
                  </button>

                  {showImagePicker && (
                    <div className="mt-4 bg-white p-4 rounded-lg shadow-lg grid grid-cols-3 gap-4 z-50 absolute top-[140px]">
                      {profileImages.map((img) => (
                        <img
                          key={img.label}
                          src={img.src}
                          alt={img.label}
                          onClick={() => setSelectedImage(img.src)}
                          className="w-[80px] h-[80px] rounded-full cursor-pointer hover:scale-105 transition-transform border-2 border-transparent hover:border-blue-400"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>Firstname</label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                      className="w-[350px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>Lastname</label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                      className="w-[350px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 px-6">
                <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-[550px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                />

                {errorMessage && (
                  <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
                )}

                <div className="flex justify-end mt-4 pt-28">
                  <button
                    disabled={!isChanged || loading}
                    onClick={handleSave}
                    className={`w-[121px] h-[44px] ${loading ? 'bg-gray-400' : 'bg-[#0AD4A1]'} text-black text-[20px] font-['Inter'] font-semibold rounded-[20px]`}
                  >
                    {loading ? 'Updating...' : 'Save'}
                  </button>
                </div>
              </div>

              <img src={Children} alt="Children" className="absolute left-[10px] top-[420px] w-[500px] h-[150px]" />
            </div>
          </div>
        </div>
      </main>

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

export default MyProfileStudent;
