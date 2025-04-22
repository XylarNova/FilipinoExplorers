import { useState } from 'react';

function MemoryGameQuestionForm() {
  const [tagalogWord, setTagalogWord] = useState('');
  const [hint, setHint] = useState('');
  const [choices, setChoices] = useState(['', '', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleChangeChoice = (index, value) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);

    // Reset correct answer if it's no longer among the updated choices
    if (!updated.includes(correctAnswer)) {
      setCorrectAnswer('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correctAnswer) {
      alert('Please select the correct answer.');
      return;
    }

    const payload = { tagalogWord, hint, choices, correctAnswer };

    try {
      const response = await fetch('http://localhost:8080/api/memorygame/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save question');
      }

      const data = await response.json();
      console.log('Saved to backend:', data);
      alert('Question saved successfully!');

      // Reset the form
      setTagalogWord('');
      setHint('');
      setChoices(['', '', '', '', '']);
      setCorrectAnswer('');
    } catch (err) {
      console.error(err);
      alert('Error saving the question.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center">Create a Memory Game Question</h2>

      {/* Tagalog Word */}
      <input
        type="text"
        placeholder="Tagalog Word"
        className="w-full border p-2"
        value={tagalogWord}
        onChange={(e) => setTagalogWord(e.target.value)}
        required
      />

      {/* Choices Inputs */}
      {choices.map((choice, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Choice ${index + 1}`}
          className="w-full border p-2"
          value={choice}
          onChange={(e) => handleChangeChoice(index, e.target.value)}
          required
        />
      ))}

      {/* Correct Answer Selector */}
      <select
        className="w-full border p-2"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        required
      >
        <option value="">Select Correct Answer</option>
        {choices.map((choice, index) =>
          choice ? (
            <option key={index} value={choice}>
              {choice}
            </option>
          ) : null
        )}
      </select>

      {/* Hint Input */}
      <input
        type="text"
        placeholder="Hint (optional)"
        className="w-full border p-2"
        value={hint}
        onChange={(e) => setHint(e.target.value)}
      />

      {/* Submit Button */}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Save
      </button>
    </form>
  );
}

export default MemoryGameQuestionForm;
