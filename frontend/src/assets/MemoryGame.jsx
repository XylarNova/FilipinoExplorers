import { useEffect, useState } from 'react';
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
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [choicesData, setChoicesData] = useState([]);
  const [questionResults, setQuestionResults] = useState(Array(10).fill(null));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({
    tagalogWord: 'Buko',
    correctAnswer: 'Coconut',
  });

  const [duration, setDuration] = useState(10);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const fetchChoices = async () => {
      const dataFromBackend = [
        {
          id: 'choice1',
          text: 'Apple',
          labelTop: 'top-[250px]',
          labelLeft: 'left-[430px]',
          bukoTop: 'top-[180px]',
          bukoLeft: 'left-[430px]',
        },
        {
          id: 'choice2',
          text: 'Banana',
          labelTop: 'top-[250px]',
          labelLeft: 'left-[690px]',
          bukoTop: 'top-[180px]',
          bukoLeft: 'left-[690px]',
        },
        {
          id: 'choice3',
          text: 'Mango',
          labelTop: 'top-[250px]',
          labelLeft: 'left-[940px]',
          bukoTop: 'top-[180px]',
          bukoLeft: 'left-[940px]',
        },
        {
          id: 'choice4',
          text: 'Coconut',
          labelTop: 'top-[440px]',
          labelLeft: 'left-[570px]',
          bukoTop: 'top-[370px]',
          bukoLeft: 'left-[570px]',
        },
        {
          id: 'choice5',
          text: 'Pineapple',
          labelTop: 'top-[440px]',
          labelLeft: 'left-[830px]',
          bukoTop: 'top-[370px]',
          bukoLeft: 'left-[830px]',
        },
      ];
      setChoicesData(dataFromBackend);
    };

    fetchChoices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= duration) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const waterHeight = (elapsed / duration) * 100;

  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
  };

  const handleCheckAnswerClick = () => {
    if (selectedChoice) {
      const isCorrect = selectedChoice.text === currentQuestion.correctAnswer;
      alert(isCorrect ? 'Correct!' : 'Wrong answer');

      const updatedResults = [...questionResults];
      updatedResults[currentQuestionIndex] = isCorrect ? 'correct' : 'wrong';
      setQuestionResults(updatedResults);
    } else {
      alert('Please select a choice.');
    }
  };

  const handleHintClick = () => {
    alert('Hint: The fruit comes from a palm tree!');
  };

  const handleSubmitClick = () => {
    alert('Answer submitted!');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* Logo */}
      <div className="absolute left-[180px] top-[70px]">
        <img src={Logo} alt="Logo" className="w-40 h-auto" draggable={false} />
      </div>

      {/* Instruction */}
      <div className="absolute left-[400px] top-[60px] w-[740px] h-[83px] relative">
        <img src={Instruction} alt="Instruction" className="w-full h-full" draggable={false} />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[25px] font-inter font-bold text-center text-[#71361F] w-[735px]">
            Piliin ang tamang salin ng Tagalog na salita sa Ingles
          </p>
        </div>
      </div>

      {/* Choices Area */}
      <div className="flex justify-center items-center h-full">
        <img
          src={ChoicesBG}
          alt="Choices Background"
          className="absolute left-[400px] top-[160px] w-[740px] h-[500px]"
          draggable={false}
        />

        {choicesData.map((choice) => (
          <div key={choice.id}>
            <img
              src={Buko}
              alt={choice.text}
              className={`absolute ${choice.bukoTop} ${choice.bukoLeft} w-[150px] h-[150px]`}
              draggable={false}
            />
            <div
              className={`absolute ${choice.labelTop} ${choice.labelLeft} w-[165px] h-[50px] cursor-pointer`}
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

        {/* Answer Area */}
        <div className="absolute left-[630px] top-[550px] w-[305px] h-[80px] z-10">
          <img src={Answer} alt="Answer" className="w-full h-full pointer-events-none" draggable={false} />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xl font-bold text-[#71361F]">{currentQuestion.tagalogWord}</p>
          </div>
        </div>

        {/* Buttons */}
        <div>
          <button onClick={() => console.log('Previous')} className="absolute left-[450px] top-[700px] w-[150px] h-[70px]">
            <img src={ButtonPrev} alt="Previous" className="w-full h-full" draggable={false} />
          </button>

          <button onClick={handleCheckAnswerClick} className="absolute left-[680px] top-[700px] w-[200px] h-[70px]">
            <img src={ButtonCheckAnswer} alt="Check Answer" className="w-full h-full" draggable={false} />
          </button>

          <button onClick={() => console.log('Next')} className="absolute left-[950px] top-[700px] w-[150px] h-[70px]">
            <img src={ButtonNext} alt="Next" className="w-full h-full" draggable={false} />
          </button>
        </div>

        {/* Timer / Log Section */}
        <div>
          <img src={Log} alt="Log" className="absolute left-[180px] top-[160px] w-[150px] h-[500px]" draggable={false} />
          <div className="absolute left-[229px] top-[250px] w-[50px] h-[360px] overflow-hidden rounded-[40px]">
            <img src={Timer} alt="Timer" className="absolute inset-0 w-full h-full z-0" draggable={false} />
            <div
              className="absolute bottom-0 left-0 w-full bg-blue-400 z-10 transition-all duration-1000 ease-linear"
              style={{ height: `${waterHeight}%`, opacity: 0.6, borderRadius: '40px' }}
            />
          </div>
        </div>

        {/* Points Section */}
        <div>
          <img src={PointsBG} alt="Points Background" className="absolute left-[1210px] top-[160px] w-[250px] h-[100px]" draggable={false} />
          <img src={Points} alt="Points" className="absolute left-[1235px] top-[185px] w-[200px] h-[50px]" draggable={false} />
        </div>

        {/* Items Section with Results */}
        <div>
          <img src={ItemsBG} alt="Items Background" className="absolute left-[1210px] top-[280px] w-[250px] h-[200px]" draggable={false} />
          {[
            { left: 1220, top: 300 },
            { left: 1281, top: 300 },
            { left: 1346, top: 300 },
            { left: 1410, top: 300 },
            { left: 1220, top: 360 },
            { left: 1281, top: 360 },
            { left: 1346, top: 360 },
            { left: 1410, top: 360 },
            { left: 1220, top: 420 },
            { left: 1281, top: 420 },
          ].map((item, index) => {
            const status = questionResults[index];
            let textColor = 'text-black';

            if (status === 'correct') textColor = 'text-green-600';
            if (status === 'wrong') textColor = 'text-red-600';

            return (
              <div
                key={index}
                className="absolute w-[40px] h-[40px] flex items-center justify-center"
                style={{ left: `${item.left}px`, top: `${item.top}px` }}
              >
                <img src={Items} alt={`Item ${index + 1}`} className="w-full h-full" draggable={false} />
                <span className={`absolute font-inter font-bold text-[25px] ${textColor}`}>{index + 1}</span>
              </div>
            );
          })}
        </div>

        {/* Hint and Submit Buttons */}
        <div>
          <button onClick={handleHintClick} className="absolute left-[1240px] top-[500px] w-[200px] h-[70px]">
            <img src={HintButton} alt="Hint Button" className="w-full h-full" draggable={false} />
          </button>

          <button onClick={handleSubmitClick} className="absolute left-[1240px] top-[580px] w-[200px] h-[70px]">
            <img src={SubmitButton} alt="Submit Button" className="w-full h-full" draggable={false} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MemoryGame;
