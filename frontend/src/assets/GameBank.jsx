import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import jwtDecode from 'jwt-decode';
import Logo from './images/Logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherSidebarIcon from './TeacherSidebarIcon';
import GuessTheWordImage from './images/Homepage/Guess The Word .png';
import ParkeQuestImage from './images/Homepage/Parke Quest.png';
import PaaralanQuestImage from './images/Homepage/Paaralan Quest Icon.png';
import MemoryGameImage from './images/Homepage/Memory Game Icon.png';
import MemoryGamePanel from './MemoryGamePanel';
import GuessTheWordPanel from './GuessTheWordPanel';
import PaaralanQuestPanel from './PaaralanQuestPanel';
import ParkeQuestPanel from './ParkeQuestPanel';



const GameBank = () => {
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(''); // Category is now the game type
  const [selectedGameType, setSelectedGameType] = useState(''); // For memory game: individual or group
  
  // Function to get category based on game type
  const getCategoryFromGameType = (gameType) => {
    switch (gameType) {
      case 'MemoryGame':
      case 'GuessTheWord':
        return 'Vocabulary';
      case 'ParkeQuest':
        return 'Grammar';
      case 'PaaralanQuest':
        return 'Reading Comprehension';
      default:
        return '';
    }
  };
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
  console.log("🔄 Loading teacher ID...");
  axiosInstance
    .get('/teachers/me')
    .then((res) => {
      console.log("✅ Teacher ID loaded:", res.data.teacherId);
      setTeacherId(res.data.teacherId);
    })
    .catch((err) => {
      console.error("❌ Failed to fetch teacher ID:", err);
      console.error("❌ Teacher ID error response:", err.response?.data);
      // Try to get teacher ID from token as fallback
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          console.log("🔄 Token decoded:", decoded);
          if (decoded.teacherId) {
            console.log("✅ Using teacher ID from token:", decoded.teacherId);
            setTeacherId(decoded.teacherId);
          }
        }
      } catch (tokenError) {
        console.error("❌ Error decoding token:", tokenError);
      }
    });
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
    let data = response.data;
    
    // Debug: Log the response structure
    console.log("🔍 Full response structure:", data);
    console.log("🔍 Response type:", typeof data);
    console.log("🔍 Is array?", Array.isArray(data));

    // If data is a string, try to parse it as JSON
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
        console.log("🔍 Parsed JSON data:", data);
      } catch (parseError) {
        console.error("❌ Failed to parse JSON string:", parseError);
        setSavedGames([]);
        return;
      }
    }

    // Handle both array and object responses
    let gamesArray;
    if (Array.isArray(data)) {
      gamesArray = data;
    } else if (data && typeof data === 'object') {
      // If it's an object, try to find the array property
      gamesArray = data.games || data.data || data.content || data.results || [];
      
      // If none of the common properties exist, check if it's a single game object
      if (!Array.isArray(gamesArray) && data.id) {
        gamesArray = [data]; // Wrap single game in array
      }
    } else {
      gamesArray = [];
    }

    console.log("🔍 Final games array:", gamesArray);
    console.log("🔍 Number of games:", gamesArray.length);

    if (Array.isArray(gamesArray)) {
      setSavedGames(gamesArray);
    } else {
      console.error("Unable to extract games array from response:", data);
      setSavedGames([]);
    }
  } catch (error) {
    console.error('❌ Error fetching teacher games:', error);
    setSavedGames([]);
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
    setSelectedCategory(''); // Category is now the main game type
    setSelectedGameType(''); // Reset subtype (individual/group for memory games)
    setVocabularyQuestions([{ tagalogWord: '', choices: ['', '', '', '', ''], correctAnswer: null, hint: '', story: '' }]);
    setGameSettings({ 
      leaderboard: false, 
      hints: false, 
      review: false, 
      shuffle: false, 
      windowTracking: false,
      storyContent: '' // Reset story content for quest games
    });
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
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedGameType(''); // Reset game type when category changes
  };
  const handleGameTypeChange = (e) => setSelectedGameType(e.target.value); // For memory game subtype
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
    let newQuestion;
    
    if (selectedCategory === 'MemoryGame') {
      // Memory games need exactly 5 choices, with correct answer at index 0
      newQuestion = { tagalogWord: '', choices: ['', 'Option 1', 'Option 2', 'Option 3', 'Option 4'], correctAnswer: 0, hint: '', story: '' };
    } else if (selectedCategory === 'PaaralanQuest' || selectedCategory === 'ParkeQuest') {
      // Quest games start with 2 choices but can have more
      newQuestion = { tagalogWord: '', choices: ['', ''], correctAnswer: null, hint: '', story: '' };
    } else {
      // Default structure for other games
      newQuestion = { tagalogWord: '', choices: ['', '', '', '', ''], correctAnswer: null, hint: '', story: '' };
    }
    
    setVocabularyQuestions([...vocabularyQuestions, newQuestion]);
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
  

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...vocabularyQuestions];
    
    // Set the correct answer in the first available slot (index 0)
    updated[qIndex].choices[0] = value;
    updated[qIndex].correctAnswer = 0;
    
    setVocabularyQuestions(updated);
  };

  // Auto-fill choices with common wrong answers
  const handleAutoFillChoices = (qIndex) => {
    const updated = [...vocabularyQuestions];
    const question = updated[qIndex];
    
    // Comprehensive bank of common English words for Filipino vocabulary learning
    const vocabularyBank = {
      // Basic nouns
      household: ['House', 'Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Living Room', 'Garden', 'Garage', 'Roof', 'Floor'],
      family: ['Mother', 'Father', 'Sister', 'Brother', 'Grandmother', 'Grandfather', 'Uncle', 'Aunt', 'Cousin', 'Baby'],
      body: ['Head', 'Eye', 'Nose', 'Mouth', 'Ear', 'Hand', 'Foot', 'Arm', 'Leg', 'Hair'],
      food: ['Rice', 'Bread', 'Water', 'Milk', 'Fish', 'Chicken', 'Egg', 'Fruit', 'Vegetable', 'Soup'],
      school: ['Book', 'Pen', 'Paper', 'Chair', 'Table', 'Board', 'Teacher', 'Student', 'Class', 'School'],
      nature: ['Tree', 'Flower', 'Sun', 'Moon', 'Star', 'River', 'Mountain', 'Sea', 'Sky', 'Cloud'],
      animals: ['Dog', 'Cat', 'Bird', 'Fish', 'Cow', 'Horse', 'Pig', 'Chicken', 'Duck', 'Goat'],
      transport: ['Car', 'Bus', 'Train', 'Plane', 'Boat', 'Bicycle', 'Motorcycle', 'Truck', 'Ship', 'Taxi'],
      
      // Adjectives
      colors: ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Black', 'Purple', 'Orange', 'Pink', 'Brown'],
      size: ['Big', 'Small', 'Large', 'Tiny', 'Huge', 'Long', 'Short', 'Wide', 'Narrow', 'Thick'],
      feelings: ['Happy', 'Sad', 'Angry', 'Excited', 'Tired', 'Scared', 'Proud', 'Worried', 'Calm', 'Surprised'],
      qualities: ['Good', 'Bad', 'Beautiful', 'Ugly', 'Clean', 'Dirty', 'New', 'Old', 'Easy', 'Hard'],
      
      // Verbs
      actions: ['Run', 'Walk', 'Jump', 'Swim', 'Eat', 'Drink', 'Sleep', 'Study', 'Play', 'Work'],
      daily: ['Wake up', 'Get up', 'Brush teeth', 'Take a bath', 'Cook', 'Clean', 'Read', 'Write', 'Listen', 'Watch'],
      
      // Places
      places: ['Hospital', 'Market', 'Church', 'Park', 'Library', 'Store', 'Restaurant', 'Beach', 'Mall', 'Office'],
      
      // Time and numbers
      time: ['Morning', 'Afternoon', 'Evening', 'Night', 'Today', 'Tomorrow', 'Yesterday', 'Week', 'Month', 'Year'],
      numbers: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']
    };
    
    // Flatten all vocabulary into one array
    const allWords = Object.values(vocabularyBank).flat();
    
    // Get the correct answer
    const correctAnswer = question.choices[0] || '';
    
    // Filter out the correct answer and already used choices
    const usedChoices = question.choices.filter(choice => choice.trim() !== '').map(choice => choice.toLowerCase());
    const availableChoices = allWords.filter(word => 
      word.toLowerCase() !== correctAnswer.toLowerCase() && 
      !usedChoices.includes(word.toLowerCase())
    );
    
    // Shuffle the available choices
    const shuffled = availableChoices.sort(() => Math.random() - 0.5);
    
    // Fill empty slots or replace placeholder options with random wrong answers
    let choiceIndex = 1; // Start from index 1 (index 0 is for correct answer)
    let wordIndex = 0;
    
    while (choiceIndex < 5 && wordIndex < shuffled.length) {
      const currentChoice = question.choices[choiceIndex] || '';
      // Replace if empty, or if it's a placeholder option from bulk import
      if (currentChoice.trim() === '' || currentChoice.startsWith('Option ')) {
        updated[qIndex].choices[choiceIndex] = shuffled[wordIndex];
        wordIndex++;
      }
      choiceIndex++;
    }
    
    // Ensure we have at least 4 total choices (including correct answer)
    // If we don't have enough shuffled words, generate simple alternatives
    for (let i = 1; i < 5; i++) {
      const currentChoice = updated[qIndex].choices[i] || '';
      if (currentChoice.trim() === '' || currentChoice.startsWith('Option ')) {
        const fallbackWords = ['Choice', 'Answer', 'Word', 'Item'];
        updated[qIndex].choices[i] = fallbackWords[(i - 1) % fallbackWords.length] + ' ' + i;
      }
    }
    
    setVocabularyQuestions(updated);
  };
  

  const handleCheckboxChange = (e) => {
    setGameSettings({
      ...gameSettings,
      [e.target.name]: e.target.checked,
    });
  };


const handleSaveGame = async () => {
  console.log("🚀 Starting game save process...");
  
  if (!teacherId) {
    alert("Please wait for the teacher ID to load.");
    console.error("❌ Teacher ID is not loaded:", teacherId);
    return;
  }

  console.log("✅ Teacher ID loaded:", teacherId);

  // Validate required fields
  if (!gameTitle.trim()) {
    alert("Please enter a game title.");
    return;
  }

  if (!selectedCategory) {
    alert("Please select a category (game type).");
    return;
  }

  // For memory games, require subtype selection
  if (selectedCategory === 'MemoryGame' && !selectedGameType) {
    alert("Please select Individual or Group mode for Memory Game.");
    return;
  }

  if (!quarter) {
    alert("Please select a quarter.");
    return;
  }

  console.log("✅ Basic validation passed");

  // Validate vocabulary questions for all game types
  let validQuestions = [];
  
  if (selectedCategory === 'MemoryGame') {
    // Memory games need 5 choices (including correct answer) and correct answer set
    console.log("🔍 Validating Memory Game questions:");
    vocabularyQuestions.forEach((q, index) => {
      console.log(`Question ${index + 1}:`, {
        tagalogWord: q.tagalogWord,
        choices: q.choices,
        filledChoices: q.choices.filter((c) => c && c.trim()).length,
        correctAnswer: q.correctAnswer
      });
    });
    
    validQuestions = vocabularyQuestions.filter(
      (q) => q.tagalogWord && q.choices.filter((c) => c && c.trim()).length >= 4 && q.correctAnswer !== null
    );
    
    console.log("✅ Valid questions count:", validQuestions.length);
  } else if (selectedCategory === 'GuessTheWord') {
    // Guess the word games only need tagalog word and hint
    validQuestions = vocabularyQuestions.filter(
      (q) => q.tagalogWord && q.hint
    );
  } else if (selectedCategory === 'PaaralanQuest' || selectedCategory === 'ParkeQuest') {
    // Quest games need at least 2 choices and correct answer
    validQuestions = vocabularyQuestions.filter(
      (q) => q.tagalogWord && q.choices.filter((c) => c).length >= 2 && q.correctAnswer !== null
    );
  } else {
    // Other game types need at least tagalog word
    validQuestions = vocabularyQuestions.filter(
      (q) => q.tagalogWord
    );
  }

  if (validQuestions.length === 0) {
    const gameTypeMessage = selectedCategory === 'MemoryGame' 
      ? "Please fill in at least one valid vocabulary question with all choices and correct answer."
      : selectedCategory === 'GuessTheWord'
      ? "Please fill in at least one word with a hint."
      : selectedCategory === 'PaaralanQuest' || selectedCategory === 'ParkeQuest'
      ? "Please fill in at least one valid question with at least 2 choices and select a correct answer."
      : "Please fill in at least one valid vocabulary question.";
    alert(gameTypeMessage);
    return;
  }

  console.log("✅ Question validation passed, valid questions:", validQuestions.length);

  // Additional validation for PaaralanQuest games
  if (selectedCategory === 'PaaralanQuest') {
    const storyMode = gameSettings.storyMode || 'single';
    
    if (storyMode === 'single') {
      // Single story mode: require main story content
      if (!gameSettings.storyContent || gameSettings.storyContent.trim() === '') {
        alert("Please enter a main story for the Paaralan Quest game.");
        return;
      }
    } else if (storyMode === 'multiple') {
      // Multiple stories mode: require story for each question
      const questionsWithoutStory = vocabularyQuestions.filter(
        (q, index) => !q.story || q.story.trim() === ''
      );
      
      if (questionsWithoutStory.length > 0) {
        alert("In Multiple Stories Mode, please provide a story for each question.");
        return;
      }
    }
    
    if (vocabularyQuestions.length === 0) {
      alert("Please add at least one question for the story.");
      return;
    }
  }

  const selectedClassroomIds = editingGameId
    ? classSelections[editingGameId] || []
    : classSelections['new'] || [];

  const classRoomIds = Array.isArray(selectedClassroomIds)
    ? selectedClassroomIds
    : [selectedClassroomIds];

  console.log("✅ Classroom IDs:", classRoomIds);

  const gameSession = {
    gameTitle: gameTitle.trim(),
    gameType: selectedCategory, // Category is now the main game type
    category: getCategoryFromGameType(selectedCategory), // Auto-generated category based on game type
    // For memory games, include subtype (individual/group)
    memoryGameType: selectedCategory === 'MemoryGame' ? selectedGameType : null,
    leaderboard: Boolean(gameSettings.leaderboard),
    hints: Boolean(gameSettings.hints),
    review: Boolean(gameSettings.review),
    shuffle: Boolean(gameSettings.shuffle),
    windowTracking: Boolean(gameSettings.windowTracking),
    setTime: parseInt(setTime) * 60 || 300, // Default to 5 minutes if not set
    quarter: quarter.trim(),
    gamePoints: parseInt(gamePoints) || 10, // Default to 10 points if not set
    status: editingGameId 
      ? savedGames.find(g => g.id === editingGameId)?.status || "Closed"
      : (classRoomIds.length === 0 ? "Draft" : "Closed"),
    classRoomIds: classRoomIds,
    teacherId: teacherId,
    // Include story content for quest games
    storyContent: (selectedCategory === 'PaaralanQuest' || selectedCategory === 'ParkeQuest') 
      ? (gameSettings.storyContent || '').trim()
      : '',
    // Include story mode for quest games
    storyMode: (selectedCategory === 'PaaralanQuest' || selectedCategory === 'ParkeQuest') 
      ? gameSettings.storyMode || 'single' 
      : '',
    // Include vocabulary questions for all game types
    vocabularyQuestions: selectedCategory === 'MemoryGame' 
      ? vocabularyQuestions.filter(q => q.tagalogWord && q.choices.filter(c => c).length === 4 && q.correctAnswer !== null)
          .map(q => ({
            ...q,
            correctAnswer: q.choices[q.correctAnswer] || q.choices[0] // Convert index to actual text
          }))
      : selectedCategory === 'GuessTheWord'
      ? vocabularyQuestions.filter(q => q.tagalogWord && q.hint)
      : selectedCategory === 'PaaralanQuest' || selectedCategory === 'ParkeQuest'
      ? vocabularyQuestions.filter(q => q.tagalogWord && q.choices.filter(c => c).length >= 2 && q.correctAnswer !== null)
          .map(q => ({
            ...q,
            correctAnswer: q.choices[q.correctAnswer] || q.choices[0] // Convert index to actual text
          }))
      : vocabularyQuestions.filter(q => q.tagalogWord),
  };

  // Validate the game session data before sending
  console.log("🔍 Game session validation:");
  console.log("- Game Title:", gameSession.gameTitle);
  console.log("- Game Type:", gameSession.gameType);
  console.log("- Category:", gameSession.category);
  console.log("- Teacher ID:", gameSession.teacherId);
  console.log("- Questions count:", gameSession.vocabularyQuestions.length);
  console.log("- Set Time:", gameSession.setTime);
  console.log("- Game Points:", gameSession.gamePoints);
  console.log("- Quarter:", gameSession.quarter);
  
  // Additional validation
  if (!gameSession.gameTitle || gameSession.gameTitle.trim() === '') {
    alert("Game title is required");
    return;
  }
  
  if (!gameSession.gameType) {
    alert("Game type is required");
    return;
  }
  
  if (!gameSession.teacherId) {
    alert("Teacher ID is missing. Please refresh the page and try again.");
    return;
  }

  try {
    console.log("🔄 Attempting to save game with data:", gameSession);
    
    if (editingGameId) {
      console.log("📝 Updating existing game:", editingGameId);
      await axiosInstance.put(`/gamesessions/put/${editingGameId}`, gameSession);
      await axiosInstance.put(`/gamesessions/updateClass/${editingGameId}`, {
        classIds: classRoomIds,
      });
      alert("Game updated successfully!");
    } else {
      console.log("➕ Creating new game");
      const res = await axiosInstance.post(`/gamesessions/post`, gameSession);
      console.log("✅ Game created, response:", res.data);
      const newGameId = res.data.id;

      if (newGameId) {
        await axiosInstance.put(`/gamesessions/updateClass/${newGameId}`, {
          classIds: classRoomIds,
        });

        await axiosInstance.put(`/gamesessions/updateStatus/${newGameId}`, {
          status: classRoomIds.length === 0 ? "Draft" : "Closed",
        });
      }

      alert("Game saved successfully!");
    }

    fetchSavedGames();
    resetForm();
    setIsPanelOpen(false);
  } catch (error) {
    console.error("❌ Full error object:", error);
    console.error("❌ Error response:", error.response);
    console.error("❌ Error response data:", error.response?.data);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.response?.data ||
                        error.message ||
                        "Unknown error occurred";
    
    alert("Error saving game: " + errorMessage);
    
    // Log the game session data that failed
    console.error("❌ Failed game session data:", gameSession);
  }
};



const handlePublishGame = async (gameId) => {
  try {
    const game = savedGames.find((g) => g.id === gameId);

    if (!game) {
      alert("Game not found!");
      return;
    }

    // 🔍 Support fallback to either `classSelections[gameId]` or fallback to game.classrooms
    const selectedClassIds = classSelections[gameId] ??
      (game?.classrooms?.map(c => c.id) ?? []);

    if (!Array.isArray(selectedClassIds) || selectedClassIds.length === 0) {
      alert("Please assign at least one class before publishing.");
      return;
    }

    // ✅ Validate game has required fields
    if (!game.gameTitle || !game.gameType) {
      alert("Cannot publish: Game is missing required information (title or game type).");
      return;
    }

    // ✅ Check that vocabulary questions exist for all games
    if (!game.vocabularyQuestions || game.vocabularyQuestions.length === 0) {
      alert("Cannot publish: No questions found for this game.");
      return;
    }

    // ✅ Validate time and points
    if (!game.setTime || game.setTime <= 0) {
      alert("Cannot publish: Please set a valid time limit for the game.");
      return;
    }

    if (!game.gamePoints || game.gamePoints <= 0) {
      alert("Cannot publish: Please set valid game points.");
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

    alert("Game published successfully! Students can now access this game.");
    fetchSavedGames();
  } catch (error) {
    console.error("❌ Error publishing game:", error);
    alert("Failed to publish game: " + (error.response?.data?.message || error.message));
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
    setSelectedCategory(game.gameType || 'MemoryGame'); // Use gameType as the main category
    setSelectedGameType(game.memoryGameType || ''); // Set memory game subtype
    
    // Convert backend data to frontend format
    const convertedQuestions = game.vocabularyQuestions?.map(q => {
      // Convert correctAnswer from String to index
      let correctAnswerIndex = null;
      if (q.correctAnswer && q.choices) {
        correctAnswerIndex = q.choices.findIndex(choice => choice === q.correctAnswer);
        if (correctAnswerIndex === -1) {
          // If correctAnswer text is not found in choices, put it in first slot
          correctAnswerIndex = 0;
          q.choices[0] = q.correctAnswer;
        }
      }
      
      return {
        ...q,
        correctAnswer: correctAnswerIndex
      };
    }) || [
      { tagalogWord: '', choices: ['', '', '', '', ''], correctAnswer: null, hint: '' }
    ];
    
    setVocabularyQuestions(convertedQuestions);
    setGameSettings({
      leaderboard: game.leaderboard || false,
      hints: game.hints || false,
      review: game.review || false,
      shuffle: game.shuffle || false,
      windowTracking: game.windowTracking || false,
      storyContent: game.storyContent || '',
      storyMode: game.storyMode || 'single'
    });
    setQuarter(game.quarter || '');
    setSetTime(game.setTime ? Math.floor(game.setTime / 60) : ''); // Convert seconds back to minutes
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


  // Test API connectivity
  const testApiConnection = async () => {
    try {
      console.log("🔄 Testing API connection...");
      const response = await axiosInstance.get('/teachers/me');
      console.log("✅ API test successful:", response.data);
      alert("API connection successful! Teacher ID: " + response.data.teacherId);
    } catch (error) {
      console.error("❌ API test failed:", error);
      alert("API connection failed: " + (error.response?.data?.message || error.message));
    }
  };

  // Test game session functionality
  const testGameSession = async () => {
    try {
      console.log("🔄 Testing game session creation and retrieval...");
      
      // Test 1: Create a simple game session
      const testGameData = {
        gameTitle: "Test Memory Game",
        gameType: "MemoryGame",
        category: "Vocabulary",
        memoryGameType: "Individual",
        quarter: "1st Quarter",
        setTime: 300,
        gamePoints: 10,
        teacherId: teacherId,
        vocabularyQuestions: [
          {
            tagalogWord: "Bahay",
            choices: ["House", "Car", "Tree", "Dog"],
            correctAnswer: 0,
            hint: "A place where people live"
          }
        ],
        classRoomIds: [],
        leaderboard: true,
        hints: true,
        review: false,
        shuffle: false,
        windowTracking: false,
        status: "Draft"
      };

      const createResponse = await axiosInstance.post('/gamesessions/post', testGameData);
      console.log("✅ Test game created:", createResponse.data);
      
      // Test 2: Retrieve the game session
      const gameId = createResponse.data.id;
      const retrieveResponse = await axiosInstance.get(`/gamesessions/get/${gameId}`);
      console.log("✅ Test game retrieved:", retrieveResponse.data);
      
      // Test 3: Check vocabulary questions
      const questions = retrieveResponse.data.vocabularyQuestions;
      console.log("✅ Vocabulary questions:", questions);
      
      alert(`Test successful! Game created with ID: ${gameId}\nQuestions: ${questions.length}`);
      
      // Clean up - delete the test game
      await axiosInstance.delete(`/gamesessions/delete/${gameId}`);
      console.log("🧹 Test game deleted");
      
    } catch (error) {
      console.error("❌ Test failed:", error);
      alert("Test failed: " + (error.response?.data?.message || error.message));
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
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search games..."
          className="px-4 py-2 rounded-lg border-none outline-none text-[#213547] font-medium w-64 bg-white"
        />
        <button
          onClick={togglePanel}
          className="bg-[#06D7A0] text-white text-[20px] font-bold font-['Fredoka'] px-6 py-2 rounded-lg shadow-md mr-2"
        >
          Create Game
        </button>
        <button
          onClick={testApiConnection}
          className="bg-[#FF6B6B] text-white text-[16px] font-bold font-['Fredoka'] px-4 py-2 rounded-lg shadow-md"
        >
          Test API
        </button>
        <button
          onClick={testGameSession}
          className="bg-[#9B59B6] text-white text-[16px] font-bold font-['Fredoka'] px-4 py-2 rounded-lg shadow-md"
        >
          Test Game
        </button>
      </div>
    </div>

    {/* WRAPPER for Sidebar + Main Content */}
    <div className="flex h-[calc(100vh-100px)]">
      {/* Sidebar */}
    <TeacherSidebarIcon/>

       
        {/* Main Game List */}
           <div className="flex-1 pl-[120px] pr-6 pt-6">
  {/* Horizontal Row with Images and Center Title */}
  <div className="flex items-center justify-center gap-8 mt-10 mb-12 flex-wrap">
    {/* Left Side Images */}
    <img src={GuessTheWordImage} alt="Guess the Word" className="w-[100px] h-auto drop-shadow-md hover:scale-105 transition" />
    <img src={ParkeQuestImage} alt="Parke Quest" className="w-[100px] h-auto drop-shadow-md hover:scale-105 transition" />

    {/* Center Title */}
    <h1 className="text-[#073A4D] text-[40px] font-bold font-['Fredoka'] mx-4 whitespace-nowrap">
      Game Bank
    </h1>

    {/* Right Side Images */}
    <img src={PaaralanQuestImage} alt="Paaralan Quest" className="w-[100px] h-auto drop-shadow-md hover:scale-105 transition" />
    <img src={MemoryGameImage} alt="Memory Game" className="w-[100px] h-auto drop-shadow-md hover:scale-105 transition" />
  </div>
          <div className="mt-10 flex justify-center">
            <div className="border-4 border-[#108AB1] rounded-[50px] w-[90%] p-6 bg-white">
              <div className="border-4 border-[#108AB1] rounded-[50px] bg-white overflow-hidden">
                <div className="grid grid-cols-7 text-[#073A4D] font-semibold text-lg h-[60px] items-center">
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Game Title</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Category</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Game Type</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Status</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Class</div>
                  <div className="border-r border-[#108AB1] text-center flex items-center justify-center h-full">Last Modified</div>
                  <div className="text-center flex items-center justify-center h-full">Actions</div>
                  </div>
          {savedGames.map((game) => (
  <div key={game.id} className="relative">
    {/* Row */}
    <div className="grid grid-cols-7 border-t border-[#108AB1] text-[#073A4D] h-[70px] items-center hover:bg-[#E0F2F7] relative z-0">
      {/* Game Title */}
      <div className="border-r border-[#108AB1] text-center">{game.gameTitle}</div>

      {/* Category */}
      <div className="border-r border-[#108AB1] text-center">{game.category}</div>

      {/* Game Type */}
      <div className="border-r border-[#108AB1] text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          game.gameType === 'MemoryGame' ? 'bg-blue-100 text-blue-800' :
          game.gameType === 'GuessTheWord' ? 'bg-green-100 text-green-800' :
          game.gameType === 'PaaralanQuest' ? 'bg-purple-100 text-purple-800' :
          game.gameType === 'ParkeQuest' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {game.gameType || 'Not Set'}
        </span>
      </div>

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

      {/* Classrooms Button */}
      <div className="border-r border-[#108AB1] text-center">
        {game.classrooms?.length === 1 ? (
          <span>{game.classrooms[0].name}</span>
        ) : game.classrooms?.length > 1 ? (
          <button
            onClick={() =>
              setDropdownOpenId(dropdownOpenId === `class-${game.id}` ? null : `class-${game.id}`)
            }
            className="border border-gray-300 px-2 py-1 rounded bg-white text-sm w-[120px] truncate"
          >
            {game.classrooms.length} Classes
          </button>
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

{/* Actions Column */}
<div className="border-r border-[#108AB1] text-center">
  <select
    onChange={(e) => {
      const action = e.target.value;
      if (action === "edit") handleEditGame(game);
      else if (action === "delete") handleDeleteGame(game.id);
      else if (action === "publish") handlePublishGame(game.id);
      e.target.selectedIndex = 0; // Reset back to "Actions"
    }}
    className="bg-white border border-[#108AB1] text-[#073A4D] rounded px-2 py-1 text-sm cursor-pointer w-[110px] font-medium"
  >
    <option value="">Actions</option>
    <option value="edit" className="text-yellow-600">✏️ Edit</option>
    <option value="delete" className="text-red-600">🗑️ Delete</option>
    <option value="publish" className="text-green-600">🚀 Publish</option>
  </select>
</div>


    </div>

    {/* ✅ Classrooms Dropdown (OUTSIDE grid row) */}
    {dropdownOpenId === `class-${game.id}` && (
      <div className="absolute left-1/2 translate-x-[-50%] mt-1 z-50 bg-white border rounded shadow-md w-[180px] max-h-[150px] overflow-y-auto">
        {game.classrooms.map((c) => (
          <div
            key={c.id}
            className="text-sm py-1 px-2 hover:bg-gray-100 rounded"
          >
            {c.name}
          </div>
        ))}
      </div>
    )}
  </div>
))}

    </div>
    </div>
    </div>
    </div>
        {/* Create/Edit Panel */}
  {isPanelOpen && (
    <>
      {selectedCategory && (selectedCategory !== 'MemoryGame' || selectedGameType) && (
        <>
          {selectedCategory === 'MemoryGame' && (
        <MemoryGamePanel
          editingGameId={editingGameId}
          gameTitle={gameTitle}
          setGameTitle={setGameTitle}
          selectedCategory={selectedCategory}
          selectedGameType={selectedGameType} // Pass memory game subtype
          actualCategory={getCategoryFromGameType(selectedCategory)} // Pass the actual category
          vocabularyQuestions={vocabularyQuestions}
          setVocabularyQuestions={setVocabularyQuestions}
          handleInputChange={handleInputChange}
          handleChoiceChange={handleChoiceChange}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleAutoFillChoices={handleAutoFillChoices}
          handleAddQuestion={handleAddQuestion}
          classes={classes}
          classSelections={classSelections}
          setClassSelections={setClassSelections}
          gameSettings={gameSettings}
          handleCheckboxChange={handleCheckboxChange}
          setTime={setTime}
          handleSetTimeChange={handleSetTimeChange}
          quarter={quarter}
          setQuarter={setQuarter}
          gamePoints={gamePoints}
          handleGamePointsChange={handleGamePointsChange}
          handleSaveGame={handleSaveGame}
          resetForm={resetForm}
          setIsPanelOpen={setIsPanelOpen}
        />
      )}
      
      {selectedCategory === 'GuessTheWord' && (
        <GuessTheWordPanel
          editingGameId={editingGameId}
          gameTitle={gameTitle}
          setGameTitle={setGameTitle}
          selectedCategory={selectedCategory}
          vocabularyQuestions={vocabularyQuestions}
          setVocabularyQuestions={setVocabularyQuestions}
          handleInputChange={handleInputChange}
          handleChoiceChange={handleChoiceChange}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleAddQuestion={handleAddQuestion}
          classes={classes}
          classSelections={classSelections}
          setClassSelections={setClassSelections}
          gameSettings={gameSettings}
          handleCheckboxChange={handleCheckboxChange}
          setTime={setTime}
          handleSetTimeChange={handleSetTimeChange}
          quarter={quarter}
          setQuarter={setQuarter}
          gamePoints={gamePoints}
          handleGamePointsChange={handleGamePointsChange}
          handleSaveGame={handleSaveGame}
          resetForm={resetForm}
          setIsPanelOpen={setIsPanelOpen}
        />
      )}
      
      {selectedCategory === 'PaaralanQuest' && (
        <PaaralanQuestPanel
          editingGameId={editingGameId}
          gameTitle={gameTitle}
          setGameTitle={setGameTitle}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          vocabularyQuestions={vocabularyQuestions}
          setVocabularyQuestions={setVocabularyQuestions}
          handleInputChange={handleInputChange}
          handleChoiceChange={handleChoiceChange}
          handleCorrectAnswerChange={handleCorrectAnswerChange}
          handleAddQuestion={handleAddQuestion}
          classes={classes}
          classSelections={classSelections}
          setClassSelections={setClassSelections}
          gameSettings={gameSettings}
          handleCheckboxChange={handleCheckboxChange}
          setTime={setTime}
          handleSetTimeChange={handleSetTimeChange}
          quarter={quarter}
          setQuarter={setQuarter}
          gamePoints={gamePoints}
          handleGamePointsChange={handleGamePointsChange}
          handleSaveGame={handleSaveGame}
          resetForm={resetForm}
          setIsPanelOpen={setIsPanelOpen}
        />
      )}
      
      {selectedCategory === 'ParkeQuest' && (
        <ParkeQuestPanel
          editingGameId={editingGameId}
          gameTitle={gameTitle}
          setGameTitle={setGameTitle}
          selectedCategory={selectedCategory}
          classes={classes}
          classSelections={classSelections}
          setClassSelections={setClassSelections}
          gameSettings={gameSettings}
          handleCheckboxChange={handleCheckboxChange}
          setTime={setTime}
          handleSetTimeChange={handleSetTimeChange}
          quarter={quarter}
          setQuarter={setQuarter}
          gamePoints={gamePoints}
          handleGamePointsChange={handleGamePointsChange}
          handleSaveGame={handleSaveGame}
          resetForm={resetForm}
          setIsPanelOpen={setIsPanelOpen}
        />
      )}
        </>
      )}
      
      {(!selectedCategory || (selectedCategory === 'MemoryGame' && !selectedGameType)) && (
        <div className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-lg p-6 overflow-y-auto z-50">
          <h2 className="text-[#108AB1] text-3xl font-bold mb-4">
            {editingGameId ? 'Edit Game' : 'Create Game'}
          </h2>
          
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Game Type</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select game type</option>
              <option value="MemoryGame">Memory Game - Match words with their meanings</option>
              <option value="GuessTheWord">Guess the Word - Spell out Tagalog words</option>
              <option value="PaaralanQuest">Paaralan Quest - School-based adventure</option>
              <option value="ParkeQuest">Parke Quest - Park-based adventure</option>
            </select>
          </div>

          {selectedCategory === 'MemoryGame' && (
            <div className="mb-6">
              <label className="block mb-1 font-semibold">Memory Game Mode</label>
              <select
                value={selectedGameType}
                onChange={handleGameTypeChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select mode</option>
                <option value="Individual">Individual - Each student plays alone</option>
                <option value="Group">Group - Students collaborate in teams</option>
              </select>
            </div>
          )}

          {selectedCategory && (
            <div className="mb-6">
              <label className="block mb-1 font-semibold">Subject Category</label>
              <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700">
                {getCategoryFromGameType(selectedCategory)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Category is automatically assigned based on game type
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">📚 Game Types Available:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Memory Game</strong> (Vocabulary): Students match Tagalog words with their meanings</li>
              <li>&nbsp;&nbsp;&nbsp;- <em>Individual:</em> Each student plays independently</li>
              <li>&nbsp;&nbsp;&nbsp;- <em>Group:</em> Students collaborate in teams</li>
              <li>• <strong>Guess the Word</strong> (Vocabulary): Students spell out words based on hints</li>
              <li>• <strong>Paaralan Quest</strong> (Reading Comprehension): School-based adventure learning</li>
              <li>• <strong>Parke Quest</strong> (Grammar): Park-based exploration and learning</li>
            </ul>
            <p className="text-sm text-blue-600 mt-2">
              Please select a game type to continue. Categories are automatically assigned based on game type.
            </p>
          </div>
          
          <button
            onClick={() => {
              resetForm();
              setIsPanelOpen(false);
            }}
            className="bg-gray-400 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  )}

  </div>
</div>
);
};

export default GameBank;