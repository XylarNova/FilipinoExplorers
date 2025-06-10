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
  const [playedGameIds, setPlayedGameIds] = useState([]);


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
        quarters.forEach(q => grouped[q] = []);

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

  useEffect(() => {
  axiosInstance.get('/student-game-session/student/played')
    .then(res => setPlayedGameIds(res.data))
    .catch(err => console.error('Failed to fetch played games:', err));
}, []);


const renderGameButton = (game) => {
  const hasPlayed = playedGameIds.includes(game.id);

if (game.status === 'Open') {
    return (
      <button
        onClick={() => {
          if (game.category === 'Vocabulary') {
            navigate(`/guesstheword/${game.id}`);
          } else if (game.category === 'Memory') {
            navigate(`/memorygame/${game.id}`);
          } else {
            alert('Unsupported game category: ' + game.category);
          }
        }}
        className="bg-[#06D6A0] text-white px-4 py-1 rounded-full text-sm font-semibold hover:opacity-90 transition"
      >
        {hasPlayed ? 'Review' : 'Start'}
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

  // Unified dark/light mode styles
  const mainBgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const cardBgClass = darkMode ? 'bg-[#2F2F2F]' : 'bg-[#FFFCF2]';
  const textClass = darkMode ? 'text-white' : 'text-[#213547]';

  return (
    <div className={`flex w-full min-h-screen ${mainBgClass}`}>
      <StudentSidebar darkMode={darkMode} />

      <div className="flex-1 px-10 py-8 overflow-y-auto">
        {/* Top Header */}
        <h1 className={`text-3xl font-bold mb-4 ${textClass}`}>Section Fortitude</h1>

        {/* Horizontal Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('Activities')}
            className={`px-6 py-2 rounded-lg font-bold shadow ${
              activeTab === 'Activities' ? 'bg-[#57B4BA] text-white' : 'bg-[#F7F6EC] text-[#213547]'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab('Group Activities')}
            className={`px-6 py-2 rounded-lg font-bold shadow ${
              activeTab === 'Group Activities' ? 'bg-[#57B4BA] text-white' : 'bg-[#F7F6EC] text-[#213547]'
            }`}
          >
            Group Activities
          </button>
        </div>

        {/* Game Cards */}
        {loading ? (
          <p className={`${textClass}`}>Loading games...</p>
        ) : (
          quarters.map((qtr, idx) => {
            const games = gamesByQuarter[qtr] || [];
            const isOpen = games.some((g) => g.status === 'Open');
            const quarterStatus = isOpen ? 'Open' : 'Closed';
            const statusColor = isOpen ? '#06D6A0' : '#EF476F';
            const bgColor = isOpen ? '#FFD166' : '#F78C6B';

            return (
              <div
                  key={idx}
                  className={`rounded-xl shadow p-6 mb-10 border-[5px] ${darkMode ? 'border-gray-700' : 'border-[#CEC9A8]'} ${cardBgClass}`}
                >

                <div className="flex justify-between items-center mb-4">
                  <span className="px-4 py-1 rounded-full text-white font-bold text-sm" style={{ backgroundColor: statusColor }}>
                    {quarterStatus}
                  </span>
                  <h3 className={`text-xl font-bold ${textClass}`}>{qtr}</h3>
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
