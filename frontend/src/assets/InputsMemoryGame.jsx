import { useState } from 'react';

export default function InputsMemoryGame() {
  const [tagalogWord, setTagalogWord] = useState('');
  const [choices, setChoices] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [timerInSeconds, setTimerInSeconds] = useState(60);
  const [message, setMessage] = useState('');

  const handleChoiceChange = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tagalogWord || choices.some(c => !c) || !correctAnswer || !timerInSeconds) {
      setMessage('❌ Please fill in all fields.');
      return;
    }

    const questionData = {
      tagalogWord,
      choices,
      correctAnswer,
      timerInSeconds: parseInt(timerInSeconds),
    };

    try {
      const response = await fetch('http://localhost:8080/api/questions/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData)
      });

      if (response.ok) {
        setMessage('✅ Question saved successfully!');
        // Reset form
        setTagalogWord('');
        setChoices(['', '', '', '']);
        setCorrectAnswer('');
        setTimerInSeconds(60);
      } else {
        const error = await response.text();
        setMessage(`❌ Failed: ${error}`);
      }
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-center">Create Memory Game Question</h2>

      {message && (
        <div className="text-center text-sm p-2 bg-yellow-100 border border-yellow-400 rounded">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Tagalog Word</label>
        <input
          type="text"
          value={tagalogWord}
          onChange={(e) => setTagalogWord(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
          placeholder="e.g. Araw"
        />
      </div>

      {choices.map((choice, index) => (
        <div key={index}>
          <label className="block text-sm font-medium">Choice {String.fromCharCode(65 + index)}</label>
          <input
            type="text"
            value={choice}
            onChange={(e) => handleChoiceChange(index, e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            placeholder={`Enter choice ${String.fromCharCode(65 + index)}`}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium">Correct Answer</label>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select correct answer</option>
          {choices.map((choice, index) => (
            <option key={index} value={choice}>
              {choice || `Choice ${String.fromCharCode(65 + index)}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Timer (seconds)</label>
        <input
          type="number"
          value={timerInSeconds}
          onChange={(e) => setTimerInSeconds(e.target.value)}
          min="5"
          className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Save Question
      </button>
    </form>
  );
}
