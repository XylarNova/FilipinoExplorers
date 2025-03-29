import React, { useState } from 'react';
import { registerTeacher } from '../api/userManagementApi';

const TeacherRegistration = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        institution: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerTeacher(formData);
            console.log('Teacher registered successfully:', response.data);
        } catch (error) {
            console.error('Error registering teacher:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} />
            <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="text" name="institution" placeholder="Institution" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
            <button type="submit">Register</button>
        </form>
    );
};

export default TeacherRegistration;