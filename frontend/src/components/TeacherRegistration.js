import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/TeacherRegistration.css';
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

function TeacherRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Check if passwords match in real-time
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(
        name === 'password'
          ? value === formData.confirmPassword
          : value === formData.password
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }
    if (!passwordMatch) {
      setError('Passwords do not match.');
      return;
    }

    setError(''); // Clear any previous errors

    // API call to backend
    try {
      const response = await fetch('http://localhost:8080/api/teachers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          school: formData.school,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Teacher registered successfully:', data);
        navigate('/login-teacher'); 
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register. Please try again.');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred. Please try again later.');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="teacher-registration">
      {/* Logo in top left */}
      <div className="logo">
        <img src={Logo} alt="Filipino Explorers" />
      </div>

      <div className="registration-container">
        {/* Picture on the left */}
        <div className="children">
          <img src={Children} alt="Filipino Explorers" />
        </div>

        {/* Registration form on the right */}
        <div className="registration-form">
          <div className="form-content">
            <div className="role-indicator">
              <span>TEACHER</span>
            </div>

            <h2>Create an Account</h2>

            <p>
              Already have an account?{' '}
              <Link to="/login-teacher" className="login-link">
                Log In
              </Link>
            </p>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="school"
                placeholder="School"
                value={formData.school}
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
                
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </span>
                </div>
                
                {!passwordMatch && (
                  <p className="error-message">Passwords do not match.</p>
                )}
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <label htmlFor="terms">I agree to Terms & Condition</label>
              </div>

              <button type="submit" className="register-btn">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherRegistration;