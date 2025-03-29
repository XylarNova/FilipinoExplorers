import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/user-management/', // Backend endpoint
});

// API Endpoints
export const registerTeacher = (data) => API.post('register-teacher/', data);
export const loginTeacher = (data) => API.post('login-teacher/', data);
export const registerStudent = (data) => API.post('register-student/', data);
export const loginStudent = (data) => API.post('login-student/', data);