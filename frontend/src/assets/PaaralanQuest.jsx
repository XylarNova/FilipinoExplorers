import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

// Replace this with all your 45+ entries
const fullStoryData = [
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
  },
  {
    story: "Habang nasa pila, mahinahong naghintay si Paolo ng kanyang turn sa kantina.",
    question: "Anong ugali ni Paolo ang ipinakita niya sa kwento?",
    choices: ["Pagmamadali", "Pagiging magulo", "Pagtitimpi at disiplina", "Pagkainggitin"],
    correctAnswer: 2,
    hint: "Hindi siya sumingit at mahinahong naghintay."
  },
  {
    story: "Nagdasal si Mia bago magsimula ang kanyang pagsusulit sa paaralan.",
    question: "Ano ang ginawa ni Mia bago ang pagsusulit?",
    choices: ["Naglaro", "Nagdasal", "Uminom ng tubig", "Nagbasa ng libro"],
    correctAnswer: 1,
    hint: "Humingi siya ng gabay sa Diyos."
  },
  {
    story: "Isinauli ni Rico ang wallet na kanyang napulot sa daan.",
    question: "Anong katangian ni Rico ang ipinakita niya?",
    choices: ["Katapatan", "Pagiging pabaya", "Pagka-makasarili", "Pagiging matatakutin"],
    correctAnswer: 0,
    hint: "Hindi niya inangkin ang napulot niya."
  },
  {
    story: "Ginising ni Lian ang kanyang kapatid upang hindi ito mahuli sa klase.",
    question: "Ano ang ipinakita ni Lian sa kanyang kapatid?",
    choices: ["Pagka-inis", "Pagmamahal at malasakit", "Pagka-tamad", "Pagkabagot"],
    correctAnswer: 1,
    hint: "Ginising niya ito upang makatulong."
  },
  {
    story: "Mas pinili ni Ella na magtapon ng basura sa tamang lalagyan kahit walang nakatingin.",
    question: "Anong ugali ang ipinakita ni Ella?",
    choices: ["Pagka-ipokrito", "Pagka-bastos", "Pagiging responsable", "Pagiging pabaya"],
    correctAnswer: 2,
    hint: "Ginawa niya ang tama kahit walang nakakakita."
  },
  {
    story: "Nakita ni Julia na nahulog ang libro ng kanyang kaklase at agad niya itong pinulot.",
    question: "Anong ginawa ni Julia nang may mahulog na libro?",
    choices: ["Tinapakan ito", "Tiningnan lang", "Pinulot at ibinalik", "Iniwan sa sahig"],
    correctAnswer: 2,
    hint: "Tumulong si Julia sa kaklase nang hindi hinihingi."
  },
  {
    story: "Tuwing gabi, inaayos ni Mark ang kanyang gamit para sa susunod na araw ng klase.",
    question: "Ano ang ginagawa ni Mark tuwing gabi?",
    choices: ["Naglalaba", "Inaayos ang gamit", "Nanonood ng TV", "Naglalaro ng cellphone"],
    correctAnswer: 1,
    hint: "Inihahanda niya ang sarili para sa klase."
  },
  {
    story: "Nag-abot ng tubig si Leo sa kanyang amang pagod mula sa trabaho.",
    question: "Ano ang ginawa ni Leo sa kanyang ama?",
    choices: ["Niyaya maglaro", "Binigyan ng tubig", "Hinayaan lang", "Inasar"],
    correctAnswer: 1,
    hint: "Inalagaan niya ang ama sa simpleng paraan."
  },
  {
    story: "Pinahiram ni Joy ng papel ang kanyang kaklaseng walang dalang gamit.",
    question: "Ano ang ibinigay ni Joy sa kanyang kaklase?",
    choices: ["Lapis", "Libro", "Papel", "Bag"],
    correctAnswer: 2,
    hint: "Ang kaklase ay walang dalang gamit pang-sulat."
  },
  {
    story: "Tumulong si Enzo sa matandang tumatawid sa kalsada.",
    question: "Sino ang tinulungan ni Enzo?",
    choices: ["Bata", "Guro", "Kaibigan", "Matanda"],
    correctAnswer: 3,
    hint: "Isang matanda ang tinulungan niya sa pagtawid."
  },
  {
    story: "Nagboluntaryo si Nina na magwalis ng paligid ng paaralan pagkatapos ng klase.",
    question: "Ano ang ginawa ni Nina pagkatapos ng klase?",
    choices: ["Umuwi agad", "Naglaro", "Nagwalis ng paligid", "Nanonood ng TV"],
    correctAnswer: 2,
    hint: "Ginawa niya ito bilang boluntaryong tulong sa paaralan."
  },
  {
    story: "Nagbigay si Tomas ng donasyong laruan para sa mga batang nasalanta ng bagyo.",
    question: "Kanino nagbigay ng laruan si Tomas?",
    choices: ["Kaklase", "Sarili", "Bata sa lansangan", "Mga batang nasalanta ng bagyo"],
    correctAnswer: 3,
    hint: "Ito ay para sa mga batang apektado ng sakuna."
  },
  {
    story: "Maagang gumising si Carla upang tumulong sa paghahanda ng agahan.",
    question: "Ano ang ginawa ni Carla ng maaga?",
    choices: ["Natutulog pa", "Nanonood ng TV", "Tumulong sa agahan", "Naglaro"],
    correctAnswer: 2,
    hint: "Siya ay tumulong sa bahay sa umaga."
  },
  {
    story: "Inakay ni Miguel ang kanyang lolo habang tumatawid sa kalsada.",
    question: "Sino ang tinulungan ni Miguel?",
    choices: ["Kaklase", "Nanay", "Kaibigan", "Lolo"],
    correctAnswer: 3,
    hint: "Tinulungan niya ang kanyang matandang kamag-anak."
  },
  {
    story: "Nagdala si Rina ng dagdag na lapis upang ipahiram sa mga kaklaseng walang gamit.",
    question: "Bakit nagdala ng dagdag na lapis si Rina?",
    choices: ["Upang magbenta", "Upang magpahiram", "Upang ipamigay", "Upang iguhit"],
    correctAnswer: 1,
    hint: "May kaklase siyang walang gamit."
  },
  {
    story: "Isinulat ni Lito ang kanyang takdang-aralin sa malinis at maayos na papel.",
    question: "Paano isinulat ni Lito ang kanyang takdang-aralin?",
    choices: ["Sa malinis at maayos na papel", "Sa punit na papel", "Sa likod ng libro", "Hindi niya isinulat"],
    correctAnswer: 0,
    hint: "Maayos siyang gumawa ng takdang-aralin."
  },
  {
    story: "Pinahiram ni Toni ang kanyang payong sa kaklaseng walang dalang panangga sa ulan.",
    question: "Anong bagay ang pinahiram ni Toni?",
    choices: ["Bag", "Payong", "Cellphone", "Jacket"],
    correctAnswer: 1,
    hint: "Panangga ito sa ulan."
  },
  {
    story: "Sumali si James sa tree planting activity ng kanilang barangay.",
    question: "Anong aktibidad ang sinalihan ni James?",
    choices: ["Pagdiriwang", "Sayawan", "Tree planting", "Basura clean-up"],
    correctAnswer: 2,
    hint: "Ito ay tumutulong sa kalikasan."
  },
  {
    story: "Nagbigay ng simpleng regalo si Ivy sa kanyang guro sa Araw ng mga Guro.",
    question: "Kailan nagbigay ng regalo si Ivy?",
    choices: ["Pasko", "Bagong Taon", "Araw ng mga Guro", "Buwan ng Wika"],
    correctAnswer: 2,
    hint: "Ito ay espesyal para sa kanyang guro."
  },
  {
    story: "Tumulong si Bryan sa paglalagay ng dekorasyon sa silid-aralan.",
    question: "Anong ginawa ni Bryan sa silid-aralan?",
    choices: ["Sinira ito", "Nilinisan ito", "Dinagdagan ng dekorasyon", "Tinulugan"],
    correctAnswer: 2,
    hint: "Ginawa ito upang mas gumanda ang klasrum."
  },
  {
    story: "Naglakad si Liza papuntang paaralan upang hindi mahuli sa klase.",
    question: "Bakit naglakad si Liza sa paaralan?",
    choices: ["Para mamasyal", "Para hindi mahuli", "Para maglaro", "Para bumili ng pagkain"],
    correctAnswer: 1,
    hint: "Ayaw niyang mahuli sa klase."
  },
  {
    story: "Ipinagtanggol ni Rob ang kanyang kaklase na inaapi ng iba.",
    question: "Ano ang ginawa ni Rob?",
    choices: ["Nanood lang", "Tumawa", "Umalis", "Ipinagtanggol ang inaapi"],
    correctAnswer: 3,
    hint: "Nagpakita siya ng tapang at pagkakaibigan."
  },
  {
    story: "Tinulungan ni Sofia ang kanyang nanay sa paglalaba tuwing Linggo.",
    question: "Anong ginagawa ni Sofia tuwing Linggo?",
    choices: ["Naglalaro", "Naglalaba", "Nag-aaral", "Natutulog"],
    correctAnswer: 1,
    hint: "Tumulong siya sa gawaing bahay."
  },
  {
    story: "Nagpaalala si Emma sa kaklase tungkol sa darating na pagsusulit.",
    question: "Ano ang ipinapaalala ni Emma?",
    choices: ["Buwan ng Wika", "Piyesta", "Pagsusulit", "Holiday"],
    correctAnswer: 2,
    hint: "Tinutulungan niya ang kaklase na makapaghanda."
  },
  {
    story: "Sumulat si Andrei ng liham ng pasasalamat sa kanyang guro.",
    question: "Kanino sumulat si Andrei?",
    choices: ["Kaklase", "Nanay", "Guro", "Kaibigan"],
    correctAnswer: 2,
    hint: "Isinulat ito bilang pasasalamat sa taong nagtuturo sa kanya."
  },
  {
    story: "Nagbigay ng upuan si Kent sa matandang babae sa bus.",
    question: "Ano ang ginawa ni Kent sa bus?",
    choices: ["Uminom ng tubig", "Nagbasa ng libro", "Nagbigay ng upuan", "Nakatulog"],
    correctAnswer: 2,
    hint: "Isinuko niya ang kanyang upuan bilang paggalang."
  },
  {
    story: "Tuwing recess, ibinabahagi ni Lara ang kanyang baon sa kanyang kaibigan.",
    question: "Kanino ibinabahagi ni Lara ang kanyang baon?",
    choices: ["Sa guro", "Sa kapatid", "Sa kaibigan", "Sa janitor"],
    correctAnswer: 2,
    hint: "Isang kilos ng pagiging mapagbigay sa kaibigan."
  },
  {
    story: "Sumunod si Alvin sa patakaran ng paaralan na bawal magkalat.",
    question: "Ano ang ginawa ni Alvin sa patakaran ng paaralan?",
    choices: ["Hindi sumunod", "Sinunod", "Ipinagwalang-bahala", "Pinagtawanan"],
    correctAnswer: 1,
    hint: "Ipinakita niya ang pagiging disiplinado."
  },
  {
    story: "Tinulungan ni Bea ang kanyang kapatid sa paggawa ng proyekto sa agham.",
    question: "Saan tinulungan ni Bea ang kanyang kapatid?",
    choices: ["Sa matematika", "Sa agham", "Sa Filipino", "Sa araling panlipunan"],
    correctAnswer: 1,
    hint: "Ito ay isang proyekto tungkol sa siyensya."
  },
  {
    story: "Naglagay ng basurahan si Teacher Anna sa likod ng silid upang hikayatin ang mga bata na huwag magkalat.",
    question: "Bakit naglagay ng basurahan si Teacher Anna?",
    choices: ["Para itago", "Para iwasan", "Para magkalat", "Para hikayatin ang kaayusan"],
    correctAnswer: 3,
    hint: "Layunin niyang turuan ang mga bata ng kalinisan."
  }
];

const PaaralanQuest = () => {
  const [studentName, setStudentName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [storyData, setStoryData] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [answerResults, setAnswerResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);

  const current = storyData.length > 0 ? storyData[currentIndex] : null;

  useEffect(() => {
    const shuffled = [...fullStoryData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 15);
    setStoryData(selected);
  }, []);

  useEffect(() => {
    if (storyData.length > 0) {
      setAnsweredQuestions(Array(storyData.length).fill(false));
      setAnswerResults(Array(storyData.length).fill(null));
    }
  }, [storyData]);

  useEffect(() => {
    if (answeredQuestions.length && answeredQuestions.every(q => q)) {
      setSessionFinished(true);
    }
  }, [answeredQuestions]);

  useEffect(() => {
    if (sessionFinished) {
      axios.post("http://localhost:8080/api/paaralan-quest/score/submit", {
        studentName,
        totalScore: score
      })
      .then(() => console.log("✅ Score and name submitted successfully."))
      .catch(err => console.error("❌ Failed to submit score:", err));
    }
  }, [sessionFinished]);

  useEffect(() => {
    if (!timerActive || sessionFinished || answeredQuestions[currentIndex]) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setFeedback("You ran out of time");
          const updatedAnswers = [...answeredQuestions];
          updatedAnswers[currentIndex] = true;
          setAnsweredQuestions(updatedAnswers);
          const updatedResults = [...answerResults];
          updatedResults[currentIndex] = "wrong";
          setAnswerResults(updatedResults);

          setTimeout(() => {
            if (currentIndex < storyData.length - 1) {
              handleNext();
            } else {
              setSessionFinished(true);
            }
          }, 1500);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, currentIndex, answeredQuestions, sessionFinished, answerResults, storyData.length]);

  const handleNext = () => {
    if (currentIndex < storyData.length - 1) {
      setCurrentIndex(ci => ci + 1);
      setSelectedChoice(null);
      setFeedback("");
      setUsedHint(false);
      setShowHint(false);
      setTimeLeft(10);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(ci => ci - 1);
      setSelectedChoice(null);
      setFeedback("");
      setUsedHint(false);
      setShowHint(false);
      setTimeLeft(10);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedChoice === null) {
      setFeedback("Please select an answer.");
      return;
    }
    if (!answeredQuestions[currentIndex]) {
      const isCorrect = selectedChoice === current.correctAnswer;
      setScore(s => s + (isCorrect ? (usedHint ? 1 : 2) : 0));
      setFeedback(isCorrect ? "CORRECT ANSWER" : "WRONG ANSWER");
      const updatedAnswers = [...answeredQuestions];
      updatedAnswers[currentIndex] = true;
      setAnsweredQuestions(updatedAnswers);
      const updatedResults = [...answerResults];
      updatedResults[currentIndex] = isCorrect ? "correct" : "wrong";
      setAnswerResults(updatedResults);
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

  if (!studentName) {
    return (
      <div style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.2)', textAlign: 'center' }}>
          <h2>Welcome to Paaralan Quest!</h2>
          <p>Please enter your name to begin:</p>
          <input
            type="text"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Your name"
            style={{ padding: '10px', width: '80%', marginTop: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <br />
          <button
            onClick={() => {
              if (nameInput.trim()) {
                setStudentName(nameInput.trim());
              } else {
                alert("Name is required to start the game.");
              }
            }}
            style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
   
    <div style={{ backgroundImage: `url(${Background})`, backgroundSize: 'cover', minHeight: '100vh', paddingTop: '100px', position: 'relative' }}>
      <img src={Logo} alt="Logo" style={{ position: 'absolute', top: '20px', left: '30px', width: '160px' }} />

    
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', marginRight: '-25px', marginTop: '100px' }}>
          <img
            src={StickImage}
           
            alt="Timer"
            style={{ marginTop: '100px', height: '150px', transform: 'rotate(90deg)', zIndex: 0 }}
          />
       
            <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50px',
            height: '320px',
            overflow: 'hidden',
            borderRadius: '50px',
            zIndex: 1
          }}>
            <div style={{
              position: 'absolute',
             
              bottom: 0,
              width: '50px',
              
              height: `${(timeLeft / 10) * 320}px`,
              backgroundColor: 'lightgreen',
              borderRadius: '50px',
             
              transition: 'height 1s linear'
            }} />
          </div>
        </div>

      
        <div style={{ display: 'flex', border: '4px solid #8B4513', backgroundColor: '#f5e5c0', borderRadius: '12px', padding: '20px', height: '600px', minWidth: '600px' }}>
          {sessionFinished ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <h1>🎉 SESSION FINISHED 🎉</h1>
              <p>Your final score: <strong>{score} points</strong></p>
            </div>
          
          ) : (
            current && <>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <h2>Kuwento #{currentIndex + 1}</h2>
                <div style={{ backgroundColor: '#fff8e1', padding: '15px', borderRadius: '8px', height: '100%', overflowY: 'auto' }}>
                  {current.story}
                </div>
              </div>

         
              <div style={{ width: '8px', backgroundColor: '#8B4513' }} />

        
              <div style={{ flex: 1, paddingLeft: '20px' }}>
                <h2>{current.question}</h2>
                {showHint && (
                  <div style={popoverStyle}>
                    <span style={iconStyle}>📘</span>
                    {current.hint}
                  </div>
                )}
                {current.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedChoice(idx)}
                    style={{
                      backgroundColor: selectedChoice === idx ? '#d1e7dd' : '#fff',
                      marginBottom: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #ccc',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

      
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '600px', width: '220px' }}>
          <div style={{
            padding: '20px',
            borderRadius: '10px',
            border: '4px solid #8B4513',
            backgroundColor: '#f5e5c0',
            textAlign: 'center',
            fontWeight: 'bold',
            color: feedback === "CORRECT ANSWER" ? 'green' : feedback === "WRONG ANSWER" ? 'red' : '#333'
          }}>
            Score: {score} <br />
            {feedback}
          </div>

       
          <div style={{ backgroundColor: '#8B4513', padding: '20px', borderRadius: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {storyData.map((_, i) => {
              let bgColor = '#f5e5c0';
              if (i === currentIndex) bgColor = '#FFD700';
              else if (answerResults[i] === 'correct') bgColor = 'lightgreen';
              else if (answerResults[i] === 'wrong') bgColor = '#ff9999';
              return (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: bgColor,
                    color: '#000',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>

       
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            <button
              onClick={handleHint}
              disabled={usedHint}
              style={{
               
                padding: '10px 20px',
                borderRadius: '30px',
              
                backgroundColor: usedHint ? '#aaa' : '#007BFF',
                color: '#fff',
                
                fontWeight: 'bold',
                
                cursor: usedHint ? 'not-allowed' : 'pointer'
              }}
            >
              HINT
            </button>

            <button
              onClick={handleCheckAnswer}
              style={{
                
                padding: '10px 20px',
                borderRadius: '10px',
                backgroundColor: '#FFD700',
                border: '2px solid #D4AC0D',
                color: '#fff',
                
                fontWeight: 'bold'
              }}
            >
              
              CHECK ANSWER
            </button>
          </div>
        </div>
      </div>

    
      {!sessionFinished && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '40px' }}>
          <img src={LeftArrow} alt="Previous" onClick={handlePrev} style={{ width: '60px', height: '60px', cursor: currentIndex > 0 ? 'pointer' : 'not-allowed', opacity: currentIndex > 0 ? 1 : 0.5 }} />
          <img src={RightArrow} alt="Next" onClick={handleNext} style={{ width: '60px', height: '60px', cursor: currentIndex < storyData.length - 1 ? 'pointer' : 'not-allowed', opacity: currentIndex < storyData.length - 1 ? 1 : 0.5 }} />
        </div>
      )}
    </div>
  );
};