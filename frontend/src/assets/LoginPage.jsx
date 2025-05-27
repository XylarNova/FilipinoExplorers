import React, { useState } from 'react';
import axios from 'axios';
import Logo from './images/Logo.png';
import LogIn from './images/Log in and sign up/Log in.png';
import Star from './images/Log in and sign up/star.png';
import Cloud from './images/Log in and sign up/cloud.png';
import './Global.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ⬅️ For programmatic navigation
  const [showPassword, setShowPassword] = useState(false);


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

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      console.log('Login successful:', message);

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
      {/* Clickable Logo */}
      <div
        onClick={() => navigate('/')}
        className="absolute left-[40px] top-[40px] w-[190px] h-[80px] cursor-pointer z-30"
      >
        <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
      </div>

      {/* Login image (girl) */}
      <div className="z-20">
        <img 
          src={LogIn} 
          alt="Log In image" 
          className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-[280px] h-[230px] z-20"
        />
      </div>

      {/* Stars */}
      <div>
        <img src={Star} alt="Star" className="absolute left-[80px] top-[200px] w-[72px] h-[66px] twinkle" />
        <img src={Star} alt="Star" className="absolute left-[300px] top-[400px] w-[72px] h-[66px] twinkle" />
        <img src={Star} alt="Star" className="absolute left-[850px] top-[20px] w-[72px] h-[66px] twinkle" />
        <img src={Star} alt="Star" className="absolute left-[1150px] top-[160px] w-[72px] h-[66px] twinkle" />
        <img src={Star} alt="Star" className="absolute left-[1100px] top-[320px] w-[72px] h-[66px] twinkle" />
      </div>

      {/* Clouds */}
      <div className="z-0">
        <img src={Cloud} alt="Cloud" className="absolute left-[980px] top-[380px] w-[350px] h-[200px] float-cloud" />
        <img src={Cloud} alt="Cloud" className="absolute left-[300px] top-[490px] w-[350px] h-[200px] float-cloud" />
      </div>

      {/* Centered White Box */}
      <div className="flex-grow flex items-center justify-center z-10 relative">
        <div className="bg-white rounded-3xl w-[544px] h-[430px] z-10 relative drop-shadow-[0_8px_30px_rgba(87,180,179,0.3)]">
          <div style={innerContentStyle}>
            <h1 className="pt-7 text-[#073A4D] text-4xl font-bold font-['Poppins'] mb-1">
              Welcome Back
            </h1>
            <p className="text-[#073A4D] text-xl font-light font-['Poppins'] mb-6">
              Create an account? <span className="font-bold">Sign up</span>
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full h-16 px-4 mb-6 rounded-lg bg-[#D9D9D9] shadow-inner text-black placeholder-black placeholder-opacity-50 focus:outline-none"
            />
            <div className="relative w-full h-16 mb-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-full px-4 rounded-lg bg-[#D9D9D9] shadow-inner text-black placeholder-black placeholder-opacity-50 focus:outline-none"
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </span>
          </div>

            <p className="text-black text-xl font-light mb-6">
              Forgot Password?
            </p>
            <button
              onClick={handleLogin}
              className="w-[180px] bg-[#57B4B3] text-black text-6xl font-extrabold py-3 rounded-xl font-['Poppins'] mx-auto block mt-4 hover:scale-105 transition-all"
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
