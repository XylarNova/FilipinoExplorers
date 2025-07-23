"use client"

import { useEffect, useState } from "react"
import axios from "axios"

// Since we can't import the actual images, I'll use placeholder URLs
// You can replace these with your actual image imports
import Logo from "../assets/images/Logo.png"
import Background from "../assets/images/Parke Game/Parke Quest BG.png"

const ParkeQuestTeacher = () => {
  const [story, setStory] = useState("")
  const [question, setQuestion] = useState("")
  const [fullSentence, setFullSentence] = useState("")
  const [fragments, setFragments] = useState(["", "", ""])
  const [hint, setHint] = useState("")
  const [message, setMessage] = useState("")
  const [questionNumber, setQuestionNumber] = useState(1)
  const [allQuestions, setAllQuestions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [globalTimer, setGlobalTimer] = useState(5)
  const [scores, setScores] = useState([])
  const [editingScore, setEditingScore] = useState(null)
  const [editedName, setEditedName] = useState("")
  const [editedScore, setEditedScore] = useState(0)

  const fetchScores = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/parkequest/scores")
      setScores(res.data)
    } catch (error) {
      console.error("❌ Failed to fetch scores:", error)
    }
  }

  const handleDeleteScore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this score?")) return
    try {
      await axios.delete(`http://localhost:8080/api/parkequest/scores/${id}`)
      fetchScores()
    } catch (err) {
      console.error("Delete score failed", err)
    }
  }

  const handleEditScore = (score) => {
    setEditingScore(score.id)
    setEditedName(score.studentName)
    setEditedScore(score.score)
  }

  const handleUpdateScore = async () => {
    try {
      await axios.put(`http://localhost:8080/api/parkequest/scores/${editingScore}`, {
        studentName: editedName,
        score: editedScore,
      })
      setEditingScore(null)
      fetchScores()
    } catch (err) {
      console.error("Update score failed", err)
    }
  }

  useEffect(() => {
    fetchAllQuestions()
    fetchGlobalTimer()
    fetchScores()
  }, [])

  const fetchAllQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/parkequest")
      setAllQuestions(res.data)
      setQuestionNumber(res.data.length + 1)
    } catch (error) {
      console.error("Error fetching questions:", error)
    }
  }

  const fetchGlobalTimer = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/parkequest/timer")
      setGlobalTimer(Math.ceil(res.data / 60))
    } catch (error) {
      console.error("Failed to fetch global timer:", error)
    }
  }

  const handleSplitSentence = () => {
    const words = fullSentence.trim().split(" ")
    const splitCount = Math.ceil(words.length / 3)
    const part1 = words.slice(0, splitCount).join(" ")
    const part2 = words.slice(splitCount, splitCount * 2).join(" ")
    const part3 = words.slice(splitCount * 2).join(" ")
    const shuffled = [part1, part2, part3].sort(() => Math.random() - 0.5)
    setFragments(shuffled)
  }

  const handleFragmentChange = (index, value) => {
    const updated = [...fragments]
    updated[index] = value
    setFragments(updated)
  }

  const handleEdit = (q) => {
    setEditingId(q.id)
    setStory(q.story)
    setQuestion(q.question)
    setFullSentence(q.correctAnswer)
    setHint(q.hint)
    setFragments(q.choices.map((c) => c.choice))
    setMessage("✏️ Editing Question #" + q.id)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await axios.delete(`http://localhost:8080/api/parkequest/${id}`) // Remove headers
        setMessage("🗑️ Question deleted.")
        fetchAllQuestions()
      } catch (error) {
        console.error("Delete error:", error)
        setMessage("❌ Failed to delete question.")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (allQuestions.length >= 10 && !editingId) {
      setMessage("❌ Maximum of 10 questions only. Delete a question to add more.")
      return
    }
    if (!story || !question || !fullSentence || fragments.includes("") || !hint) {
      setMessage("❌ Please fill out all fields, including a valid timer.")
      return
    }

    const dto = {
      story,
      question,
      correctAnswer: fullSentence,
      choices: fragments,
      hint,
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/parkequest/${editingId}`, dto)
        setMessage(`✅ Question #${editingId} updated!`)
        setEditingId(null)
      } else {
        await axios.post("http://localhost:8080/api/parkequest", dto)
        setMessage("✅ Question #" + questionNumber + " submitted!")
        setQuestionNumber((prev) => prev + 1)
      }
      setStory("")
      setQuestion("")
      setFullSentence("")
      setFragments(["", "", ""])
      setHint("")
      fetchAllQuestions()
    } catch (error) {
      console.error("Submit error:", error)
      setMessage("❌ Failed to submit. Try again.")
    }
  }

  const handleUpdateGlobalTimer = async () => {
    if (globalTimer < 1 || globalTimer > 60) {
      setMessage("⏰ Please set a timer between 1 and 60 minutes.")
      return
    }
    try {
      await axios.post(`http://localhost:8080/api/parkequest/timer?seconds=${globalTimer * 60}`)
      setMessage(`✅ Global timer set to ${globalTimer} minute(s)!`)
    } catch (error) {
      console.error("Failed to update global timer:", error)
      setMessage("❌ Failed to update global timer.")
    }
  }

  // Format date and time properly
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return { dateStr, timeStr }
  }

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap");
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: "Fredoka", cursive;
          margin: 0;
          padding: 0;
        }
        
        .wood-panel {
          background: #4e2c1c;
          border-radius: 30px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          border: 3px solid #8B4A32;
        }
        
        .wood-input {
          background: #fde68a;
          border: 2px solid #8B4A32;
          border-radius: 12px;
          padding: 12px 16px;
          font-family: "Fredoka", cursive;
          font-size: 16px;
          color: #4e2c1c;
          font-weight: 500;
        }
        
        .wood-input:focus {
          outline: none;
          border-color: #ffca28;
          box-shadow: 0 0 0 3px rgba(255, 202, 40, 0.3);
        }
        
        .wood-button {
          background: #ffca28;
          border: 2px solid #8B4A32;
          border-radius: 12px;
          padding: 12px 24px;
          font-family: "Fredoka", cursive;
          font-weight: bold;
          color: #4e2c1c;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .wood-button:hover {
          background: #ffd54f;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        .wood-button:active {
          transform: translateY(0);
        }
        
        .wood-button-blue {
          background: #1982fc;
          color: white;
        }
        
        .wood-button-blue:hover {
          background: #1976d2;
        }
        
        .wood-button-red {
          background: #f44336;
          color: white;
        }
        
        .wood-button-red:hover {
          background: #d32f2f;
        }
        
        .wood-button-green {
          background: #4caf50;
          color: white;
        }
        
        .wood-button-green:hover {
          background: #388e3c;
        }
        
        .stats-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #ffca28;
          border: 3px solid #8B4A32;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #4e2c1c;
          font-size: 18px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <div
        className="flex flex-col min-h-screen bg-cover bg-center font-['Fredoka'] relative"
        style={{ backgroundImage: `url(${Background})` }}
      >
        {/* Logo at top left */}
        <div className="absolute top-6 left-8 z-10">
          <img src={Logo || "/placeholder.svg"} alt="Logo" className="w-40" />
        </div>

        {/* Title Banner */}
        <div className="w-full flex justify-center mb-6 mt-6">
          <div className="inline-block bg-amber-100 border-4 border-amber-800 px-8 py-4 rounded-xl shadow-md text-center">
            <h1 className="text-3xl font-bold text-amber-900">🌟 Parke Quest Teacher Portal 🌟</h1>
            <p className="text-lg text-amber-800">Gumawa ng mga Tanong para sa mga Batang Eksplorador!</p>
          </div>
        </div>

        <div className="flex flex-1 justify-center items-start gap-8 px-6 pb-12">
          {/* Left Panel - Stats */}
          <div className="flex flex-col gap-6 mt-4">
            {/* Stats Panel */}
            <div className="wood-panel p-6 text-white text-center min-w-[220px]">
              <h3 className="text-xl font-bold mb-4 text-[#fde68a]">📊 Statistics</h3>
              <div className="flex flex-col gap-4">
                <div className="stats-circle mx-auto">
                  <span>{allQuestions.length}</span>
                </div>
                <p className="text-[#fde68a] font-semibold">Total Questions</p>

                <div className="stats-circle mx-auto">
                  <span>{scores.length}</span>
                </div>
                <p className="text-[#fde68a] font-semibold">Student Scores</p>
              </div>
            </div>
          </div>

          {/* Main Content Panel */}
          <div className="flex flex-col items-center gap-6 w-[750px]">
            {/* Timer Settings */}
            <div className="wood-panel p-6 text-white w-full">
              <h3 className="text-xl font-bold mb-4 text-[#fde68a] text-center">⏰ Game Timer</h3>
              <div className="flex items-center justify-center gap-4">
                <label className="text-[#fde68a] font-semibold">Minutes:</label>
                <input
                  type="number"
                  className="wood-input w-20 text-center"
                  min={1}
                  max={60}
                  value={globalTimer}
                  onChange={(e) => setGlobalTimer(Number.parseInt(e.target.value))}
                />
                <button onClick={handleUpdateGlobalTimer} className="wood-button">
                  ⏰ Set Timer
                </button>
              </div>
            </div>

            {/* Question Form */}
            <div className="wood-panel p-6 text-white w-full">
              <h2 className="text-2xl font-bold mb-6 text-center text-[#fde68a]">
                {editingId ? `✏️ Edit Question #${editingId}` : `➕ Create Question #${questionNumber}`}
              </h2>

              {editingId && (
                <div className="text-right mb-4">
                  <button
                    type="button"
                    className="wood-button-blue"
                    onClick={() => {
                      setEditingId(null)
                      setStory("")
                      setQuestion("")
                      setFullSentence("")
                      setFragments(["", "", ""])
                      setHint("")
                      setMessage("🆕 Ready to create a new question.")
                    }}
                  >
                    ➕ Create New Question
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Story */}
                <div className="flex flex-col gap-2">
                  <label className="block text-[#fde68a] font-semibold mb-2">
                    📚 Adventure Story
                  </label>
                  <textarea
                    className="wood-input w-full"
                    rows={3}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Tell an exciting story about our Filipino explorer..."
                  />
                </div>

                {/* Question */}
                <div className="flex flex-col gap-2">
                  <label className="block text-[#fde68a] font-semibold mb-2">
                    ❓ Question
                  </label>
                  <input
                    className="wood-input w-full"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What question will challenge our young explorers?"
                  />
                </div>

                {/* Full Sentence */}
                <div className="flex flex-col gap-2">
                  <label className="block text-[#fde68a] font-semibold mb-2">
                    ✅ Correct Answer
                  </label>
                  <input
                    className="wood-input w-full mb-3"
                    value={fullSentence}
                    onChange={(e) => setFullSentence(e.target.value)}
                    placeholder="Write the complete correct answer..."
                  />
                  <button type="button" onClick={handleSplitSentence} className="wood-button">
                    ✨ Split into Fragments
                  </button>
                </div>

                {/* Fragments */}
                <div className="flex flex-col gap-2">
                  <label className="block text-[#fde68a] font-semibold mb-3">
                    🧩 Answer Fragments
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {fragments.map((frag, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-[#fde68a] font-semibold min-w-[100px]">Fragment {index + 1}:</span>
                        <input
                          className="wood-input flex-1"
                          value={frag}
                          onChange={(e) => handleFragmentChange(index, e.target.value)}
                          placeholder={`Fragment ${index + 1}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hint */}
                <div className="flex flex-col gap-2">
                  <label className="block text-[#fde68a] font-semibold mb-2">
                    💡 Hint
                  </label>
                  <input
                    className="wood-input w-full"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="Shows the first fragment"
                  />
                </div>

                <button type="submit" className="wood-button w-full text-lg py-4">
                  {editingId ? "💾 Update Question" : "➕ Create Question"}
                </button>

                {message && (
                  <div className="text-center p-4 bg-[#fde68a] rounded-lg">
                    <p className="font-bold text-[#4e2c1c]">{message}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Panel - Questions & Scores */}
          <div className="flex flex-col gap-6 w-[450px] mt-4">
            {/* Questions List */}
            <div className="wood-panel p-6 text-white max-h-[400px] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-[#fde68a] text-center">📚 Question Library</h3>
              {allQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎯</div>
                  <p className="text-[#fde68a]">No questions yet!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allQuestions.map((q, i) => (
                    <div key={q.id} className="bg-[#8B4A32] p-4 rounded-lg border-2 border-[#fde68a]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-[#ffca28] text-[#4e2c1c] px-2 py-1 rounded font-bold text-sm">
                         Q#{i + 1}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(q)} className="wood-button-blue px-3 py-1 text-sm">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(q.id)} className="wood-button-red px-3 py-1 text-sm">
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-[#fde68a] font-semibold mb-1">{q.question}</p>
                      <p className="text-xs text-gray-300 italic mb-2">{q.story}</p>
                      <p className="text-xs text-green-300">✅ {q.correctAnswer}</p>
                      <p className="text-xs text-blue-300">💡 {q.hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scores Panel */}
            <div className="wood-panel p-6 text-white max-h-[350px] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-[#fde68a] text-center">🏆 Student Scores</h3>
              {scores.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏅</div>
                  <p className="text-[#fde68a]">No scores yet!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scores.map((s, i) => {
                    const { dateStr, timeStr } = formatDateTime(s.timestamp)
                    return (
                      <div key={i} className="bg-[#8B4A32] p-4 rounded-lg border border-[#fde68a]">
                        {editingScore === s.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[#fde68a] text-xs font-semibold mb-1">Student Name:</label>
                              <input
                                className="wood-input w-full text-sm"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Enter student name..."
                              />
                            </div>
                            <div>
                              <label className="block text-[#fde68a] text-xs font-semibold mb-1">Score:</label>
                              <input
                                type="number"
                                className="wood-input w-20 text-sm"
                                value={editedScore}
                                onChange={(e) => setEditedScore(Number(e.target.value))}
                                min="0"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={handleUpdateScore}
                                className="wood-button-green px-3 py-1 text-xs flex-1"
                              >
                                💾 Save
                              </button>
                              <button
                                onClick={() => setEditingScore(null)}
                                className="wood-button px-3 py-1 text-xs flex-1"
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="text-[#fde68a] font-bold text-sm mb-1">
                                  👤 {s.studentName || "Anonymous Explorer"}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-[#4caf50] text-white px-2 py-1 rounded text-xs font-bold">
                                    ⭐ {s.score} pts
                                  </span>
                                </div>
                                <div className="text-xs text-gray-300">
                                  <p className="mb-1">📅 {dateStr}</p>
                                  <p>🕐 {timeStr}</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 ml-2">
                                <button
                                  onClick={() => handleEditScore(s)}
                                  className="wood-button-blue px-2 py-1 text-xs"
                                  title="Edit Score"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteScore(s.id)}
                                  className="wood-button-red px-2 py-1 text-xs"
                                  title="Delete Score"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParkeQuestTeacher
