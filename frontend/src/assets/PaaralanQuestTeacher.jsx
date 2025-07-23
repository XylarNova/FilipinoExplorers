import React from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../assets/images/Paaralan Quest/Paaralan Quest BG.png';
import Logo from '../assets/images/Logo.png';

const PaaralanQuestTeacher = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundImage: `url(${Background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: "'Fredoka', sans-serif",
      paddingTop: '60px',
      position: 'relative',
    }}>
      {/* Logo in top-left */}
      <img src={Logo} alt="Logo" style={{ position: 'absolute', top: '20px', left: '30px', width: '140px' }} />

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        padding: '40px 50px',
        borderRadius: '20px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '90%',
        marginTop: '40px'
      }}>
        <h1 style={{
          fontSize: '30px',
          marginBottom: '20px',
          color: '#073A4D',
        }}>
          👩‍🏫 Paaralan Quest - Teacher Panel
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#333',
          marginBottom: '30px',
        }}>
          Manage your reading comprehension questions below.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={() => navigate('/paaralanquest-teacher/create')}
            style={buttonStyle}
          >
            ➕ Create Question
          </button>
          <button
            onClick={() => navigate('/paaralanquest-teacher/display')}
            style={buttonStyle}
          >
            ✏️ Update Question
          </button>
          
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  backgroundColor: '#06D7A0',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  width: '100%',
  transition: 'background-color 0.3s ease',
};

export default PaaralanQuestTeacher;
