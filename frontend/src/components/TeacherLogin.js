import React, { useState } from 'react';
import { loginTeacher } from '../api/userManagementApi';

const TeacherLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginTeacher(formData);
            console.log('Login successful:', response.data);

            // Example: Redirect or show teacher dashboard after login
            // window.location.href = "/teacher-dashboard";
        } catch (error) {
            console.error('Error logging in teacher:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default TeacherLogin;