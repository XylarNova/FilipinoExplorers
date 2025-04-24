import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WordOfTheDay = () => {
  const [word, setWord] = useState(null);

  useEffect(() => {
    // Fetch Word of the Day from the backend
    axios.get('http://localhost:8080/api/words/get')
      .then(response => {
        if (response.data) {
          setWord(response.data);  // Directly use the word data
        }
      })
      .catch(error => {
        console.error('There was an error fetching the word of the day:', error);
      });
  }, []);

  if (!word) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#F5B066] p-8 rounded-2xl max-w-lg mx-auto">
      {/* Word of the Day Text */}
      <h1 className="text-center text-xl font-semibold">Word of the Day</h1>
      
      {/* Word */}
      <div className="bg-[#FDFBEE] mt-4 p-4 rounded-xl">
        <div className="text-center font-bold font-[Poppins] text-xl">{word.salita}</div>
        <div className="text-center">({word.salitaTranslation})</div>
      </div>

      {/* Kahulugan */}
      <div className="mt-4">
        <div className="bg-[#FDFBEE] p-4 rounded-xl">
          <h2 className="text-center text-lg font-bold">Kahulugan</h2>
          <div className="text-center">{word.kahulugan}</div>
          <div className="text-center">({word.kahuluganTranslation})</div>
        </div>
      </div>

      {/* Pangungusap */}
      <div className="mt-4">
        <div className="bg-[#FDFBEE] p-4 rounded-xl">
          <h2 className="text-center text-lg font-bold">Gamit sa Pangungusap</h2>
          <div className="text-center">{word.pangungusap}</div>
          <div className="text-center">({word.pangungusapTranslation})</div>
        </div>
      </div>
    </div>
  );
}

export default WordOfTheDay;
