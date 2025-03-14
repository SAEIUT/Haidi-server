import React from 'react';
import HomeNavbar from '../HomeNavbar';
import ProfilePhoto from './ProfilePhoto';
import ProfileButton from './ProfileButton';

interface ProfileScreenProps {
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  onEdit: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  firstname,
  lastname,
  email,
  tel,
  onEdit,
}) => {
  return (
    <div className="flex-grow p-6 bg-gray-100">
      <HomeNavbar navLight={true} bgLight={true} />
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Mon profil</h1>
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <ProfilePhoto />
        <ProfileButton />
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Prénom</label>
          <p className="text-gray-900 text-lg">{firstname}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Nom</label>
          <p className="text-gray-900 text-lg">{lastname}</p>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <p className="text-gray-900 text-lg">{email}</p>
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Téléphone</label>
          <p className="text-gray-900 text-lg">{tel}</p>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow transition hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            onClick={onEdit}
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
