import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTeacherProfile = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        institution: '',
    });

    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch the current teacher profile details on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/user-management/teacher-profile/');
                setFormData(response.data); // Assuming the API returns teacher details
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://127.0.0.1:8000/user-management/teacher-profile/', formData);
            setSuccessMessage('Profile updated successfully!');
            console.log('Update response:', response.data);
        } catch (error) {
            setErrorMessage('Error updating profile. Please try again.');
            console.error('Error updating profile:', error);
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <h1>Edit Teacher Profile</h1>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="institution"
                    placeholder="Institution"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default EditTeacherProfile;