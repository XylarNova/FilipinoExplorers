import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './assets/Homepage';
import SignUpType from './assets/SignUpType';
import RegisterTeacher from './assets/RegisterTeacher';
import RegisterStudent from './assets/RegisterStudent';
import LoginPage from './assets/LoginPage';

import TeacherDashboard from './assets/TeacherDashboard';
import StudentDashboard from './assets/StudentDashboard';

import GuessTheWord from './assets/Guesstheword';
import MemoryGame from './assets/MemoryGame';
import PaaralanQuest from './assets/PaaralanQuest';
import ParkeQuest from './assets/ParkeQuest';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUpType />} />
        <Route path="/register-teacher" element={<RegisterTeacher />} />
        <Route path="/register-student" element={<RegisterStudent />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Games Section Path */}
        <Route path="/guesstheword" element={<GuessTheWord />} />
        <Route path="/memorygame" element={<MemoryGame />} />
        <Route path="/paaralanquest" element={<PaaralanQuest />} />
        <Route path="/parkequest" element={<ParkeQuest />} />
      </Routes>
    </Router>
  );
};

export default App;