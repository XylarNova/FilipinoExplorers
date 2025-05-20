import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './images/Logo.png';
import HomeImage from './images/Homepage/Home 1st rec.png';
import GuessTheWordImage from './images/Homepage/Guess The Word .png';
import ParkeQuestImage from './images/Homepage/Parke Quest.png';
import PaaralanQuestImage from './images/Homepage/Paaralan Quest Icon.png';
import MemoryGameImage from './images/Homepage/Memory Game Icon.png';
import './Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();
  const [activeDescription, setActiveDescription] = useState(null);

  const gameData = [
    {
      name: 'Guess The Word',
      color: '#F3668A',
      image: GuessTheWordImage,
      description: ' Hulaan ang tamang salita! Arrange the jumbled letters to form the correct Filipino word based on a clue. You can use a hint—but it’ll cost some points!'
    },
    {
      name: 'Parke Quest',
      color: '#4092AD',
      image: ParkeQuestImage,
      description: ' Ayusin ang magulong pangungusap! Drag and drop the words to build the correct sentence. It’s a fun grammar puzzle!'
    },
    {
      name: 'Paaralan Quest',
      color: '#06D7A0',
      image: PaaralanQuestImage,
      description: ' Basahin at intindihin, tanong sagutin natin! Read a story and answer fun questions about it. Great for building reading skills!'
    },
    {
      name: 'Memory Game',
      color: '#FAB869',
      image: MemoryGameImage,
      description: ' Hanapin ang tamang salin! A Filipino word will appear and you’ll pick the correct English translation. Great for boosting your vocabulary!'
    }
  ];

  return (
    <div id="home">
      <header
  className="sticky-header"
>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px',
    fontFamily: "'Fredoka', sans-serif",
    fontWeight: 600
  }}>
    <img src={Logo} alt="Filipino Explorers Logo" style={{ width: '150px' }} />
    <nav style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
      <ul style={{ display: 'inline-flex', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
        <li style={{ margin: '0 20px' }}><a href="#home" className="nav-link">Home</a></li>
        <li style={{ margin: '0 20px' }}><a href="#about" className="nav-link">About Us</a></li>
        <li style={{ margin: '0 20px' }}><a href="#games" className="nav-link">Games</a></li>
        <li style={{ margin: '0 20px' }}><button onClick={() => navigate('/signup')} className="nav-link">Sign Up</button></li>
        <li style={{ margin: '0 20px' }}><button onClick={() => navigate('/login')} className="nav-link" style={{ backgroundColor: '#06D7A0' }}>Log In</button></li>
      </ul>
    </nav>
  </div>
</header>


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px', backgroundColor: '#118AB2', color: '#000' }}>
        <div style={{ flex: 1, textAlign: 'center', paddingRight: '20px' }}>
          <h1 style={{ fontSize: '50px', fontWeight: '700', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>
            “Unlock Your Child’s Love for Filipino!”
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '20px' }}>
            A fun, gamified way to explore the Filipino language for Grade 5 learners.
          </p>
          <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#FAB900', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => alert('Explore Now!')}>
            Start Exploring !
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img src={HomeImage} alt="Home Illustration" style={{ width: '100%', maxWidth: '400px', borderRadius: '10px' }} />
        </div>
      </div>

      <div id="about" style={{ backgroundColor: '#FDFBEE', padding: '60px 40px', textAlign: 'center' }}>
      <h2 style={{
        fontSize: '46px',
        fontWeight: '700',
        color: '#073A4D',
        fontFamily: "'Fredoka', sans-serif",
        marginBottom: '30px'
      }}>
        📘 About FilipinoExplorers
      </h2>

      <p style={{
        fontSize: '20px',
        lineHeight: '1.8',
        maxWidth: '900px',
        margin: '0 auto',
        color: '#213547',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <strong>FilipinoExplorers</strong> is a gamified e-learning platform made especially for <strong>Grade 5 learners</strong>. 
        It helps students build their Filipino language skills through fun games in vocabulary, sentence construction, and reading comprehension — all aligned with the <strong>DepEd K–12 curriculum</strong> and <strong>MELCs</strong>. 🎓📚
      </p>

      <p style={{
        fontSize: '18px',
        marginTop: '20px',
        color: '#444',
        fontFamily: "'Poppins', sans-serif"
      }}>
        The platform is also designed to assist <strong>teachers</strong> in delivering engaging, curriculum-based Filipino lessons whether in face-to-face or digital classrooms.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '40px', flexWrap: 'wrap' }}>
        {/* For Students */}
        <div style={{
          backgroundColor: '#57B4BA',
          borderRadius: '20px',
          padding: '30px 20px',
          width: '280px',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#073A4D' }}>🧒🏻 For Learners</h3>
          <p style={{ fontSize: '14px', color: '#333' }}>
            Learning Filipino becomes exciting and meaningful with colorful, interactive games.
          </p>
        </div>

        {/* MELCs */}
        <div style={{
          backgroundColor: '#015551',
          color: '#fff',
          borderRadius: '20px',
          padding: '30px 20px',
          width: '280px',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>📖 Curriculum-Aligned</h3>
          <p style={{ fontSize: '14px' }}>
            Each activity supports the Grade 5 Filipino Most Essential Learning Competencies (MELCs).
          </p>
        </div>

        {/* For Teachers */}
        <div style={{
          backgroundColor: '#FF6B4A',
          borderRadius: '20px',
          padding: '30px 20px',
          width: '280px',
          color: '#fff',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>👩‍🏫 For Teachers</h3>
          <p style={{ fontSize: '14px' }}>
            Helps teachers guide students with ready-to-use, class-friendly Filipino learning tools.
          </p>
        </div>
      </div>
    </div>


      <div id="games" style={{ padding: '40px', backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '46px', fontWeight: '700', color: '#073A4D', fontFamily: "'Fredoka', sans-serif", textAlign: 'center', marginBottom: '40px' }}>Explore Our Games</h2>
        <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between', gap: '20px', overflowX: 'auto' }}>
          {gameData.map((game, index) => (
            <div
              key={index}
              onClick={() => setActiveDescription(activeDescription === index ? null : index)}
              style={{
                backgroundColor: game.color,
                borderRadius: '20px',
                padding: '20px',
                width: 'calc(25% - 20px)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px' }}>
                <img src={game.image} alt={game.name} style={{ width: '100%', maxWidth: '200px', borderRadius: '10px' }} />
              </div>
              <div style={{
                marginTop: activeDescription === index ? '15px' : '0',
                maxHeight: activeDescription === index ? '200px' : '0px',
                opacity: activeDescription === index ? 1 : 0,
                overflow: 'hidden',
                backgroundColor: `${game.color}BF`,
                borderRadius: '10px',
                padding: activeDescription === index ? '12px' : '0px',
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '14px',
                color: '#000',
                transition: 'all 0.4s ease-in-out'
              }}>
                {game.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="join" style={{ padding: '40px', backgroundColor: '#ffffff', textAlign: 'center' }}>
        <h2 style={{ fontSize: '46px', fontWeight: '700', color: '#073A4D', fontFamily: "'Fredoka', sans-serif", marginBottom: '20px' }}>Ready to Begin?</h2>
        <button style={{ padding: '10px 20px', fontSize: '20px', backgroundColor: '#FAB900', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => navigate('/signup')}>
          Sign Up for Free
        </button>
      </div>

      <footer style={{ backgroundColor: '#073A4D', color: '#ffffff', textAlign: 'center', padding: '20px', fontFamily: "'Fredoka', sans-serif" }}>
        © 2025 FilipinoExplorers | Aralin mo, Laruin mo!
      </footer>
    </div>
  );
};

export default Homepage;
