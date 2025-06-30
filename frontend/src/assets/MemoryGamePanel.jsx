import React from 'react';

const MemoryGamePanel = ({
  editingGameId,
  gameTitle,
  setGameTitle,
  selectedCategory,
  handleCategoryChange,
  vocabularyQuestions,
  handleInputChange,
  handleChoiceChange,
  handleCorrectAnswerChange,
  handleAddQuestion,
  classes,
  classSelections,
  setClassSelections,
  gameSettings,
  handleCheckboxChange,
  setTime,
  handleSetTimeChange,
  quarter,
  setQuarter,
  gamePoints,
  handleGamePointsChange,
  handleSaveGame,
  resetForm,
  setIsPanelOpen,
}) => {
  return (
    <div className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-lg p-6 overflow-y-auto z-50">
      <h2 className="text-[#108AB1] text-3xl font-bold mb-4">
        {editingGameId ? 'Edit Game' : 'Create Game'}
      </h2>

      {/* Game Title */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Game Title</label>
        <input
          type="text"
          placeholder="Enter game title"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select category</option>
          <option value="Vocabulary">Vocabulary</option>
          <option value="Grammar">Grammar</option>
          {/* Add more categories if needed */}
        </select>
      </div>

      {/* Show vocabulary questions only if Vocabulary category is selected */}
      {selectedCategory === 'Vocabulary' && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Vocabulary Questions</label>
          {vocabularyQuestions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 border p-3 rounded">
              {/* Tagalog Word Input */}
              <input
                type="text"
                placeholder="Tagalog Word"
                value={q.tagalogWord}
                onChange={(e) => handleInputChange(qIndex, 'tagalogWord', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              />

              {/* Choices with radio buttons in a 2x2 grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                {[0, 1, 2, 3].map((cIndex) => (
                  <label key={cIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`correctAnswer-${qIndex}`}
                      checked={q.correctAnswer === cIndex}
                      onChange={() => handleCorrectAnswerChange(qIndex, cIndex)}
                      className="cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${cIndex + 1}`}
                      value={q.choices[cIndex]}
                      onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                      className={`border rounded px-2 py-1 w-full ${
                        q.correctAnswer === cIndex ? 'border-green-500' : 'border-gray-300'
                      }`}
                    />
                  </label>
                ))}
              </div>

              {/* Hint input below */}
              <input
                type="text"
                placeholder="Hint"
                value={q.hint}
                onChange={(e) => handleInputChange(qIndex, 'hint', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          ))}
          <button
            onClick={handleAddQuestion}
            className="bg-[#108AB1] text-white px-4 py-2 rounded mt-2"
          >
            Add Question
          </button>
        </div>
      )}

      {/* Classroom Assignment + Game Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Game Settings</h3>

        {/* Classroom Selector */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Assign to Classrooms (optional)</label>
          <div className="border border-gray-300 rounded p-2 max-h-40 overflow-y-auto">
            <label className="flex items-center space-x-2 mb-1">
              <input
                type="checkbox"
                checked={
                  (editingGameId
                    ? (classSelections[editingGameId] || []).length
                    : (classSelections['new'] || []).length) === 0
                }
                onChange={() =>
                  setClassSelections((prev) => ({
                    ...prev,
                    [editingGameId || 'new']: [],
                  }))
                }
              />
              <span>None (Save as Draft)</span>
            </label>

            {classes.map((c) => {
              const selected =
                editingGameId && classSelections[editingGameId]
                  ? classSelections[editingGameId]
                  : classSelections['new'] || [];

              return (
                <label key={c.id} className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...selected, c.id]
                        : selected.filter((id) => id !== c.id);
                      setClassSelections((prev) => ({
                        ...prev,
                        [editingGameId || 'new']: updated,
                      }));
                    }}
                  />
                  <span className="text-sm truncate">{c.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Game Settings Checkboxes */}
        <div className="flex flex-col space-y-2">
          {['leaderboard', 'hints', 'review', 'shuffle', 'windowTracking'].map((setting) => (
            <label key={setting} className="flex items-center space-x-2 capitalize">
              <input
                type="checkbox"
                name={setting}
                checked={gameSettings[setting]}
                onChange={handleCheckboxChange}
              />
              <span>{setting.charAt(0).toUpperCase() + setting.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Set Time */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold">Set Time (minutes)</label>
        <input
          type="number"
          min="0"
          value={setTime}
          onChange={handleSetTimeChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Quarter */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold">Quarter</label>
        <select
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select quarter</option>
          <option value="1st Quarter">1st Quarter</option>
          <option value="2nd Quarter">2nd Quarter</option>
          <option value="3rd Quarter">3rd Quarter</option>
          <option value="4th Quarter">4th Quarter</option>
        </select>
      </div>

      {/* Game Points */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Game Points</label>
        <input
          type="number"
          min="0"
          value={gamePoints}
          onChange={handleGamePointsChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        onClick={handleSaveGame}
        className="bg-[#06D7A0] text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition"
      >
        {editingGameId ? 'Update Game' : 'Save Game'}
      </button>
      <button
        onClick={() => {
          if (window.confirm("Changes will not be saved. Are you sure you want to exit?")) {
            resetForm();
            setIsPanelOpen(false);
          }
        }}
        className="ml-4 bg-gray-400 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition"
      >
        Exit
      </button>
    </div>
  );
};

export default MemoryGamePanel;
