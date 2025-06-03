import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import StudentSidebar from './StudentSidebar';
import { useNavigate } from 'react-router-dom';

const quarters = ['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter'];

const StudentModule = ({ darkMode = false }) => {
  const [gamesByQuarter, setGamesByQuarter] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Activities');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const classRes = await axiosInstance.get('/classes/student/joined');
        const classIds = classRes.data.map((cls) => cls.id);

        const allGames = [];
        for (const id of classIds) {
          const res = await axiosInstance.get(`/gamesessions/classroom/${id}`);
          allGames.push(...res.data);
        }

        const grouped = {};
        quarters.forEach(q => grouped[q] = []); // ensure all quarters exist

        allGames.forEach((game) => {
          if (quarters.includes(game.quarter)) {
            grouped[game.quarter].push(game);
          }
        });

        setGamesByQuarter(grouped);
      } catch (err) {
        console.error('Error loading games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const renderStatusBadge = (status) => (
    <span
      className={`px-3 py-1 text-sm font-bold rounded-full text-white`}
      style={{ backgroundColor: status === 'Open' ? '#06D6A0' : '#EF476F' }}
    >
      {status}
    </span>
  );

  const renderGameButton = (game) => {
    if (game.status === 'Open') {
      return (
        <button
          onClick={() => navigate(`/play/${game.gameTitle.toLowerCase().replace(/\s/g, '-')}/${game.id}`)}
          className="bg-[#06D6A0] text-white px-4 py-1 rounded-full text-sm font-semibold hover:opacity-90 transition"
        >
          {game.review ? 'Review' : 'Start'}
        </button>
      );
    } else {
      return (
        <button
          disabled
          className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold cursor-not-allowed"
        >
          Lock
        </button>
      );
    }
  };

  const bgClass = darkMode ? 'bg-gray-900 text-white' : 'bg-white text-[#213547]';

  return (
    <div className={`flex h-screen ${bgClass}`}>
      <StudentSidebar darkMode={darkMode} />

      <div className="flex-1 overflow-y-auto p-10">
        <h1 className="text-3xl font-bold text-[#213547] mb-6">Section Fortitude</h1>

        <div className="flex gap-6 mb-10">
          <div className="w-[180px] p-4 rounded-lg shadow bg-[#F7F6EC] space-y-4">
            <button
              onClick={() => setActiveTab('Activities')}
              className={`w-full py-2 rounded ${activeTab === 'Activities' ? 'bg-[#213547] text-white' : 'bg-white text-[#213547]'} font-bold shadow`}
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab('Group Activities')}
              className={`w-full py-2 rounded ${activeTab === 'Group Activities' ? 'bg-[#213547] text-white' : 'bg-white text-[#213547]'} font-bold shadow`}
            >
              Group Activities
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading games...</p>
        ) : (
          quarters.map((qtr, idx) => {
            const games = gamesByQuarter[qtr] || [];
            const isOpen = games.some((g) => g.status === 'Open');
            const quarterStatus = isOpen ? 'Open' : 'Closed';
            const statusColor = isOpen ? '#06D6A0' : '#EF476F';
            const bgColor = isOpen ? '#FFD166' : '#F78C6B';

            return (
              <div key={idx} className="rounded-xl border shadow p-6 bg-[#FFFCF2] mb-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-4 py-1 rounded-full text-white font-bold text-sm" style={{ backgroundColor: statusColor }}>
                    {quarterStatus}
                  </span>
                  <h3 className="text-xl font-bold text-[#213547]">{qtr}</h3>
                </div>

                <div className="space-y-3">
                  {games.length > 0 ? (
                    games.map((game, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center px-5 py-3 rounded-lg shadow"
                        style={{ backgroundColor: bgColor }}
                      >
                        <span className="font-semibold text-[#073B4C]">{game.gameTitle}</span>
                        {renderGameButton(game)}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-gray-500">No games in this quarter</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentModule;
