import React, { useState } from 'react';
import axios from 'axios';
import Logo from './images/Logo.png';
import LogIn from './images/Log in and sign up/Log in.png';
import Star from './images/Log in and sign up/star.png';
import Cloud from './images/Log in and sign up/Log in and Register.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const innerContentStyle = {
    paddingTop: '40px',
    paddingLeft: '40px',
    paddingRight: '40px',
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const { token, role, message } = response.data;

      // Store the response data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Log message instead of alert
      console.log('Login successful:', message);

      // Redirect based on role
      if (role === 'TEACHER') {
        window.location.href = '/teacher-dashboard';
      } else if (role === 'STUDENT') {
        window.location.href = '/student-dashboard';
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#073A4D] flex flex-col">
      {/* Logo */}
      <div>
        <img src={Logo} alt="Logo" className="absolute left-[40px] top-[40px] w-[190px] h-[80px]" />
      </div>

      {/* Login image */}
      <div className="z-20">
        <img src={LogIn} alt="Log In image" className="absolute left-[500px] top-[20px] w-[300px] h-[250px]" />
      </div>

      {/* Stars */}
      <div>
        <img src={Star} alt="Star" className="absolute left-[80px] top-[200px] w-[72px] h-[66px]" />
        <img src={Star} alt="Star" className="absolute left-[300px] top-[400px] w-[72px] h-[66px]" />
        <img src={Star} alt="Star" className="absolute left-[850px] top-[20px] w-[72px] h-[66px]" />
        <img src={Star} alt="Star" className="absolute left-[1150px] top-[160px] w-[72px] h-[66px]" />
        <img src={Star} alt="Star" className="absolute left-[1100px] top-[320px] w-[72px] h-[66px]" />
      </div>

      {/* Clouds image */}
      <div className="z-0">
        <img src={Cloud} alt="Cloud" className="absolute left-[980px] top-[380px] w-[350px] h-[200px]" />
        <img src={Cloud} alt="Cloud" className="absolute left-[300px] top-[490px] w-[350px] h-[200px]" />
      </div>

      {/* Centered White Box */}
      <div className="flex-grow flex items-center justify-center z-10 relative">
        <div className="bg-white rounded-3xl shadow-lg w-[544px] h-[430px] border border-black z-10 relative">
          <div style={innerContentStyle}>
            {/* Welcome Back */}
            <h1 className="pt-7 text-[#073A4D] text-4xl font-bold font-['Poppins'] mb-1">
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
              className="w-[100px] bg-[#57B4B3] text-black text-lg py-3 rounded-2xl font-['Inter'] font-semibold mx-auto block"
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
