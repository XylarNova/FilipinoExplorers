import React from 'react';

const GuessTheWordPanel = ({
  editingGameId,
  gameTitle,
  setGameTitle,
  selectedCategory,
  vocabularyQuestions,
  setVocabularyQuestions,
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
        {editingGameId ? 'Edit Guess The Word Game' : 'Create Guess The Word Game'}
      </h2>

      {/* Game Description */}
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
        <h4 className="font-semibold text-blue-800 mb-2">🎯 Guess The Word Game</h4>
        <p className="text-sm text-blue-700">
          Students will spell out Tagalog words based on hints and scrambled letters. 
          Each question should have a Tagalog word and a helpful hint.
        </p>
      </div>

      {/* Game Title */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Game Title</label>
        <input
          type="text"
          placeholder="Enter game title (e.g., 'Guess Filipino Animals')"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Vocabulary Questions - Required for Guess The Word */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Word List & Hints</label>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Instructions:</strong> Add Tagalog words that students need to spell out. 
            The hint will help them figure out the word. Make sure hints are clear but not too obvious!
          </p>
        </div>
        
        {vocabularyQuestions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 border p-3 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Word {qIndex + 1}</span>
              {vocabularyQuestions.length > 1 && (
                <button
                  onClick={() => {
                    const updated = vocabularyQuestions.filter((_, idx) => idx !== qIndex);
                    setVocabularyQuestions(updated);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            {/* Tagalog Word Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagalog Word</label>
              <input
                type="text"
                placeholder="Enter the Tagalog word (e.g., 'PUSO')"
                value={q.tagalogWord}
                onChange={(e) => handleInputChange(qIndex, 'tagalogWord', e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-lg"
              />
            </div>

            {/* Hint Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hint</label>
              <input
                type="text"
                placeholder="Enter a helpful hint (e.g., 'Body part that pumps blood')"
                value={q.hint}
                onChange={(e) => handleInputChange(qIndex, 'hint', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* English Translation (Optional) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">English Translation (Optional)</label>
              <input
                type="text"
                placeholder="English meaning (e.g., 'Heart')"
                value={q.choices[0] || ''}
                onChange={(e) => handleChoiceChange(qIndex, 0, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Difficulty Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
              <select
                value={q.choices[1] || 'Medium'}
                onChange={(e) => handleChoiceChange(qIndex, 1, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="Easy">Easy (3-5 letters)</option>
                <option value="Medium">Medium (6-8 letters)</option>
                <option value="Hard">Hard (9+ letters)</option>
              </select>
            </div>
          </div>
        ))}
        
        <button
          onClick={handleAddQuestion}
          className="bg-[#108AB1] text-white px-4 py-2 rounded mt-2"
        >
          Add Word
        </button>
      </div>

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
          {['leaderboard', 'hints', 'review', 'shuffle'].map((setting) => (
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
          min="1"
          max="60"
          value={setTime}
          onChange={handleSetTimeChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Recommended: 5-15 minutes"
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
          min="1"
          max="100"
          value={gamePoints}
          onChange={handleGamePointsChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Points per correct word"
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

export default GuessTheWordPanel;
