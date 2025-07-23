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
  const [savedOrders, setSavedOrders] = useState(() => {
    const saved = localStorage.getItem("pq_savedOrders");
    return saved ? JSON.parse(saved) : {};
  });
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
  const alreadyAnsweredCorrectly = answeredIndices.includes(currentIndex);
  const [totalSeconds, setTotalSeconds] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const intervalRef = useRef(null);

  const submitGame = async () => {
    try {
      await axios.post("http://localhost:8080/api/parkequest/submit-score", {
        score: score,
        studentName: playerName || "Anonymous"
      });
      setFinalScore(score);
      setSecondsLeft(0);
      localStorage.removeItem("pq_score");
      localStorage.removeItem("pq_answered");
      localStorage.removeItem("pq_index");
      localStorage.removeItem("pq_startTime");
      localStorage.removeItem("pq_savedOrders");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("pq_hint_")) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.error("❌ Failed to submit game manually:", err);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/parkequest/timer").then((res) => {
      const total = res.data;
      setTotalSeconds(total);
      const savedStartTime = localStorage.getItem("pq_startTime");
      const parsed = parseInt(savedStartTime);
      const now = Date.now();
      if (!savedStartTime || isNaN(parsed) || now - parsed >= total * 1000) {
        localStorage.setItem("pq_startTime", now.toString());
        setSecondsLeft(total);
        setScore(0);
        setAnsweredIndices([]);
        setResultMessage("");
        localStorage.removeItem("pq_score");
        localStorage.removeItem("pq_answered");
        localStorage.removeItem("pq_index");
      } else {
        const elapsed = Math.floor((now - parsed) / 1000);
        const remaining = total - elapsed;
        setSecondsLeft(remaining > 0 ? remaining : 0);
      }
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
  }, [totalSeconds]);

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
        localStorage.removeItem("pq_savedOrders");
        setScore(0);
        setAnsweredIndices([]);
        setResultMessage("");
        setTimeout(() => {
          navigate("/#games");
        }, 2000);
      })();
    }
  }, [secondsLeft, navigate]);

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
      let orderToUse;
      orderToUse = savedOrders[currentIndex] || choices;
      if (!savedOrders[currentIndex]) {
        const updatedOrders = { ...savedOrders, [currentIndex]: choices };
        setSavedOrders(updatedOrders);
        localStorage.setItem("pq_savedOrders", JSON.stringify(updatedOrders));
      }
      setOrderedChoices(orderToUse);
      setSelectedOrder(orderToUse);
      setResultMessage("");
      const hasHint =
        localStorage.getItem(`pq_hint_${currentIndex}`) === "true" &&
        !answeredIndices.includes(currentIndex);
      setUsedHint(hasHint);
      setShowHint(false);
    }
  }, [questions, currentIndex, savedOrders]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updated = Array.from(orderedChoices);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setOrderedChoices(updated);
    setSelectedOrder(updated);
    const newSaved = { ...savedOrders, [currentIndex]: updated };
    setSavedOrders(newSaved);
    localStorage.setItem("pq_savedOrders", JSON.stringify(newSaved));
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
      if (!alreadyAnswered && res.data.message === "CORRECT ANSWER") {
        const newScore = score + 2;
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
    if (secondsLeft === 0) return;
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
      <div className="w-full flex justify-start mt-6 pl-[375px]">
        <div className="w-[600px] bg-amber-100 border-4 border-amber-800 px-8 py-4 rounded-xl shadow-md text-center">
          <h1 className="text-3xl font-bold text-amber-900">Hulaan ang Salita</h1>
          <p className="text-lg text-amber-800">Buoin ang salita na tinutukoy ng kahulugan</p>
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center gap-10 px-6 py-12">
        {/* Timer Stick with static + dynamic liquid */}
        <div className="relative w-[180px] h-[420px] flex items-center justify-center">
          <img src={TimerLog} alt="Timer Stick" className="absolute w-full h-full object-contain z-10" />
          <div className="absolute w-[36px] h-[360px] bottom-[25px] z-20 flex items-end justify-center overflow-hidden rounded-full">
            <div className="w-full h-full" style={{ backgroundColor: "#fff3bf" }} />
          </div>
          <div className="absolute w-[36px] h-[360px] bottom-[25px] z-30 flex items-end justify-center overflow-hidden rounded-full">
            <div
              className="w-full"
              style={{
                height: `${progress}%`,
                backgroundColor: "#1fd0a1",
                borderRadius: "9999px",
                transition: "all 1s ease",
              }}
            />
          </div>
        </div>
        {/* Game Panel */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative bg-[#4e2c1c] rounded-[30px] w-[600px] min-h-[500px] flex flex-col items-center justify-start shadow-md px-6 py-4 text-white gap-3">
            <p className="text-sm italic text-center text-[#fde68a]">{current?.story}</p>
            <h2 className="text-lg font-bold text-center">{current?.question}</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fragments">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col items-center gap-3 mt-2"
                  >
                    {orderedChoices.map((frag, idx) => {
                      let isHinted = false;
                      if (usedHint && current && current.correctAnswer) {
                        const correctSentence = current.correctAnswer.trim();
                        isHinted = correctSentence.startsWith(frag);
                      }
                      return (
                        <Draggable key={`frag-${idx}`} draggableId={`frag-${idx}`} index={idx}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative flex items-center justify-center mb-4 ${isHinted ? "ring-4 ring-white" : ""}`}
                              style={{ minHeight: "120px", width: "100%", maxWidth: "460px" }}
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
                      );
                    })}
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
          <div className="relative w-[325px] h-[180px] flex flex-col justify-start items-center">
            <div className="relative w-[325px] h-[50px]" style={{ position: 'absolute', top: -150, left: 0, right: 0 }}>
              <div className="bg-[#4e2c1c] rounded-[24px] w-full h-[70px] flex items-center justify-center shadow-md">
                <div className="bg-[#fde68a] h-[50px] w-[280px] rounded-[20px] px-4 py-2 shadow-inner text-center flex items-center justify-center font-bold text-lg text-[#4e2c1c]">
                  Score: {score} / {questions.length * 2}
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-[280px] min-h-[230px] bg-[#8B4A32] rounded-[24px] shadow-lg -mt-50"> {/* Add margin-top to push numbers lower */}
            <div className="absolute top-4 left-3 grid grid-cols-4 gap-x-3 gap-y-3 w-full pr-4">
              {questions.map((_, num) => {
                const isAnswered = answeredIndices.includes(num);
                const isCurrent = currentIndex === num;
                let className = "w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ";
                if (isAnswered && isCurrent) {
                  className += "bg-green-300 text-white";
                } else if (isAnswered) {
                  className += "bg-green-300 text-black";
                } else if (isCurrent) {
                  className += "bg-orange-500 text-white";
                } else {
                  className += "bg-[#F9D9A6] text-black";
                }
                return (
                  <div key={num + 1} className={className}>
                    {num + 1}
                  </div>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => {
              if (score >= 1 && !usedHint && !alreadyAnsweredCorrectly) {
                const newScore = score - 1;
                setScore(newScore);
                setUsedHint(true);
                setShowHint(false);
                const correctSentence = current.correctAnswer?.trim() || "";
                const updated = [...orderedChoices];
                const index = updated.findIndex(frag => correctSentence.startsWith(frag));
                if (index > 0) {
                  const [moved] = updated.splice(index, 1);
                  updated.unshift(moved);
                  setOrderedChoices(updated);
                  setSelectedOrder(updated);
                  const newSaved = { ...savedOrders, [currentIndex]: updated };
                  setSavedOrders(newSaved);
                  localStorage.setItem("pq_savedOrders", JSON.stringify(newSaved));
                  localStorage.setItem(`pq_hint_${currentIndex}`, "true");
                }
                localStorage.setItem("pq_score", newScore.toString());
              }
            }}
            disabled={score < 1 || usedHint || alreadyAnsweredCorrectly}
            className={`w-[250px] py-3 rounded-full font-bold text-lg shadow-md ${
              score < 1 || usedHint || alreadyAnsweredCorrectly
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1982fc] hover:bg-blue-700 text-white"
            }`}
          >
            HINT
          </button>
          <button
            onClick={submitGame}
            className="w-[250px] py-3 rounded-full bg-[#ffca28] hover:bg-yellow-500 text-white font-bold text-lg shadow-md"
          >
            SUBMIT
          </button>
          {resultMessage && (
            <div className="text-white text-lg font-bold text-center mt-4">
              {resultMessage === "CORRECT ANSWER" ? "✅ Tama!" : "❌ Mali. Subukan muli."}
            </div>
          )}
          {finalScore !== null && secondsLeft !== 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white text-[#4e2c1c] p-8 rounded-xl shadow-lg text-center max-w-md font-bold text-xl">
                ✅ Session submitted!<br />
                Your final score: {finalScore} / {questions.length * 2}
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
            Your final score: {finalScore ?? score} / {questions.length * 2}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkeQuest;