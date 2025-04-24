import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import Logo from './images/logo.png';
import Dashboard from './images/Navigation/DashboardIcon.png';
import Profile from './images/Navigation/ProfileIcon.png';
import ClassIcon from './images/Navigation/ClassIcon.png';
import GameEditor from './images/Navigation/GameEditorIcon.png';
import LogOut from './images/Navigation/LogOutIcon.png';

const TeacherClassList = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchClasses = async () => {
    const token = localStorage.getItem("token");
    let email;

    try {
      const decoded = jwtDecode(token);
      email = decoded.sub;

      if (!email) {
        console.error('Email not found in token');
        return;
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/classes/teacher/email/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const openManageModal = (classItem) => {
    setSelectedClass(classItem);
    setShowModal(true);
    setCopySuccess('');
  };

  const closeManageModal = () => {
    setShowModal(false);
    setSelectedClass(null);
    setCopySuccess('');
  };

  const handleCopyCode = () => {
    if (selectedClass?.classCode) {
      navigator.clipboard.writeText(selectedClass.classCode);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 1500);
    }
  };

  const updateClass = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedClass) return;
  
    try {
      const response = await axios.put(
        `http://localhost:8080/api/classes/update/${selectedClass.id}`,
        {
          name: selectedClass.name,
          description: selectedClass.description,
          bannerUrl: selectedClass.bannerUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Class updated successfully, refresh class list
        fetchClasses();
        closeManageModal();
      } else {
        console.error('Failed to update class');
      }
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };
  

  const mainBgClass = darkMode ? "bg-gray-900" : "bg-white";
  const sidebarBgClass = darkMode ? "bg-gray-800" : "bg-[#FDFBEE]";
  const sidebarBorderClass = darkMode ? "border-gray-700" : "border-[#CEC9A8]";
  const textClass = darkMode ? "text-white" : "text-[#213547]";

  return (
    <div className={`flex h-screen w-full ${mainBgClass} relative`}>
      {/* Sidebar */}
      <aside className={`w-[292px] ${sidebarBgClass} shadow-md border-r ${sidebarBorderClass} pt-8`}>
        <div className="mb-10 flex justify-center">
          <img src={Logo} alt="Filipino Explorer Logo" className="w-40" />
        </div>
        <nav className="space-y-6 pl-6">
          {[{ icon: Dashboard, label: 'Dashboard', path: '/teacher-dashboard' },
            { icon: Profile, label: 'My Profile', path: '/profile-teacher' },
            { icon: ClassIcon, label: 'Class', path: '/class' },
            { icon: GameEditor, label: 'Game Editor', path: '/editor' },
            { icon: LogOut, label: 'Log Out', path: '/logout' }]
            .map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center space-x-4 font-bold text-lg cursor-pointer ${textClass}`}
                onClick={() => navigate(item.path)}
              >
                <img src={item.icon} alt={item.label} className="w-6 h-6" />
                <span>{item.label}</span>
              </div>
            ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${mainBgClass} pt-15 px-10`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-[40px] font-bold font-['Fredoka'] ${textClass}`}>Classes</h1>
          <button
            onClick={() => navigate('/class-creation')}
            className="bg-[#108AB1] text-black border-[20px] border-[#289A7C] font-['Fredoka'] font-bold text-[15px] py-2 px-6 pr-4 rounded-lg shadow hover:opacity-90 transition"
          >
            Create Class
          </button>
        </div>

        {/* Classes List */}
        <div className="flex flex-wrap gap-6">
          {loading ? (
            <p>Loading classes...</p>
          ) : classes.length > 0 ? (
            classes.map((classItem, idx) => (
              <div
                key={idx}
                className={`w-[220px] flex items-center p-3 rounded-[10px] shadow-md relative ${idx % 2 === 0 ? 'bg-blue-100' : 'bg-green-100'}`}
                style={{ height: '100px' }}
              >
                <div className="w-[70px] h-[70px] rounded-lg flex-shrink-0 overflow-hidden bg-gray-300 flex items-center justify-center text-white font-bold text-xl">
                  {classItem.bannerUrl ? (
                    <img src={classItem.bannerUrl} alt={classItem.name} className="object-cover w-full h-full" />
                  ) : (
                    <span>{classItem.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 pl-4 overflow-hidden">
                  <h2 className="text-base font-bold font-['Poppins'] truncate">{classItem.name}</h2>
                </div>
                <div className="absolute top-2 right-2 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
                  </svg>
                  <div className="hidden group-hover:block absolute right-0 top-6 bg-white shadow-md rounded-lg w-36 z-10">
                    <button onClick={() => openManageModal(classItem)} className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100">Manage Class</button>
                    <button className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100">Add Student</button>
                    <button className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100">Get Code</button>
                    <button className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100">Delete Class</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No classes found.</p>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && selectedClass && (
        <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] relative shadow-lg border border-gray-300">
            <button
              onClick={closeManageModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05a1 1 0 011.414-1.414L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-4">Edit Class</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-medium">Class Name</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={selectedClass.name}
                  onChange={(e) => setSelectedClass({ ...selectedClass, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium">Description</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  value={selectedClass.description || ''}
                  onChange={(e) => setSelectedClass({ ...selectedClass, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium">Banner URL</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={selectedClass.bannerUrl || ''}
                  onChange={(e) => setSelectedClass({ ...selectedClass, bannerUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium">Class Code</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
                    value={selectedClass.classCode || ''}
                    readOnly
                  />
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
                {copySuccess && <p className="text-green-500 text-sm mt-1">{copySuccess}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={closeManageModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={updateClass}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`rounded-full p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
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

export default TeacherClassList;
