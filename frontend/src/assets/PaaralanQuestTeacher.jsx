import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaaralanQuestTeacher = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FDFBEE',
      fontFamily: "'Fredoka', sans-serif"
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px', color: '#073A4D' }}>
        📚 Paaralan Quest - Teacher Panel
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          📋 Display Questions
        </button>
        <button
          onClick={() => navigate('/paaralanquest-teacher/update')}
          style={buttonStyle}
        >
          ✏️ Update Question
        </button>
        <button
          onClick={() => navigate('/paaralanquest-teacher/delete')}
          style={buttonStyle}
        >
          ❌ Delete Question
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '18px',
  backgroundColor: '#06D7A0',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  width: '260px',
  textAlign: 'center'
};

export default PaaralanQuestTeacher;
