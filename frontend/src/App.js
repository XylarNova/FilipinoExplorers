import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import RegisterType from './components/RegisterType';
import LoginType from './components/LoginType';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register-type" element={<RegisterType />} />
        <Route path="/login-type" element={<LoginType />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;