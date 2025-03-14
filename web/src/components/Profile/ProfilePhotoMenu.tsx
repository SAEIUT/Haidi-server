import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import ProfilePhoto from './ProfilePhoto';

const ProfilePhotoMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'état de la connexion
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirige vers la page vitrine
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Redirige vers la page de profil
  };

  // Si l'utilisateur n'est pas connecté, afficher un bouton de connexion à la place
  if (!isLoggedIn) {
    return (
      <button 
        onClick={() => navigate('/login')}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Se connecter
      </button>
    );
  }

  // Si connecté, afficher le menu avec la photo de profil
  return (
    <div className="relative">
      <div onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <ProfilePhoto className="w-8 h-8 rounded-full object-cover" />
      </div>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg dark:bg-slate-800">
          <button
            onClick={handleProfileClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white"
          >
            Voir mon profil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoMenu;