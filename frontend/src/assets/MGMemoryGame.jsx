import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Background from './images/Memory Game/Memory Game BG.png';
import Logo from './images/Logo.png';
import Instruction from './images/Memory Game/Instruction.png';
import ChoicesBG from './images/Memory Game/ChoicesBG.png';
import Buko from './images/Memory Game/Buko.png';
import Choices from './images/Memory Game/Choices.png';
import Answer from './images/Memory Game/Answer.png';
import Log from './images/Memory Game/Log.png';
import Timer from './images/Memory Game/Timer.png';
import ButtonPrev from './images/Memory Game/ButtonPrev.png';
import ButtonNext from './images/Memory Game/ButtonNext.png';
import ButtonCheckAnswer from './images/Memory Game/CheckAnswer.png';
import PointsBG from './images/Memory Game/PointsBG.png';
import Points from './images/Memory Game/Points.png';
import ItemsBG from './images/Memory Game/ItemsBG.png';
import Items from './images/Memory Game/Items.png';
import HintButton from './images/Memory Game/HintButton.png';
import SubmitButton from './images/Memory Game/SubmitButton.png';

function MemoryGame() {
  const { sessionId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);
  const [gameElapsed, setGameElapsed] = useState(0); // Total game time elapsed
  const [gameDuration, setGameDuration] = useState(300); // Total game duration in seconds
  const [gameSession, setGameSession] = useState(null); // Store game session data
  const [debugMode, setDebugMode] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  // Debug: Log the sessionId
  console.log("🔍 Memory Game loaded with sessionId:", sessionId);

  const fetchQuestions = async () => {
    try {
      console.log("🔍 Fetching questions for sessionId:", sessionId);
      
      let res;
      if (sessionId) {
        // Get game session data which includes vocabulary questions
        const sessionRes = await axiosInstance.get(`/gamesessions/get/${sessionId}`);
        console.log("🔍 Game session data:", sessionRes.data);
        
        // Store the complete game session data
        setGameSession(sessionRes.data);
        
        // Set the total game duration from the session (setTime is in seconds)
        const totalGameTime = sessionRes.data.setTime || 300; // Default to 5 minutes
        setGameDuration(totalGameTime);
        console.log("🔍 Game duration set to:", totalGameTime, "seconds");
        
        // Extract vocabulary questions from the game session
        const questions = sessionRes.data.vocabularyQuestions || [];
        console.log("🔍 Questions extracted:", questions);
        
        res = { data: questions };
      } else {
        // Fallback to the old endpoint if no sessionId
        res = await axiosInstance.get('/questions/get');
      }
      
      console.log("🔍 Final questions data:", res.data);
      setQuestions(res.data);
      setQuestionResults(new Array(res.data.length).fill(null));
    } catch (err) {
      console.error('❌ Error fetching questions:', err);
      console.error('❌ Error response:', err.response?.data);
      
      // Show user-friendly error message
      if (err.response?.status === 404) {
        alert('Game session not found. Please check if the game exists and try again.');
      } else if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in.');
      } else {
        alert('Failed to load game questions. Please try again later.');
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [sessionId]);

  // Game timer effect - runs for the entire game duration
  useEffect(() => {
    if (questions.length === 0 || gameEnded) return;

    let gameInterval;
    
    if (gameStarted) {
      gameInterval = setInterval(() => {
        setGameElapsed((prev) => {
          const newElapsed = prev + 1;
          
          // Check if game time is up
          if (newElapsed >= gameDuration) {
            setGameEnded(true);
            clearInterval(gameInterval);
            
            // Auto-submit the game when time is up
            setTimeout(() => {
              handleGameEnd();
            }, 1000);
            
            return gameDuration;
          }
          
          return newElapsed;
        });
      }, 1000);
    }

    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, [gameStarted, questions.length, gameDuration, gameEnded]);

  // Start the game when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !gameStarted && !gameEnded) {
      setGameStarted(true);
      console.log("🎮 Game started! Duration:", gameDuration, "seconds");
    }
  }, [questions.length, gameStarted, gameEnded, gameDuration]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${Background})` }}>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-4">Loading questions...</div>
          <div className="text-lg text-white">Please wait while we load the game.</div>
        </div>
      </div>
    );
  }

  if (!questions[currentQuestionIndex]) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${Background})` }}>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">No questions available</div>
          <div className="text-lg text-white">This game session doesn't have any questions yet.</div>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentQuestionIndex];
  
  // Ensure choices is an array and not empty
  if (!current.choices || !Array.isArray(current.choices) || current.choices.length === 0) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${Background})` }}>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Invalid question format</div>
          <div className="text-lg text-white">This question doesn't have proper choices.</div>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const choicesData = current.choices.map((text, index) => {
    const positions = [
      { labelTop: 'top-[310px]', labelLeft: 'left-[580px]', bukoTop: 'top-[220px]', bukoLeft: 'left-[580px]' },
      { labelTop: 'top-[310px]', labelLeft: 'left-[860px]', bukoTop: 'top-[220px]', bukoLeft: 'left-[860px]' },
      { labelTop: 'top-[310px]', labelLeft: 'left-[1140px]', bukoTop: 'top-[220px]', bukoLeft: 'left-[1140px]' },
      { labelTop: 'top-[540px]', labelLeft: 'left-[700px]', bukoTop: 'top-[450px]', bukoLeft: 'left-[700px]' },
      { labelTop: 'top-[540px]', labelLeft: 'left-[1000px]', bukoTop: 'top-[450px]', bukoLeft: 'left-[1000px]' },
    ];
    return {
      id: `choice${index + 1}`,
      text,
      ...positions[index],
    };
  });

  // Calculate timer display values
  const remainingTime = Math.max(0, gameDuration - gameElapsed);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const waterHeight = (gameElapsed / gameDuration) * 100;

  const imagePath = current.imageName ? `/assets/tagalog-words/${current.imageName}` : null;

  const handleChoiceClick = (choice) => {
    if (questionResults[currentQuestionIndex] !== null || gameEnded) return;
    setSelectedChoice(choice);
  };

  const handleCheckAnswerClick = () => {
    if (!selectedChoice) {
      alert('Please select a choice.');
      return;
    }

    if (questionResults[currentQuestionIndex] !== null) return;

    // Handle both string and index-based correct answers
    let isCorrect;
    if (typeof current.correctAnswer === 'number') {
      // If correctAnswer is an index, compare with the choice index
      const choiceIndex = parseInt(selectedChoice.id.replace('choice', '')) - 1;
      isCorrect = choiceIndex === current.correctAnswer;
    } else if (typeof current.correctAnswer === 'string') {
      // If correctAnswer is a string, compare with the choice text
      isCorrect = selectedChoice.text === current.correctAnswer;
    } else {
      // Fallback: try to find the correct answer text in choices
      const correctText = current.choices[current.correctAnswer];
      isCorrect = selectedChoice.text === correctText;
    }

    console.log('🔍 Answer check:', {
      selected: selectedChoice,
      correctAnswer: current.correctAnswer,
      choices: current.choices,
      isCorrect
    });

    // Calculate points per item
    const pointsPerItem = gameSession?.gamePoints || 10;
    
    // Update results and score
    const updatedResults = [...questionResults];
    updatedResults[currentQuestionIndex] = isCorrect ? 'correct' : 'wrong';
    setQuestionResults(updatedResults);
    
    if (isCorrect) {
      setTotalScore(prev => prev + pointsPerItem);
      alert(`Correct! +${pointsPerItem} points`);
    } else {
      alert('Wrong answer');
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedChoice(null); // Reset selection for next question
      } else {
        // All questions completed
        handleGameEnd();
      }
    }, 1000);
  };

  const handleHintClick = () => {
    if (gameEnded) return;
    alert(`Hint: ${current.hint || 'No hint available.'}`);
  };

  const handleSubmitClick = () => {
    if (gameEnded) return;
    if (window.confirm('Are you sure you want to submit the game?')) {
      handleGameEnd();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1 && !gameEnded) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedChoice(null);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0 && !gameEnded) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedChoice(null);
    }
  };

  const handleGameEnd = () => {
    setGameEnded(true);
    setGameStarted(false);
    
    const correctAnswers = questionResults.filter(result => result === 'correct').length;
    const totalQuestions = questions.length;
    const pointsPerItem = gameSession?.gamePoints || 10;
    const finalScore = correctAnswers * pointsPerItem;
    
    alert(`Game Over!\nTime: ${Math.floor(gameElapsed / 60)}:${(gameElapsed % 60).toString().padStart(2, '0')}\nCorrect Answers: ${correctAnswers}/${totalQuestions}\nTotal Score: ${finalScore} points`);
    
    // TODO: Save game results to backend
    console.log('🎮 Game ended:', {
      sessionId,
      timeElapsed: gameElapsed,
      totalTime: gameDuration,
      correctAnswers,
      totalQuestions,
      finalScore,
      results: questionResults
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${Background})` }}>
      {/* Debug Panel */}
      {debugMode && (
        <div className="fixed top-0 left-0 bg-black bg-opacity-80 text-white p-4 z-50 max-w-md">
          <h3 className="font-bold mb-2">Debug Info</h3>
          <div className="text-sm">
            <p>Session ID: {sessionId}</p>
            <p>Total Questions: {questions.length}</p>
            <p>Current Question: {currentQuestionIndex + 1}</p>
            <p>Game Started: {gameStarted ? 'Yes' : 'No'}</p>
            <p>Game Ended: {gameEnded ? 'Yes' : 'No'}</p>
            <p>Total Time: {gameDuration}s</p>
            <p>Elapsed: {gameElapsed}s</p>
            <p>Remaining: {remainingTime}s</p>
            <p>Points Per Item: {gameSession?.gamePoints || 10}</p>
            <p>Total Score: {totalScore}</p>
            <p>Current Question Data: {JSON.stringify(current, null, 2)}</p>
            <p>Selected Choice: {selectedChoice ? selectedChoice.text : 'None'}</p>
          </div>
          <button 
            onClick={() => setDebugMode(false)}
            className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
          >
            Close Debug
          </button>
        </div>
      )}

      {/* Game Status Display */}
      <div className="fixed top-4 left-4 bg-white bg-opacity-90 text-black p-3 rounded-lg shadow-lg z-40">
        <div className="text-sm font-bold">
          <p>Time: {minutes}:{seconds.toString().padStart(2, '0')}</p>
          <p>Question: {currentQuestionIndex + 1}/{questions.length}</p>
          <p>Score: {totalScore}</p>
          {gameEnded && <p className="text-red-600">GAME OVER</p>}
        </div>
      </div>

      {/* Debug Toggle Button */}
      <button
        onClick={() => setDebugMode(!debugMode)}
        className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-sm z-40"
      >
        Debug
      </button>

      {/* Logo */}
      <div className="absolute left-[250px] top-[70px]">
        <img src={Logo} alt="Logo" className="w-50 h-auto" draggable={false} />
      </div>

      {/* Instruction Banner */}
      <div className="absolute left-[550px] top-[60px] w-[840px] h-[100px] relative">
        <img src={Instruction} alt="Instruction" className="w-full h-full" draggable={false} />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[25px] font-inter font-bold text-center text-[#71361F] w-[735px]">
            Piliin ang tamang salin ng Tagalog na salita sa Ingles
          </p>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex justify-center items-center h-full">
        <img src={ChoicesBG} alt="Choices Background" className="absolute left-[550px] top-[200px] w-[840px] h-[650px]" draggable={false} />
        
        {/* Choices */}
        {choicesData.map((choice) => (
          <div key={choice.id}>
            <img src={Buko} alt={choice.text} className={`absolute ${choice.bukoTop} ${choice.bukoLeft} w-[200px] h-[200px] ${gameEnded ? 'opacity-50' : ''}`} draggable={false} />
            <div
              className={`absolute ${choice.labelTop} ${choice.labelLeft} w-[215px] h-[70px] ${gameEnded ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleChoiceClick(choice)}
            >
              <img
                src={Choices}
                alt={`Choice ${choice.id}`}
                className={`w-full h-full ${selectedChoice?.id === choice.id ? 'opacity-60' : ''} ${gameEnded ? 'opacity-50' : ''}`}
                draggable={false}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className={`font-inter font-bold text-black text-[30px] ${gameEnded ? 'opacity-50' : ''}`}>{choice.text}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Word / Answer Area */}
        <div className="absolute left-[825px] top-[710px] w-[305px] h-[80px] z-10">
          <img src={Answer} alt="Answer" className="w-full h-full pointer-events-none" draggable={false} />
          <div className="absolute inset-0 flex items-center justify-center">
            {imagePath ? (
              <img src={imagePath} alt={current.tagalogWord} className="h-[60px] object-contain" />
            ) : (
              <p className="text-xl font-bold text-[#71361F]">{current.tagalogWord}</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div>
          <button 
            onClick={handlePrev} 
            disabled={gameEnded}
            className={`absolute left-[600px] top-[860px] w-[200px] h-[80px] ${gameEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img src={ButtonPrev} alt="Previous" className="w-full h-full" draggable={false} />
          </button>
          <button 
            onClick={handleCheckAnswerClick} 
            disabled={gameEnded}
            className={`absolute left-[850px] top-[860px] w-[250px] h-[80px] ${gameEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img src={ButtonCheckAnswer} alt="Check Answer" className="w-full h-full" draggable={false} />
          </button>
          <button 
            onClick={handleNext} 
            disabled={gameEnded}
            className={`absolute left-[1120px] top-[860px] w-[200px] h-[80px] ${gameEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img src={ButtonNext} alt="Next" className="w-full h-full" draggable={false} />
          </button>
        </div>

        {/* Timer */}
        <div>
          <img src={Log} alt="Log" className="absolute left-[280px] top-[220px] w-[150px] h-[600px]" draggable={false} />
          <div className="absolute left-[329px] top-[310px] w-[50px] h-[460px] overflow-hidden rounded-[40px]">
            <img src={Timer} alt="Timer" className="absolute inset-0 w-full h-full z-0" draggable={false} />
            <div
              className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-linear z-10 ${
                remainingTime < 60 ? 'bg-red-400' : remainingTime < 120 ? 'bg-yellow-400' : 'bg-blue-400'
              }`}
              style={{ 
                height: `${Math.max(0, 100 - waterHeight)}%`, 
                opacity: 0.7, 
                borderRadius: '40px' 
              }}
            />
            {/* Timer Text */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-white font-bold text-xs text-center bg-black bg-opacity-50 px-1 py-0.5 rounded">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Points and Items */}
        <div className="absolute left-[1500px] top-[200px] w-[300px] h-[110px]">
          <img src={PointsBG} alt="Points Background" className="w-full h-full" draggable={false} />
          <img src={Points} alt="Points" className="absolute top-[30px] left-1/2 transform -translate-x-1/2 w-[200px] h-[50px]" draggable={false} />
        </div>

        <div>
          <img src={ItemsBG} alt="Items Background" className="absolute left-[1500px] top-[350px] w-[300px] h-[300px]" draggable={false} />
          {questionResults.map((status, index) => {
            const coords = [
              { left: 1520, top: 370 },
              { left: 1581, top: 370 },
              { left: 1646, top: 370 },
              { left: 1710, top: 370 },
              { left: 1520, top: 430 },
              { left: 1581, top: 430 },
              { left: 1646, top: 430 },
              { left: 1710, top: 430 },
              { left: 1520, top: 490 },
              { left: 1581, top: 490 },
            ][index];

            let color = 'text-black';
            if (status === 'correct') color = 'text-green-600';
            if (status === 'wrong') color = 'text-red-600';

            return (
              <div
                key={index}
                className="absolute w-[40px] h-[40px] flex items-center justify-center"
                style={{ left: `${coords.left}px`, top: `${coords.top}px` }}
              >
                <img src={Items} alt={`Item ${index + 1}`} className="w-full h-full" draggable={false} />
                <span className={`absolute font-inter font-bold text-[25px] ${color}`}>{index + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Hint and Submit Buttons */}
        <div>
          <button 
            onClick={handleHintClick} 
            disabled={gameEnded}
            className={`absolute left-[1540px] top-[680px] w-[200px] h-[70px] ${gameEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img src={HintButton} alt="Hint Button" className="w-full h-full" draggable={false} />
          </button>
          <button 
            onClick={handleSubmitClick} 
            disabled={gameEnded}
            className={`absolute left-[1540px] top-[740px] w-[200px] h-[70px] ${gameEnded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img src={SubmitButton} alt="Submit Button" className="w-full h-full" draggable={false} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoryGame;
