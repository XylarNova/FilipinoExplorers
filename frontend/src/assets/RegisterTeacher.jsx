import React, { useState } from "react";
import Logo from "./images/Logo.png";
import SignUp from "./images/Log in and sign up/Sign Up.png";

const RegisterTeacher = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

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
      const response = await fetch("http://localhost:8080/api/auth/register-teacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          school: formData.school,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        // Redirect or clear form if needed
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="bg-[#073A4D] h-screen flex flex-col items-start p-5 relative">
      {/* Logo */}
      <div className="w-full flex justify-start">
        <img
          src={Logo}
          alt="Logo"
          className="w-48 mb-5"
          style={{ paddingTop: "1rem", paddingLeft: "2.5rem" }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 w-full relative">
        {/* Sign-Up Image */}
        <img
          src={SignUp}
          alt="Sign Up"
          className="absolute bottom-0 h-full object-cover"
        />

        {/* White Box */}
        <div
          className="bg-white rounded-[40px] flex flex-col justify-start items-start absolute right-50 top-1/2 transform -translate-y-1/2"
          style={{ width: "540px", height: "635px", padding: "2rem 3rem" }} // Explicit padding for the white box
        >
          {/* "Teacher" Label */}
          <div
            className="absolute top-4 right-4 bg-[#57B4BA] text-black text-sm font-bold flex items-center justify-center"
            style={{
              padding: "0 2rem", // Increased padding on the left and right
              height: "40px",
              borderRadius: "20px",
            }}
          >
            TEACHER
          </div>

          {/* Form Header */}
          <div
            className="w-full"
            style={{
              paddingTop: "2rem", // Increased padding above the header
              paddingBottom: "1rem", // Added padding below the header
            }}
          >
            <h1
              className="text-2xl text-[#073A4D] mb-2"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }} // Set font to Poppins Medium
            >
              Create an Account
            </h1>
            <p
              className="text-sm text-black mb-5"
              style={{ fontFamily: "'Poppins', sans-serif" }} // Set font to Poppins
            >
              Already have an account?{" "}
              <a
                href="#"
                className="text-[#073A4D] font-bold hover:underline"
              >
                Log In
              </a>
            </p>
          </div>

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full pt-6 px-6"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 200, // Extra Light
            }}
          >
            {/* First Name and Last Name */}
            <div className="flex gap-4" style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-1/2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
                style={{
                  backgroundColor: "#D9D9D9",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", // Inner shadow
                  height: "50px", // Increased height
                }}
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-1/2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
                style={{
                  backgroundColor: "#D9D9D9",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", // Inner shadow
                  height: "50px", // Increased height
                }}
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
              style={{
                backgroundColor: "#D9D9D9",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", // Inner shadow
                height: "50px", // Increased height
                marginBottom: "1rem", // Reduced space below
              }}
            />

            {/* School */}
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="School"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
              style={{
                backgroundColor: "#D9D9D9",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", // Inner shadow
                height: "50px", // Increased height
                marginBottom: "1rem", // Reduced space below
              }}
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
              style={{
                backgroundColor: "#D9D9D9",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", // Inner shadow
                height: "50px", // Increased height
                marginBottom: "1rem", // Reduced space below
              }}
            />

            {/* Confirm Password */}
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#073A4D]"
              style={{
                backgroundColor: "#D9D9D9",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", // Inner shadow
                height: "50px", // Increased height
                marginBottom: "1rem", // Reduced space below
              }}
            />

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#073A4D", // Changes the checkbox color
                }}
              />
              <label
                htmlFor="terms"
                className="text-sm text-black"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-[#073A4D] font-bold hover:underline"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="text-white py-3 rounded-lg hover:bg-[#4CA9A9] transition"
                    style={{
                    backgroundColor: "#57B4B3", // Updated background color
                    marginTop: "1rem",
                    width: "204px", // Set button width to 204px
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