import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Logo from './images/Logo.png'; 
import SchoolIcon from '@mui/icons-material/School'; 
import PersonIcon from '@mui/icons-material/Person';
import './Homepage.css';

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
        <img src={Logo} alt="Filipino Explorers Logo" style={{ width: '150px' }} />
        <nav style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <ul style={{ display: 'inline-flex', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
            <li style={{ margin: '0 20px' }}>
              <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: '#000' }}>Home</Link>
            </li>
            <li style={{ margin: '0 20px' }}>
              <Link to="/#about" className="nav-link" style={{ textDecoration: 'none', color: '#000' }}>About Us</Link>
            </li>
            <li style={{ margin: '0 20px' }}>
              <Link to="/#games" className="nav-link" style={{ textDecoration: 'none', color: '#000' }}>Games</Link>
            </li>
            <li style={{ margin: '0 20px' }}>
              <button onClick={() => navigate('/signup')} className="nav-link" style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#000' }}>
                Sign Up
              </button>
            </li>
            <li style={{ margin: '0 20px' }}>
              <button onClick={() => navigate('/login')} className="nav-link" style={{ padding: '10px 20px', backgroundColor: '#06D7A0', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', color: '#000' }}>
                Log In
              </button>
            </li>
          </ul>
        </nav>

      </header>

      {/* Main Content Section */}
      <div style={{ 
        flex: 1, /* Ensures this section takes up available space */
        display: 'flex', /* Flexbox for vertical centering */
        flexDirection: 'column', /* Stack content vertically */
        justifyContent: 'center', /* Center content vertically */
        alignItems: 'center', /* Center content horizontally */
        padding: '40px', 
        backgroundColor: '#ffffff', 
        textAlign: 'center', 
        fontFamily: "'Poppins', sans-serif" 
      }}>
        <h1 style={{ fontSize: '46px', fontWeight: '700', color: '#073A4D', marginBottom: '20px' }}>
          Choose your account type
        </h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '40px' /* Space between the boxes */ 
        }}>
          <button 
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#108AB1', /* Teacher box color */
              color: '#000', 
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              flexDirection: 'column', /* Stack icon and text vertically */
              alignItems: 'center',
              gap: '20px', /* Increased gap for better spacing */
              width: '200px', /* Increased width for uniformity */
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', /* Box shadow */
            }}
            onClick={() => navigate('/register-teacher')} // Navigate to /register-teacher
          >
            <PersonIcon style={{ fontSize: '100px' }} /> {/* Increased icon size */}
            Teacher
          </button>
          <button 
            style={{
              padding: '20px',
              fontSize: '18px',
              backgroundColor: '#FFD068', /* Student box color */
              color: '#000', 
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              flexDirection: 'column', /* Stack icon and text vertically */
              alignItems: 'center',
              gap: '20px', /* Increased gap for better spacing */
              width: '200px', /* Increased width for uniformity */
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', /* Box shadow */
            }}
            onClick={() => navigate('/register-student')}
          >
            <SchoolIcon style={{ fontSize: '100px' }} /> {/* Increased icon size */}
            Student
          </button>
        </div>
      </div>

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