// ✅ ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ForgotPassImage from '../assets/images/Buttons and Other/forgot pass.png';
import Logo from '../assets/images/Logo.png';
import Star from '../assets/images/Log in and sign up/star.png';
import Cloud from '../assets/images/Log in and sign up/cloud.png';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        newPassword
      });
      navigate('/password-reset-confirmation');
    } catch (error) {
      console.error(error);
      alert('Error resetting password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#073A4D] relative">
      <img src={Logo} alt="Logo" className="absolute left-[40px] top-[40px] w-[190px] h-[80px] cursor-pointer" onClick={() => navigate('/')} />

      <img src={ForgotPassImage} alt="Reset Password" className="absolute top-[20px] left-1/2 transform -translate-x-1/2 w-[280px] h-[230px] z-20" />

      <img src={Star} alt="Star" className="absolute left-[80px] top-[200px] w-[72px] h-[66px]" />
      <img src={Star} alt="Star" className="absolute left-[300px] top-[400px] w-[72px] h-[66px]" />
      <img src={Star} alt="Star" className="absolute left-[850px] top-[20px] w-[72px] h-[66px]" />
      <img src={Star} alt="Star" className="absolute left-[1150px] top-[160px] w-[72px] h-[66px]" />

      <img src={Cloud} alt="Cloud" className="absolute left-[980px] top-[380px] w-[350px] h-[200px]" />
      <img src={Cloud} alt="Cloud" className="absolute left-[300px] top-[490px] w-[350px] h-[200px]" />

      <div className="flex items-center justify-center h-screen">
        <div className="bg-white rounded-3xl w-[544px] h-[460px] shadow-xl p-10">
          <h1 className="text-[#073A4D] text-3xl font-bold text-center mb-6">Reset Password</h1>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-4 p-3 bg-gray-200 rounded-md"
          />
          <input
            type="password"
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-6 p-3 bg-gray-200 rounded-md"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-[#57B4B3] text-white font-bold py-3 rounded-md hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
