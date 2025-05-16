import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./images/Logo.png";
import SignUp from "./images/Log in and sign up/Sign Up.png";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_of_birth: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          date_of_birth: formData.date_of_birth,
          role: "STUDENT", // Role added as STUDENT
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        throw new Error("Invalid JSON response from server.");
      }

      if (response.ok) {
        // ✅ Store the token and optionally email or user info
        localStorage.setItem("token", result.token); // Store token in localStorage
        localStorage.setItem("email", formData.email); // Store email in localStorage
        localStorage.setItem("role", "STUDENT"); // Store role in localStorage

        navigate("/profile-student");
      } else {
        console.log(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="bg-[#073A4D] h-screen flex flex-col items-start p-5 relative">
      {/* Logo */}
      <div className="w-full flex justify-start">
        <img
          src={Logo}
          alt="Logo"
          className="w-64 mb-5"  // Increased size
          style={{ paddingTop: "1rem", paddingLeft: "2.5rem" }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 w-full relative">
        <img
          src={SignUp}
          alt="Sign Up"
          className="absolute left-[-50px] top-[-73px] w-[800px] h-[940px]"  // Increased size
        />

        <div
          className="bg-white rounded-[40px] flex flex-col justify-start items-start absolute right-50 top-1/2 transform -translate-y-1/2"
          style={{ width: "540px", height: "635px", padding: "2rem 3rem" }}
        >
          <div
            className="absolute top-4 right-4 bg-[#57B4BA] text-black text-sm font-bold flex items-center justify-center"
            style={{
              padding: "0 2rem",
              height: "40px",
              borderRadius: "20px",
            }}
          >
            STUDENT
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

          <form onSubmit={handleSubmit} className="w-full pt-6 px-6" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 200 }}>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="w-1/2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
                style={{ backgroundColor: "#D9D9D9", boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", height: "50px" }}
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-1/2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
                style={{ backgroundColor: "#D9D9D9", boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", height: "50px" }}
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D] mb-4"
              style={{ backgroundColor: "#D9D9D9", boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", height: "50px" }}
            />

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              placeholder="Date of Birth"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D] mb-4"
              style={{ backgroundColor: "#D9D9D9", boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", height: "50px" }}
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D] mb-4"
              style={{ backgroundColor: "#D9D9D9", boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", height: "50px" }}
            />

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D] mb-4"
              style={{ backgroundColor: "#D9D9D9", boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", height: "50px" }}
            />

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                style={{ width: "18px", height: "18px", accentColor: "#073A4D" }}
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

export default RegisterStudent;
