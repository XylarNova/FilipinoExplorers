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
        const classes = classRes.data;

        const allGamesWithClassInfo = [];
        const gameIdTracker = new Set(); // Track unique game IDs

        for (const classroom of classes) {
          try {
            const res = await axiosInstance.get(`/gamesessions/classroom/${classroom.id}`);
            const gamesInClass = res.data;

            gamesInClass.forEach((game) => {
              // Create unique identifier for game-classroom combination
              const gameKey = `${game.id}-${classroom.id}`;
              
              if (!gameIdTracker.has(gameKey)) {
                gameIdTracker.add(gameKey);
                
                // Add classroom info to each game
                const gameWithClassInfo = {
                  ...game,
                  classroomInfo: {
                    id: classroom.id,
                    name: classroom.name,
                    teacherName: classroom.teacher 
                      ? `${classroom.teacher.first_name} ${classroom.teacher.last_name}`
                      : 'Unknown Teacher'
                  },
                  // Default gameType if null
                  gameType: game.gameType || 'MemoryGame'
                };
                
                allGamesWithClassInfo.push(gameWithClassInfo);
              }
            });
          } catch (classError) {
            console.error(`Error loading games for classroom ${classroom.id}:`, classError);
          }
        }

        // Group games by quarter
        const grouped = {};
        quarters.forEach(q => grouped[q] = []);

        allGamesWithClassInfo.forEach((game) => {
          if (quarters.includes(game.quarter)) {
            grouped[game.quarter].push(game);
          }
        });

        // Sort games within each quarter by status (Open first) and then by title
        Object.keys(grouped).forEach(quarter => {
          grouped[quarter].sort((a, b) => {
            if (a.status === 'Open' && b.status !== 'Open') return -1;
            if (a.status !== 'Open' && b.status === 'Open') return 1;
            return a.gameTitle.localeCompare(b.gameTitle);
          });
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
          console.log('Game clicked:', game); // Debug log
          
          if (game.category === 'Vocabulary') {
            // Handle different game types with fallback
            switch (game.gameType) {
              case 'GuessTheWord':
                navigate(`/guesstheword/${game.id}`);
                break;
              case 'MemoryGame':
              case null:
              case undefined:
                // Default to MemoryGame for null/undefined gameType
                navigate(`/memorygame/${game.id}`);
                break;
              default:
                console.warn('Unknown game type:', game.gameType);
                // Default fallback to MemoryGame
                navigate(`/memorygame/${game.id}`);
            }
          } else if (game.category === 'Grammar') {
            // Handle Grammar games (you can add more game types here)
            navigate(`/memorygame/${game.id}`); // Default to memory game
          } else {
            console.error('Unsupported game category:', game.category);
            alert(`Game category "${game.category}" is not yet supported. Please contact your teacher.`);
          }
        }}
        className="bg-[#06D6A0] text-white px-4 py-1 rounded-full text-sm font-semibold hover:opacity-90 transition"
        title={`${hasPlayed ? 'Review' : 'Start'} - ${game.classroomInfo?.name || 'Unknown Class'}`}
      >
        {hasPlayed ? 'Review' : 'Start'}
      </button>
    );
  } else {
    return (
      <button
        disabled
        className="bg-gray-400 text-gray-600 px-4 py-1 rounded-full text-sm font-semibold cursor-not-allowed opacity-60"
        title={`Game is ${game.status.toLowerCase()} - ${game.classroomInfo?.name || 'Unknown Class'}`}
      >
        {game.status === 'Draft' ? 'Draft' : 'Locked'}
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
                        key={`${game.id}-${game.classroomInfo?.id || i}`}
                        className="flex justify-between items-center px-5 py-3 rounded-lg shadow"
                        style={{ backgroundColor: bgColor }}
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-[#073B4C]">{game.gameTitle}</div>
                          <div className="text-xs text-[#073B4C] opacity-75 mt-1">
                            {game.classroomInfo?.name} • {game.classroomInfo?.teacherName}
                          </div>
                          <div className="text-xs text-[#073B4C] opacity-60 mt-1">
                            {game.category} • {game.gameType || 'MemoryGame'}
                            {game.status !== 'Open' && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                                {game.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {renderGameButton(game)}
                        </div>
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
