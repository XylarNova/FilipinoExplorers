import { useEffect, useState } from 'react';
import Background from './images/Memory Game/Memory Game BG.png';
import Clouds from './images/Memory Game/Clouds.png';
import ChoicesBG from './images/Memory Game/ChoicesBG1.png';
import Buko from './images/Memory Game/Buko.png';
import Choices from './images/Memory Game/Choices.png';
import Word from './images/Memory Game/Answer.png';
import Student1 from './images/Memory Game/Student1.png';
import Student2 from './images/Memory Game/Student2.png';
import Student3 from './images/Memory Game/Student3.png';
import Student4 from './images/Memory Game/Student4.png';

export default function MemoryGameGroup() {
  const TOTAL_TIME = 60; // total time in seconds
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const fillPercentage = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  // Positions for each Buko/Choices group
  const positions = [
    { left: 290 },
    { left: 490 },
    { left: 690 },
    { left: 890 },
    { left: 1090 },
  ];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* Water-style visual timer bar */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20 w-[900px] h-6 rounded-[15px] border border-[#06D7A0] bg-transparent overflow-hidden">
        <div
          className="h-full rounded-[15px]"
          style={{
            width: `${fillPercentage}%`,
            backgroundColor: '#06D7A0',
            transition: 'width 1s linear',
          }}
        ></div>
      </div>

      {/* Clouds */}
      <img
        src={Clouds}
        alt="Clouds"
        draggable={false}
        className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[1000px] z-10"
      />

      {/* ChoicesBG below clouds */}
      <img
        src={ChoicesBG}
        alt="Choices Background"
        draggable={false}
        className="absolute top-[209px] left-1/2 transform -translate-x-1/2 w-[1000px] z-10"
      />

      {/* Render Buko and Choices pairs */}
      {positions.map(({ left }, index) => (
        <div key={index}>
          <img
            src={Buko}
            alt="Buko"
            draggable={false}
            className="absolute top-[217px] z-20"
            style={{ left: `${left}px`, width: '150px' }}
          />
          <img
            src={Choices}
            alt="Choices"
            draggable={false}
            className="absolute top-[280px] z-20"
            style={{ left: `${left}px`, width: '160px' }}
          />
        </div>
      ))}

      <img
        src={Word}
        alt="Word"
        draggable={false}
        className="absolute z-20"
        style={{ top: '430px', left: '50%', transform: 'translateX(-50%)', width: '300px' }}
      />

      <img
        src={Student1}
        alt="Student 1"
        draggable={false}
        className="absolute z-20"
        style={{ top: '600px', left: '25%', transform: 'translateX(-50%)', width: '180px' }}
      />

      <img
        src={Student2}
        alt="Student 2"
        draggable={false}
        className="absolute z-20"
        style={{ top: '600px', left: '42%', transform: 'translateX(-50%)', width: '180px' }}
      />

     <img
        src={Student3}
        alt="Student 3"
        draggable={false}
        className="absolute z-20"
        style={{ top: '600px', left: '59%', transform: 'translateX(-50%)', width: '180px' }}
      />

     <img
        src={Student4}
        alt="Student 4"
        draggable={false}
        className="absolute z-20"
        style={{ top: '600px', left: '75%', transform: 'translateX(-50%)', width: '180px' }}
      />
    </div>
  );
}
