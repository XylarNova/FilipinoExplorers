import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/TeacherLogin.css';
import Logo from './images/Logo.png';
import Children from './images/Log in and sign up/Sign Up.png';

// SVG Eye Icons as components
const EyeIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function TeacherLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(''); // Clear any previous errors

    // API call to backend for login
    try {
      const response = await fetch('http://localhost:8080/api/teachers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const token = await response.text(); // Assuming the backend returns the token as plain text
        console.log('Login successful. Token:', token);
        // Save token to localStorage or context (if needed)
        localStorage.setItem('authToken', token);

        // Navigate to edit profile if login is successful
        navigate('/edit-profile-teacher');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="teacher-login">
      {/* Logo in top left */}
      <div className="logo">
        <img src={Logo} alt="Filipino Explorers" />
      </div>

      <div className="login-container">

        {/* Login form on the right */}
        <div className="login-form">
          <div className="form-content">
            <div className="role-indicator">
              <span>TEACHER</span>
            </div>

            <h2>Welcome Back</h2>

            <p>
              Don't have an account?{' '}
              <Link to="/register-teacher" className="login-link">
                Sign Up
              </Link>
            </p>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="password-group">
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </span>
                </div>
              </div>

              <button type="submit" className="login-btn">
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherLogin;