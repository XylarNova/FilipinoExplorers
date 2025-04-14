import React, { useState } from 'react';
import axios from 'axios';
import Logo from './images/Logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const innerContentStyle = {
    paddingTop: '40px',
    paddingLeft: '40px',
    paddingRight: '40px'
  };

  const handleLogin = async () => {
    try {
      let response;

      // Try student login
      try {
        response = await axios.post('http://localhost:8080/api/auth/login-student', {
          email,
          password,
        });
      } catch (err) {
        // Fallback to teacher login
        response = await axios.post('http://localhost:8080/api/auth/login-teacher', {
          email,
          password,
        });
      }

      const { token, id, role, message } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('role', role);

      alert(message);

      // Redirect based on role
      if (role === 'teacher') {
        window.location.href = '/teacher-dashboard';
      } else if (role === 'student') {
        window.location.href = '/student-dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#073A4D] flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <img src={Logo} alt="Logo" className="h-12" />
      </div>

      {/* Centered White Box */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg w-[544px] h-[350px]">
          <div style={innerContentStyle}>
            {/* Welcome Back */}
            <h1 className="text-[#073A4D] text-4xl font-bold font-['Poppins'] mb-1">
              Welcome Back
            </h1>

            {/* Sign Up prompt */}
            <p className="text-[#073A4D] text-xl font-light font-['Poppins'] mb-6">
              Create an account? <span className="font-bold">Sign up</span>
            </p>

            {/* Email Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full h-16 px-4 mb-6 rounded-lg bg-[#D9D9D9] shadow-inner text-black placeholder-black placeholder-opacity-50 focus:outline-none"
            />

            {/* Password Input */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-16 px-4 mt-0 mb-2 rounded-lg bg-[#D9D9D9] shadow-inner text-black placeholder-black placeholder-opacity-50 focus:outline-none"
            />

            {/* Forgot Password */}
            <p className="text-black text-xl font-light mb-6">
              Forgot Password?
            </p>

            {/* Log In Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-[#57B4B3] text-black text-lg py-3 rounded-2xl font-['Inter'] font-semibold"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
