import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InputsMemoryGame() {
  const [tagalogWord, setTagalogWord] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [choices, setChoices] = useState(['', '', '', '', '']);
  const [hint, setHint] = useState('');
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/questions/get');
      setQuestionList(res.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const fetchAllSessions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/session/all');
      setAllSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchAllSessions();
  }, []);

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);

    if (!newChoices.includes(correctAnswer)) {
      setCorrectAnswer('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/questions/post', {
        tagalogWord,
        correctAnswer,
        choices,
        hint,
        timerInSeconds: 10,
      });
      alert('✅ Question submitted successfully!');
      setTagalogWord('');
      setCorrectAnswer('');
      setChoices(['', '', '', '', '']);
      setHint('');
      fetchQuestions();
    } catch (error) {
      console.error(error);
      alert('❌ Error submitting question.');
    }
  };

  const handleSelectQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const createGameSession = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/session/create', selectedQuestions);
      alert(`✅ Game session created! ID: ${res.data.id}`);
      setSelectedQuestions([]);
      fetchAllSessions();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to create session');
    }
  };

  const selectedQuestionData = questionList.filter((q) =>
    selectedQuestions.includes(q.id)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md mt-10 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add a New Question</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Tagalog Word</label>
          <input
            type="text"
            value={tagalogWord}
            onChange={(e) => setTagalogWord(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Choices</label>
          {choices.map((choice, index) => (
            <input
              key={`choice-${index}`}
              type="text"
              placeholder={`Choice ${index + 1}`}
              value={choice}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mb-2"
            />
          ))}
        </div>

        <div>
          <label className="block font-semibold mb-1">Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="" disabled>
              -- Select correct answer --
            </option>
            {choices
              .filter((choice) => choice.trim() !== '')
              .map((choice, index) => (
                <option key={index} value={choice}>
                  {choice}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Hint</label>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Submit Question
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Submitted Questions</h3>
        {questionList.length === 0 ? (
          <p className="text-gray-500">No questions added yet.</p>
        ) : (
          <table className="w-full table-auto border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Use</th>
                <th className="border px-4 py-2">Tagalog</th>
                <th className="border px-4 py-2">Correct Answer</th>
                <th className="border px-4 py-2">Choices</th>
                <th className="border px-4 py-2">Hint</th>
              </tr>
            </thead>
            <tbody>
              {questionList.map((q, index) => (
                <tr key={q.id || index} className={selectedQuestions.includes(q.id) ? 'bg-green-100' : ''}>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(q.id)}
                      onChange={() => handleSelectQuestion(q.id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{q.tagalogWord}</td>
                  <td className="border px-4 py-2">{q.correctAnswer}</td>
                  <td className="border px-4 py-2">{q.choices.join(', ')}</td>
                  <td className="border px-4 py-2">{q.hint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Selected Questions for Game</h3>
        <ul className="list-disc pl-5">
          {selectedQuestionData.map((q) => (
            <li key={q.id}>{q.tagalogWord} - {q.correctAnswer}</li>
          ))}
        </ul>

        <button
          onClick={createGameSession}
          disabled={selectedQuestions.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-4"
        >
          Save Selected Questions as Game Session
        </button>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4 text-center">All Saved Game Sessions</h3>
        {allSessions.length === 0 ? (
          <p className="text-gray-500 text-center">No sessions saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition duration-200"
              >
                <h4 className="font-bold text-lg mb-2 text-blue-700">Session ID: {session.id}</h4>
                <div className="space-y-3">
                  {session.questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 bg-gray-50 rounded border border-gray-100"
                    >
                      <p className="text-sm font-medium text-gray-800">{q.tagalogWord}</p>
                      <p className="text-sm text-gray-600">Answer: {q.correctAnswer}</p>
                      <p className="text-sm text-gray-600">Choices: {q.choices.join(', ')}</p>
                      <p className="text-sm text-gray-600">Hint: {q.hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
