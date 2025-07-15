import React from 'react';

const PaaralanQuestPanel = ({
  editingGameId,
  gameTitle,
  setGameTitle,
  selectedCategory,
  handleCategoryChange,
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
        {editingGameId ? 'Edit Paaralan Quest Game' : 'Create Paaralan Quest Game'}
      </h2>

      {/* Game Description */}
      <div className="mb-4 bg-purple-50 border border-purple-200 rounded p-3">
        <h4 className="font-semibold text-purple-800 mb-2">🏫 Paaralan Quest Game</h4>
        <p className="text-sm text-purple-700">
          Students will navigate through different school scenarios and locations, learning Filipino 
          language and culture through interactive school-based adventures. This game uses pre-defined 
          content and scenarios.
        </p>
      </div>

      {/* Game Title */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Game Title</label>
        <input
          type="text"
          placeholder="Enter game title (e.g., 'School Adventure Quest')"
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
          <option value="Culture">Culture</option>
          <option value="Reading">Reading</option>
        </select>
      </div>

      {/* Story Mode Selection */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Story Mode</label>
        <div className="space-y-3">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="storyMode"
                value="single"
                checked={gameSettings.storyMode === 'single' || !gameSettings.storyMode}
                onChange={(e) => handleCheckboxChange({
                  target: { name: 'storyMode', value: e.target.value }
                })}
                className="form-radio"
              />
              <span className="text-sm">
                <strong>Single Story Mode:</strong> One story shown at the beginning, then all questions about that story
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="storyMode"
                value="multiple"
                checked={gameSettings.storyMode === 'multiple'}
                onChange={(e) => handleCheckboxChange({
                  target: { name: 'storyMode', value: e.target.value }
                })}
                className="form-radio"
              />
              <span className="text-sm">
                <strong>Multiple Stories Mode:</strong> Different story for each question number
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Game Content Information */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Story Content</h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <h4 className="font-semibold text-blue-800 mb-2">📚 Story Instructions:</h4>
          <p className="text-sm text-blue-700">
            {gameSettings.storyMode === 'multiple' 
              ? "In Multiple Stories Mode, you'll add a story for each question individually below."
              : "Create an engaging story set in a school environment. The story should be appropriate for students and relate to the selected category. After the story, you can create questions that test comprehension and learning objectives."
            }
          </p>
        </div>
        
        {(!gameSettings.storyMode || gameSettings.storyMode === 'single') && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Main Story Content</label>
            <textarea
              placeholder="Write or paste your story here. Example: 'Sa isang magandang umaga, pumasok si Maria sa paaralan. Nakita niya ang kanyang mga kaklase na naglalaro sa playground...'"
              value={gameSettings.storyContent || ''}
              onChange={(e) => handleCheckboxChange({
                target: { name: 'storyContent', checked: false, value: e.target.value }
              })}
              className="w-full border border-gray-300 rounded px-3 py-2 min-h-32"
              rows="6"
            />
            <p className="text-sm text-gray-600 mt-1">
              Write a story that relates to your selected category and learning objectives.
            </p>
          </div>
        )}
      </div>

      {/* Story Questions */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Story Questions</label>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Instructions:</strong> Create questions about the story. Each question should have 
            at least 2 choices but can have more. Students will answer these after reading the story.
          </p>
        </div>
        
        {vocabularyQuestions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 border p-4 rounded bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700">Question {qIndex + 1}</span>
              {vocabularyQuestions.length > 1 && (
                <button
                  onClick={() => {
                    const updated = vocabularyQuestions.filter((_, idx) => idx !== qIndex);
                    setVocabularyQuestions(updated);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Question
                </button>
              )}
            </div>
            
            {/* Story for this question (Multiple Stories Mode) */}
            {gameSettings.storyMode === 'multiple' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Story for Question {qIndex + 1}</label>
                <textarea
                  placeholder="Write the story for this specific question..."
                  value={q.story || ''}
                  onChange={(e) => handleInputChange(qIndex, 'story', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 min-h-24"
                  rows="4"
                />
                <p className="text-sm text-gray-600 mt-1">
                  This story will be shown with question {qIndex + 1}.
                </p>
              </div>
            )}
            
            {/* Question Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                placeholder="Enter your question (e.g., 'Sino ang pangunahing tauhan sa kuwento?')"
                value={q.tagalogWord || ''}
                onChange={(e) => handleInputChange(qIndex, 'tagalogWord', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Dynamic Choices */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Answer Choices</label>
              {q.choices.map((choice, cIndex) => (
                <div key={cIndex} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name={`correctAnswer-${qIndex}`}
                    checked={q.correctAnswer === cIndex}
                    onChange={() => handleCorrectAnswerChange(qIndex, cIndex)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm font-medium">{String.fromCharCode(65 + cIndex)}.</span>
                  <input
                    type="text"
                    placeholder={`Choice ${cIndex + 1}`}
                    value={choice}
                    onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                    className={`border rounded px-3 py-2 flex-1 ${
                      q.correctAnswer === cIndex ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                  />
                  {q.choices.length > 2 && (
                    <button
                      onClick={() => {
                        const updated = [...vocabularyQuestions];
                        updated[qIndex].choices.splice(cIndex, 1);
                        if (updated[qIndex].correctAnswer === cIndex) {
                          updated[qIndex].correctAnswer = null;
                        } else if (updated[qIndex].correctAnswer > cIndex) {
                          updated[qIndex].correctAnswer--;
                        }
                        setVocabularyQuestions(updated);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              {q.choices.length < 6 && (
                <button
                  onClick={() => {
                    const updated = [...vocabularyQuestions];
                    updated[qIndex].choices.push('');
                    setVocabularyQuestions(updated);
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm mt-2"
                >
                  + Add Choice
                </button>
              )}
            </div>

            {/* Hint */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hint (Optional)</label>
              <input
                type="text"
                placeholder="Provide a hint to help students answer this question"
                value={q.hint || ''}
                onChange={(e) => handleInputChange(qIndex, 'hint', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={handleAddQuestion}
          className="bg-[#108AB1] text-white px-4 py-2 rounded mt-2"
        >
          Add Question
        </button>
      </div>

      {/* Difficulty Level */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Difficulty Level</label>
        <select
          value={gameSettings.difficulty || 'Medium'}
          onChange={(e) => handleCheckboxChange({
            target: { name: 'difficulty', checked: false, value: e.target.value }
          })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Easy">Easy - Basic vocabulary and simple scenarios</option>
          <option value="Medium">Medium - Intermediate vocabulary and mixed scenarios</option>
          <option value="Hard">Hard - Advanced vocabulary and complex scenarios</option>
        </select>
      </div>

      {/* Learning Objectives */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Learning Objectives</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="vocabularyFocus"
              checked={gameSettings.vocabularyFocus}
              onChange={handleCheckboxChange}
            />
            <span>Vocabulary Building</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="culturalContext"
              checked={gameSettings.culturalContext}
              onChange={handleCheckboxChange}
            />
            <span>Cultural Context Learning</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="socialInteraction"
              checked={gameSettings.socialInteraction}
              onChange={handleCheckboxChange}
            />
            <span>Social Interaction Skills</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="readingComprehension"
              checked={gameSettings.readingComprehension}
              onChange={handleCheckboxChange}
            />
            <span>Reading Comprehension</span>
          </label>
        </div>
      </div>

      {/* Classroom Assignment */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Classroom Assignment</h3>
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

      {/* Game Settings */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Game Settings</h3>
        <div className="flex flex-col space-y-2">
          {['leaderboard', 'hints', 'review', 'progressTracking'].map((setting) => (
            <label key={setting} className="flex items-center space-x-2 capitalize">
              <input
                type="checkbox"
                name={setting}
                checked={gameSettings[setting]}
                onChange={handleCheckboxChange}
              />
              <span>{setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Set Time */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold">Set Time (minutes)</label>
        <input
          type="number"
          min="5"
          max="60"
          value={setTime}
          onChange={handleSetTimeChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Recommended: 15-30 minutes"
        />
        <p className="text-sm text-gray-600 mt-1">
          Quest games typically take longer than other game types
        </p>
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
          min="10"
          max="500"
          value={gamePoints}
          onChange={handleGamePointsChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Points for completing the quest"
        />
      </div>

      <button
        onClick={handleSaveGame}
        className="bg-[#06D7A0] text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition"
      >
        {editingGameId ? 'Update Quest' : 'Save Quest'}
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

export default PaaralanQuestPanel;
