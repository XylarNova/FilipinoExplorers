import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Background from './images/Memory Game/Memory Game BG.png';
import Logo from './images/Logo.png';
import Instruction from './images/Memory Game/Instruction.png';
import ChoicesBG from './images/Memory Game/ChoicesBG.png';
import Buko from './images/Memory Game/Buko.png';
import Choices from './images/Memory Game/Choices.png';
import Answer from './images/Memory Game/Answer.png';
import Log from './images/Memory Game/Log.png';
import Timer from './images/Memory Game/Timer.png';
import ButtonPrev from './images/Memory Game/ButtonPrev.png';
import ButtonNext from './images/Memory Game/ButtonNext.png';
import ButtonCheckAnswer from './images/Memory Game/CheckAnswer.png';
import PointsBG from './images/Memory Game/PointsBG.png';
import Points from './images/Memory Game/Points.png';
import ItemsBG from './images/Memory Game/ItemsBG.png';
import Items from './images/Memory Game/Items.png';
import HintButton from './images/Memory Game/HintButton.png';
import SubmitButton from './images/Memory Game/SubmitButton.png';

function MemoryGame() {
  const { sessionId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(10);

  const fetchQuestions = async () => {
    try {
      let res;
      if (sessionId) {
        const sessionRes = await axios.get(`http://localhost:8080/api/session/${sessionId}`);
        res = { data: sessionRes.data.questions };
      } else {
        res = await axios.get('http://localhost:8080/api/questions/get');
      }
      setQuestions(res.data);
      setQuestionResults(new Array(res.data.length).fill(null));
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [sessionId]);

  useEffect(() => {
    if (questions.length === 0) return;

    const current = questions[currentQuestionIndex];
    const qDuration = current.timerInSeconds || 10;

    setDuration(qDuration);
    setElapsed(0);
    setSelectedChoice(null);

    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= qDuration) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, questions]);

  if (questions.length === 0) {
    return <div className="text-center text-2xl mt-20">Loading questions...</div>;
  }

  const current = questions[currentQuestionIndex];
  const choicesData = current.choices.map((text, index) => {
    const positions = [
      { labelTop: 'top-[310px]', labelLeft: 'left-[580px]', bukoTop: 'top-[220px]', bukoLeft: 'left-[580px]' },
      { labelTop: 'top-[310px]', labelLeft: 'left-[860px]', bukoTop: 'top-[220px]', bukoLeft: 'left-[860px]' },
      { labelTop: 'top-[310px]', labelLeft: 'left-[1140px]', bukoTop: 'top-[220px]', bukoLeft: 'left-[1140px]' },
      { labelTop: 'top-[540px]', labelLeft: 'left-[700px]', bukoTop: 'top-[450px]', bukoLeft: 'left-[700px]' },
      { labelTop: 'top-[540px]', labelLeft: 'left-[1000px]', bukoTop: 'top-[450px]', bukoLeft: 'left-[1000px]' },
    ];
    return {
      id: `choice${index + 1}`,
      text,
      ...positions[index],
    };
  });

  const waterHeight = (elapsed / duration) * 100;

  const handleChoiceClick = (choice) => {
    if (questionResults[currentQuestionIndex] !== null) return;
    setSelectedChoice(choice);
  };

  const handleCheckAnswerClick = () => {
    if (!selectedChoice) {
      alert('Please select a choice.');
      return;
    }

    if (questionResults[currentQuestionIndex] !== null) return;

    const isCorrect = selectedChoice.text === current.correctAnswer;
    alert(isCorrect ? 'Correct!' : 'Wrong answer');

    const updatedResults = [...questionResults];
    updatedResults[currentQuestionIndex] = isCorrect ? 'correct' : 'wrong';
    setQuestionResults(updatedResults);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        alert('You have completed all the questions!');
      }
    }, 1000);
  };

  const handleHintClick = () => {
    alert(`Hint: ${current.hint || 'No hint available.'}`);
  };

  const handleSubmitClick = () => {
    alert('Answers submitted!');
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const imagePath = current.imageName ? `/assets/tagalog-words/${current.imageName}` : null;

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${Background})` }}>
      {/* Logo */}
      <div className="absolute left-[250px] top-[70px]">
        <img src={Logo} alt="Logo" className="w-50 h-auto" draggable={false} />
      </div>

      {/* Instruction Banner */}
      <div className="absolute left-[550px] top-[60px] w-[840px] h-[100px] relative">
        <img src={Instruction} alt="Instruction" className="w-full h-full" draggable={false} />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[25px] font-inter font-bold text-center text-[#71361F] w-[735px]">
            Piliin ang tamang salin ng Tagalog na salita sa Ingles
          </p>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex justify-center items-center h-full">
        <img src={ChoicesBG} alt="Choices Background" className="absolute left-[550px] top-[200px] w-[840px] h-[650px]" draggable={false} />
        
        {/* Choices */}
        {choicesData.map((choice) => (
          <div key={choice.id}>
            <img src={Buko} alt={choice.text} className={`absolute ${choice.bukoTop} ${choice.bukoLeft} w-[200px] h-[200px]`} draggable={false} />
            <div
              className={`absolute ${choice.labelTop} ${choice.labelLeft} w-[215px] h-[70px] cursor-pointer`}
              onClick={() => handleChoiceClick(choice)}
            >
              <img
                src={Choices}
                alt={`Choice ${choice.id}`}
                className={`w-full h-full ${selectedChoice?.id === choice.id ? 'opacity-60' : ''}`}
                draggable={false}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-inter font-bold text-black text-[30px]">{choice.text}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Word / Answer Area */}
        <div className="absolute left-[825px] top-[710px] w-[305px] h-[80px] z-10">
          <img src={Answer} alt="Answer" className="w-full h-full pointer-events-none" draggable={false} />
          <div className="absolute inset-0 flex items-center justify-center">
            {imagePath ? (
              <img src={imagePath} alt={current.tagalogWord} className="h-[60px] object-contain" />
            ) : (
              <p className="text-xl font-bold text-[#71361F]">{current.tagalogWord}</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div>
          <button onClick={handlePrev} className="absolute left-[600px] top-[860px] w-[200px] h-[80px]">
            <img src={ButtonPrev} alt="Previous" className="w-full h-full" draggable={false} />
          </button>
          <button onClick={handleCheckAnswerClick} className="absolute left-[850px] top-[860px] w-[250px] h-[80px]">
            <img src={ButtonCheckAnswer} alt="Check Answer" className="w-full h-full" draggable={false} />
          </button>
          <button onClick={handleNext} className="absolute left-[1120px] top-[860px] w-[200px] h-[80px]">
            <img src={ButtonNext} alt="Next" className="w-full h-full" draggable={false} />
          </button>
        </div>

        {/* Timer */}
        <div>
          <img src={Log} alt="Log" className="absolute left-[280px] top-[220px] w-[150px] h-[600px]" draggable={false} />
          <div className="absolute left-[329px] top-[310px] w-[50px] h-[460px] overflow-hidden rounded-[40px]">
            <img src={Timer} alt="Timer" className="absolute inset-0 w-full h-full z-0" draggable={false} />
            <div
              className="absolute bottom-0 left-0 w-full bg-blue-400 z-10 transition-all duration-1000 ease-linear"
              style={{ height: `${waterHeight}%`, opacity: 0.6, borderRadius: '40px' }}
            />
          </div>
        </div>

        {/* Points and Items */}
        <div className="absolute left-[1500px] top-[200px] w-[300px] h-[110px]">
          <img src={PointsBG} alt="Points Background" className="w-full h-full" draggable={false} />
          <img src={Points} alt="Points" className="absolute top-[30px] left-1/2 transform -translate-x-1/2 w-[200px] h-[50px]" draggable={false} />
        </div>

        <div>
          <img src={ItemsBG} alt="Items Background" className="absolute left-[1500px] top-[350px] w-[300px] h-[300px]" draggable={false} />
          {questionResults.map((status, index) => {
            const coords = [
              { left: 1520, top: 370 },
              { left: 1581, top: 370 },
              { left: 1646, top: 370 },
              { left: 1710, top: 370 },
              { left: 1520, top: 430 },
              { left: 1581, top: 430 },
              { left: 1646, top: 430 },
              { left: 1710, top: 430 },
              { left: 1520, top: 490 },
              { left: 1581, top: 490 },
            ][index];

            let color = 'text-black';
            if (status === 'correct') color = 'text-green-600';
            if (status === 'wrong') color = 'text-red-600';

            return (
              <div
                key={index}
                className="absolute w-[40px] h-[40px] flex items-center justify-center"
                style={{ left: `${coords.left}px`, top: `${coords.top}px` }}
              >
                <img src={Items} alt={`Item ${index + 1}`} className="w-full h-full" draggable={false} />
                <span className={`absolute font-inter font-bold text-[25px] ${color}`}>{index + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Hint and Submit Buttons */}
        <div>
          <button onClick={handleHintClick} className="absolute left-[1540px] top-[680px] w-[200px] h-[70px]">
            <img src={HintButton} alt="Hint Button" className="w-full h-full" draggable={false} />
          </button>
          <button onClick={handleSubmitClick} className="absolute left-[1540px] top-[740px] w-[200px] h-[70px]">
            <img src={SubmitButton} alt="Submit Button" className="w-full h-full" draggable={false} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoryGame;
