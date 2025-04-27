import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Logo from "./images/logo.png";
import Dashboard from "./images/Navigation/DashboardIcon.png";
import Profile from "./images/Navigation/ProfileIcon.png";
import Modules from "./images/Navigation/ClassIcon.png";
import LogOut from "./images/Navigation/LogOutIcon.png";
import JoinClass from "./images/Dashboard/JoinClass.png";
import WordOfTheDay from "./WordOfTheDay";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstname");
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClassCode("");
    setErrorMessage("");
  };

  const handleSubmitClassCode = async () => {
    try {
      const token = localStorage.getItem("token"); // get your JWT token
  
      if (!token) {
        console.error("No token found. User might not be authenticated.");
        return;
      }
  
      const response = await axios.post(
        "http://localhost:8080/api/classes/join",
        { classCode }, // send the classCode in the body
        {
          headers: {
            Authorization: `Bearer ${token}`, // attach the token here
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log("Joined class successfully:", response.data);
      setShowModal(false);
      setClassCode(""); // Clear input after submitting
    } catch (error) {
      console.error("Failed to join class:", error);
    }
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

        <div className="mt-8 px-6">
          <WordOfTheDay />
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${mainBgClass} pt-10 px-10 relative`}>
        <div className={`w-full h-full ${sidebarBgClass} border-[5px] ${sidebarBorderClass} rounded-[20px] relative`}>
          <h1 className={`text-[40px] font-bold font-['Poppins'] ${textClass} mb-8 pt-6 pl-6`}>
            Magandang Araw {firstName || "Student"},
          </h1>

          <img
            src={JoinClass}
            alt="Join Class Button"
            className="absolute left-[370px] top-[170px] w-[150px] h-[40px] cursor-pointer"
            onClick={handleOpenModal}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Transparent background area to click outside */}
            <div
              className="absolute inset-0 bg-black opacity-30"
              onClick={handleCloseModal}
            ></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-lg p-8 w-96 shadow-lg z-50">
              <h2 className="text-2xl font-bold mb-4 text-center">Enter Class Code</h2>
              {errorMessage && <div className="text-red-500 mb-4 text-center">{errorMessage}</div>}
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="Class Code"
                className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitClassCode}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Timeline */}
      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-l ${sidebarBorderClass} pt-10 px-6 relative`}>
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
