import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import ProfilePhotoMenu from '../components/Profile/ProfilePhotoMenu'; // Importez le composant

export default function HomeNavbar({ navLight, bgLight }: { navLight: boolean, bgLight: boolean }) {
  const [scroll, setScroll] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handlerScroll = () => {
      if (window.scrollY > 50) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener('scroll', handlerScroll);

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    return () => {
      window.removeEventListener('scroll', handlerScroll);
    };
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className={`transition-all duration-300 fixed top-0 left-0 right-0 z-50 h-18
      ${scroll ? 'py-1 shadow-md backdrop-blur-sm bg-white/90 dark:bg-slate-900/90' : 'py-2 bg-transparent'}
      ${bgLight && !scroll ? 'bg-white dark:bg-slate-900' : ''}`}
      id="navbar">
      <div className="container mx-auto px-4 relative flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link to="/" className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
            <span className="text-red-500 mr-1">C</span>FM
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Link
            to="/Home"
            className={`px-2 py-1 text-sm font-medium transition-colors ${
              location.pathname === "/Home"
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-slate-700 hover:text-red-500 dark:text-slate-200'
            }`}
          >
            Home
          </Link>
          <Link
            to="/Mes-trajets"
            className={`px-2 py-1 text-sm font-medium transition-colors ${
              location.pathname === "/Mes-trajets"
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-slate-700 hover:text-red-500 dark:text-slate-200'
            }`}
          >
            Mes Trajets
          </Link>
        </div>
        <div className="flex items-center space-x-2">
        <button
  onClick={toggleDarkMode}
  className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
>
  {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
</button>

          <ProfilePhotoMenu />
        </div>
      </div>
    </nav>
  );
}
