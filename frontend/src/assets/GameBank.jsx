import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Logo from './images/Logo.png';
import Dashboard from './images/Navigation/DashboardIcon.png';
import Profile from './images/Navigation/ProfileIcon.png';
import ClassIcon from './images/Navigation/ClassIcon.png';
import GameEditor from './images/Navigation/GameEditorIcon.png';
import LogOut from './images/Navigation/LogOutIcon.png';

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
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [editingGameId, setEditingGameId] = useState(null);

  // TODO: Replace this with your actual auth token retrieval method
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchSavedGames();
    fetchClasses();
  }, []);

  const fetchSavedGames = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/gamesessions/all');
      // Use the status from the backend, do NOT override it here
      setSavedGames(response.data);
    } catch (error) {
      console.error('Error fetching saved games:', error);
    }
  };

  const fetchClasses = async () => {
    const token = localStorage.getItem("token");
    let email;
  
    try {
      const decoded = jwtDecode(token);
      email = decoded.sub;
      if (!email) {
        console.error('Email not found in token');
        return;
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:8080/api/classes/teacher/email/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };
  

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    if (!isPanelOpen) {
      resetForm();
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
    setClassId('');
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
    const isCurrentlyCorrect = updated[qIndex].correctAnswer === updated[qIndex].choices[cIndex];
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
    const gameSession = {
      gameTitle,
      category: selectedCategory,
      vocabularyQuestions,
      gameSettings,
      quarter,
      setTime,
      gamePoints,
      classId,
      status: 'Closed', // default status on creation
    };

    try {
      if (editingGameId) {
        await axios.put(`http://localhost:8080/api/gamesessions/put/${editingGameId}`, gameSession);
        alert('Game updated successfully!');
      } else {
        await axios.post('http://localhost:8080/api/gamesessions/post', gameSession);
        alert('Game saved successfully!');
      }
      fetchSavedGames();
      resetForm();
      setIsPanelOpen(false);
    } catch (error) {
      alert('Error saving game!');
      console.error(error);
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      await axios.delete(`http://localhost:8080/api/gamesessions/delete/${gameId}`);
      alert('Game deleted successfully!');
      fetchSavedGames();
    } catch (error) {
      alert('Error deleting game!');
      console.error(error);
    }
  };

  const handleEditGame = (game) => {
    setEditingGameId(game.id);
    setGameTitle(game.gameTitle);
    setSelectedCategory(game.category);
    setVocabularyQuestions(game.vocabularyQuestions);
    setGameSettings(game.gameSettings);
    setQuarter(game.quarter);
    setSetTime(game.setTime);
    setGamePoints(game.gamePoints);
    setClassId(game.classId);
    setIsPanelOpen(true);
  };

  const handleStatusChange = async (gameId, newStatus) => {
    try {
      // Optimistically update UI
      const updatedGames = savedGames.map((game) =>
        game.id === gameId ? { ...game, status: newStatus } : game
      );
      setSavedGames(updatedGames);

      await axios.put(`http://localhost:8080/api/gamesessions/updateStatus/${gameId}`, { status: newStatus });
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

      {/* Side Navigation */}
      <div className="flex h-[calc(100vh-100px)]">
        <div className="w-[100px] bg-white flex flex-col items-center justify-center space-y-10">
          <img src={Dashboard} alt="Dashboard" className="w-12 h-12 cursor-pointer" />
          <img src={Profile} alt="Profile" className="w-12 h-12 cursor-pointer" />
          <img src={ClassIcon} alt="Classes" className="w-12 h-12 cursor-pointer" />
          <img src={GameEditor} alt="Game Editor" className="w-12 h-12 cursor-pointer" />
          <img src={LogOut} alt="Logout" className="w-12 h-12 cursor-pointer" />
        </div>

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
<div key={game.id} className="grid grid-cols-6 border-t border-[#108AB1] text-[#073A4D] h-[70px] items-center hover:bg-[#E0F2F7]" >
<div className="border-r border-[#108AB1] text-center">{game.gameTitle}</div>
<div className="border-r border-[#108AB1] text-center">{game.category}</div>
<div className="border-r border-[#108AB1] text-center">
<select
value={game.status}
onChange={(e) => handleStatusChange(game.id, e.target.value)}
className="bg-white border border-[#108AB1] rounded px-2 py-1 cursor-pointer"
>
<option value="Closed">Closed</option>
<option value="Open">Open</option>
</select>
</div>
<div className="border-r border-[#108AB1] text-center">
<select
  value={classId}
  onChange={handleClassChange}
  className="border border-gray-300 rounded p-2"
>
  <option value="">Select a Class</option>
  {classes.map((c) => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
</select>

</div>
<div className="border-r border-[#108AB1] text-center">
{game.lastModified
  ? new Date(game.lastModified).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  : 'N/A'}

</div>
<div className="text-center space-x-4">
<button
onClick={() => handleEditGame(game)}
className="bg-[#06D7A0] text-white px-4 py-1 rounded"
>
Edit
</button>
<button
onClick={() => handleDeleteGame(game.id)}
className="bg-[#FF595E] text-white px-4 py-1 rounded"
>
Delete
</button>
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

    {/* Game Settings Section */}
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Game Settings</h3>
      <div className="flex flex-col space-y-2">
        {/* Only show these specific settings */}
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
  </div>
)}

  </div>
</div>
);
};

export default GameBank;
