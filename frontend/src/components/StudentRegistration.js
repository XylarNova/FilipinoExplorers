import React, { useState } from 'react';
import { registerStudent } from '../api/userManagementApi';

const StudentRegistration = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        birthdate: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        try {
            const response = await registerStudent(formData);
            console.log('Student registration successful:', response.data);
        } catch (error) {
            console.error('Error registering student:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} required />
            <input type="text" name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="date" name="birthdate" placeholder="Birthdate" value={formData.birthdate} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default StudentRegistration;