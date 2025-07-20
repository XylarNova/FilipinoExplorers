import React, { useState, useEffect, useEffect } from 'react';
import axios from 'axios';
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

// Replace this with all your 45+ entries


const PaaralanQuest = () => {
  const [student_Id, setstudent_Id] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [storyData, setStoryData] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choice_Id, setChoice_Id] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [end_Time, setEnd_Time] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [answerResults, setAnswerResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const timeoutTriggeredRef = React.useRef(false);


  const current = storyData.length > 0 ? storyData[currentIndex] : null;

  useEffect(() => {
  axios.get("http://localhost:8080/api/story-questions")
    .then(res => {
      const raw = res.data;

      const formatted = raw.map(item => ({
        story: item.story,
        question: item.question,
        choices: item.choices,
        correctAnswer: item.correctAnswer,
        hint: item.hint,
      }));

      const shuffled = formatted.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 15);
      setStoryData(selected);
    })
    .catch(err => {
      console.error("❌ Failed to load Paaralan Quest data:", err);
    });
}, []);


  useEffect(() => {
    if (storyData.length > 0) {
      setAnsweredQuestions(Array(storyData.length).fill(false));
      setAnswerResults(Array(storyData.length).fill(null));
    }
  }, [storyData]);

  useEffect(() => {
    if (answeredQuestions.length && answeredQuestions.every(q => q)) {
      setEnd_Time(true);
    }
  }, [answeredQuestions]);

  useEffect(() => {
    if (end_Time) {
      axios.post("http://localhost:8080/api/paaralan-quest/score/submit", {
        student_Id,
        totalScore: score
      })
      .then(() => console.log("✅ Score and name submitted successfully."))
      .catch(err => console.error("❌ Failed to submit score:", err));
    }
  }, [end_Time]);

  useEffect(() => {
  if (!timerActive || end_Time || answeredQuestions[currentIndex]) return;

  timeoutTriggeredRef.current = false; // Reset lock for new question

  const interval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setFeedback("You ran out of time");

        const updatedAnswers = [...answeredQuestions];
        updatedAnswers[currentIndex] = true;
        setAnsweredQuestions(updatedAnswers);

        const updatedResults = [...answerResults];
        updatedResults[currentIndex] = "wrong";
        setAnswerResults(updatedResults);

        if (!timeoutTriggeredRef.current) {
          timeoutTriggeredRef.current = true;

          setTimeout(() => {
            if (currentIndex < storyData.length - 1) {
              handleNext();
            } else {
              setEnd_Time(true);
            }
          }, 0); // Can be immediate or slight delay if you prefer
        }

        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [timerActive, currentIndex, answeredQuestions, end_Time, answerResults, storyData.length]);


  const handleNext = () => {
    if (currentIndex < storyData.length - 1) {
      setCurrentIndex(ci => ci + 1);
      setChoice_Id(null);
      setFeedback("");
      setUsedHint(false);
      setShowHint(false);
      setTimeLeft(10);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(ci => ci - 1);
      setChoice_Id(null);
      setFeedback("");
      setUsedHint(false);
      setShowHint(false);
      setTimeLeft(10);
    }
  };

  const handleCheckAnswer = () => {
    if (choice_Id === null) {
      setFeedback("Please select an answer.");
      return;
    }
    if (!answeredQuestions[currentIndex]) {
      const isCorrect = choice_Id === current.correctAnswer;
      setScore(s => s + (isCorrect ? (usedHint ? 1 : 2) : 0));
      setFeedback(isCorrect ? "CORRECT ANSWER" : "WRONG ANSWER");
      const updatedAnswers = [...answeredQuestions];
      updatedAnswers[currentIndex] = true;
      setAnsweredQuestions(updatedAnswers);
      const updatedResults = [...answerResults];
      updatedResults[currentIndex] = isCorrect ? "correct" : "wrong";
      setAnswerResults(updatedResults);
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

  if (!student_Id) {
    return (
      <div style={{ backgroundImage: `url(${Background})`
, backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.2)', textAlign: 'center' }}>
          <h2>Welcome to Paaralan Quest!</h2>
          <p>Please enter your name to begin:</p>
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Your name"
            style={{ padding: '10px', width: '80%', marginTop: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <br />
          <button
            onClick={() => {
              if (nameInput.trim()) {
                setstudent_Id(nameInput.trim());
              } else {
                alert("Name is required to start the game.");
              }
            }}
            style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
   
    <div style={{ backgroundImage: `url(${Background})`
, backgroundSize: 'cover', minHeight: '100vh', paddingTop: '100px', position: 'relative' }}>
      <img src={Logo} alt="Logo" style={{ position: 'absolute', top: '20px', left: '30px', width: '160px' }} />

    
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', marginRight: '-25px', marginTop: '100px' }}>
          <img
            src={StickImage}
           
            alt="Timer"
            style={{ marginTop: '100px', height: '150px', transform: 'rotate(90deg)', zIndex: 0 }}
          />
       
            <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50px',
            height: '320px',
            overflow: 'hidden',
            borderRadius: '50px',
            zIndex: 1
          }}>
            <div style={{
              position: 'absolute',
             
              bottom: 0,
              width: '50px',
              
              height: `${(timeLeft / 10) * 320}px`,

              backgroundColor: 'lightgreen',
              borderRadius: '50px',
             
              transition: 'height 1s linear'
            }} />
          </div>
        </div>

      
        <div style={{ display: 'flex', border: '4px solid #8B4513', backgroundColor: '#f5e5c0', borderRadius: '12px', padding: '20px', height: '600px', minWidth: '600px' }}>
          {end_Time ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <h1>🎉 SESSION FINISHED 🎉</h1>
              <p>Your final score: <strong>{score} points</strong></p>
            </div>
          
          ) : (
            current && <>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <h2>Kuwento #{currentIndex + 1}</h2>
                <div style={{ backgroundColor: '#fff8e1', padding: '15px', borderRadius: '8px', height: '100%', overflowY: 'auto' }}>
                  {current.story}
                </div>
              </div>

         
              <div style={{ width: '8px', backgroundColor: '#8B4513' }} />

        
              <div style={{ flex: 1, paddingLeft: '20px' }}>
                <h2>{current.question}</h2>
                {showHint && (
                  <div style={popoverStyle}>
                    <span style={iconStyle}>📘</span>
                    {current.hint}
                  </div>
                )}
                {current.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChoice_Id(idx)}
                    style={{
                      backgroundColor: choice_Id === idx ? '#d1e7dd' : '#fff',
                      marginBottom: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #ccc',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '600px', width: '220px' }}>
          <div style={{
            padding: '20px',
            borderRadius: '10px',
            border: '4px solid #8B4513',
            backgroundColor: '#f5e5c0',
            textAlign: 'center',
            fontWeight: 'bold',
            color: feedback === "CORRECT ANSWER" ? 'green' : feedback === "WRONG ANSWER" ? 'red' : '#333'
          }}>
            Score: {score} <br />
            {feedback}
          </div>

       
          <div style={{ backgroundColor: '#8B4513', padding: '20px', borderRadius: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {storyData.map((_, i) => {
              let bgColor = '#f5e5c0';
              if (i === currentIndex) bgColor = '#FFD700';
              else if (answerResults[i] === 'correct') bgColor = 'lightgreen';
              else if (answerResults[i] === 'wrong') bgColor = '#ff9999';
              return (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: bgColor,
                    color: '#000',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

       
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <button
              onClick={handleHint}
              disabled={usedHint}
              style={{
               
                padding: '10px 20px',
                borderRadius: '30px',
              
                backgroundColor: usedHint ? '#aaa' : '#007BFF',
                color: '#fff',
                
                fontWeight: 'bold',
                
                cursor: usedHint ? 'not-allowed' : 'pointer'
              }}
            >
              HINT
            </button>

            <button
              onClick={handleCheckAnswer}
              style={{
                
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: '#FFD700',
                border: '2px solid #D4AC0D',
                color: '#fff',
                
                fontWeight: 'bold'
              }}
            >
              
              CHECK ANSWER
            </button>
          </div>
        </div>
      </div>

    
      {!end_Time && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px' }}>
          <img src={LeftArrow} alt="Previous" onClick={handlePrev} style={{ width: '60px', height: '60px', cursor: currentIndex > 0 ? 'pointer' : 'not-allowed', opacity: currentIndex > 0 ? 1 : 0.5 }} />
          <img src={RightArrow} alt="Next" onClick={handleNext} style={{ width: '60px', height: '60px', cursor: currentIndex < storyData.length - 1 ? 'pointer' : 'not-allowed', opacity: currentIndex < storyData.length - 1 ? 1 : 0.5 }} />
        </div>
      )}
    </div>
  );
};
export default PaaralanQuest;