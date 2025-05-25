import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./images/Logo.png";
import Star from "./images/Log in and sign up/star.png";
import Cloud from "./images/Log in and sign up/signClouds.png";
import FlyingKids from "./images/Log in and sign up/flyingkids.png";
import './Global.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const RegisterTeacher = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleCheckboxChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("Must agree with terms and conditions before registering");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          school: formData.school,
          role: "TEACHER",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Registration successful!");
        localStorage.setItem("token", result.token);
        localStorage.setItem("email", formData.email);
        localStorage.setItem("role", "TEACHER");
        navigate("/profile-teacher");
      } else {
        console.log(result.message || "Registration failed");
      }
    } catch (error) {
      console.log("Error during registration:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="bg-[#073A4D] min-h-screen flex p-5 relative overflow-hidden">
      {/* Clickable Logo */}
      <div
        onClick={() => navigate('/')}
        className="absolute left-[40px] top-[40px] w-[190px] h-[80px] cursor-pointer z-30"
      >
        <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
      </div>

      {/* Flying Kids */}
      <img
        src={FlyingKids}
        alt="Flying Kids"
        className="flying"
        style={{
          position: "absolute",
          left: "140px",
          bottom: "80px",
          width: "500px",
          zIndex: 10
        }}
      />

      {/* Stars in curved layout */}
      <img src={Star} className="absolute bottom-[300px] left-[30px] w-[60px] z-0 twinkle" />
      <img src={Star} className="absolute bottom-[500px] left-[100px] w-[60px] z-0 twinkle" />
      <img src={Star} className="absolute bottom-[600px] left-[300px] w-[60px] z-0 twinkle" />
      <img src={Star} className="absolute bottom-[550px] left-[500px] w-[60px] z-0 twinkle" />
      <img src={Star} className="absolute bottom-[300px] left-[650px] w-[60px] z-0 twinkle" />

      {/* Clouds */}
      <img src={Cloud} className="absolute bottom-[-150px] left-[-60px] w-[500px] z-0 float-cloud" />
      <img src={Cloud} className="absolute bottom-[-300px] left-[-40px] w-[600px] z-0 float-cloud" />

      {/* Form container */}
      <div className="flex flex-1 w-full justify-end items-center z-20" style={{ marginRight: "100px" }}>
        <div
          className="bg-white rounded-[40px] shadow-xl flex flex-col justify-start items-start relative"
          style={{ width: "540px", height: "635px", padding: "2rem 3rem" }}
        >
          {/* TEACHER label */}
          <div
            className="absolute top-4 right-4 bg-[#57B4BA] text-black text-sm font-bold flex items-center justify-center"
            style={{
              padding: "0 2rem",
              height: "40px",
              borderRadius: "20px",
            }}
          >
            TEACHER
          </div>

          <div className="w-full" style={{ paddingTop: "2rem", paddingBottom: "1rem" }}>
            <h1
              className="text-2xl text-[#073A4D] mb-2"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
            >
              Create an Account
            </h1>
            <p className="text-sm text-black mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Already have an account?{" "}
              <a href="#" className="text-[#073A4D] font-bold hover:underline">
                Log In
              </a>
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full pt-6 px-6"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 200 }}
          >
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-1/2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
                style={{
                  backgroundColor: "#D9D9D9",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                  height: "50px",
                }}
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-1/2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
                style={{
                  backgroundColor: "#D9D9D9",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                  height: "50px",
                }}
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
              style={{
                backgroundColor: "#D9D9D9",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                height: "50px",
              }}
            />

            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="School"
              className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
              style={{
                backgroundColor: "#D9D9D9",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                height: "50px",
              }}
            />

            {/* 👁️ Password Field */}
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
                style={{
                  backgroundColor: "#D9D9D9",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                  height: "50px",
                }}
              />
              <span
                className="absolute right-4 top-4 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>

            {/* 👁️ Confirm Password Field */}
            <div className="relative w-full mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
                style={{
                  backgroundColor: "#D9D9D9",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                  height: "50px",
                }}
              />
              <span
                className="absolute right-4 top-4 cursor-pointer text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </span>
            </div>


           <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              style={{ width: "18px", height: "18px", accentColor: "#073A4D" }}
              checked={agreedToTerms}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms" className="text-sm text-black">
              I agree to the{" "}
              <a href="#" className="text-[#073A4D] font-bold hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>


            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white py-3 rounded-lg hover:bg-[#4CA9A9] transition"
                style={{
                  backgroundColor: "#57B4B3",
                  marginTop: "1rem",
                  width: "204px",
                }}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterTeacher;
