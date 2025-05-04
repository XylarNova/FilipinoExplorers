import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InputsMemoryGame() {
  const [tagalogWord, setTagalogWord] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [choices, setChoices] = useState(['', '', '', '', '']);
  const [hint, setHint] = useState('');
  const [questionList, setQuestionList] = useState([]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/questions/get');
      setQuestionList(res.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
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
        timerInSeconds: 10, // Default hardcoded timer
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md mt-10 rounded-lg">
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
          <table className="w-full table-auto border border-gray-300 text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">Tagalog</th>
                <th className="border px-4 py-2">Correct Answer</th>
                <th className="border px-4 py-2">Choices</th>
                <th className="border px-4 py-2">Hint</th>
                <th className="border px-4 py-2">Timer (s)</th>
              </tr>
            </thead>
            <tbody>
              {questionList.map((q, index) => (
                <tr key={q.id || index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{q.tagalogWord}</td>
                  <td className="border px-4 py-2">{q.correctAnswer}</td>
                  <td className="border px-4 py-2">{q.choices.join(', ')}</td>
                  <td className="border px-4 py-2">{q.hint}</td>
                  <td className="border px-4 py-2">{q.timerInSeconds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
