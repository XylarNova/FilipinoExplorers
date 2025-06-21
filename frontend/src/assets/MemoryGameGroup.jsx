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
  const TOTAL_TIME = 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentProgress, setStudentProgress] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/questions/get');
        const data = await res.json();
        setQuestions(data || []);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };

    fetchQuestions();

    // Mock student progress for now (4 students)
    setStudentProgress([
      { student: { id: 1 }, isCorrect: null },
      { student: { id: 2 }, isCorrect: null },
      { student: { id: 3 }, isCorrect: null },
      { student: { id: 4 }, isCorrect: null },
    ]);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const fillPercentage = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

  const handleStudentChoice = (studentId, choiceText) => {
    if (studentAnswers[studentId]) return;

    const updatedAnswers = { ...studentAnswers, [studentId]: choiceText };
    setStudentAnswers(updatedAnswers);

    if (Object.keys(updatedAnswers).length === studentProgress.length) {
      const current = questions[currentQuestionIndex];
      const updatedProgress = studentProgress.map((progress) => {
        const selected = updatedAnswers[progress.student.id];
        return {
          ...progress,
          isCorrect: selected === current.correctAnswer,
        };
      });

      setTimeout(() => {
        setStudentProgress(updatedProgress);
        setStudentAnswers({});
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTimeLeft(TOTAL_TIME); // reset timer per question if needed
        } else {
          alert('Game complete!');
        }
      }, 1000);
    }
  };

  const current = questions[currentQuestionIndex];
  const choicePositions = [290, 490, 690, 890, 1090];
  const studentImages = [Student1, Student2, Student3, Student4];
  const leftPositions = ['25%', '42%', '59%', '75%'];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* Timer Bar */}
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

      <img
        src={Clouds}
        alt="Clouds"
        draggable={false}
        className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[1000px] z-10"
      />

      <img
        src={ChoicesBG}
        alt="Choices Background"
        draggable={false}
        className="absolute top-[209px] left-1/2 transform -translate-x-1/2 w-[1000px] z-10"
      />

      {/* Choice Items */}
      {current?.choices.map((choiceText, index) => (
        <div key={index}>
          <img
            src={Buko}
            alt="Buko"
            draggable={false}
            className="absolute top-[217px] z-20"
            style={{ left: `${choicePositions[index]}px`, width: '150px' }}
          />
          <div
            onClick={() =>
              studentProgress.forEach((progress) =>
                handleStudentChoice(progress.student.id, choiceText)
              )
            }
            className="absolute top-[280px] z-20 cursor-pointer w-[160px] h-[70px] flex items-center justify-center"
            style={{ left: `${choicePositions[index]}px` }}
          >
            <img
              src={Choices}
              alt="Choice"
              className="absolute w-full h-full"
              draggable={false}
            />
            <span className="text-[25px] font-inter font-bold text-black text-center z-10">
              {choiceText}
            </span>
          </div>
        </div>
      ))}

      {/* Tagalog Word */}
      <div
        className="absolute z-20 flex items-center justify-center"
        style={{ top: '430px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '80px' }}
      >
        <img src={Word} alt="Word Container" className="absolute z-10 w-full h-full" draggable={false} />
        {current && (
          <div className="z-20 text-center">
            <p className="text-[25px] font-inter font-bold text-[#71361F] text-center">{current.tagalogWord}</p>
          </div>
        )}
      </div>

      {/* Student Avatars */}
      {studentProgress.map((progress, idx) => (
        <img
          key={progress.student.id}
          src={studentImages[idx]}
          alt={`Student ${idx + 1}`}
          draggable={false}
          className={`absolute z-20 ${progress.isCorrect ? 'grayscale-0' : 'grayscale'}`}
          style={{
            top: '600px',
            left: leftPositions[idx],
            transform: 'translateX(-50%)',
            width: '180px',
            border: progress.isCorrect ? '4px solid limegreen' : '4px solid red',
            borderRadius: '9999px',
          }}
        />
      ))}
    </div>
  );
}
