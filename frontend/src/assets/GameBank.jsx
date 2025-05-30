import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import jwtDecode from 'jwt-decode';
import Logo from './images/Logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherSidebar from './TeacherSidebar';


const GameBank = () => {
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [vocabularyQuestions, setVocabularyQuestions] = useState([
    { tagalogWord: '', choices: ['', '', '', '', ''], correctAnswer: null, hint: '' },
  ]);
  const [gameSettings, setGameSettings] = useState({
    leaderboard: false,
    hints: false,
    review: false,
    shuffle: false,
    windowTracking: false,
  });
  const [quarter, setQuarter] = useState('');
  const [setTime, setSetTime] = useState('');
  const [gamePoints, setGamePoints] = useState('');
  const [savedGames, setSavedGames] = useState([]);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [classSelections, setClassSelections] = useState({});
  const [classes, setClasses] = useState([]);
  const [editingGameId, setEditingGameId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);

useEffect(() => {
  axiosInstance
    .get('/teachers/me')
    .then((res) => setTeacherId(res.data.teacherId))
    .catch((err) => console.error("❌ Failed to fetch teacher ID:", err));
}, []);



  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const createFlag = params.get('create');
  if (createFlag === 'true') {
    setIsPanelOpen(true);
  }
}, [location.search]);



  useEffect(() => {
    fetchSavedGames();
    fetchClasses();
  }, []);
  

const fetchSavedGames = async () => {
  try {
    const response = await axiosInstance.get('/gamesessions/my-games');
    const data = response.data;

    if (Array.isArray(data)) {
      setSavedGames(data);
    } else {
      console.error("Expected an array, got:", data);
      setSavedGames([]); // fallback
    }
  } catch (error) {
    console.error('❌ Error fetching teacher games:', error);
    setSavedGames([]); // fallback
  }
};



  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const email = decoded?.sub;

      if (!email) {
        console.error("❌ Email not found in token.");
        return;
      }

      const response = await axiosInstance.get(`/classes/teacher/email/${email}`);
      setClasses(response.data);
    } catch (error) {
      console.error("❌ Error fetching classes:", error);
    }
  };

      
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    if (!isPanelOpen) {
      resetForm();
    }
  };

  const handleSaveClassSelection = async (gameId, classId) => {
  try {
    await axiosInstance.put(`/gamesessions/updateClass/${gameId}`, { classIds: [classId] });
    fetchSavedGames();
  } catch (error) {
    console.error('❌ Error updating class for game:', error);
    alert('Failed to update class. Please try again.');
  }
};

  

  const resetForm = () => {
    setGameTitle('');
    setSelectedCategory('');
    setVocabularyQuestions([{ tagalogWord: '', choices: ['', '', '', '', ''], correctAnswer: null, hint: '' }]);
    setGameSettings({ leaderboard: false, hints: false, review: false, shuffle: false, windowTracking: false });
    setQuarter('');
    setSetTime('');
    setGamePoints('');
    setClassSelections((prev) => {
      const updated = { ...prev };
      if (editingGameId) delete updated[editingGameId];
      return updated;
    });
    setEditingGameId(null);
  };
  

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleQuarterChange = (e) => setQuarter(e.target.value);
  const handleSetTimeChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === '') setSetTime(value);
  };
  const handleGamePointsChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === '') setGamePoints(value);
  };
  const handleClassChange = (e) => setClassId(e.target.value);

  const handleAddQuestion = () => {
    setVocabularyQuestions([
      ...vocabularyQuestions,
      { tagalogWord: '', choices: ['', '', '', '', ''], correctAnswer: null, hint: '' },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...vocabularyQuestions];
    updated[index][field] = value;
    setVocabularyQuestions(updated);
  };

  const handleChoiceChange = (qIndex, cIndex, value) => {
    const updated = [...vocabularyQuestions];
    const isCurrentlyCorrect = updated[qIndex].correctAnswer === cIndex;
    updated[qIndex].choices[cIndex] = value;
  
    if (isCurrentlyCorrect) {
      updated[qIndex].correctAnswer = value;
    }
  
    setVocabularyQuestions(updated);
  };
  

  const handleCorrectAnswerChange = (qIndex, cIndex) => {
    const updated = [...vocabularyQuestions];
    updated[qIndex].correctAnswer = cIndex;
    setVocabularyQuestions(updated);
  };
  

  const handleCheckboxChange = (e) => {
    setGameSettings({
      ...gameSettings,
      [e.target.name]: e.target.checked,
    });
  };


const handleSaveGame = async () => {
  if (!teacherId) {
    alert("Please wait for the teacher ID to load.");
    return;
  }

  const validQuestions = vocabularyQuestions.filter(
    (q) => q.tagalogWord && q.choices.filter((c) => c).length === 4 && q.correctAnswer !== null
  );

  if (validQuestions.length === 0) {
    alert("Please fill in at least one valid question.");
    return;
  }

  const selectedClassroomIds = editingGameId
    ? classSelections[editingGameId] || []
    : classSelections['new'] || [];

  const classRoomIds = Array.isArray(selectedClassroomIds)
    ? selectedClassroomIds
    : [selectedClassroomIds];

  const gameSession = {
    gameTitle,
    category: selectedCategory,
    leaderboard: gameSettings.leaderboard,
    hints: gameSettings.hints,
    review: gameSettings.review,
    shuffle: gameSettings.shuffle,
    windowTracking: gameSettings.windowTracking,
    setTime: parseInt(setTime),
    quarter,
    gamePoints: parseInt(gamePoints),
    status: classRoomIds.length === 0 ? "Draft" : "Closed", // initial
    classRoomIds,
    teacherId,
    vocabularyQuestions: validQuestions,
  };

  try {
    if (editingGameId) {
      // ✅ Update main game
      await axiosInstance.put(`/gamesessions/put/${editingGameId}`, gameSession);

      // ✅ Assign classrooms
      await axiosInstance.put(`/gamesessions/updateClass/${editingGameId}`, {
        classIds: classRoomIds,
      });


      alert("Game updated successfully!");
    } else {
      // ✅ Create new game
      const res = await axiosInstance.post(`/gamesessions/post`, gameSession);
      const newGameId = res.data.id;

      // ✅ Assign classrooms
      await axiosInstance.put(`/gamesessions/updateClass/${newGameId}`, {
        classIds: classRoomIds,
      });

      // ✅ Update status (now that classrooms exist)
      await axiosInstance.put(`/gamesessions/updateStatus/${newGameId}`, {
        status: classRoomIds.length === 0 ? "Draft" : "Closed",
      });

      alert("Game saved successfully!");
    }

    fetchSavedGames();
    resetForm();
    setIsPanelOpen(false);
  } catch (error) {
    console.error("❌ Error saving game:", error);
    alert("Error saving game!");
  }
};


const handlePublishGame = async (gameId) => {
  try {
    const game = savedGames.find((g) => g.id === gameId);

    // 🔍 Support fallback to either `classSelections[gameId]` or fallback to game.classrooms
    const selectedClassIds = classSelections[gameId] ??
      (game?.classrooms?.map(c => c.id) ?? []);

    if (!Array.isArray(selectedClassIds) || selectedClassIds.length === 0) {
      alert("Please assign at least one class before publishing.");
      return;
    }

    // ✅ Check that vocabulary questions exist
    if (
      game?.category === "Vocabulary" &&
      (!game.vocabularyQuestions || game.vocabularyQuestions.length === 0)
    ) {
      alert("Cannot publish: No vocabulary questions found.");
      return;
    }

    // ✅ Assign class IDs
    await axiosInstance.put(`/gamesessions/updateClass/${gameId}`, {
      classIds: selectedClassIds,
    });

    // ✅ Update status to 'Open'
    await axiosInstance.put(`/gamesessions/updateStatus/${gameId}`, {
      status: "Open",
    });

    alert("Game published successfully!");
    fetchSavedGames();
  } catch (error) {
    console.error("❌ Error publishing game:", error);
    alert("Failed to publish game. Please try again.");
  }
};


    const handleDeleteGame = async (gameId) => {
      try {
        await axiosInstance.delete(`/gamesessions/delete/${gameId}`);
        alert('Game deleted successfully!');
        fetchSavedGames();
      } catch (error) {
        alert('Error deleting game!');
        console.error(error);
      }
    };


  const handleEditGame = (game) => {
    setEditingGameId(game.id);
    setGameTitle(game.gameTitle || '');
    setSelectedCategory(game.category || '');
    setVocabularyQuestions(game.vocabularyQuestions || [
      { tagalogWord: '', choices: ['', '', '', '', ''], correctAnswer: null, hint: '' }
    ]);
    setGameSettings({
      leaderboard: game.leaderboard || false,
      hints: game.hints || false,
      review: game.review || false,
      shuffle: game.shuffle || false,
      windowTracking: game.windowTracking || false,
    });
    setQuarter(game.quarter || '');
    setSetTime(game.setTime || '');
    setGamePoints(game.gamePoints || '');
   setClassSelections((prev) => ({
    ...prev,
    [game.id]: game.classrooms?.map(c => c.id) || []
  }));

    setIsPanelOpen(true);
  };


  const handlePerGameClassChange = (gameId, value) => {
    setClassSelections((prev) => ({
      ...prev,
      [gameId]: value,
    }));
    handleSaveClassSelection(gameId, value); 
  };

    const handleStatusChange = async (gameId, newStatus) => {
    try {
      // Optimistically update UI
      const updatedGames = savedGames.map((game) =>
        game.id === gameId ? { ...game, status: newStatus } : game
      );
      setSavedGames(updatedGames);

      await axiosInstance.put(`/gamesessions/updateStatus/${gameId}`, { status: newStatus });
    } catch (error) {
      console.error('Error updating game status:', error);
      alert('Failed to update game status. Please try again.');
      fetchSavedGames(); // Revert state if error
    }
  };


  return (
      <div className="w-full relative">
    {/* Top Bar */}
    <div className="bg-[#108AB1] rounded-b-[50px] h-[100px] px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-[56px] w-[56px] ml-10">
          <img src={Logo} alt="Logo" className="h-full w-full object-contain transform scale-[2.2]" />
        </div>
        <h1 className="text-white text-[40px] font-extrabold font-['Poppins'] pl-50">Game Bank</h1>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search games..."
          className="px-4 py-2 rounded-lg border-none outline-none text-[#213547] font-medium w-64 bg-white"
        />
        <button
          onClick={togglePanel}
          className="bg-[#06D7A0] text-white text-[20px] font-bold font-['Fredoka'] px-6 py-2 rounded-lg shadow-md"
        >
          Create Game
        </button>
      </div>
    </div>

    {/* WRAPPER for Sidebar + Main Content */}
    <div className="flex h-[calc(100vh-100px)]">
      {/* Sidebar */}
   <TeacherSidebar />

       
        {/* Main Game List */}
        <div className="flex-1 p-6">
          <p className="text-[#073A4D] text-[50px] font-bold font-['Poppins'] pt-8 pl-10">Game List</p>
          <div className="mt-10 flex justify-center">
            <div className="border-4 border-[#108AB1] rounded-[50px] w-[90%] p-6 bg-white">
              <div className="border-4 border-[#108AB1] rounded-[50px] bg-white">
                <div className="grid grid-cols-6 text-[#073A4D] font-semibold text-lg h-[60px] items-center">
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Game Title</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Category</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Status</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Class</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Last Modified</div>
                  <div className="text-center flex items-center justify-center h-full">Actions</div>
                  </div>
          {savedGames.map((game) => (
        <div
          key={game.id}
          className="grid grid-cols-6 border-t border-[#108AB1] text-[#073A4D] h-[70px] items-center hover:bg-[#E0F2F7]"
        >
          {/* Game Title */}
          <div className="border-r border-[#108AB1] text-center">{game.gameTitle}</div>

          {/* Category */}
          <div className="border-r border-[#108AB1] text-center">{game.category}</div>

          {/* Status Dropdown */}
          <div className="border-r border-[#108AB1] text-center">
            <select
              value={game.status}
              onChange={(e) => handleStatusChange(game.id, e.target.value)}
              className="bg-white border border-[#108AB1] rounded px-2 py-1 cursor-pointer"
            >
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
              <option value="Open">Open</option>
            </select>
          </div>

          {/* Class Column */}
          <div className="border-r border-[#108AB1] text-center relative">
            {game.classrooms?.length === 1 ? (
              <span>{game.classrooms[0].name}</span>
            ) : game.classrooms?.length > 1 ? (
              <>
                <button
                  onClick={() =>
                    setDropdownOpenId(dropdownOpenId === `class-${game.id}` ? null : `class-${game.id}`)
                  }
                  className="border border-gray-300 px-2 py-1 rounded bg-white text-sm w-[120px] truncate"
                >
                  {game.classrooms.length} Classes
                </button>
                {dropdownOpenId === `class-${game.id}` && (
                  <div className="absolute z-50 bg-white border rounded shadow-lg mt-2 p-2 w-[180px] max-h-[150px] overflow-y-auto">
                    {game.classrooms.map((c) => (
                      <div key={c.id} className="text-sm py-1 px-2 hover:bg-gray-100 rounded">
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-400 italic">None</span>
            )}
          </div>

          {/* Last Modified */}
          <div className="border-r border-[#108AB1] text-center">
            {game.lastModified
              ? new Date(game.lastModified).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              : 'N/A'}
          </div>

          {/* Actions Dropdown */}
          <div className="relative text-center">
            <button
              onClick={() =>
                setDropdownOpenId(dropdownOpenId === `action-${game.id}` ? null : `action-${game.id}`)
              }
              className="border border-[#108AB1] bg-white text-[#073A4D] rounded px-2 py-1 text-sm"
            >
              Actions
            </button>

            {dropdownOpenId === `action-${game.id}` && (
              <div className="absolute right-0 z-50 bg-white border rounded shadow-md mt-1 p-1 w-[120px]">
                <button
                  onClick={() => {
                    handleEditGame(game);
                    setDropdownOpenId(null);
                  }}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-yellow-100 text-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDeleteGame(game.id);
                    setDropdownOpenId(null);
                  }}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-red-100 text-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    handlePublishGame(game.id);
                    setDropdownOpenId(null);
                  }}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-green-100 text-green-600"
                >
                  Publish
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

    </div>
    </div>
    </div>
    </div>
        {/* Create/Edit Panel */}
    {isPanelOpen && (
      <div className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-lg p-6 overflow-y-auto z-50">
        <h2 className="text-[#108AB1] text-3xl font-bold mb-4">
          {editingGameId ? 'Edit Game' : 'Create Game'}
        </h2>

        {/* Game Title */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Game Title</label>
          <input
            type="text"
            placeholder="Enter game title"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

    {/* Category */}
    <div className="mb-6">
      <label className="block mb-1 font-semibold">Category</label>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="">Select category</option>
        <option value="Vocabulary">Vocabulary</option>
        <option value="Grammar">Grammar</option>
        {/* Add more categories if needed */}
      </select>
    </div>

    {/* Show vocabulary questions only if Vocabulary category is selected */}
    {selectedCategory === 'Vocabulary' && (
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Vocabulary Questions</label>
        {vocabularyQuestions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 border p-3 rounded">
            {/* Tagalog Word Input */}
            <input
              type="text"
              placeholder="Tagalog Word"
              value={q.tagalogWord}
              onChange={(e) => handleInputChange(qIndex, 'tagalogWord', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />

            {/* Choices with radio buttons in a 2x2 grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
              {[0, 1, 2, 3].map((cIndex) => (
                <label key={cIndex} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`correctAnswer-${qIndex}`}
                  checked={q.correctAnswer === cIndex}
                  onChange={() => handleCorrectAnswerChange(qIndex, cIndex)}
                  className="cursor-pointer"
                />
                <input
                  type="text"
                  placeholder={`Option ${cIndex + 1}`}
                  value={q.choices[cIndex]}
                  onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                  className={`border rounded px-2 py-1 w-full ${
                    q.correctAnswer === cIndex ? 'border-green-500' : 'border-gray-300'
                  }`}
                />
              </label>
              
              ))}
            </div>

            {/* Hint input below */}
            <input
              type="text"
              placeholder="Hint"
              value={q.hint}
              onChange={(e) => handleInputChange(qIndex, 'hint', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        ))}
        <button
          onClick={handleAddQuestion}
          className="bg-[#108AB1] text-white px-4 py-2 rounded mt-2"
        >
          Add Question
        </button>
      </div>
    )}

{/* Classroom Assignment + Game Settings */}
<div className="mb-6">
  <h3 className="font-semibold mb-2">Game Settings</h3>

  {/* Classroom Selection */}
  <div className="mb-4">
    <label className="block mb-1 font-semibold">Assign to Classrooms (optional)</label>
    <div className="border border-gray-300 rounded p-2 max-h-40 overflow-y-auto">
      <label className="flex items-center space-x-2 mb-1">
        <input
          type="checkbox"
          checked={(classSelections['new'] || []).length === 0}
          onChange={() => setClassSelections((prev) => ({ ...prev, new: [] }))}
        />
        <span>None (Save as Draft)</span>
      </label>
      {classes.map((c) => {
        const selected = classSelections['new'] || [];
        return (
          <label key={c.id} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={selected.includes(c.id)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...selected, c.id]
                  : selected.filter((id) => id !== c.id);
                setClassSelections((prev) => ({ ...prev, new: updated }));
              }}
            />
            <span className="text-sm truncate">{c.name}</span>
          </label>
        );
      })}
    </div>
  </div>

    {/* Game Settings Checkboxes */}
    <div className="flex flex-col space-y-2">
      {['leaderboard', 'hints', 'review', 'shuffle', 'windowTracking'].map((setting) => (
        <label key={setting} className="flex items-center space-x-2 capitalize">
          <input
            type="checkbox"
            name={setting}
            checked={gameSettings[setting]}
            onChange={handleCheckboxChange}
          />
          <span>{setting.charAt(0).toUpperCase() + setting.slice(1)}</span>
        </label>
      ))}
    </div>
  </div>


    {/* Set Time */}
    <div className="mb-5">
      <label className="block mb-2 font-semibold">Set Time (seconds)</label>
      <input
        type="number"
        min="0"
        value={setTime}
        onChange={handleSetTimeChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>

    {/* Quarter */}
    <div className="mb-5">
      <label className="block mb-2 font-semibold">Quarter</label>
      <select
        value={quarter}
        onChange={(e) => setQuarter(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      >
        <option value="">Select quarter</option>
        <option value="1st Quarter">1st Quarter</option>
        <option value="2nd Quarter">2nd Quarter</option>
        <option value="3rd Quarter">3rd Quarter</option>
        <option value="4th Quarter">4th Quarter</option>
      </select>
    </div>

    {/* Game Points */}
    <div className="mb-6">
      <label className="block mb-2 font-semibold">Game Points</label>
      <input
        type="number"
        min="0"
        value={gamePoints}
        onChange={handleGamePointsChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>

    <button
      onClick={handleSaveGame}
      className="bg-[#06D7A0] text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition"
    >
      {editingGameId ? 'Update Game' : 'Save Game'}
    </button>
    <button
      onClick={() => {
        if (window.confirm("Changes will not be saved. Are you sure you want to exit?")) {
          resetForm();
          setIsPanelOpen(false);
        }
      }}
      className="ml-4 bg-gray-400 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition"
    >
      Exit
    </button>
  </div>
)}

  </div>
</div>
);
};

export default GameBank;
