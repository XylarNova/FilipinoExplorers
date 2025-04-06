import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Homepage from './components/Homepage';

// TYPES
import RegisterType from './components/RegisterType';
import LoginType from './components/LoginType';

// Teacher Import
import TeacherRegistration from './components/TeacherRegistration';
import TeacherLogin from './components/TeacherLogin';
import EditTeacherProfile from './components/EditTeacherProfile';

// Student Import
import StudentRegistration from './components/StudentRegistration';
import StudentLogin from './components/StudentLogin';
import EditStudentProfile from './components/EditStudentProfile';

// Helper function to check authentication
const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return token ? true : false;
};

// Helper function to fetch the user's role from the backend
const fetchUserRole = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const response = await fetch('http://localhost:8080/api/teachers/decode-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.role; // 'teacher' or 'student'
        } else {
            console.error('Failed to fetch user role');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
};

// PrivateRoute component
const PrivateRoute = ({ children, role }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserRole = async () => {
            const role = await fetchUserRole();
            setUserRole(role);
            setLoading(false);
        };
        getUserRole();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while fetching the role
    }

    if (!isAuthenticated() || userRole !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/register-type" element={<RegisterType />} />
                <Route path="/login-type" element={<LoginType />} />
                
                {/* Teacher Side */}
                <Route path="/register-teacher" element={<TeacherRegistration />} />
                <Route path="/login-teacher" element={<TeacherLogin />} />
                <Route
                    path="/edit-profile-teacher"
                    element={
                        <PrivateRoute role="teacher">
                            <EditTeacherProfile />
                        </PrivateRoute>
                    }
                />

                {/* Student Side */}
                <Route path="/register-student" element={<StudentRegistration />} />
                <Route path="/login-student" element={<StudentLogin />} />
                <Route
                    path="/edit-profile-student"
                    element={
                        <PrivateRoute role="student">
                            <EditStudentProfile />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;