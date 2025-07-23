
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Background from '../assets/images/Paaralan Quest/Paaralan Quest BG.png';
import Logo from '../assets/images/Logo.png';

import LeftArrow from '../assets/images/Buttons and Other/button prev.png';
import RightArrow from '../assets/images/Buttons and Other/button next.png';
import { useLocation } from 'react-router-dom';

const players = ['Player 1', 'Player 2', 'Player 3'];





const PaaralanQuestGroup = () => {
const [showTimesUp, setShowTimesUp] = useState(false);

const [showNameInput, setShowNameInput] = useState(true);
const [playerNames, setPlayerNames] = useState(['', '', '']);
const [questions, setQuestions] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [votes, setVotes] = useState(Array(players.length).fill(null));
const [scores, setScores] = useState([0, 0, 0]); // Player 1, 2, 3
const [submitted, setSubmitted] = useState(false);
const [scoredQuestions, setScoredQuestions] = useState([]); // set empty initially
const [timeLeft, setTimeLeft] = useState(10);

const location = useLocation();
const student_Id = location.state?.student_Id || "Player";
const current = questions.length > 0 ? questions[currentIndex] : null;



 

useEffect(() => {
  axios.get('http://localhost:8080/api/story-questions')
    .then(res => {
      if (res.data && res.data.length > 0) {
        setQuestions(res.data);
      } else {
        console.warn("No questions found.");
      }
    })
    .catch(err => {
      console.error("❌ Failed to fetch questions:", err);
    });
}, []);
  
  const handleVote = (playerIndex, choiceIndex) => {
  


    if (submitted) return; // Lock voting after submit
    const updatedVotes = [...votes];
    updatedVotes[playerIndex] = choiceIndex;
    setVotes(updatedVotes);
  };


  const getVoteCounts = () => {
  if (!current || !current.choices) return []; // ✅ prevent crash if not ready
  const counts = Array(current.choices.length).fill(0);
  votes.forEach((vote) => {
    if (vote !== null) counts[vote]++;
  });
  return counts;
};


  const getMostVotedIndex = () => {
    const counts = getVoteCounts();
    const max = Math.max(...counts);
    return counts.indexOf(max);
  };

  const handleSubmit = () => {
  if (submitted || scoredQuestions[currentIndex]) return; // prevent double scoring

  const newScores = [...scores];
  votes.forEach((vote, i) => {
    if (vote === questions[currentIndex].correctAnswer) {
      newScores[i] += 1;
    }
  });

  setScores(newScores);

  // Mark this question as scored
  const updatedScored = [...scoredQuestions];
  updatedScored[currentIndex] = true;
  setScoredQuestions(updatedScored);

  setSubmitted(true); // lock in the votes
};




  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setVotes(Array(players.length).fill(null));
      setSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setVotes(Array(players.length).fill(null));
      setSubmitted(false);
    }
  };

  const voteCounts = getVoteCounts();
  const mostVoted = getMostVotedIndex();

  useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setShowTimesUp(true); // ⏰ show popup
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(interval);
}, [currentIndex]); // Re-run when question changes

  const handleStartGame = () => {
  if (playerNames.every(name => name.trim() !== '')) {
    setShowNameInput(false);
  }
};
// 👇 Add this conditional to prevent crashing during initial load
// ✅ Always show name input first, before anything else
if (showNameInput) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${Background})`,
      backgroundSize: 'cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Fredoka', sans-serif"
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px', color: '#073A4D' }}>Enter Player Names</h2>

        {playerNames.map((name, i) => (
          <div key={i} style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Player {i + 1}:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                const updated = [...playerNames];
                updated[i] = e.target.value;
                setPlayerNames(updated);
              }}
              style={{
                padding: '8px 12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '70%'
              }}
              placeholder={`Enter name for Player ${i + 1}`}
            />
          </div>
        ))}

        <button
          onClick={handleStartGame}
          disabled={playerNames.some(name => name.trim() === '')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#06D7A0',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

// ✅ Now fallback loading screen for questions
if (!current) {
  



  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fdfbee',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Fredoka', sans-serif"
    }}>
      <h2>Loading questions...</h2>
    </div>
  );
}

  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        paddingTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img src={Logo} alt="Logo" style={{ position: 'absolute', top: 20, left: 30, width: 160 }} />

      <div style={{ display: 'flex', gap: 20, width: '90%', alignItems: 'center' }}>
        <div style={{ position: 'relative', marginRight: '-25px', height: '150px', width: '50px' }}>
  <div style={{
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: `${(timeLeft / 10) * 350}px`,
    backgroundColor: 'lightgreen',
    borderRadius: '50px',
    transition: 'height 1s linear'
  }} />
</div>


        <div style={{
          border: '4px solid #8B4513', backgroundColor: '#f5e5c0',
          borderRadius: 12, padding: 20, height: 600, minWidth: 600,
          display: 'flex', flexDirection: 'row'
        }}>
          <div style={{ flex: 1, paddingRight: 20 }}>
            <h2 style={{ color: '#5D4037' }}>Kuwento #{currentIndex + 1}</h2>
            <div style={{ backgroundColor: '#fff8e1', padding: 15, borderRadius: 8, height: '100%', overflowY: 'auto' }}>
              {current.story}
            </div>
          </div>

          <div style={{ width: 8, backgroundColor: '#8B4513' }} />

          <div style={{ flex: 1, paddingLeft: 20 }}>
            <h2>{current.question}</h2>
            <div style={{ marginTop: 10 }}>
              {current.choices.map((choice, i) => (
                <div key={i} style={{
                  border: '2px solid #ccc', borderRadius: 8, marginBottom: 10,
                  backgroundColor: submitted && i === mostVoted ? '#c8e6c9' : '#fff',
                  padding: 10
                }}>
                  <strong>{choice}</strong>
                  <div style={{ fontSize: 12, color: '#333' }}>
                   Welcome, {student_Id}!
                    Votes: {voteCounts[i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 600 }}>
                            <div style={{
  backgroundColor: '#f5e5c0',
  border: '4px solid #8B4513',
  borderRadius: 10,
  padding: 20,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  minWidth: '300px',
  gap: 20
}}>
  <div>
    <h3>📊 Player Scores</h3>
   {playerNames.map((name, i) => (
  <div key={i}>
    {name}: <strong>{scores[i]}</strong>
  </div>
))}

  </div>

  {scoredQuestions[currentIndex] && (
    <div style={{
      marginTop: 30,
      color: '#8B0000',
      fontWeight: 'bold',
      fontSize: 14,
      maxWidth: '140px',
      textAlign: 'right'
    }}>
      ✅ You already answered this question.
    </div>
  )}
</div>




          <div style={{
            backgroundColor: '#8B4513', borderRadius: 10, padding: 20, color: '#fff',
            display: 'flex', flexDirection: 'column', gap: 10
          }}>
            <div style={{
            backgroundColor: '#8B4513',
            borderRadius: 10,
            padding: 20,
            color: '#fff',
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            justifyContent: 'center'
          }}>
            {playerNames.map((name, i) => (
  <div key={i} style={{ textAlign: 'center', flex: 1 }}>
    <div style={{
      marginBottom: 10,
      fontWeight: 'bold',
      fontSize: '16px'
    }}>{name}'s Vote</div>


                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {current.choices.map((choice, j) => (
                    <button
                      key={j}
                      disabled={submitted}
                      onClick={() => handleVote(i, j)}
                      style={{
                        padding: '10px',
                        backgroundColor: votes[i] === j ? '#ffd54f' : '#fff',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        cursor: submitted ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        color: '#000',
                        minWidth: '140px',
                        textAlign: 'center'
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleSubmit} disabled={submitted}
              style={{
                backgroundColor: '#007BFF', color: '#fff', borderRadius: 30,
                padding: '10px 20px', fontWeight: 'bold'
              }}>
              SUBMIT GROUP ANSWER
            </button>
          </div>
        </div>
      </div>
{showTimesUp && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}>
      <h2 style={{ color: '#d32f2f', fontSize: '28px', marginBottom: '20px' }}>⏰ Time's Up!</h2>
      <button
        onClick={() => {
          setShowTimesUp(false);
          handleNext();
          setTimeLeft(10); // reset timer
        }}
        style={{
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '10px',
          cursor: 'pointer'
        }}
      >
        Next Question
      </button>
    </div>
  </div>
)}

      <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 40 }}>
        <img src={LeftArrow} alt="Prev" onClick={handlePrev}
          style={{ width: 60, height: 60, cursor: currentIndex > 0 ? 'pointer' : 'not-allowed', opacity: currentIndex > 0 ? 1 : 0.5 }} />
        <img src={RightArrow} alt="Next" onClick={handleNext}
          style={{ width: 60, height: 60, cursor: currentIndex < questions.length - 1 ? 'pointer' : 'not-allowed', opacity: currentIndex < questions.length - 1 ? 1 : 0.5 }} />
      </div>
    </div>
  );
};

export default PaaralanQuestGroup;