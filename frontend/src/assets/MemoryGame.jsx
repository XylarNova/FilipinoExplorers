import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Logo from './images/Logo.png'; 
import SchoolIcon from '@mui/icons-material/School'; 
import PersonIcon from '@mui/icons-material/Person';

const SignUpType = () => {
  const navigate = useNavigate(); 

  return (
    <div 
      id="signup" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}
    >
      {/* Header Section */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '20px 40px', 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #ddd',
        fontFamily: "'Fredoka', sans-serif", 
        fontWeight: '600', 
      }}>
        <img 
          src={Logo} 
          alt="Filipino Explorers Logo" 
          style={{ width: '150px' }} 
        />
        <nav style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <ul style={{ 
            display: 'inline-flex', 
            listStyle: 'none', 
            margin: 0, 
            padding: 0, 
            alignItems: 'center' 
          }}>
            <li style={{ margin: '0 20px', fontSize: '18px' }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>Home</Link>
            </li>
            <li style={{ margin: '0 20px', fontSize: '18px' }}>
              <Link to="/#about" style={{ textDecoration: 'none', color: '#000' }}>About Us</Link>
            </li>
            <li style={{ margin: '0 20px', fontSize: '18px' }}>
              <Link to="/#games" style={{ textDecoration: 'none', color: '#000' }}>Games</Link>
            </li>
            <li style={{ margin: '0 20px', fontSize: '18px' }}>
              <button 
                onClick={() => navigate('/signup')} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#000', 
                  fontSize: '18px', 
                  cursor: 'pointer', 
                  textDecoration: 'none' 
                }}
              >
                Sign Up
              </button>
            </li>
            <li style={{ margin: '0 20px' }}>
              <button 
                style={{
                  padding: '10px 20px', 
                  fontSize: '16px', 
                  backgroundColor: '#06D7A0',
                  color: '#000', 
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Log In
              </button>
            </li>
          </ul>
        </nav>
      </header>


      {/* Footer Section */}
      <footer style={{ 
        backgroundColor: '#073A4D', 
        color: '#ffffff', 
        textAlign: 'center', 
        padding: '20px', 
        fontFamily: "'Fredoka', sans-serif" 
      }}>
        © 2025 FilipinoExplorers | Aralin mo, Laruin mo!
      </footer>
    </div>
  );
};

export default SignUpType;