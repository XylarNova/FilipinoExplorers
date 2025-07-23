import React, { useState } from 'react';
 
const GuessTheWordPanel = ({
  editingGameId,
  gameTitle,
  setGameTitle,
  actualCategory, // The actual subject category (Vocabulary, Grammar, etc.)
  puzzles,
  setPuzzles, // Add this prop for direct state updates
  handleInputChange,
  handleAddPuzzle,
  classes,
  classSelections,
  setClassSelections,
  gameSettings,
  handleCheckboxChange,
  quarter,
  setQuarter,
  handleSaveGame,
  resetForm,
  setIsPanelOpen,
}) => {
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportRows, setBulkImportRows] = useState([
    { word: '', clue: '', translation: '', score: 10 },
    { word: '', clue: '', translation: '', score: 10 },
    { word: '', clue: '', translation: '', score: 10 },
    { word: '', clue: '', translation: '', score: 10 },
    { word: '', clue: '', translation: '', score: 10 }
  ]);
 
  const handleDeletePuzzle = (pIndex) => {
    if (puzzles.length <= 1) {
      alert('You must have at least one puzzle.');
      return;
    }
   
    if (window.confirm('Are you sure you want to delete this puzzle?')) {
      const updatedPuzzles = puzzles.filter((_, index) => index !== pIndex);
      if (setPuzzles) {
        setPuzzles(updatedPuzzles);
      }
    }
  };
 
  const handleBulkImportRowChange = (index, field, value) => {
    const updatedRows = [...bulkImportRows];
    updatedRows[index][field] = field === 'score' ? parseInt(value, 10) || 10 : value;
    setBulkImportRows(updatedRows);
  };
 
  const addBulkImportRow = () => {
    setBulkImportRows([...bulkImportRows, { word: '', clue: '', translation: '', score: 10 }]);
  };
 
  const removeBulkImportRow = (index) => {
    if (bulkImportRows.length > 1) {
      const updatedRows = bulkImportRows.filter((_, i) => i !== index);
      setBulkImportRows(updatedRows);
    }
  };
 
  const handleBulkImport = () => {
    const validRows = bulkImportRows.filter(row =>
      row.word.trim() && row.clue.trim() && row.translation.trim()
    );
   
    if (validRows.length === 0) {
      alert('Please fill in at least one complete row (word, clue, translation, and score).');
      return;
    }
   
    const newPuzzles = validRows.map(row => ({
      word: row.word.trim().toUpperCase(),
      clue: row.clue.trim(),
      translation: row.translation.trim(),
      score: parseInt(row.score) || 10,
      hintEnabled: true
    }));
   
    if (setPuzzles) {
      const updatedPuzzles = [...puzzles, ...newPuzzles];
      setPuzzles(updatedPuzzles);
      alert(`Successfully imported ${newPuzzles.length} puzzles!`);
    }
   
    // Reset the bulk import form
    setBulkImportRows([
      { word: '', clue: '', translation: '', score: 10 },
      { word: '', clue: '', translation: '', score: 10 },
      { word: '', clue: '', translation: '', score: 10 },
      { word: '', clue: '', translation: '', score: 10 },
      { word: '', clue: '', translation: '', score: 10 }
    ]);
    setShowBulkImport(false);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-lg p-6 overflow-y-auto z-50">
      <h2 className="text-[#108AB1] text-3xl font-bold mb-4">
        {editingGameId ? (
          <span>
            <span className="text-orange-600">✏️ Edit</span> Guess the Word Game
          </span>
        ) : (
          'Create Guess the Word Game'
        )}
      </h2>
 
      {/* Edit Mode Notice */}
      {editingGameId && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-sm text-orange-800">
            <strong>🔄 Edit Mode:</strong> You're editing an existing Guess the Word Game.
            You can add new puzzles, modify existing ones, change the game mode, and update settings.
          </p>
        </div>
      )}
 
      {/* Game Type Display */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800 mt-1">
          <strong>Category:</strong> {actualCategory || 'Vocabulary'}
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
 
      {/* Word Puzzles Section */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Word Puzzles</label>
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Teacher Tip:</strong> Enter the word students need to guess, provide a clue in Filipino/Tagalog, 
            and include an English translation. Set appropriate points for each puzzle.
          </p>
        </div>
       
        {puzzles.map((puzzle, pIndex) => (
          <div key={pIndex} className="mb-6 border p-4 rounded bg-gray-50">
            {/* Puzzle Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-700">Puzzle {pIndex + 1}</h4>
                {editingGameId && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    puzzle.id ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {puzzle.id ? 'Existing' : 'New'}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {puzzles.length > 1 && (
                  <button
                    onClick={() => handleDeletePuzzle(pIndex)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    title="Delete this puzzle"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
 
            {/* Word Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Word to Guess
              </label>
              <input
                type="text"
                placeholder="Enter Filipino word"
                value={puzzle.word || ''}
                onChange={(e) => handleInputChange(pIndex, 'word', e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
 
            {/* Clue Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clue
              </label>
              <textarea
                placeholder="Enter Filipino word meaning"
                value={puzzle.clue || ''}
                onChange={(e) => handleInputChange(pIndex, 'clue', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
 
            {/* Translation Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Translation
              </label>
              <textarea
                placeholder="Enter English translation of the clue"
                value={puzzle.translation || ''}
                onChange={(e) => handleInputChange(pIndex, 'translation', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows="3"
              />
            </div>
 
            {/* Score Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points
              </label>
              <input
                type="number"
                min="1"
                max="100"
                placeholder="Enter points (1-100)"
                value={puzzle.score || 10}
                onChange={(e) => handleInputChange(pIndex, 'score', parseInt(e.target.value) || 10)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">1-100</p>
            </div>
 
            {/* Hint Status */}
            <div className="mb-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={puzzle.hintEnabled !== false}
                  onChange={(e) => handleInputChange(pIndex, 'hintEnabled', e.target.checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-400"
                />
                <span className="text-sm font-medium text-gray-700">Enable hints for this puzzle</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Allow students to request hints during gameplay</p>
            </div>
 
            {/* Preview */}
            <div className="mt-3 p-2 bg-white border rounded">
              <p className="text-xs text-gray-600 mb-1">Preview:</p>
              <p className="text-sm">
                <strong>Word:</strong> {puzzle.word || '-'}
              </p>
              <p className="text-sm">
                <strong>Clue:</strong> {puzzle.clue || '-'}
              </p>
              <p className="text-sm">
                <strong>Translation:</strong> {puzzle.translation || '-'}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  puzzle.hintEnabled !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                }`}>
                  Hints: {puzzle.hintEnabled !== false ? 'Enabled' : 'Disabled'}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                  Points: {puzzle.score || 10}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAddPuzzle}
            className="bg-[#108AB1] text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Puzzle
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
            <h4 className="font-semibold mb-3">Bulk Import Puzzles</h4>
            <p className="text-sm text-gray-600 mb-4">
              Fill in the table below with your puzzles. Leave empty rows blank - only filled rows will be imported.
            </p>
           
            <div className="bg-white rounded border overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 bg-gray-50 border-b font-medium text-sm">
                <div className="col-span-1 p-3 text-center border-r">#</div>
                <div className="col-span-2 p-3 border-r">Word</div>
                <div className="col-span-4 p-3 border-r">Clue (Filipino)</div>
                <div className="col-span-4 p-3 border-r">Translation (English)</div>
                <div className="col-span-1 p-3 text-center">Points</div>
              </div>
             
              {/* Rows */}
              {bulkImportRows.map((row, index) => (
                <div key={index} className="grid grid-cols-12 border-b hover:bg-gray-50">
                  <div className="col-span-1 p-3 text-center border-r text-sm text-gray-500">
                    {index + 1}
                    {bulkImportRows.length > 1 && (
                      <button
                        onClick={() => removeBulkImportRow(index)}
                        className="block text-red-500 hover:text-red-700 text-xs mt-1"
                        title="Remove this row"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="col-span-2 p-2 border-r">
                    <input
                      type="text"
                      placeholder="Word..."
                      value={row.word}
                      onChange={(e) => handleBulkImportRowChange(index, 'word', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-4 p-2 border-r">
                    <textarea
                      placeholder="Enter clue in Filipino/Tagalog..."
                      value={row.clue}
                      onChange={(e) => handleBulkImportRowChange(index, 'clue', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="2"
                    />
                  </div>
                  <div className="col-span-4 p-2 border-r">
                    <textarea
                      placeholder="Enter English translation..."
                      value={row.translation}
                      onChange={(e) => handleBulkImportRowChange(index, 'translation', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      rows="2"
                    />
                  </div>
                  <div className="col-span-1 p-2 text-center">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="10"
                      value={row.score}
                      onChange={(e) => handleBulkImportRowChange(index, 'score', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
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
                Import Puzzles
              </button>
              <button
                onClick={() => {
                  setBulkImportRows([
                    { word: '', clue: '', translation: '', score: 10 },
                    { word: '', clue: '', translation: '', score: 10 },
                    { word: '', clue: '', translation: '', score: 10 },
                    { word: '', clue: '', translation: '', score: 10 },
                    { word: '', clue: '', translation: '', score: 10 }
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
                <li>Only rows with word, clue, and translation filled will be imported</li>
                <li>Words will be automatically converted to uppercase</li>
                <li>Default score is 10 points if not specified</li>
                <li>Hints will be enabled by default for all imported puzzles</li>
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
          {['leaderboard', 'review', 'shuffle', 'windowTracking'].map((setting) => (
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