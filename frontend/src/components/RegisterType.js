import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/RegisterType.css';
import Logo from './images/Logo.png';

function RegisterType() {
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

  const handleTeacherSelect = () => {
    navigate('/register/teacher');
  };

  const handleStudentSelect = () => {
    navigate('/register/student');
  };

  return (
    <div className="registertype">
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
     

      {/* Account Type Selection */}
      <div className="account-type-container">
        <h1 className="account-type-title">Choose your account type</h1>
        <div className="account-type-options">
          <div className="account-type-card" onClick={handleTeacherSelect}>
            <div className="account-type-icon teacher-icon"></div>
            <h2>Teacher</h2>
          </div>
          <div className="account-type-card" onClick={handleStudentSelect}>
            <div className="account-type-icon student-icon"></div>
            <h2>Student</h2>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 FilipinoExplorers | Aralin mo, Laruín mo!</p>
      </footer>
    </div>
  );
}

export default RegisterType;