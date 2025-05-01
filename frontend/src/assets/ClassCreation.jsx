import React, { useState } from 'react';
import Logo from './images/logo.png';
import Dashboard from './images/Navigation/DashboardIcon.png';
import Profile from './images/Navigation/ProfileIcon.png';
import ClassIcon from './images/Navigation/ClassIcon.png';
import GameEditor from './images/Navigation/GameEditorIcon.png';
import LogOut from './images/Navigation/LogOutIcon.png';

const ClassCreation = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enrollmentMethod, setEnrollmentMethod] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleDarkMode = () => setDarkMode(prevState => !prevState);

  const mainBgClass = darkMode ? "bg-gray-900" : "bg-white";
  const sidebarBgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const sidebarBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";

  const handleFileChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      setErrorMessage('No token found.');
      return;
    }

    const formData = new FormData();
    formData.append("info", new Blob([JSON.stringify({ name, description, enrollmentMethod })], { type: "application/json" }));

    if (bannerFile) {
      formData.append("banner", bannerFile);
    }

    try {
      const response = await fetch('http://localhost:8080/api/classes/createclass', {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to create class. Status: ${response.status}`);

      const data = await response.json();
      console.log("Class created successfully:", data);

      // Reset form fields after success
      setName('');
      setDescription('');
      setEnrollmentMethod('');
      setBannerFile(null);
      setErrorMessage('');

      // Add students if provided
      if (students.length > 0) {
        await addStudentsToClass(students, data.classCode);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(`Failed to create class: ${error.message}`);
    }
  };

  const handleEnrollmentChange = (e) => {
    const value = e.target.value;
    setEnrollmentMethod(value);
    if (value === "Manually Input Email") {
      setShowModal(true);
    }
  };

  const handleAddStudent = () => {
    if (searchEmail && !students.includes(searchEmail)) {
      setStudents(prev => [...prev, searchEmail]);
      setSearchEmail('');
      setShowModal(false);
    } else {
      setErrorMessage('Please enter a valid email or avoid adding duplicates.');
    }
  };

  const addStudentsToClass = async (studentsList, classCode) => {
    const token = localStorage.getItem('token');
    try {
      for (const email of studentsList) {
        const response = await fetch('http://localhost:8080/api/classes/add-student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentEmail: email,
            classCode: classCode,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to add student with email: ${email}. Response: ${errorText}`);
        }

        const result = await response.json();
        console.log("Student added:", result);
      }

      setStudents([]); // Clear students after successful addition
    } catch (error) {
      console.error("Error adding students:", error);
      setErrorMessage(`Failed to add students: ${error.message}`);
    }
  };

  return (
    <div className={`flex h-screen w-full ${mainBgClass} relative`}>
      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-r ${sidebarBorderClass} pt-8`}>
        <div className="mb-10 flex justify-center">
          <img src={Logo} alt="Filipino Explorer Logo" className="w-40" />
        </div>
        <nav className="space-y-6 pl-6">
          {[{ icon: Dashboard, text: 'Dashboard' }, { icon: Profile, text: 'My Profile' }, { icon: ClassIcon, text: 'Class' }, { icon: GameEditor, text: 'Game Editor' }, { icon: LogOut, text: 'Log Out' }]
            .map(({ icon, text }) => (
              <div key={text} className={`flex items-center space-x-4 font-bold text-lg ${textClass}`}>
                <img src={icon} alt={text} className="w-6 h-6" />
                <span>{text}</span>
              </div>
            ))}
        </nav>
      </aside>

      <main className={`flex-1 ${mainBgClass} pt-10 px-10`}>
        <h1 className={`text-[40px] font-bold font-['Fredoka'] ${textClass} mb-8`}>Create Class Form</h1>
        {errorMessage && (
          <div className="text-red-500 mb-4">
            <strong>{errorMessage}</strong>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-8">
            <div>
              <label className="block font-bold text-[20px] text-[#073A4D] mb-2">Class name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-[10px] border border-[#FFD067] w-[441px] h-[32px] px-3"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[20px] text-[#073A4D] mb-2">Upload Class Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-[441px] h-[32px] rounded-[10px] border-[2px] border-[#06D7A0] text-gray-500 font-light text-[15px] p-1"
              />
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <label className="block font-bold text-[20px] text-[#073A4D] mb-2">Class Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-[10px] border border-[#FFD067] w-[452px] h-[141px] px-3 py-2 resize-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[20px] text-[#073A4D] mb-2">Choose Enrollment Method</label>
              <select
                value={enrollmentMethod}
                onChange={handleEnrollmentChange}
                className="rounded-[10px] border border-[#F04772] w-[441px] h-[32px] px-2"
                required
              >
                <option value="" disabled>Select an option</option>
                <option value="Invite through code">Invite through code</option>
                <option value="Manually Input Email">Manually Input Email</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#06D7A0] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#05b88a]"
          >
            Create Class
          </button>
        </form>
      </main>

      {showModal && (
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-xl z-50 border border-gray-300 w-96">
          <h2 className="text-xl font-bold mb-4">Search for Student Email</h2>
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Enter student email"
            className="w-full border p-2 rounded mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStudent}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Student
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4">
        <button onClick={toggleDarkMode} className={`rounded-full p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 15a5 5 0 100-10 5 5 0 000 10zm0 2a7 7 0 100-14 7 7 0 000 14zM10 0v2M10 18v2M0 10h2M18 10h2M3.515 3.515l1.414 1.414M15.071 15.071l1.414 1.414M3.515 16.485l1.414-1.414M15.071 4.929l1.414-1.414" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ClassCreation;
