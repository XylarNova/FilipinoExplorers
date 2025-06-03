import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';


const MyProfileTeacher = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    school: '',
    email: '',
    profilePictureUrl: '',
  });
  const [originalData, setOriginalData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Persist dark mode
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        const response = await axios.get('http://localhost:8080/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User data:", response.data);
        setUserData(response.data);
        setOriginalData(response.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }finally {
        setLoading(false);  // Set loading to false after data fetching
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const isChanged = JSON.stringify(userData) !== JSON.stringify(originalData) || selectedImage;

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("school", userData.school);
    formData.append("email", userData.email);
    if (selectedImage) formData.append("profilePicture", selectedImage);

    try {
      setLoading(true);
      await axios.put("http://localhost:8080/api/auth/user/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully!");
      setOriginalData({ ...userData, profilePictureUrl: userData.profilePictureUrl }); // Update original
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert("Update failed.");
      }
    } finally {
      setLoading(false);
    }
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
        <div className="flex gap-10">
          {/* Sidebar Card */}
          <div className="pt-10">
            <div className={`w-[247px] h-[230px] ${sidebarBgClass} rounded-[20px] border-[5px] ${sidebarBorderClass} shadow-lg p-4`}>
              <h2 className={`text-[25px] ${textClass} font-['Poppins'] font-extrabold mb-4 text-center`}>
                Account Details
              </h2>
              <div className="flex flex-col gap-4 items-center">
                <button
                  onClick={() => navigate('/profile-teacher')}
                  className={`w-[190px] h-[49px] ${
                    location.pathname === '/profile-teacher' ? 'bg-gray-300' : 'bg-[#57B4BA]'
                  } text-black text-[24px] font-['Inter'] font-bold rounded-[10px]`}
                >
                  My Profile
                </button>

                <button
                  onClick={() => navigate('/my-account-teacher')}
                  className={`w-[190px] h-[49px] ${
                    location.pathname === '/my-account-teacher' ? 'bg-gray-300' : 'bg-[#57B4BA]'
                  } text-black text-[24px] font-['Inter'] font-bold rounded-[10px]`}
                >
                  My Account
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="pt-10">
            <div className={`w-[676px] h-[615px] ${sidebarBgClass} rounded-[20px] border-[5px] ${sidebarBorderClass} shadow-lg p-8`}>
              <h2 className={`text-[40px] ${textClass} font-['Poppins'] font-bold mb-10 text-center`}>Personal Information</h2>

              <div className="flex items-start justify-center gap-12">
                {/* Profile Pic */}
                <div className="flex flex-col items-center">
                  <div className="w-[120px] h-[120px] rounded-full bg-gray-300 overflow-hidden shadow-md">
                    <img
                      src={imagePreview || userData.profilePictureUrl || "https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png"}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="profilePicInput"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedImage(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <button
                    onClick={() => document.getElementById("profilePicInput").click()}
                    className="mt-2 text-sm text-blue-500 underline"
                  >
                    Change Photo
                  </button>
                </div>

                {/* Input Fields */}
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

              {/* School */}
              <div className="mt-10 flex flex-col items-start px-6">
                <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>School</label>
                <input
                  type="text"
                  value={userData.school}
                  onChange={(e) => setUserData({ ...userData, school: e.target.value })}
                  className="w-[550px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                />
              </div>

              {/* Email & Update */}
              <div className="mt-8 px-6">
                <label className={`${textClass} opacity-70 font-['Inter'] font-bold text-[16px] mb-2`}>Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-[550px] h-[40px] bg-white rounded-[20px] shadow-md px-4 text-lg font-['Inter']"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleUpdate}
                    disabled={!isChanged || loading}
                    className={`w-[121px] h-[44px] ${
                      loading ? 'bg-gray-400' : 'bg-[#0AD4A1]'
                    } text-black text-[20px] font-['Inter'] font-semibold rounded-[20px]`}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
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
