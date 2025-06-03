import React, { useState } from 'react';
import Background from '../assets/images/Paaralan Quest/Paaralan Quest BG.png';
import Logo from '../assets/images/Logo.png';
import StickImage from '../assets/images/Buttons and Other/Timer Log.png';
import LeftArrow from '../assets/images/Buttons and Other/button prev.png';
import RightArrow from '../assets/images/Buttons and Other/button next.png';

console.log("✅ PaaralanQuest component is rendering.");

const popoverStyle = {
  animation: 'fadeIn 0.3s ease',
  backgroundColor: '#fff8e1',
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '10px 15px',
  position: 'relative',
  marginTop: '10px',
  color: '#333',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%',
};

const iconStyle = {
  display: 'inline-block',
  marginRight: '8px',
  fontSize: '20px',
};

const storyData = [
  {
    story: "Si Juan ay isang masipag na estudyante na laging tumutulong sa kanyang mga kaklase.",
    question: "Ano ang ipinapakita ni Juan sa kanyang mga kaklase?",
    choices: ["Katamaran", "Kasipagan", "Kawalang-galang", "Pag-aalinlangan"],
    correctAnswer: 1,
    hint: "Si Juan ay hindi tamad at palaging tumutulong."
  },
  {
    story: "Isang araw, nagtanim ng buto ng mangga si Ana at araw-araw niya itong dinilig.",
    question: "Ano ang aral sa kwento ni Ana?",
    choices: ["Ang prutas ay masarap", "Ang tubig ay mahalaga", "Ang tiyaga ay may magandang bunga", "Ang araw ay mainit"],
    correctAnswer: 2,
    hint: "Araw-araw niyang dinilig ang kanyang tanim."
  },
  {
    story: "Tuwing hapon, tinutulungan ni Marco ang kanyang lola sa pagtitinda ng gulay sa palengke.",
    question: "Ano ang ipinapakita ni Marco sa kanyang lola?",
    choices: ["Pagiging makasarili", "Pagmamalaki", "Paggalang at pagtulong", "Pag-aaksaya ng oras"],
    correctAnswer: 2,
    hint: "Tumutulong si Marco sa kanyang lola araw-araw."
  },
  {
    story: "Masayang naglaro si Liza at ang kanyang mga kaibigan sa parke pagkatapos ng klase.",
    question: "Ano ang ginagawa ni Liza pagkatapos ng klase?",
    choices: ["Nag-aaral", "Nagpapahinga", "Naglalaba", "Naglaro sa parke"],
    correctAnswer: 3,
    hint: "Ginawa ito ni Liza kasama ang kanyang mga kaibigan sa parke."
  },
  {
    story: "Si Mang Tonyo ay palaging naglilinis ng kanyang bakuran tuwing umaga.",
    question: "Ano ang ugali ni Mang Tonyo batay sa kwento?",
    choices: ["Tamad", "Malinis at masinop", "Makalat", "Pasaway"],
    correctAnswer: 1,
    hint: "Araw-araw siyang naglilinis sa bakuran."
  },
  {
    story: "Nagbigay ng pagkain si Carla sa batang lansangan nang makita niya ito sa daan.",
    question: "Anong katangian ni Carla ang ipinakita sa kwento?",
    choices: ["Pagkainggitin", "Madamot", "Mapagbigay", "Palaaway"],
    correctAnswer: 2,
    hint: "Nagbigay si Carla ng pagkain."
  },
  {
    story: "Laging pinupuri ng kanyang guro si Ben dahil sa maayos niyang pagsusulat.",
    question: "Bakit pinupuri si Ben ng kanyang guro?",
    choices: ["Magaling siyang sumayaw", "Maayos siyang magsulat", "Mahusay siyang umawit", "Magaling siyang magbasa"],
    correctAnswer: 1,
    hint: "Ang guro niya ay humanga sa paraan ng kanyang pagsusulat."
  },
  {
    story: "Naglakad si Noel ng isang kilometro upang makarating sa paaralan kahit umuulan.",
    question: "Anong katangian ang ipinakita ni Noel?",
    choices: ["Katamaran", "Katapatan", "Kasipagan at tiyaga", "Kabastusan"],
    correctAnswer: 2,
    hint: "Naglakad siya kahit na umuulan."
  },
  {
    story: "Tuwing Sabado, nagsisimba ang pamilya Reyes bilang pasasalamat.",
    question: "Ano ang ginagawa ng pamilya Reyes tuwing Sabado?",
    choices: ["Namamasyal", "Nagsisimba", "Naglalaro", "Namimili"],
    correctAnswer: 1,
    hint: "Ginagawa nila ito bilang pasasalamat."
  },
  {
    story: "Pinagbigyan ni Aling Rosa ang hiling ng kanyang anak na bumili ng libro.",
    question: "Ano ang hiningi ng anak ni Aling Rosa?",
    choices: ["Laruan", "Damit", "Sapatos", "Libro"],
    correctAnswer: 3,
    hint: "Gamit ito sa pag-aaral at binili sa halip na laruan o damit."
  },
  {
    story: "Si Dan ay hindi nanood ng TV at sa halip ay nag-aral para sa pagsusulit.",
    question: "Ano ang ginawa ni Dan sa halip na manood ng TV?",
    choices: ["Nagluto", "Natulog", "Nag-aral", "Naglaro"],
    correctAnswer: 2,
    hint: "Inuna niya ang pagsusulit kaysa sa TV."
  },
  {
    story: "Tinulungan ni May si Lisa sa paggawa ng takdang-aralin sa Filipino.",
    question: "Anong asignatura ang tinulungan ni May kay Lisa?",
    choices: ["Matematika", "Agham", "Filipino", "Araling Panlipunan"],
    correctAnswer: 2,
    hint: "Takdang-aralin ito sa wikang pambansa."
  },
  {
    story: "Naglinis ng silid-aralan ang mga mag-aaral bago umuwi.",
    question: "Ano ang ginawa ng mga mag-aaral bago umuwi?",
    choices: ["Naglaro", "Naglinis ng silid-aralan", "Nag-quiz", "Nag-sine"],
    correctAnswer: 1,
    hint: "Isinagawa nila ito para maging maayos ang klasrum."
  },
  {
    story: "Tumulong si Karen sa mga batang walang dalang lapis sa klase.",
    question: "Ano ang tulong na ginawa ni Karen?",
    choices: ["Nagbahagi ng lapis", "Nagpahiram ng libro", "Naglinis ng klasrum", "Nagbigay ng pera"],
    correctAnswer: 0,
    hint: "Walang dalang gamit sa pagsusulat ang mga bata."
  },
  {
    story: "Pinatawad ni Andrea ang kanyang kaibigan matapos silang mag-away.",
    question: "Ano ang ginawa ni Andrea sa kanyang kaibigan?",
    choices: ["Pinagalitan", "Pinalayas", "Pinatawad", "Pinagsabihan"],
    correctAnswer: 2,
    hint: "Naging magkaibigan ulit sila matapos ang alitan."
  }
];

const PaaralanQuest = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(Array(storyData.length).fill(false));

  const current = storyData[currentIndex];

  const handleNext = () => {
    if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setFeedback("");
      setUsedHint(false);
      setShowHint(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedChoice(null);
      setFeedback("");
      setUsedHint(false);
      setShowHint(false);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedChoice === null) {
      setFeedback("Please select an answer.");
      return;
    }

    if (!answeredQuestions[currentIndex]) {
      if (selectedChoice === current.correctAnswer) {
        setScore((prev) => prev + (usedHint ? 1 : 2));
        setFeedback("CORRECT ANSWER");
      } else {
        setFeedback("WRONG ANSWER");
      }

      const updatedAnswers = [...answeredQuestions];
      updatedAnswers[currentIndex] = true;
      setAnsweredQuestions(updatedAnswers);
    } else {
      setFeedback("You already answered this question.");
    }
  };

  const handleHint = () => {
    if (!usedHint) {
      setUsedHint(true);
      setShowHint(true);
    }
  };

  return (
    <div
      className="bg-cover min-h-screen pt-24 px-8 flex flex-col items-center gap-6"
      style={{ backgroundImage: `url(${Background})` }}
    >
      {/* Logo */}
      <img src={Logo} alt="Logo" className="absolute top-5 left-8 w-40" />
  
      {/* Timer Panel */}
      <div className="absolute top-[180px] left-10 mt-45">
        <div className="relative w-40 h-40">
          <img
            src={StickImage}
            alt="Timer"
            className="w-full h-full object-contain rotate-90"
          />
          <div className="absolute top-[24%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-12 h-80 bg-green-200 rounded-full" />
        </div>
      </div>
  
      {/* Main Content Wrapper */}
      <div className="flex flex-row gap-5 w-full max-w-[1300px] pl-40">
        {/* Left Side: Story */}
        <div className="flex-1 flex border-8 border-[#71361F] bg-[#f5e5c0] h-[570px]">
          {/* Story */}
          <div className="flex-1 pr-5 bg-[#F4D2A3]">
            <div className="p-4 rounded-lg h-full overflow-y-auto text-justify">
              {current.story}
            </div>
          </div>
  
          {/* Divider */}
          <div className="w-2 bg-[#71361F]" />
  
          {/* Question & Choices */}
          <div className="flex-1 pl-5 p-4 bg-[#F4D2A3] flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-lg mb-3">{current.question}</h2>
  
              {showHint && (
                <div className="animate-fadeIn bg-[#fff8e1] border border-gray-300 rounded-lg p-3 mb-3 text-gray-800 shadow-md">
                  <span className="inline-block mr-2 text-xl">📘</span>
                  {current.hint}
                </div>
              )}
  
              {current.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedChoice(index)}
                  className={`mb-2 p-2 rounded-lg border-2 border-gray-300 cursor-pointer w-full text-left transition ${
                    selectedChoice === index ? "bg-green-100" : "bg-white"
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </div>
  
        {/* Side Panel */}
        <div className="w-[220px] flex flex-col justify-between mr-[-60px]">
          {/* Feedback & Score */}
          <div 
            className={`p-5 rounded-lg border-4 text-center font-bold ${
              feedback === "CORRECT ANSWER"
                ? "border-[#8B4513] bg-[#f5e5c0] text-green-500"
                : feedback === "WRONG ANSWER"
                ? "border-[#8B4513] bg-[#f5e5c0] text-red-500"
                : "border-[#8B4513] bg-[#f5e5c0] text-gray-800"
            }`}
          >
            Score: {score}
            <br />
            {feedback}
          </div>
  
          {/* Question Dots */}
          <div className="bg-[#8B4513] p-5 rounded-lg flex flex-wrap gap-2 justify-center">
            {storyData.map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full font-bold flex justify-center items-center ${
                  i === currentIndex ? "bg-yellow-400" : "bg-[#f5e5c0]"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
  
          {/* Hint Button */}
          <button
            onClick={handleHint}
            disabled={usedHint}
            className={`px-5 py-2 rounded-full font-bold text-white ${
              usedHint
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }`}
          >
            HINT
          </button>
        </div>
      </div>
  
      {/* Navigation Buttons */}
      <div className="flex justify-center items-center gap-10 mt-4">
        <img
          src={LeftArrow}
          alt="Previous"
          onClick={handlePrev}
          className={`w-14 h-14 ${
            currentIndex > 0
              ? "cursor-pointer opacity-100"
              : "cursor-not-allowed opacity-50"
          }`}
        />
        <button
          onClick={handleCheckAnswer}
          className="px-6 py-3 rounded-lg bg-yellow-400 border-2 border-yellow-600 text-white font-bold hover:bg-yellow-500 transition"
        >
          CHECK ANSWER
        </button>
        <img
          src={RightArrow}
          alt="Next"
          onClick={handleNext}
          className={`w-14 h-14 ${
            currentIndex < storyData.length - 1
              ? "cursor-pointer opacity-100"
              : "cursor-not-allowed opacity-50"
          }`}
        />
      </div>
    </div>
  );  
};

export default PaaralanQuest;