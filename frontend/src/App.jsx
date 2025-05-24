import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './assets/Homepage';
import SignUpType from './assets/SignUpType';
import RegisterTeacher from './assets/RegisterTeacher';
import RegisterStudent from './assets/RegisterStudent';
import LoginPage from './assets/LoginPage';

import TeacherDashboard from './assets/TeacherDashboard';
import ClassCreation from './assets/ClassCreation';
import TeacherClassList from './assets/TeacherClassList';
import MyProfileTeacher from './assets/MyProfileTeacher';
import GameBank from './assets/GameBank';
import TeacherGuessTheWord from './assets/TeacherGuessTheWord';

import StudentDashboard from './assets/StudentDashboard';
import MyProfileStudent from './assets/MyProfileStudent';

import GuessTheWord from './assets/GuessTheWord';

import MemoryGame from './assets/MemoryGame';
import InputsMemoryGame from './assets/InputsMemoryGame';

import PaaralanQuest from './assets/PaaralanQuest';
import ParkeQuest from './assets/ParkeQuest';

import GroupMode from './assets/Groupmode';


// Admin Side
import AddWordOfTheDay from './adminpages/AddWordOfTheDay';

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
        <Route path="/class-creation" element={<ClassCreation />} />
        <Route path="/teacher-classlist" element={<TeacherClassList />} />
        <Route path="/profile-teacher" element={<MyProfileTeacher />} />
        <Route path="/gamebank" element={<GameBank />} />
        <Route path="/guess-the-word-teacher" element={<TeacherGuessTheWord />} />
        
        {/* Student Dashboard Path */}

        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/profile-student" element={<MyProfileStudent />} />
        

        {/* Games Section Path */}
        <Route path="/guesstheword" element={<GuessTheWord />} />

        <Route path="/memorygame/:sessionId?" element={<MemoryGame />} />
        <Route path="/inputmemorygame" element={<InputsMemoryGame />} />

        <Route path="/paaralanquest" element={<PaaralanQuest />} />
        <Route path="/parkequest" element={<ParkeQuest />} />

        {/* Admin Side */}
        <Route path="/add-wotd" element={<AddWordOfTheDay />} />

        <Route path="/groupmode" element={<GroupMode />} />

      </Routes>
    </Router>
  );
};

export default App;