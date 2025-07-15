import React, { useState } from 'react';

const MemoryGamePanel = ({
  editingGameId,
  gameTitle,
  setGameTitle,
  selectedCategory,
  selectedGameType, // Memory game subtype (Individual/Group)
  actualCategory, // The actual subject category (Vocabulary, Grammar, etc.)
  vocabularyQuestions,
  setVocabularyQuestions, // Add this prop for direct state updates
  handleInputChange,
  handleChoiceChange,
  handleCorrectAnswerChange,
  handleAutoFillChoices,
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
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [bulkImportRows, setBulkImportRows] = useState([
    { tagalogWord: '', englishAnswer: '' },
    { tagalogWord: '', englishAnswer: '' },
    { tagalogWord: '', englishAnswer: '' },
    { tagalogWord: '', englishAnswer: '' },
    { tagalogWord: '', englishAnswer: '' }
  ]);

  const handleDeleteQuestion = (qIndex) => {
    if (vocabularyQuestions.length <= 1) {
      alert('You must have at least one question.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = vocabularyQuestions.filter((_, index) => index !== qIndex);
      if (setVocabularyQuestions) {
        setVocabularyQuestions(updatedQuestions);
      }
    }
  };

  const handleBulkImportRowChange = (index, field, value) => {
    const updatedRows = [...bulkImportRows];
    updatedRows[index][field] = value;
    setBulkImportRows(updatedRows);
  };

  const addBulkImportRow = () => {
    setBulkImportRows([...bulkImportRows, { tagalogWord: '', englishAnswer: '' }]);
  };

  const removeBulkImportRow = (index) => {
    if (bulkImportRows.length > 1) {
      const updatedRows = bulkImportRows.filter((_, i) => i !== index);
      setBulkImportRows(updatedRows);
    }
  };

  const handleBulkImport = () => {
    const validRows = bulkImportRows.filter(row => 
      row.tagalogWord.trim() && row.englishAnswer.trim()
    );
    
    if (validRows.length === 0) {
      alert('Please fill in at least one complete row (both Tagalog word and English answer).');
      return;
    }
    
    const newQuestions = validRows.map(row => ({
      tagalogWord: row.tagalogWord.trim(),
      choices: [row.englishAnswer.trim(), 'Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      hint: '',
      story: ''
    }));
    
    if (setVocabularyQuestions) {
      const updatedQuestions = [...vocabularyQuestions, ...newQuestions];
      setVocabularyQuestions(updatedQuestions);
      alert(`Successfully imported ${newQuestions.length} questions! Use "Auto-fill Choices" to replace the placeholder options with better choices.`);
    }
    
    // Reset the bulk import form
    setBulkImportRows([
      { tagalogWord: '', englishAnswer: '' },
      { tagalogWord: '', englishAnswer: '' },
      { tagalogWord: '', englishAnswer: '' },
      { tagalogWord: '', englishAnswer: '' },
      { tagalogWord: '', englishAnswer: '' }
    ]);
    setShowBulkImport(false);
  };

  const handleBulkImportOld = () => {
    if (!bulkImportText.trim()) {
      alert('Please enter some questions to import.');
      return;
    }
    
    const lines = bulkImportText.trim().split('\n');
    const newQuestions = [];
    const errors = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // Skip empty lines
      
      // Support both "=" and tab separation
      const parts = trimmedLine.includes('=') 
        ? trimmedLine.split('=').map(part => part.trim())
        : trimmedLine.split('\t').map(part => part.trim());
      
      if (parts.length === 2 && parts[0] && parts[1]) {
        const [tagalogWord, englishAnswer] = parts;
        newQuestions.push({
          tagalogWord,
          choices: [englishAnswer, '', '', '', ''],
          correctAnswer: 0,
          hint: '',
          story: ''
        });
      } else {
        errors.push(`Line ${index + 1}: "${trimmedLine}" - Invalid format`);
      }
    });
    
    if (errors.length > 0) {
      alert(`Some lines had errors:\n${errors.join('\n')}\n\nCorrect format: "TagalogWord = EnglishAnswer" or "TagalogWord [Tab] EnglishAnswer"`);
      return;
    }
    
    if (newQuestions.length > 0) {
      // Directly update the vocabulary questions if we have the setter
      if (setVocabularyQuestions) {
        const updatedQuestions = [...vocabularyQuestions, ...newQuestions];
        setVocabularyQuestions(updatedQuestions);
        alert(`Successfully imported ${newQuestions.length} questions! You can now use Auto-fill to add incorrect choices for each question.`);
      } else {
        // Fallback method: Add questions one by one
        newQuestions.forEach(() => handleAddQuestion());
        
        setTimeout(() => {
          const startIndex = vocabularyQuestions.length;
          newQuestions.forEach((newQ, index) => {
            const qIndex = startIndex + index;
            handleInputChange(qIndex, 'tagalogWord', newQ.tagalogWord);
            handleCorrectAnswerChange(qIndex, newQ.choices[0]);
          });
          
          alert(`Successfully imported ${newQuestions.length} questions! You can now use Auto-fill to add incorrect choices for each question.`);
        }, 100);
      }
    }
    
    setBulkImportText('');
    setShowBulkImport(false);
  };
  return (
    <div className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-lg p-6 overflow-y-auto z-50">
      <h2 className="text-[#108AB1] text-3xl font-bold mb-4">
        {editingGameId ? 'Edit Game' : 'Create Game'}
      </h2>

      {/* Game Type Display */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800">
          <strong>Game Type:</strong> Memory Game - {selectedGameType || 'Individual'}
        </p>
        <p className="text-sm text-blue-800 mt-1">
          <strong>Category:</strong> {actualCategory || 'Vocabulary'}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {selectedGameType === 'Group' 
            ? 'Students will collaborate in teams to match words with meanings' 
            : 'Each student will play individually to match words with meanings'}
        </p>
      </div>

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

      {/* Vocabulary questions for all memory games */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Vocabulary Questions</label>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Teacher Tip:</strong> Just enter the Tagalog word and correct English answer. 
            You can use "Auto-fill" to generate similar choices, or add your own custom incorrect choices.
          </p>
        </div>
        
          {vocabularyQuestions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 border p-4 rounded bg-gray-50">
              {/* Question Header */}
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">Question {qIndex + 1}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAutoFillChoices(qIndex)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Auto-fill Choices
                  </button>
                  {vocabularyQuestions.length > 1 && (
                    <button
                      onClick={() => handleDeleteQuestion(qIndex)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      title="Delete this question"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Tagalog Word Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagalog Word
                </label>
                <input
                  type="text"
                  placeholder="Enter Tagalog word (e.g., 'Bahay')"
                  value={q.tagalogWord}
                  onChange={(e) => handleInputChange(qIndex, 'tagalogWord', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Correct Answer Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct English Answer
                </label>
                <input
                  type="text"
                  placeholder="Enter correct English translation (e.g., 'House')"
                  value={q.correctAnswer !== null ? q.choices[q.correctAnswer] : ''}
                  onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                  className="w-full border border-green-500 rounded px-3 py-2 bg-green-50 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Incorrect Choices */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incorrect Choices (Optional - will auto-generate if empty)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((cIndex) => {
                    // Skip the correct answer slot
                    if (q.correctAnswer === cIndex) return null;
                    
                    return (
                      <div key={cIndex} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 w-12">Wrong:</span>
                        <input
                          type="text"
                          placeholder={`Incorrect option ${cIndex + 1}`}
                          value={q.choices[cIndex]}
                          onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hint input */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hint (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter a helpful hint for students"
                  value={q.hint}
                  onChange={(e) => handleInputChange(qIndex, 'hint', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Preview */}
              <div className="mt-3 p-2 bg-white border rounded">
                <p className="text-xs text-gray-600 mb-1">Preview:</p>
                <p className="text-sm">
                  <strong>{q.tagalogWord || 'Tagalog Word'}</strong> = ?
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {q.choices.filter(choice => choice.trim()).map((choice, idx) => (
                    <span 
                      key={idx} 
                      className={`text-xs px-2 py-1 rounded ${
                        q.correctAnswer === q.choices.indexOf(choice) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {choice}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddQuestion}
              className="bg-[#108AB1] text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Question
            </button>
            <button
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {showBulkImport ? 'Cancel Bulk Import' : 'Bulk Import'}
            </button>
          </div>

          {/* Bulk Import Section */}
          {showBulkImport && (
            <div className="mt-4 p-4 bg-gray-100 rounded border">
              <h4 className="font-semibold mb-3">Bulk Import Questions</h4>
              <p className="text-sm text-gray-600 mb-4">
                Fill in the table below with your questions. Leave empty rows blank - only filled rows will be imported.
              </p>
              
              <div className="bg-white rounded border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 bg-gray-50 border-b font-medium text-sm">
                  <div className="col-span-1 p-3 text-center border-r">#</div>
                  <div className="col-span-5 p-3 border-r">Tagalog Word</div>
                  <div className="col-span-5 p-3 border-r">English Answer</div>
                  <div className="col-span-1 p-3 text-center">Action</div>
                </div>
                
                {/* Rows */}
                {bulkImportRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-12 border-b hover:bg-gray-50">
                    <div className="col-span-1 p-3 text-center border-r text-sm text-gray-500">
                      {index + 1}
                    </div>
                    <div className="col-span-5 p-2 border-r">
                      <input
                        type="text"
                        placeholder="Enter Tagalog word..."
                        value={row.tagalogWord}
                        onChange={(e) => handleBulkImportRowChange(index, 'tagalogWord', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-5 p-2 border-r">
                      <input
                        type="text"
                        placeholder="Enter English answer..."
                        value={row.englishAnswer}
                        onChange={(e) => handleBulkImportRowChange(index, 'englishAnswer', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div className="col-span-1 p-3 text-center">
                      {bulkImportRows.length > 1 && (
                        <button
                          onClick={() => removeBulkImportRow(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                          title="Remove this row"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={addBulkImportRow}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Add Row
                </button>
                <button
                  onClick={handleBulkImport}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-medium"
                >
                  Import Questions
                </button>
                <button
                  onClick={() => {
                    setBulkImportRows([
                      { tagalogWord: '', englishAnswer: '' },
                      { tagalogWord: '', englishAnswer: '' },
                      { tagalogWord: '', englishAnswer: '' },
                      { tagalogWord: '', englishAnswer: '' },
                      { tagalogWord: '', englishAnswer: '' }
                    ]);
                    setShowBulkImport(false);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 font-medium"
                >
                  Cancel
                </button>
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                💡 <strong>Tips:</strong> 
                <ul className="mt-1 ml-4 list-disc">
                  <li>Only rows with both Tagalog word and English answer will be imported</li>
                  <li>After importing, use "Auto-fill Choices" to generate incorrect options</li>
                  <li>You can add more rows by clicking "Add Row"</li>
                </ul>
              </div>
            </div>
          )}
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
        <label className="block mb-2 font-semibold">Total Game Time (minutes)</label>
        <input
          type="number"
          min="1"
          max="60"
          value={setTime}
          onChange={handleSetTimeChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter total game duration"
        />
        <p className="text-sm text-gray-600 mt-1">
          This is the total time for the entire game, regardless of number of questions.
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
        <label className="block mb-2 font-semibold">Points Per Question</label>
        <input
          type="number"
          min="1"
          max="100"
          value={gamePoints}
          onChange={handleGamePointsChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter points per correct answer"
        />
        <p className="text-sm text-gray-600 mt-1">
          Students earn these points for each correct answer during the game.
        </p>
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
