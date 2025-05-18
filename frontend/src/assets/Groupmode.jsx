import React, { useState } from "react";
import Logo from "../assets/images/Logo.png";
import Cloud from "../assets/images/Log in and sign up/cloud.png";
import Profile from "../assets/images/Log in and sign up/Profile.png";
import './Global.css';

const GroupMode = () => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState(["", ""]); // Start with 2 members

  const handleMemberChange = (index, value) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      const updated = [...members];
      updated.splice(index, 1);
      setMembers(updated);
    }
  };

  const handleCreateTeam = () => {
    alert(`Group "${groupName}" created with members: ${members.join(", ")}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#1794b2",
        minHeight: "100vh",
        position: "relative",
        padding: "2rem",
        fontFamily: "'Fredoka', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Floating Clouds */}
      <img src={Cloud} alt="Cloud" className="float-cloud" style={{ position: "absolute", top: "20px", left: "20px", width: 250 }} />
      <img src={Cloud} alt="Cloud" className="float-cloud" style={{ position: "absolute", top: "20px", right: "20px", width: 250 }} />
      <img src={Cloud} alt="Cloud" className="float-cloud" style={{ position: "absolute", bottom: "20px", left: "20px", width: 250 }} />
      <img src={Cloud} alt="Cloud" className="float-cloud" style={{ position: "absolute", bottom: "20px", right: "20px", width: 250 }} />

      {/* Centered Content */}
      <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center", zIndex: 1, position: "relative" }}>
        {/* Centered Logo at Top */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <img src={Logo} alt="Filipino Explorer Logo" style={{ width: "320px" }} />
        </div>

        <h2 style={{ color: "#FFD166", fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem" }}>GROUP MODE</h2>

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Enter Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#fff",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        />

        <h3 style={{ color: "#FFD166", fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>EXPLORERS</h3>

        {/* Member Inputs with Remove Button */}
        {members.map((member, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "0.8rem",
      width: "100%",
    }}
  >
    <input
      type="text"
      placeholder={`Member ${index + 1}`}
      value={member}
      onChange={(e) => handleMemberChange(index, e.target.value)}
      style={{
        flex: 1,
        padding: "10px 16px",
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
        borderTopRightRadius: members.length > 1 ? "0" : "10px",
        borderBottomRightRadius: members.length > 1 ? "0" : "10px",
        border: "none",
        backgroundColor: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        fontSize: "1rem",
      }}
    />
    {members.length > 1 && (
      <button
        onClick={() => removeMember(index)}
        style={{
          backgroundColor: "#EF476F",
          color: "white",
          border: "none",
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px",
          height: "48px",
          width: "48px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        ×
      </button>
    )}
  </div>
))}

        <p
          onClick={addMember}
          style={{ color: "#073B4C", fontWeight: "500", cursor: "pointer", marginBottom: "2rem" }}
        >
          + add more members
        </p>

        {/* Create Team Button */}
        <button
          onClick={handleCreateTeam}
          style={{
            backgroundColor: "#06D6A0",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: "30px",
            fontWeight: "700",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            marginBottom: "1.5rem",
          }}
        >
          Create Team
        </button>

        {/* Centered Bottom Illustration */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <img src={Profile} alt="Kids Holding Hands" style={{ width: "280px" }} />
        </div>
      </div>
    </div>
  );
};

export default GroupMode;