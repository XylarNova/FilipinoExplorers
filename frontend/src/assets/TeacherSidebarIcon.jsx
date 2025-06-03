import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Dashboard from './images/Navigation/DashboardIcon.png';
import Profile from './images/Navigation/ProfileIcon.png';
import ClassIcon from './images/Navigation/ClassIcon.png';
import GameEditor from './images/Navigation/GameEditorIcon.png';
import LogOut from './images/Navigation/LogOutIcon.png';

const TeacherSidebarIcon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: Dashboard, path: '/teacher-dashboard', label: 'Dashboard' },
    { icon: Profile, path: '/profile-teacher', label: 'My Profile' },
    { icon: ClassIcon, path: '/teacher-classlist', label: 'Classes' },
    { icon: GameEditor, path: '/gamebank', label: 'Game Editor' },
    { icon: LogOut, path: '/', label: 'Log Out' },
  ];

  return (
    <aside className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 w-[96px] h-full flex flex-col items-center gap-6 py-4">
      <div className="flex flex-col gap-6 mt-auto mb-auto">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.label === 'Log Out') localStorage.removeItem('token');
              navigate(item.path);
            }}
            className={`transition-transform duration-150 focus:outline-none ${
              location.pathname === item.path ? 'opacity-100 scale-110' : 'opacity-70'
            } hover:opacity-100 hover:scale-110`}
          >
            <img src={item.icon} alt={item.label} className="w-9 h-9" />
          </button>
        ))}
      </div>
    </aside>
  );
};

export default TeacherSidebarIcon;
