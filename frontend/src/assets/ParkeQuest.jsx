"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import Logo from "../assets/images/Logo.png";
import Background from "../assets/images/Parke Game/Parke Quest BG.png";
import WoodPanel from "../assets/images/Parke Game/wood-panel2.png";
import ButtonNext from "../assets/images/Buttons and Other/button next.png";
import ButtonPrev from "../assets/images/Buttons and Other/button prev.png";
import TimerLog from "../assets/images/Parke Game/Timer Log.png";





const ParkeQuest = () => {
  const hasInitializedRef = useRef(false);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(() =>
    parseInt(localStorage.getItem("pq_index")) || 0
  );
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("pq_playerName") || "");
  const [orderedChoices, setOrderedChoices] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [score, setScore] = useState(() =>
    parseInt(localStorage.getItem("pq_score")) || 0
  );
  const [answeredIndices, setAnsweredIndices] = useState(() => {
    const saved = localStorage.getItem("pq_answered");
    return saved ? JSON.parse(saved) : [];
  });

  const submitGame = async () => {
  try {
    await axios.post("http://localhost:8080/api/parkequest/submit-score", {
      score: score,
      studentName: playerName || "Anonymous"
    });

    setFinalScore(score); // ✅ Show score first

    setTimeout(() => {
      setScore(0);
      setAnsweredIndices([]);
      setResultMessage("");
      localStorage.removeItem("pq_score");
      localStorage.removeItem("pq_answered");
      localStorage.removeItem("pq_index");
      navigate("/#games");
    }, 3000);
  } catch (err) {
    console.error("❌ Failed to submit game manually:", err);
  }
};


  const intervalRef = useRef(null);
  const [totalSeconds, setTotalSeconds] = useState(null); // ⏱️ fetched from backend
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
  axios.get("http://localhost:8080/api/parkequest/timer").then((res) => {
    const seconds = res.data;
    setTotalSeconds(seconds);
    setSecondsLeft(seconds);
  });
}, []);


  useEffect(() => {
  if (
    !hasInitializedRef.current &&
    currentIndex === 0 &&
    secondsLeft !== null &&
    !localStorage.getItem("pq_score")
  ) {
    setScore(0);
    setAnsweredIndices([]);
    localStorage.removeItem("pq_score");
    localStorage.removeItem("pq_answered");
    localStorage.removeItem("pq_index");
    hasInitializedRef.current = true;
  }
}, [secondsLeft, currentIndex]);


      useEffect(() => {
        if (totalSeconds === null) return;

        intervalRef.current = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(intervalRef.current);
      }, [totalSeconds]); // ✅ Only runs once when timer is fetched

      // 🔁 Auto-redirect 4 seconds after time is up
        useEffect(() => {
  if (secondsLeft === 0) {
    (async () => {
      try {
        await axios.post("http://localhost:8080/api/parkequest/submit-score", {
          score: score,
          studentName: playerName || "Anonymous"
        });
      } catch (err) {
        console.error("Failed to save score at timeout:", err);
      }

      setFinalScore(score);
      localStorage.removeItem("pq_score");
      localStorage.removeItem("pq_answered");
      localStorage.removeItem("pq_index");
      setScore(0);
      setAnsweredIndices([]);
      setResultMessage("");

      setTimeout(() => {
        navigate("/#games");
      }, 4000);
    })();
  }
}, [secondsLeft, navigate]);

  // ⏬ Fetch questions once
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/parkequest")
      .then((res) => {
        const filtered = res.data.filter(
          (q) =>
            q.story &&
            q.question &&
            Array.isArray(q.choices) &&
            q.choices.length > 0
        );
        setQuestions(filtered);
      })
      .catch((err) => console.error("Failed to fetch questions:", err));
  }, []);

  useEffect(() => {
  if (questions.length > 0 && questions[currentIndex]) {
    const choices = questions[currentIndex].choices.map((c) => c.choice);
    setOrderedChoices(choices);
    setSelectedOrder(choices);
    setResultMessage("");
    setShowHint(false);
    setUsedHint(false);
  }
}, [questions, currentIndex]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updated = Array.from(orderedChoices);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setOrderedChoices(updated);
    setSelectedOrder(updated);
  };


      const checkAnswer = async () => {
      if (secondsLeft === 0) return;

      const current = questions[currentIndex];
      const studentAnswer = selectedOrder.join(" ");

      try {
        const res = await axios.post("http://localhost:8080/api/parkequest/check", {
          questionId: current.id,
          selectedAnswer: studentAnswer,
          usedHint,
        });

        setResultMessage(res.data.message);

        const alreadyAnswered = answeredIndices.includes(currentIndex);

        if (!alreadyAnswered && res.data.score > 0) {
          const newScore = score + res.data.score;
          const newAnswered = [...answeredIndices, currentIndex];
          setScore(newScore);
          setAnsweredIndices(newAnswered);
          localStorage.setItem("pq_score", newScore.toString());
          localStorage.setItem("pq_answered", JSON.stringify(newAnswered));
        }

      } catch (err) {
        console.error("Check answer failed:", err);
      }
    };


  const goToNext = async () => {
    if (secondsLeft === 0) return; // ⛔ Prevent navigation if time is up
    if (currentIndex === questions.length - 1) {
      try {
        await axios.post("http://localhost:8080/api/parkequest/submit-score", {
          score: score,
          studentName: playerName || "Anonymous"
        });
        localStorage.removeItem("pq_score");
        localStorage.removeItem("pq_answered");
        localStorage.removeItem("pq_index");
      } catch (err) {
        console.error("Failed to save final score:", err);
      }
    } else {
      const newIndex = Math.min(currentIndex + 1, questions.length - 1);
      setCurrentIndex(newIndex);
      localStorage.setItem("pq_index", newIndex.toString());
    }
  };



  const goToPrevious = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    localStorage.setItem("pq_index", newIndex.toString());
  };

  const progress =
  totalSeconds && secondsLeft !== null
    ? (secondsLeft / totalSeconds) * 100
    : 100;

  const current = questions[currentIndex];

  if (!questions.length) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white text-xl"
        style={{ backgroundImage: `url(${Background})`, backgroundSize: "cover" }}
      >
        Loading Parke Quest...
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center font-['Fredoka'] relative"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="absolute top-4 left-4 z-10">
        <img src={Logo} alt="Logo" className="w-40" />
      </div>

      <div className="w-full text-center mt-6">
        <div className="inline-block bg-amber-100 border-4 border-amber-800 px-8 py-4 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-amber-900">Hulaan ang Salita</h1>
          <p className="text-lg text-amber-800">Buoin ang salita na tinutukoy ng kahulugan</p>
        </div>
      </div>

      <div className="flex flex-1 justify-center items-center gap-10 px-6 py-12">
        {/* Timer Stick */}
        <div className="relative w-[140px] h-[320px] flex items-center justify-center">
          <img
            src={TimerLog}
            alt="Timer Stick"
            className="absolute w-[180px] h-[420px] object-contain z-10"
          />
          <div
            className="absolute bottom-[20px] w-[20px] bg-emerald-400 z-20 transition-all duration-1000 ease-linear rounded-full"
            style={{
              height: `${progress}%`,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          ></div>
        </div>

        {/* Game Panel */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative bg-[#4e2c1c] rounded-[30px] w-[600px] min-h-[500px] flex flex-col items-center justify-start shadow-md px-6 py-4 text-white gap-3">
            <p className="text-sm italic text-center text-[#fde68a]">{current?.story}</p>
            <h2 className="text-lg font-bold text-center">{current?.question}</h2>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fragments">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col items-center gap-3 mt-2">
                    {orderedChoices.map((frag, idx) => (
                      <Draggable key={`frag-${idx}`} draggableId={`frag-${idx}`} index={idx}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="relative"
                          >
                            <img
                              src={WoodPanel}
                              alt={`Fragment ${idx}`}
                              className="h-[120px] w-full max-w-[460px] object-contain"
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg px-4 text-center">
                              {frag}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex items-center justify-between w-full px-8 mt-2">
            <button onClick={goToPrevious} className="w-[185px] h-[85px]">
              <img src={ButtonPrev} alt="Previous" className="w-full h-full object-contain" />
            </button>
            <button
              onClick={checkAnswer}
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full font-bold text-lg shadow-md"
            >
              CHECK ANSWER
            </button>
            <button onClick={goToNext} className="w-[185px] h-[85px]">
              <img src={ButtonNext} alt="Next" className="w-full h-full object-contain" />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-[325px] h-[70px]">
            <div className="absolute -top-[100px] left-1/2 transform -translate-x-1/2 bg-[#4e2c1c] rounded-[24px] w-full h-[80px] flex items-center justify-center shadow-md">
              <div className="bg-[#fde68a] h-[60px] w-[280px] rounded-[20px] px-4 py-2 shadow-inner text-center flex items-center justify-center font-bold text-lg text-[#4e2c1c]">
                {showHint ? current?.hint : ""}
              </div>
            </div>
          </div>

          <div className="relative w-[280px] min-h-[230px] bg-[#8B4A32] rounded-[24px] shadow-lg">
            <div className="absolute top-4 left-3 grid grid-cols-4 gap-x-3 gap-y-3 w-full pr-4">
              {questions.map((_, num) => (
                <div
                  key={num + 1}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentIndex === num ? "bg-orange-500 text-white" : "bg-[#F9D9A6] text-black"
                  }`}
                >
                  {num + 1}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setUsedHint(true);
              setShowHint(true);
            }}
            className="w-[250px] py-3 rounded-full bg-[#1982fc] hover:bg-blue-700 text-white font-bold text-lg shadow-md"
          >
            HINT
          </button>
          <button
            onClick={submitGame}
            className="w-[250px] py-3 rounded-full bg-[#ffca28] hover:bg-yellow-500 text-white font-bold text-lg shadow-md"
          >
            SUBMIT
          </button>


          <div className="text-white text-lg font-bold text-center mt-2">
            Score: <span className="text-green-300">{score}</span> / {questions.length}
          </div>

          {resultMessage && (
            <div className="text-white text-lg font-bold text-center mt-4">
              {resultMessage === "CORRECT ANSWER" ? "✅ Tama!" : "❌ Mali. Subukan muli."}
            </div>
          )}

          {finalScore !== null && secondsLeft !== 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white text-[#4e2c1c] p-8 rounded-xl shadow-lg text-center max-w-md font-bold text-xl">
                ✅ Session submitted!<br />
                Your final score: {finalScore} / {questions.length}
                <div className="text-sm mt-2 text-gray-600">Returning to homepage...</div>
              </div>
            </div>
          )}

        </div>
      </div>
      {/* Timer popup when time is up */}
{secondsLeft === 0 && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white text-[#4e2c1c] p-8 rounded-xl shadow-lg text-center max-w-md font-bold text-xl">
      Your final score: {finalScore ?? score} / {questions.length}
    </div>
  </div>
)}

    </div>
  );
};

export default ParkeQuest;