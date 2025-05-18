import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WordOfTheDay = ({ darkMode })  => {
  const [word, setWord] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/words/get')
      .then((res) => setWord(res.data))
      .catch((err) => console.error("Error fetching word:", err));
  }, []);

  if (!word) return <div>Loading...</div>;

  return (
    <div className={`${darkMode ? "bg-gray-700" : "bg-[#F88D6B]"} p-4 rounded-[20px] w-full max-w-[250px] h-[360px] flex flex-col justify-between shadow`}>
      {/* Top Section */}
      <div>
        <h1 className={`text-center text-lg font-bold ${darkMode ? "text-white" : "text-[#073B4C]"} mb-3 font-['Fredoka']`}>
          Word of the Day
        </h1>

        {/* Word */}
        <div className={`${darkMode ? "bg-gray-600 text-white" : "bg-[#FDFBEE] text-[#073B4C]"} p-2 rounded-xl text-center mb-2`}>
          <div className="font-bold text-[clamp(14px,2.5vw,18px)]">
            {showTranslation ? word.salitaTranslation : word.salita}
          </div>
        </div>

        {/* Kahulugan */}
        <div className={`${darkMode ? "bg-gray-600 text-white" : "bg-[#FDFBEE] text-[#073B4C]"} p-2 rounded-xl text-center mb-2`}>
          <h2 className="text-sm font-bold mb-1">Kahulugan</h2>
          <div className="text-[clamp(11px,2vw,14px)] leading-tight">
            {showTranslation ? word.kahuluganTranslation : word.kahulugan}
          </div>
        </div>

        {/* Pangungusap */}
        <div className={`${darkMode ? "bg-gray-600 text-white" : "bg-[#FDFBEE] text-[#073B4C]"} p-2 rounded-xl text-center`}>
          <h2 className="text-sm font-bold mb-1">Gamit sa Pangungusap</h2>
          <div className="text-[clamp(11px,2vw,13px)] leading-tight">
            {showTranslation ? word.pangungusapTranslation : word.pangungusap}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="text-center mt-4">
        <button
          onClick={() => setShowTranslation(prev => !prev)}
          className={`px-4 py-1 text-sm rounded-full font-semibold transition ${
            darkMode
              ? "bg-teal-700 text-white hover:bg-teal-600"
              : "bg-[#06D6A0] text-white hover:bg-[#04b88a]"
          }`}
        >
          {showTranslation ? 'Ipakita ang Filipino' : 'Translate to English'}
        </button>

      </div>
    </div>

  );
};

export default WordOfTheDay;
