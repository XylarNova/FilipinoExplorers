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
import MyAccountTeacher from './assets/MyAccountTeacher';
import ProgressTracking from './assets/ProgressTracking'; 


import StudentDashboard from './assets/StudentDashboard';
import MyProfileStudent from './assets/MyProfileStudent';
import MyAccountStudent from './assets/MyAccountStudent';
import StudentModule from './assets/StudentModule';


import GuessTheWord from './assets/GuessTheWord';

import MemoryGame from './assets/MGMemoryGame';
import MemoryGameGroup from './assets/MGMemoryGameGroup';

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

         {/* Teacher Side Path */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/class-creation" element={<ClassCreation />} />
        <Route path="/teacher-classlist" element={<TeacherClassList />} />
        <Route path="/profile-teacher" element={<MyProfileTeacher />} />
        <Route path="/my-account-teacher" element={<MyAccountTeacher />} />
        <Route path="/gamebank" element={<GameBank />} />
        <Route path="/guess-the-word-teacher" element={<TeacherGuessTheWord />} />
        <Route path="/progress-tracking/:classRoomId" element={<ProgressTracking />} />
        
        {/* Student Side Path */}

        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/profile-student" element={<MyProfileStudent />} />
        <Route path="/account-student" element={<MyAccountStudent />} />
        <Route path="/student-modules" element={<StudentModule />} />



        

        {/* Games Section Path */}
       {/*<Route path="/guesstheword" element={<GuessTheWord />} />*/}
        <Route path="/memorygamegroup" element={<MemoryGameGroup />} />wd

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