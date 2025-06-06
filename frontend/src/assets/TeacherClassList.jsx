import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import TeacherSidebar from './TeacherSidebar';
import class1 from '../assets/images/ClassroomBanner/class1.jpg';
import class2 from '../assets/images/ClassroomBanner/class2.jpg';
import class3 from '../assets/images/ClassroomBanner/class3.jpg';
import class4 from '../assets/images/ClassroomBanner/class4.jpg';
import class5 from '../assets/images/ClassroomBanner/class5.jpg';
import class6 from '../assets/images/ClassroomBanner/class6.jpg';
import class7 from '../assets/images/ClassroomBanner/class7.jpg';
import class8 from '../assets/images/ClassroomBanner/class8.jpg';
import class9 from '../assets/images/ClassroomBanner/class9.jpg';
import class10 from '../assets/images/ClassroomBanner/class10.jpg';

const TeacherClassList = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showGetCodeModal, setShowGetCodeModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);


  // Dark Mode Setup
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) setDarkMode(storedDarkMode === "true");
  }, []);

  const vibrantColors = [
  'bg-[#EF476F]', // Red
  'bg-[#FFD166]', // Yellow
  'bg-[#06D6A0]', // Teal
  'bg-[#118AB2]', // Blue
  'bg-[#073B4C]', // Dark Blue
];


  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch Classes
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

  // Open modals
  const openManageModal = (classItem) => {
    setSelectedClass(classItem);
    setShowManageModal(true);
    setCopySuccess('');
  };

  const closeManageModal = () => {
    setShowManageModal(false);
    setSelectedClass(null);
    setCopySuccess('');
  };

  const openGetCodeModal = (classItem) => {
    setSelectedClass(classItem);
    setShowGetCodeModal(true);
  };

  const closeGetCodeModal = () => {
    setShowGetCodeModal(false);
    setSelectedClass(null);
  };

  const openDeleteConfirmationModal = (classItem) => {
    setSelectedClass(classItem);
    setShowDeleteConfirmationModal(true);
  };

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
    setSelectedClass(null);
  };

  // Handle copying code
  const handleCopyCode = () => {
    if (selectedClass?.classCode) {
      navigator.clipboard.writeText(selectedClass.classCode);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 1500);
    }
  };

  // Delete Class
  const deleteClass = async () => {
    const classId = selectedClass.id;
    const token = localStorage.getItem("token");
    if (!token || !classId) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/classes/delete/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Refresh class list after deleting the class
        fetchClasses();
        closeDeleteConfirmationModal();
      } else {
        console.error('Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  // Update class
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
        // Refresh class list after update
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

  useEffect(() => {
  const handleClickOutside = (e) => {
    // If click is outside any dropdown, close it
    if (!e.target.closest('.dropdown-wrapper')) {
      setOpenDropdownId(null);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

  return (
    <div className={`flex h-screen w-full ${mainBgClass} relative`}>
      {/* Sidebar */}
          <TeacherSidebar darkMode={darkMode} />

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
                className={`w-[220px] flex items-center p-3 rounded-[10px] shadow-md relative ${vibrantColors[idx % vibrantColors.length]}`}
                style={{ height: '100px' }}
              >

             <div className="w-[70px] h-[70px] rounded-xl flex-shrink-0 bg-white flex items-center justify-center text-[#073B4C] text-3xl font-bold shadow-md overflow-hidden">
                {classItem.bannerUrl ? (
                  <img
                    src={
                      classItem.bannerUrl.startsWith('/assets')
                        ? classItem.bannerUrl
                        : `/assets/images/ClassroomBanner/${classItem.bannerUrl}`
                    }
                    alt={classItem.name}
                    className="object-cover w-full h-full rounded-xl"
                  />
                ) : (
                  <span>{classItem.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>


                <div className="flex-1 pl-4 overflow-hidden">
                  <h2 className="text-base font-bold font-['Poppins'] truncate">{classItem.name}</h2>
                </div>
                <div className="absolute top-2 right-2 dropdown-wrapper">
  <svg
    onClick={() =>
      setOpenDropdownId(openDropdownId === classItem.id ? null : classItem.id)
    }
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-700 cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 12h.01M12 12h.01M18 12h.01"
    />
        </svg>

        {openDropdownId === classItem.id && (
          <div className="absolute right-0 top-6 bg-white shadow-md rounded-lg w-36 z-10">
            <button
              onClick={() => openManageModal(classItem)}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Manage Class
            </button>
            <button className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100">
              Add Student
            </button>
            <button
              onClick={() => openGetCodeModal(classItem)}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Get Code
            </button>
            <button
              onClick={() => openDeleteConfirmationModal(classItem)}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Delete Class
            </button>
          </div>
        )}
      </div>

              </div>
            ))
          ) : (
            <p>No classes found.</p>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmationModal && selectedClass && (
        <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] relative shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Are you sure you want to delete this class?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteConfirmationModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={deleteClass}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Class Modal */}
      {showManageModal && selectedClass && (
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
                <label className="block font-medium mb-2">Choose a Class Banner</label>
                <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {[
                    'class1.jpg', 'class2.jpg', 'class3.jpg', 'class4.jpg', 'class5.jpg',
                    'class6.jpg', 'class7.jpg', 'class8.jpg', 'class9.jpg', 'class10.jpg'
                  ].map((banner, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedClass({ ...selectedClass, bannerUrl: banner })}
                      className={`border-4 rounded-md overflow-hidden ${
                        selectedClass.bannerUrl === banner ? 'border-[#06D7A0] shadow-lg scale-105' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={`/assets/images/ClassroomBanner/${banner}`}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
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
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Get Class Code Modal */}
      {showGetCodeModal && selectedClass && (
        <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] relative shadow-lg border border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Class Code</h2>
            <p className="mb-6">Share this code with students to allow them to join your class:</p>
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
            <div className="flex justify-end mt-6">
              <button
                onClick={closeGetCodeModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassList;
