import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import axios from "axios";
import axiosInstance from '../utils/axiosInstance';
import StudentSidebar from './StudentSidebar';
import JoinClass from "./images/Dashboard/JoinClass.png";
import GuessTheWordImage from "./images/Homepage/Guess The Word .png";
import ParkeQuestImage from "./images/Homepage/Parke Quest.png";
import PaaralanQuestImage from "./images/Homepage/Paaralan Quest Icon.png";
import MemoryGameImage from "./images/Homepage/Memory Game Icon.png";


const StudentDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [classRoomId, setClassRoomId] = useState(null);
  const [assignedGames, setAssignedGames] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);



  const fetchClassAndGames = async () => {
  try {
    const classRes = await axiosInstance.get('/classes/student/joined');
    const joinedClasses = classRes.data;

    if (joinedClasses.length > 0) {
      const roomId = joinedClasses[0].id;
      setIsEnrolled(true);
      setClassRoomId(roomId);

      const gameRes = await axiosInstance.get(`/gamesessions/classroom/${roomId}`);
      setAssignedGames(gameRes.data);
    } else {
      setIsEnrolled(false);
      setAssignedGames([]);
    }
  } catch (err) {
    console.error("Error fetching joined class or games:", err);
    setIsEnrolled(false);
  }
};


  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

useEffect(() => {
  const fetchUserFirstName = async () => {
  try {
    const response = await axiosInstance.get("/auth/user");
    setFirstName(response.data.firstName || "Student");
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    setFirstName("Student");
  }
};


  fetchUserFirstName();
}, []);


useEffect(() => {
  fetchClassAndGames();
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

  const gameData = [
  {
    name: 'Guess The Word',
    color: '#F3668A',
    image: GuessTheWordImage,
    description: 'Hulaan ang tamang salita! Arrange the jumbled letters...'
  },
  {
    name: 'Parke Quest',
    color: '#4092AD',
    image: ParkeQuestImage,
    description: 'Ayusin ang magulong pangungusap! Drag and drop...'
  },
  {
    name: 'Paaralan Quest',
    color: '#06D7A0',
    image: PaaralanQuestImage,
    description: 'Basahin at intindihin, tanong sagutin natin! Read a story...'
  },
  {
    name: 'Memory Game',
    color: '#FAB869',
    image: MemoryGameImage,
    description: 'Hanapin ang tamang salin! A Filipino word will appear...'
  }
];


   const handleSubmitClassCode = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        "/classes/join",
        { classCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

     await fetchClassAndGames(); // ✅ Refresh UI with joined class and modules

      setShowModal(false);
      setClassCode("");

    } catch (error) {
      console.error("Failed to join class:", error);
      setErrorMessage("Invalid class code or join failed.");
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
       <StudentSidebar darkMode={darkMode} />

      {/* Main Content */}
      <main className={`flex-1 ${mainBgClass} pt-10 px-10 relative`}>
        <div className={`w-full h-full ${sidebarBgClass} border-[5px] ${sidebarBorderClass} rounded-[20px] p-6 relative`}>
  <h1 className={`text-[40px] font-bold font-['Poppins'] ${textClass} mb-8`}>
    Magandang Araw {firstName || "Student"},
  </h1>

   {!classRoomId && assignedGames.length === 0 ?  (
  <div className="flex flex-col items-center justify-center h-[300px]">
    <img
      src={JoinClass}
      alt="Join Class Button"
      className="w-[150px] h-[40px] cursor-pointer"
      onClick={handleOpenModal}
    />
    <p className={`mt-4 ${textClass}`}>Join a class to see your modules.</p>
  </div>
) : (
  <div>
    <h2 className={`text-[28px] font-semibold mb-6 ${textClass}`}>Your Modules</h2>
    <div className="grid grid-cols-2 gap-6">
      {assignedGames.map((game, idx) => {
        const matched = gameData.find(g => g.name === game.gameTitle);
        if (!matched) return null;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl shadow-md cursor-pointer"
            style={{ backgroundColor: matched.color }}
            onClick={() => navigate(`/${matched.name.toLowerCase().replace(/\s/g, "-")}`)}
          >
            <img
              src={matched.image}
              alt={matched.name}
              className="w-full h-40 object-contain rounded-lg mb-2"
            />
            <h3 className="font-bold text-xl text-white">{matched.name}</h3>
            <p className="text-white text-sm">{matched.description}</p>
          </div>
        );
      })}
    </div>
  </div>
)}

</div>


        {/* Modal */}
        {showModal && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-[#118AB2] rounded-[30px] px-8 py-6 w-[340px] shadow-xl text-white text-center">
          <h2 className="text-xl font-bold mb-4 font-['Fredoka']">Enter Class Code</h2>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-300 font-semibold text-sm mb-3">
              {errorMessage}
            </div>
          )}

          {/* Input */}
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Class Code"
            className="w-full p-3 rounded-xl bg-white text-[#073B4C] text-center mb-6 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleCloseModal}
              className="bg-[#EF476F] text-white px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitClassCode}
              className="bg-[#06D6A0] text-white px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition"
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
