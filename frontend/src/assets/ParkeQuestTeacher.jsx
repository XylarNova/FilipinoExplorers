import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../assets/images/Logo.png";
import Background from "../assets/images/Parke Game/Parke Quest BG.png";

const ParkeQuestTeacher = () => {
  const [story, setStory] = useState("");
  const [question, setQuestion] = useState("");
  const [fullSentence, setFullSentence] = useState("");
  const [fragments, setFragments] = useState(["", "", ""]);
  const [hint, setHint] = useState("");
  const [message, setMessage] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [allQuestions, setAllQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [globalTimer, setGlobalTimer] = useState(5); // 🌍 Global game timer in minutes
  const [scores, setScores] = useState([]);

  const fetchScores = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/parkequest/scores");
    setScores(res.data);
  } catch (error) {
    console.error("❌ Failed to fetch scores:", error);
  }
};


  useEffect(() => {
    fetchAllQuestions();
    fetchGlobalTimer();
    fetchScores();
  }, []);

  const fetchAllQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/parkequest");
      setAllQuestions(res.data);
      setQuestionNumber(res.data.length + 1);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchGlobalTimer = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/parkequest/timer");
    setGlobalTimer(Math.ceil(res.data / 60)); // convert from seconds to minutes
  } catch (error) {
    console.error("Failed to fetch global timer:", error);
  }
};


  const handleSplitSentence = () => {
    const words = fullSentence.trim().split(" ");
    const splitCount = Math.ceil(words.length / 3);
    const part1 = words.slice(0, splitCount).join(" ");
    const part2 = words.slice(splitCount, splitCount * 2).join(" ");
    const part3 = words.slice(splitCount * 2).join(" ");
    const shuffled = [part1, part2, part3].sort(() => Math.random() - 0.5);
    setFragments(shuffled);
  };

  const handleFragmentChange = (index, value) => {
    const updated = [...fragments];
    updated[index] = value;
    setFragments(updated);
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setStory(q.story);
    setQuestion(q.question);
    setFullSentence(q.correctAnswer);
    setHint(q.hint);
    setFragments(q.choices.map(c => c.choice));
    setMessage("✏️ Editing Question #" + q.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await axios.delete(`http://localhost:8080/api/parkequest/${id}`, {
          headers: {
            Authorization: "Bearer dummy-token",
          },
        });
        setMessage("🗑️ Question deleted.");
        fetchAllQuestions();
      } catch (error) {
        console.error("Delete error:", error);
        setMessage("❌ Failed to delete question.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!story || !question || !fullSentence || fragments.includes("") || !hint) {
      setMessage("❌ Please fill out all fields, including a valid timer.");
      return;
    }

    const dto = {
      story,
      question,
      correctAnswer: fullSentence,
      choices: fragments,
      hint,
      };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/parkequest/${editingId}`, dto, {
          headers: {
            Authorization: "Bearer dummy-token",
          },
        });
        setMessage(`✅ Question #${editingId} updated!`);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:8080/api/parkequest", dto, {
          headers: {
            Authorization: "Bearer dummy-token",
          },
        });
        setMessage("✅ Question #" + questionNumber + " submitted!");
        setQuestionNumber((prev) => prev + 1);
      }

      setStory("");
      setQuestion("");
      setFullSentence("");
      setFragments(["", "", ""]);
      setHint("");
      fetchAllQuestions();
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Failed to submit. Try again.");
    }
  };

  const handleUpdateGlobalTimer = async () => {
  if (globalTimer < 1 || globalTimer > 60) {
    setMessage("⏰ Please set a timer between 1 and 60 minutes.");
    return;
  }

  try {
    await axios.post(`http://localhost:8080/api/parkequest/timer?seconds=${globalTimer * 60}`);


    setMessage(`✅ Global timer set to ${globalTimer} minute(s)!`);
  } catch (error) {
    console.error("Failed to update global timer:", error);
    setMessage("❌ Failed to update global timer.");
  }
};


  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center py-10 px-4"
      style={{
        backgroundImage: `url(${Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-2xl bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg font-['Fredoka'] border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="w-40" />
        </div>


        <div className="mb-8">
        <label className="block font-bold mb-2 text-[#073B4C]">🌍 Set Global Game Timer (minutes)</label>
        <div className="flex gap-2">
          <input
            type="number"
            className="w-full p-2 border rounded"
            min={1}
            max={60}
            value={globalTimer}
            onChange={(e) => setGlobalTimer(parseInt(e.target.value))}
          />
          <button
            onClick={handleUpdateGlobalTimer}
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Timer
          </button>
        </div>
      </div>


        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4 text-center text-[#073B4C]">
            {editingId ? `Edit Parke Quest Question #${editingId}` : `Add Parke Quest Question #${questionNumber}`}
          </h2>

          <label className="block font-semibold">Story</label>
          <textarea
            className="w-full p-3 border rounded mb-4"
            rows={3}
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />

          <label className="block font-semibold">Question</label>
          <input
            className="w-full p-2 border rounded mb-4"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <label className="block font-semibold">Correct Full Sentence</label>
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            value={fullSentence}
            onChange={(e) => setFullSentence(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSplitSentence}
            className="mb-4 bg-[#FFD166] text-[#073B4C] px-4 py-2 rounded hover:bg-[#ffc94a]"
          >
            Split into Fragments
          </button>

          {fragments.map((frag, index) => (
            <div key={index} className="mb-2">
              <label className="font-semibold">Fragment {index + 1}</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={frag}
                onChange={(e) => handleFragmentChange(index, e.target.value)}
              />
            </div>
          ))}

          <label className="block font-semibold mt-4">Hint</label>
          <input
            className="w-full p-2 border rounded mb-4"
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
          />



          <button
            type="submit"
            className="w-full bg-[#06D6A0] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#05c594] transition-all"
          >
            {editingId ? "Update Question" : "Submit Question"}
          </button>

          {message && <p className="mt-4 text-center text-sm">{message}</p>}
        </form>

        <div className="mt-10">
          <h3 className="text-lg font-bold mb-2 text-[#073B4C]">Existing Questions</h3>
          {allQuestions.length === 0 && (
            <p className="text-sm italic text-gray-500">No questions yet.</p>
          )}
          {allQuestions.map((q) => (
            <div key={q.id} className="bg-white border rounded p-4 mb-3 shadow-sm">
              <p><strong>Q#{q.id}:</strong> {q.question}</p>
              <p className="text-sm italic">Story: {q.story}</p>
              <p className="text-sm">Answer: <span className="text-green-700">{q.correctAnswer}</span></p>
              <p className="text-sm">Hint: {q.hint}</p>
              <p className="text-sm">Choices: {q.choices.map(c => c.choice).join(", ")}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(q)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(q.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>

            <div className="mt-10">
      <h3 className="text-lg font-bold mb-2 text-[#073B4C]">📊 Student Scores</h3>
      {scores.length === 0 ? (
        <p className="text-sm italic text-gray-500">No scores submitted yet.</p>
      ) : (
        <table className="w-full text-sm border mt-2 bg-white rounded shadow">
          <thead className="bg-[#073B4C] text-white">
            <tr>
              <th className="p-2 text-left">Student Name</th>
              <th className="p-2 text-left">Score</th>
              <th className="p-2 text-left">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{s.studentName || "Anonymous"}</td>
                <td className="p-2">{s.score}</td>
                <td className="p-2">{new Date(s.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

      </div>
    </div>
  );
};

export default ParkeQuestTeacher;