import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import TeacherSidebar from './TeacherSidebar';
import TotalClassIcon from '../assets/images/Buttons and Other/TotalClassroom.png';
import TotalStudentIcon from '../assets/images/Buttons and Other/TotalStudent.png';
import ActiveModulesIcon from '../assets/images/Buttons and Other/ActiveModules.png';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [summary, setSummary] = useState({ totalClasses: 0, totalStudents: 0, activeModules: 0 });
  const [classOverview, setClassOverview] = useState([]);
  const [lastName, setLastName] = useState('');
  const [timelineGames, setTimelineGames] = useState([]); //timeline state
  const [sortOrder, setSortOrder] = useState('desc'); //order state for timeline

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [summaryRes, classOverviewRes, userRes, gamesRes] = await Promise.all([
          axiosInstance.get('/teacher-dashboard/summary'),
          axiosInstance.get('/teacher-dashboard/class-overview'),
          axiosInstance.get('/auth/user'),
          axiosInstance.get('/gamesessions/my-games', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }),
        ]);

        setSummary(summaryRes.data);
        setClassOverview(classOverviewRes.data);
        setLastName(userRes.data.lastName || '');
        setTimelineGames(gamesRes.data); // timeline set

      } catch (error) {
        console.error("❌ Failed to load dashboard data", error);
      }
    };

    fetchData();
  }, []);


  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const mainBgClass = darkMode ? "bg-gray-900" : "bg-white";
  const sidebarBgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const sidebarBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";

  return (
    <div className={`flex min-h-screen ${mainBgClass}`}>
      <TeacherSidebar darkMode={darkMode} />

      <main className="flex-1 pt-10 px-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-[40px] font-bold font-['Fredoka'] ${textClass}`}>
            Magandang Araw, Gurong {lastName}
          </h1>
          <div className="space-x-4">
            <button onClick={() => navigate('/class-creation')} className="bg-[#06D7A0] text-black border-[4px] border-[#289A7C] font-bold text-sm py-2 px-6 rounded-lg shadow hover:opacity-90">
              Create Class
            </button>
            <button onClick={() => navigate('/gamebank?create=true')} className="bg-[#06D7A0] text-black border-[4px] border-[#289A7C] font-bold text-sm py-2 px-6 rounded-lg shadow hover:opacity-90">
              Create Game
            </button>
          </div>
        </div>

        <h2 className={`text-[30px] font-bold font-['Fredoka'] ${textClass} mb-4`}>SUMMARY</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-xl border-2 border-yellow-400 bg-white text-center shadow">
            <img src={TotalClassIcon} alt="Total Classrooms" className="h-10 mx-auto mb-2" />
            <p className="text-md font-semibold text-[#073B4C] mb-2">Total Classrooms</p>
            <p className="text-[32px] font-bold text-[#073B4C]">{summary.totalClasses}</p>
          </div>
          <div className="p-6 rounded-xl border-2 border-teal-400 bg-white text-center shadow">
            <img src={TotalStudentIcon} alt="Total Student" className="h-10 mx-auto mb-2" />
            <p className="text-md font-semibold text-[#073B4C] mb-2">Total Student</p>
            <p className="text-[32px] font-bold text-[#073B4C]">{summary.totalStudents}</p>
          </div>
          <div className="p-6 rounded-xl border-2 border-pink-400 bg-white text-center shadow">
            <img src={ActiveModulesIcon} alt="Active Modules" className="h-10 mx-auto mb-2" />
            <p className="text-md font-semibold text-[#073B4C] mb-2">Active Modules</p>
            <p className="text-[32px] font-bold text-[#073B4C]">{summary.activeModules}</p>
          </div>
        </div>

        <h2 className={`text-[30px] font-bold font-['Fredoka'] ${textClass} mb-4`}>CLASS OVERVIEW</h2>

    <div className="bg-white rounded-xl border-2 border-[#118AB2] shadow overflow-hidden">
      <div className="grid grid-cols-4 bg-[#E0F2F7] text-[#073B4C] font-semibold text-lg h-[60px] items-center">
        <div className="border-r border-[#118AB2] text-center">Class</div>
        <div className="border-r border-[#118AB2] text-center">Number of Students</div>
        <div className="border-r border-[#118AB2] text-center">Modules</div>
        <div className="text-center">Status</div>
      </div>
      {classOverview.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No classes found.</div>
      ) : (
        classOverview.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 border-t border-[#118AB2] text-[#073B4C] text-md h-[60px] items-center hover:bg-[#F1FAFF]">
            <div className="border-r border-[#118AB2] text-center">
              <span className="truncate block px-2 font-medium">{item.className}</span>
            </div>
            <div className="border-r border-[#118AB2] text-center">
              <span>{item.studentCount}</span>
            </div>
            <div className="border-r border-[#118AB2] text-center">
              <span>{item.moduleCount}</span>
            </div>
            <div className="text-center">
              <span className={`px-4 py-1 rounded-full text-white font-medium ${item.status === 'Active' ? 'bg-[#06D6A0]' : 'bg-gray-400'}`}>{item.status}</span>
            </div>
          </div>
        ))
      )}
    </div>

      </main>

      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-l ${sidebarBorderClass} pt-10 px-6 relative`}>
        <div className="absolute top-4 right-4">
          <button onClick={toggleDarkMode} className={`rounded-full p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-[30px] font-bold font-['Fredoka'] ${textClass}`}>
            Timeline
          </h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="text-sm rounded border border-gray-300 px-2 py-1 focus:outline-none"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>

        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {timelineGames.length === 0 ? (
            <p className={`${textClass} text-center`}>No games created yet.</p>
          ) : (
            timelineGames
              .sort((a, b) => {
                const dateA = new Date(a.lastModified);
                const dateB = new Date(b.lastModified);
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
              }) //sort order logic
              .slice(0, 5) //limit to 5 most recent games (can adjust as needed)
              .map((game, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow border-l-4 border-[#06D6A0]">
                  <h3 className="text-lg font-semibold text-[#073B4C] truncate">{game.gameTitle}</h3>
                  <p className="text-sm text-gray-500 truncate">🗂️ {game.category}</p> 
                  <p className="text-sm text-gray-400 truncate">👾 {game.gameType} | 📜 {game.status}</p> 
                  <p className="text-xs text-gray-400">🕓 {new Date(game.lastModified).toLocaleString()}</p> 
                </div> //can change emoji here to something custom
              ))
          )}
        </div>
      </aside>
    </div>
  );
};

export default TeacherDashboard;
