import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Background from '../assets/images/Paaralan Quest/Paaralan Quest BG.png';
import Logo from '../assets/images/Logo.png';
import StickImage from '../assets/images/Buttons and Other/Timer Log.png';
import LeftArrow from '../assets/images/Buttons and Other/button prev.png';
import RightArrow from '../assets/images/Buttons and Other/button next.png';

console.log("✅ PaaralanQuest component is rendering.");

const popoverStyle = {
  animation: 'fadeIn 0.3s ease',
  backgroundColor: '#fff8e1',
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '10px 15px',
  position: 'relative',
  marginTop: '10px',
  color: '#333',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%',
};

const iconStyle = {
  display: 'inline-block',
  marginRight: '8px',
  fontSize: '20px',
};

const PaaralanQuest = () => {
  const { sessionId } = useParams();
  const [gameSession, setGameSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStory, setShowStory] = useState(true);
  const [storyTimer, setStoryTimer] = useState(null);

  // Fetch game session data
  useEffect(() => {
    const fetchGameSession = async () => {
      try {
        const response = await axiosInstance.get(`/gamesessions/${sessionId}`);
        const session = response.data;
        
        setGameSession(session);
        setQuestions(session.vocabularyQuestions || []);
        setAnsweredQuestions(new Array(session.vocabularyQuestions?.length || 0).fill(false));
        
        // Set story visibility based on story mode
        if (session.storyMode === 'multiple') {
          setShowStory(false); // Don't show story screen for multiple stories mode
        } else {
          // Set up story timer based on game settings for single story mode
          if (session.storyContent && session.setTime) {
            const storyDisplayTime = Math.min(session.setTime / 3, 60); // Story shows for 1/3 of total time, max 60 seconds
            setStoryTimer(storyDisplayTime);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game session:', err);
        setError('Failed to load game. Please try again.');
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchGameSession();
    }
  }, [sessionId]);

  // Handle story timer
  useEffect(() => {
    if (showStory && storyTimer > 0) {
      const timer = setTimeout(() => {
        setShowStory(false);
      }, storyTimer * 1000);

      return () => clearTimeout(timer);
    }
  }, [showStory, storyTimer]);

  if (loading) {
    return (
      <div className="bg-cover min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${Background})` }}>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-xl font-bold text-gray-700">Loading Paaralan Quest...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-cover min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${Background})` }}>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-xl font-bold text-red-600 mb-4">Error</div>
          <div className="text-gray-700">{error}</div>
        </div>
      </div>
    );
  }

  if (!gameSession || !questions.length) {
    return (
      <div className="bg-cover min-h-screen flex items-center justify-center" style={{ backgroundImage: `url(${Background})` }}>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-xl font-bold text-gray-700 mb-4">No Game Data</div>
          <div className="text-gray-600">This game session has no questions available.</div>
        </div>
      </div>
    );
  }

  // Show story screen if story exists and showStory is true
  if (showStory && gameSession.storyContent && (!gameSession.storyMode || gameSession.storyMode === 'single')) {
    return (
      <div
        className="bg-cover min-h-screen pt-24 px-8 flex flex-col items-center gap-6"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <img src={Logo} alt="Logo" className="absolute top-5 left-8 w-40" />
        
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-[#f5e5c0] border-8 border-[#71361F] rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-[#71361F]">
              {gameSession.gameTitle}
            </h1>
            
            <div className="bg-[#F4D2A3] p-6 rounded-lg text-lg leading-relaxed text-justify">
              {gameSession.storyContent}
            </div>
            
            <div className="text-center mt-6">
              <button
                onClick={() => setShowStory(false)}
                className="px-8 py-3 bg-yellow-400 border-2 border-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-500 transition"
              >
                START QUESTIONS
              </button>
            </div>
            
            {storyTimer && (
              <div className="text-center mt-4 text-gray-600">
                Questions will start automatically in {storyTimer} seconds
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  // Check if game is complete
  const isGameComplete = answeredQuestions.every(answered => answered);
  
  // If game is complete, show completion screen
  if (isGameComplete) {
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    return (
      <div
        className="bg-cover min-h-screen pt-24 px-8 flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <img src={Logo} alt="Logo" className="absolute top-5 left-8 w-40" />
        
        <div className="bg-[#f5e5c0] border-8 border-[#71361F] rounded-lg p-8 max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-[#71361F] mb-6">
            🎉 Congratulations! 🎉
          </h1>
          
          <div className="text-2xl font-bold text-gray-800 mb-4">
            Game Complete!
          </div>
          
          <div className="text-xl mb-6">
            <div className="mb-2">Final Score: <span className="font-bold text-green-600">{score}</span></div>
            <div className="mb-2">Total Questions: <span className="font-bold">{totalQuestions}</span></div>
            <div className="mb-4">Percentage: <span className="font-bold text-blue-600">{percentage}%</span></div>
          </div>
          
          <div className="text-lg text-gray-700 mb-6">
            {percentage >= 80 
              ? "Excellent work! You've mastered this quest!" 
              : percentage >= 60 
              ? "Good job! Keep practicing to improve!" 
              : "Keep learning and try again!"}
          </div>
          
          <button
            onClick={() => window.location.href = '/student-dashboard'}
            className="px-8 py-3 bg-yellow-400 border-2 border-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-500 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setFeedback("");
      setUsedHint(false);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedChoice(null);
      setFeedback("");
      setUsedHint(false);
      setShowHint(false);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedChoice === null) {
      setFeedback("Please select an answer.");
      return;
    }

    if (!answeredQuestions[currentIndex]) {
      if (selectedChoice === current.correctAnswer) {
        setScore((prev) => prev + (usedHint ? 1 : 2));
        setFeedback("CORRECT ANSWER");
      } else {
        setFeedback("WRONG ANSWER");
      }

      const updatedAnswers = [...answeredQuestions];
      updatedAnswers[currentIndex] = true;
      setAnsweredQuestions(updatedAnswers);
    } else {
      setFeedback("You already answered this question.");
    }
  };

  const handleHint = () => {
    if (!usedHint) {
      setUsedHint(true);
      setShowHint(true);
    }
  };

  return (
    <div
      className="bg-cover min-h-screen pt-24 px-8 flex flex-col items-center gap-6"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* Logo */}
      <img src={Logo} alt="Logo" className="absolute top-5 left-8 w-40" />
  
      {/* Timer Panel */}
      <div className="absolute top-[180px] left-10 mt-45">
        <div className="relative w-40 h-40">
          <img
            src={StickImage}
            alt="Timer"
            className="w-full h-full object-contain rotate-90"
          />
          <div className="absolute top-[24%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-12 h-80 bg-green-200 rounded-full" />
        </div>
      </div>
  
      {/* Main Content Wrapper */}
      <div className="flex justify-center w-full max-w-[900px] mx-auto">
        {/* Question Panel */}
        <div className="bg-[#f5e5c0] border-8 border-[#71361F] rounded-lg p-8 w-full min-h-[500px] flex flex-col">
          <h1 className="text-2xl font-bold text-center mb-6 text-[#71361F]">
            {gameSession.gameTitle}
          </h1>
          
          {/* Story for current question (Multiple Stories Mode) */}
          {gameSession.storyMode === 'multiple' && current.story && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-[#71361F]">Story {currentIndex + 1}:</h3>
              <div className="bg-[#F4D2A3] p-4 rounded-lg text-base leading-relaxed text-justify">
                {current.story}
              </div>
            </div>
          )}
          
          <h2 className="font-bold text-xl mb-4 text-center">{current.question}</h2>

          {showHint && (
            <div className="animate-fadeIn bg-[#fff8e1] border border-gray-300 rounded-lg p-3 mb-4 text-gray-800 shadow-md">
              <span className="inline-block mr-2 text-xl">📘</span>
              {current.hint}
            </div>
          )}

          <div className="flex-1 mb-6">
            {current.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => setSelectedChoice(index)}
                className={`mb-3 p-4 rounded-lg border-2 cursor-pointer w-full text-left transition ${
                  selectedChoice === index 
                    ? "bg-green-100 border-green-500 text-green-800" 
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                {choice}
              </button>
            ))}
          </div>

          {/* Feedback & Score */}
          <div 
            className={`p-4 rounded-lg border-4 text-center font-bold mb-4 ${
              feedback === "CORRECT ANSWER"
                ? "border-green-500 bg-green-50 text-green-700"
                : feedback === "WRONG ANSWER"
                ? "border-red-500 bg-red-50 text-red-700"
                : "border-gray-300 bg-gray-50 text-gray-700"
            }`}
            style={{ minHeight: "80px" }}
          >
            <div className="text-lg">{feedback}</div>
            <div className="text-sm mt-1">Score: {score}</div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <img
              src={LeftArrow}
              alt="Previous"
              onClick={handlePrev}
              className={`w-12 h-12 ${
                currentIndex > 0
                  ? "cursor-pointer opacity-100 hover:opacity-80"
                  : "cursor-not-allowed opacity-50"
              }`}
            />
            
            <div className="flex gap-4 items-center">
              <button
                onClick={handleHint}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  usedHint
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={usedHint}
              >
                {usedHint ? "Hint Used" : "Get Hint"}
              </button>
              
              <button
                onClick={handleCheckAnswer}
                className="px-6 py-2 rounded-lg bg-yellow-400 border-2 border-yellow-600 text-white font-bold hover:bg-yellow-500 transition"
              >
                CHECK ANSWER
              </button>
            </div>
            
            <img
              src={RightArrow}
              alt="Next"
              onClick={handleNext}
              className={`w-12 h-12 ${
                currentIndex < questions.length - 1
                  ? "cursor-pointer opacity-100 hover:opacity-80"
                  : "cursor-not-allowed opacity-50"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Question Progress Indicators */}
      <div className="flex justify-center mt-4">
        <div className="bg-[#8B4513] p-3 rounded-lg flex flex-wrap gap-2 justify-center">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full font-bold flex justify-center items-center text-sm ${
                i === currentIndex ? "bg-yellow-400" : "bg-[#f5e5c0]"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );  
};

export default PaaralanQuest;