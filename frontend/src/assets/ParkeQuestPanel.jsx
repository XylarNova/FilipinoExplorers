import React from 'react';

const ParkeQuestPanel = ({
  editingGameId,
  gameTitle,
  setGameTitle,
  selectedCategory,
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
        {editingGameId ? 'Edit Parke Quest Game' : 'Create Parke Quest Game'}
      </h2>

      {/* Game Description */}
      <div className="mb-4 bg-green-50 border border-green-200 rounded p-3">
        <h4 className="font-semibold text-green-800 mb-2">🌳 Parke Quest Game</h4>
        <p className="text-sm text-green-700">
          Students will explore a virtual park environment, discovering Filipino nature vocabulary, 
          cultural practices, and environmental awareness through interactive outdoor adventures. 
          This game uses pre-defined park scenarios and activities.
        </p>
      </div>

      {/* Game Title */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Game Title</label>
        <input
          type="text"
          placeholder="Enter game title (e.g., 'Park Adventure Explorer')"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Game Content Information */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Game Content</h3>
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <h4 className="font-semibold text-green-800 mb-2">🌲 Available Park Locations:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>Playground:</strong> Action words and recreational activities</li>
            <li>• <strong>Garden:</strong> Plant and flower vocabulary, nature descriptions</li>
            <li>• <strong>Pond Area:</strong> Water-related vocabulary and animal names</li>
            <li>• <strong>Picnic Area:</strong> Food vocabulary and family activities</li>
            <li>• <strong>Walking Trail:</strong> Direction words and descriptive language</li>
            <li>• <strong>Sports Court:</strong> Sports vocabulary and competitive expressions</li>
            <li>• <strong>Rest Area:</strong> Comfort and relaxation vocabulary</li>
          </ul>
          <p className="text-sm text-green-600 mt-2">
            <strong>Note:</strong> The game will automatically select appropriate locations based on 
            the chosen category and adventure type.
          </p>
        </div>
      </div>

      {/* Adventure Type */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Adventure Type</label>
        <select
          value={gameSettings.adventureType || 'Exploration'}
          onChange={(e) => handleCheckboxChange({
            target: { name: 'adventureType', checked: false, value: e.target.value }
          })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Exploration">Exploration - Discover and learn about park features</option>
          <option value="Scavenger Hunt">Scavenger Hunt - Find specific items and complete tasks</option>
          <option value="Nature Guide">Nature Guide - Learn about plants and animals</option>
          <option value="Cultural Tour">Cultural Tour - Explore Filipino park traditions</option>
        </select>
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
          <option value="Easy">Easy - Basic nature vocabulary and simple tasks</option>
          <option value="Medium">Medium - Intermediate vocabulary and mixed activities</option>
          <option value="Hard">Hard - Advanced vocabulary and complex challenges</option>
        </select>
      </div>

      {/* Learning Objectives */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Learning Objectives</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="natureVocabulary"
              checked={gameSettings.natureVocabulary}
              onChange={handleCheckboxChange}
            />
            <span>Nature Vocabulary</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="environmentalAwareness"
              checked={gameSettings.environmentalAwareness}
              onChange={handleCheckboxChange}
            />
            <span>Environmental Awareness</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="culturalTraditions"
              checked={gameSettings.culturalTraditions}
              onChange={handleCheckboxChange}
            />
            <span>Cultural Traditions</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="observationSkills"
              checked={gameSettings.observationSkills}
              onChange={handleCheckboxChange}
            />
            <span>Observation Skills</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="physicalActivity"
              checked={gameSettings.physicalActivity}
              onChange={handleCheckboxChange}
            />
            <span>Physical Activity Vocabulary</span>
          </label>
        </div>
      </div>

      {/* Season/Weather Setting */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Season/Weather Setting</label>
        <select
          value={gameSettings.weatherSetting || 'Sunny Day'}
          onChange={(e) => handleCheckboxChange({
            target: { name: 'weatherSetting', checked: false, value: e.target.value }
          })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Sunny Day">Sunny Day - Bright and cheerful atmosphere</option>
          <option value="Rainy Season">Rainy Season - Wet weather vocabulary</option>
          <option value="Windy Day">Windy Day - Weather-related activities</option>
          <option value="Festival Day">Festival Day - Cultural celebrations in the park</option>
        </select>
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
          {['leaderboard', 'hints', 'review', 'progressTracking', 'teamMode'].map((setting) => (
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
          min="10"
          max="60"
          value={setTime}
          onChange={handleSetTimeChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Recommended: 20-45 minutes"
        />
        <p className="text-sm text-gray-600 mt-1">
          Park adventures typically require more time for exploration
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
          min="15"
          max="500"
          value={gamePoints}
          onChange={handleGamePointsChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Points for completing the park adventure"
        />
      </div>

      <button
        onClick={handleSaveGame}
        className="bg-[#06D7A0] text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition"
      >
        {editingGameId ? 'Update Adventure' : 'Save Adventure'}
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

export default ParkeQuestPanel;
