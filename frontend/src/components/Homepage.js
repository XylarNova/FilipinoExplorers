import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Homepage.css';
import Logo from './images/Logo.png'
import Learning from './images/Homepage/Home 1st rec.png'
import MemoryGame from './images/Homepage/Memory Game Icon.png'
import PaaralanQuest from './images/Homepage/Paaralan Quest Icon.png'
import ParkeQuest from './images/Homepage/Parke Quest (2).png'
import WordGame from './images/Homepage/Guess The Word .png'

function Homepage() {
  const navigate = useNavigate();

  const homepage = () => {
    navigate('/');
  };

  const handleSignUp = () => {
    navigate('/register-type');
  };

  const handleLogin = () => {
    navigate('/login-type');
  };

  return (
    <div className="homepage">
      {/* Navigation Bar */}
        <nav className="navbar">
            <div className="logo">
                <img src={Logo} alt="Filipino Explorers" />
            </div>
            
            <div className="nav-links">
                <button className="btn" onClick={homepage}>
                    Home
                </button>
                <button className="btn" onClick={homepage}>
                    About us
                </button>
                <button className="btn" onClick={homepage}>
                    Games
                </button>
                <button className="register-btn" onClick={handleSignUp}>
                    Sign up
                </button>
                <button className="login-btn" onClick={handleLogin}>
                    Log in
                </button>
            </div>
        </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>"Unlock Your Child's<br />Love for Filipino!"</h1>
          <p>A fun, gamified way to explore the Filipino<br />language for Grade 5 learners.</p>
          <button className="cta-button">Start Exploring !</button>
        </div>
        <div className="hero-image">
          <img src={Learning} alt="Children learning" />
        </div>
      </section>

      {/* Why Filipino Explorers Section */}
      <section className="why-section">
        <h2>Why Filipino Explorers?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span role="img" aria-label="book">🧠</span> Curriculum-Aligned
          </div>
          <div className="feature-card">
            <span role="img" aria-label="game">🎯</span> Gamified Experience
          </div>
          <div className="feature-card">
            <span role="img" aria-label="chart">📈</span> Track Progress
          </div>
          <div className="feature-card">
            <span role="img" aria-label="teacher">👨‍🏫</span> Easy Class Setup
          </div>
          <div className="feature-card">
            <span role="img" aria-label="tools">🧰</span> Teacher Tools
          </div>
          <div className="feature-card">
            <span role="img" aria-label="trophy">🏆</span> Leaderboard
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="games-section">
        <h2>Explore Our Games</h2>
        <div className="games-grid">
          <div className="game-card">
            <img src={WordGame} alt="Guess The Word" />
          </div>
          <div className="game-card">
            <img src={ParkeQuest} alt="Parke Quest" />
          </div>
          <div className="game-card">
            <img src={PaaralanQuest} alt="Paaralan Quest" />
          </div>
          <div className="game-card">
            <img src={MemoryGame} alt="Memory Game" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Begin?</h2>
        <button 
          className="signup-btn" 
          onClick={handleSignUp}
        >
          Sign Up for Free
        </button>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 FilipinoExplorers | Aralin mo, Laruín mo!</p>
      </footer>
    </div>
  );
}

export default Homepage;