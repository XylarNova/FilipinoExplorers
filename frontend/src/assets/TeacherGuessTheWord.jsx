import { useState, useEffect } from 'react';
import axios from 'axios';
import filipinoExplorerLogo from '../assets/images/logo.png';

const TeacherGuessTheWord = () => {
  const [puzzles, setPuzzles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState({
  id: null,
  word: '',
  clue: '',
  translation: '', 
  shuffledLetters: '',
  score: 10,
  hintEnabled: true
});
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [selectedPuzzles, setSelectedPuzzles] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [activePuzzles, setActivePuzzles] = useState([]);
  const [editingScore, setEditingScore] = useState(null);
  const [temporaryScore, setTemporaryScore] = useState(10);

  // API base URL
  const API_BASE_URL = 'http://localhost:8080/api/gtw';

  // Fetch puzzles on component mount
  useEffect(() => {
    fetchPuzzles();
    fetchActivePuzzles();
  }, []);

  // Reset selected puzzles when the puzzle list changes or when activePuzzles changes
  useEffect(() => {
    if (activePuzzles.length > 0) {
      // If we have active puzzles, select those
      setSelectedPuzzles(activePuzzles.map(puzzle => puzzle.id));
    } else if (puzzles.length > 0 && puzzles.length <= 10) {
      // If 10 or fewer puzzles, auto-select all
      setSelectedPuzzles(puzzles.map(puzzle => puzzle.id));
    } else if (puzzles.length > 10 && !selectionMode) {
      // If more than 10 puzzles and not in selection mode, auto-select first 10
      setSelectedPuzzles(puzzles.slice(0, 10).map(puzzle => puzzle.id));
    }
  }, [puzzles, activePuzzles, selectionMode]);

  const fetchPuzzles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/word-puzzles`);
      if (response.data) {
        setPuzzles(response.data);
      }
    } catch (error) {
      console.error('Error fetching puzzles:', error);
      setError('Failed to load puzzles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivePuzzles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/active-puzzles`);
      if (response.data) {
        setActivePuzzles(response.data);
      }
    } catch (error) {
      console.error('Error fetching active puzzles:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPuzzle({
      ...currentPuzzle,
      [name]: name === 'score' ? parseInt(value, 10) || 10 : value
    });
  };

  const validateForm = () => {
  if (!currentPuzzle.word || !currentPuzzle.clue || !currentPuzzle.translation) {
    setError('Please fill in all required fields: Word, Clue, and Translation');
    return false;
  }
  return true;
};

  const resetForm = () => {
  setCurrentPuzzle({
    id: null,
    word: '',
    clue: '',
    translation: '', // Add translation field
    shuffledLetters: '',
    score: 10,
    hintEnabled: true
  });
  setIsEditing(false);
  setError(null);
};

  const savePuzzle = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let response;
      
      // If shuffledLetters is empty, the backend will generate it
      const puzzleData = {
        ...currentPuzzle,
        word: currentPuzzle.word.toUpperCase(), // Ensure word is uppercase
        score: currentPuzzle.score || 10 // Ensure score has a default value
      };
      
      if (isEditing) {
        response = await axios.put(`${API_BASE_URL}/word-puzzles/${currentPuzzle.id}`, puzzleData);
        setConfirmationMessage('Puzzle updated successfully!');
      } else {
        response = await axios.post(`${API_BASE_URL}/word-puzzles`, puzzleData);
        setConfirmationMessage('New puzzle added successfully!');
      }
      
      fetchPuzzles(); // Refresh the puzzle list
      resetForm();
      setShowConfirmation(true);
      
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving puzzle:', error);
      setError('Failed to save puzzle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const editPuzzle = (puzzle) => {
  setCurrentPuzzle({
    id: puzzle.id,
    word: puzzle.word,
    clue: puzzle.clue,
    translation: puzzle.translation || '', // Add translation field with fallback
    shuffledLetters: puzzle.shuffledLetters,
    score: puzzle.score || 10,
    hintEnabled: puzzle.hintEnabled !== false
  });
  setIsEditing(true);
  window.scrollTo(0, 0);
};

  const deletePuzzle = async (id) => {
    if (window.confirm('Are you sure you want to delete this puzzle?')) {
      try {
        await axios.delete(`${API_BASE_URL}/word-puzzles/${id}`);
        fetchPuzzles(); // Refresh the list
        fetchActivePuzzles(); // Refresh active puzzles
        setConfirmationMessage('Puzzle deleted successfully!');
        setShowConfirmation(true);
        
        // Hide confirmation after 3 seconds
        setTimeout(() => {
          setShowConfirmation(false);
        }, 3000);
      } catch (error) {
        console.error('Error deleting puzzle:', error);
        setError('Failed to delete puzzle. Please try again.');
      }
    }
  };

  // Toggle puzzle selection for gameplay
  const togglePuzzleSelection = (id) => {
    if (selectedPuzzles.includes(id)) {
      // Remove from selection if already selected
      setSelectedPuzzles(selectedPuzzles.filter(puzzleId => puzzleId !== id));
    } else {
      // Add to selection if not yet at 10 puzzles
      if (selectedPuzzles.length < 10) {
        setSelectedPuzzles([...selectedPuzzles, id]);
      } else {
        alert('You can only select up to 10 puzzles for gameplay!');
      }
    }
  };

  // Save the selected puzzles for gameplay
  const saveSelectedPuzzles = async () => {
    if (selectedPuzzles.length < 1) {
      setError('Please select at least one puzzle for gameplay.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/active-puzzles`, { puzzleIds: selectedPuzzles });
      fetchActivePuzzles(); // Refresh active puzzles list
      setConfirmationMessage(`${selectedPuzzles.length} puzzles successfully set for gameplay!`);
      setShowConfirmation(true);
      setSelectionMode(false);
      
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving selected puzzles:', error);
      setError('Failed to save selected puzzles. Please try again.');
    }
  };

  // Function to manually shuffle letters
  const shuffleLetters = () => {
    if (!currentPuzzle.word) {
      setError('Please enter a word first.');
      return;
    }
    
    const letters = currentPuzzle.word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    setCurrentPuzzle({
      ...currentPuzzle,
      shuffledLetters: letters.join('')
    });
  };

  // Start editing a puzzle's score
  const startEditingScore = (puzzle) => {
    setEditingScore(puzzle.id);
    setTemporaryScore(puzzle.score || 10);
  };

  // Cancel editing a puzzle's score
  const cancelEditingScore = () => {
    setEditingScore(null);
    setTemporaryScore(10);
  };

  // Save updated score for a puzzle
  const saveUpdatedScore = async (puzzleId) => {
    try {
      await axios.put(`${API_BASE_URL}/word-puzzles/${puzzleId}/score`, { score: temporaryScore });
      fetchPuzzles(); // Refresh the list
      setEditingScore(null);
      setConfirmationMessage('Score updated successfully!');
      setShowConfirmation(true);
      
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating score:', error);
      setError('Failed to update score. Please try again.');
    }
  };

  const toggleHintStatus = async (puzzleId, currentStatus) => {
  try {
    await axios.put(`${API_BASE_URL}/word-puzzles/${puzzleId}/hint-status`, { 
      hintEnabled: !currentStatus 
    });
    fetchPuzzles(); // Refresh the list
    setConfirmationMessage(`Hint ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
    setShowConfirmation(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  } catch (error) {
    console.error('Error updating hint status:', error);
    setError('Failed to update hint status. Please try again.');
  }
};
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header Section with logo on the left */}
      <div className="w-full py-4 px-8">
        <div className="w-40">
          <img src={filipinoExplorerLogo} alt="Filipino Explorer" className="w-full" />
        </div>
      </div>
      
      {/* Main content container */}
      <div className="flex justify-center">
        <div className="w-3/4 py-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-amber-900 text-center mb-8">Teacher Management: Guess the Word</h1>

          {/* Confirmation Message */}
          {showConfirmation && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{confirmationMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
              <button 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>
          )}

          {/* Word Count Status */}
          <div className="bg-amber-100 border border-amber-400 text-amber-800 px-4 py-3 rounded mb-4">
            <span className="block sm:inline font-medium">
              {puzzles.length < 10 ? 
                `You need to add ${10 - puzzles.length} more word(s) to meet the minimum requirement of 10 words.` : 
                `You have ${puzzles.length} words. ${puzzles.length > 10 ? 'You need to select 10 words for students to answer.' : 'All words will be used for students to answer.'}`
              }
            </span>
            {activePuzzles.length > 0 && (
              <span className="block sm:inline font-medium mt-2">
                Currently, {activePuzzles.length} word(s) are active for students.
              </span>
            )}
          </div>

          {/* Puzzle Form */}
          <div className="bg-white rounded-lg shadow-md p-10 mb-12">
            <h2 className="text-xl font-bold text-amber-800 mb-8 text-center">
              {isEditing ? 'Edit Puzzle' : 'Add New Puzzle'}
            </h2>
            
            <form onSubmit={savePuzzle} className="px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
                <div>
                  <label className="block text-amber-800 font-medium mb-3">
                    Word*
                  </label>
                  <input
                    type="text"
                    name="word"
                    value={currentPuzzle.word}
                    onChange={handleInputChange}
                    className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter word (e.g., BAYANIHAN)"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-2">The word players need to guess</p>
                </div>
                
                <div>
                  <label className="block text-amber-800 font-medium mb-3">
                    Shuffled Letters
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="shuffledLetters"
                      value={currentPuzzle.shuffledLetters}
                      onChange={handleInputChange}
                      className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Leave blank for auto-generation"
                    />
                    <button 
                      type="button" 
                      onClick={shuffleLetters}
                      className="bg-amber-400 hover:bg-amber-500 text-amber-900 px-4 py-2 rounded-md"
                    >
                      Shuffle
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Optional: System will auto-generate if left blank</p>
                </div>
                
                <div className="md:col-span-2 mt-2">
                  <label className="block text-amber-800 font-medium mb-3">
                    Score*
                  </label>
                  <input
                    type="number"
                    name="score"
                    value={currentPuzzle.score}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-2">Points awarded to the student for solving this puzzle (1-100)</p>
                </div>
                
                <div className="md:col-span-2 mt-2">
                  <label className="block text-amber-800 font-medium mb-3">
                    Clue*
                  </label>
                  <textarea
                    name="clue"
                    value={currentPuzzle.clue}
                    onChange={handleInputChange}
                    className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter clue (e.g., Isang taong handang magsakripisyo para sa kapwa at bayan.)"
                    rows="3"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-2">The main clue shown to players</p>
                </div>
                <div className="md:col-span-2 mt-2">
                <label className="block text-amber-800 font-medium mb-3">
                  Translation* 
                </label>
                <textarea
                  name="translation"
                  value={currentPuzzle.translation}
                  onChange={handleInputChange}
                  className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter English translation of the clue (e.g., A person willing to sacrifice for others and country.)"
                  rows="3"
                  required
                />
                <p className="text-gray-500 text-sm mt-2">English translation of the clue or definition</p>
              </div>
              </div>
              
              <div className="flex justify-center gap-6 mt-10">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-md font-medium"
                  disabled={isLoading}
                >
                  {isEditing ? 'Update Puzzle' : 'Add Puzzle'}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-md font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Puzzles List */}
          <div className="bg-white rounded-lg shadow-md p-10 mb-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-amber-800">Existing Puzzles</h2>
              
              {puzzles.length >= 10 && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectionMode(!selectionMode)}
                    className="bg-amber-400 hover:bg-amber-500 text-amber-900 px-4 py-2 rounded-md"
                  >
                    {selectionMode ? 'Cancel Selection' : 'Select Puzzles for Gameplay'}
                  </button>
                  
                  {selectionMode && (
                    <button
                      onClick={saveSelectedPuzzles}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                      disabled={selectedPuzzles.length === 0}
                    >
                      Save Selected ({selectedPuzzles.length}/10)
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {isLoading && <p className="text-center py-4">Loading puzzles...</p>}
            
            {!isLoading && puzzles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No puzzles found. Create your first puzzle using the form above!</p>
                <p className="text-red-500 font-medium">Remember: You need to add at least 10 words for students.</p>
              </div>
            )}
            
            {!isLoading && puzzles.length > 0 && (
              <div className="overflow-x-auto px-4">
                <table className="min-w-full bg-white border border-amber-200 rounded-lg">
                  <thead>
                    <tr className="bg-amber-100 text-amber-800">
                      {selectionMode && (
                        <th className="py-3 px-4 text-center border-b border-amber-200">
                          Select
                        </th>
                      )}
                      <th className="py-3 px-4 text-left border-b border-amber-200">ID</th>
                      <th className="py-3 px-4 text-left border-b border-amber-200">Word</th>
                      <th className="py-3 px-4 text-left border-b border-amber-200">Clue</th>
                      <th className="py-3 px-4 text-left border-b border-amber-200">Translation</th>
                      <th className="py-3 px-4 text-center border-b border-amber-200">Score</th>
                      <th className="py-3 px-4 text-center border-b border-amber-200">Active</th>
                      <th className="py-3 px-4 text-center border-b border-amber-200">Hint Status</th>
                      <th className="py-3 px-4 text-left border-b border-amber-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {puzzles.map((puzzle) => {
                      const isActive = activePuzzles.some(activePuzzle => activePuzzle.id === puzzle.id);
                      return (
                        <tr key={puzzle.id} className={`border-b border-amber-100 hover:bg-amber-50 ${
                          selectionMode && selectedPuzzles.includes(puzzle.id) ? 'bg-amber-50' : ''
                        }`}>
                          {selectionMode && (
                            <td className="py-3 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={selectedPuzzles.includes(puzzle.id)}
                                onChange={() => togglePuzzleSelection(puzzle.id)}
                                className="h-5 w-5 text-amber-500 focus:ring-amber-400"
                              />
                            </td>
                          )}
                          <td className="py-3 px-4">{puzzle.id}</td>
                          <td className="py-3 px-4 font-medium">{puzzle.word}</td>
                          <td className="py-3 px-4">
                            {puzzle.clue.length > 50 ? `${puzzle.clue.substring(0, 50)}...` : puzzle.clue}
                          </td>
                          <td className="py-3 px-4">
                            {puzzle.translation && puzzle.translation.length > 50 
                              ? `${puzzle.translation.substring(0, 50)}...` 
                              : (puzzle.translation || 'N/A')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {editingScore === puzzle.id ? (
                              <div className="flex items-center justify-center space-x-2">
                                <input
                                  type="number"
                                  value={temporaryScore}
                                  onChange={(e) => setTemporaryScore(parseInt(e.target.value) || 10)}
                                  min="1"
                                  max="100"
                                  className="w-16 border border-amber-300 rounded-md px-2 py-1 text-center"
                                />
                                <button
                                  onClick={() => saveUpdatedScore(puzzle.id)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={cancelEditingScore}
                                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div
                                className="flex items-center justify-center cursor-pointer hover:bg-amber-100 py-1 px-2 rounded"
                                onClick={() => startEditingScore(puzzle)}
                              >
                                <span className="font-medium">{puzzle.score || 10}</span>
                                <span className="ml-1 text-gray-500 text-xs">✏️</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isActive ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center">
                              <button
                                onClick={() => toggleHintStatus(puzzle.id, puzzle.hintEnabled !== false)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                  puzzle.hintEnabled !== false ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    puzzle.hintEnabled !== false ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                            <div className="text-xs mt-1">
                              {puzzle.hintEnabled !== false ? 'Enabled' : 'Disabled'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => editPuzzle(puzzle)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deletePuzzle(puzzle.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Requirements and instructions */}
            <div className="mt-8 space-y-4">
              {puzzles.length < 10 && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                  <p className="font-medium">⚠️ You need to add at least {10 - puzzles.length} more word(s) to meet the minimum requirement.</p>
                  <p className="text-sm mt-2">Students need at least 10 words to play the game effectively.</p>
                </div>
              )}
              
              {puzzles.length >= 10 && puzzles.length <= 10 && activePuzzles.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md">
                  <p className="font-medium">⚠️ You need to set these puzzles as active for students to play with them.</p>
                  <p className="text-sm mt-2">Click the "Select Puzzles for Gameplay" button to activate them.</p>
                </div>
              )}
              
              {puzzles.length > 10 && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md">
                  <p className="font-medium">ℹ️ You've created more than 10 words, which is great!</p>
                  <p className="text-sm mt-2">Please select exactly 10 words for students to play with by clicking the "Select Puzzles for Gameplay" button.</p>
                </div>
              )}
              
              {activePuzzles.length > 0 && activePuzzles.length < 10 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md">
                  <p className="font-medium">⚠️ You currently have {activePuzzles.length} active puzzles.</p>
                  <p className="text-sm mt-2">It's recommended to have exactly 10 active puzzles for the best student experience.</p>
                </div>
              )}
              
              {activePuzzles.length === 10 && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
                  <p className="font-medium">✅ Perfect! You have 10 active puzzles ready for students.</p>
                  <p className="text-sm mt-2">Students will see these puzzles when they play the game.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherGuessTheWord;