import React from "react";
import HomeNavbar from '../HomeNavbar';

interface EditProfileProps {
  editedProfile: {
    firstname: string;
    lastname: string;
    email: string;
    tel: string;
    password?: string;
  };
  onChange: (profile: Partial<EditProfileProps["editedProfile"]>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({
  editedProfile,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="flex-grow p-7 bg-gray-100">
      <HomeNavbar navLight={true} bgLight={true} />
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Modifier votre profil</h1>
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Prénom</label>
          <input
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            value={editedProfile.firstname}
            onChange={(e) => onChange({ firstname: e.target.value })}
            placeholder="Entrez votre prénom"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Nom</label>
          <input
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            value={editedProfile.lastname}
            onChange={(e) => onChange({ lastname: e.target.value })}
            placeholder="Entrez votre nom"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="email"
            value={editedProfile.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Entrez votre email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Téléphone</label>
          <input
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="tel"
            value={editedProfile.tel}
            onChange={(e) => onChange({ tel: e.target.value })}
            placeholder="Entrez votre téléphone"
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">Nouveau mot de passe</label>
          <input
            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="password"
            value={editedProfile.password || ""}
            onChange={(e) => onChange({ password: e.target.value })}
            placeholder="Entrez un nouveau mot de passe"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="w-1/2 mr-2 px-4 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
            onClick={onSave}
          >
            Sauvegarder
          </button>
          <button
            className="w-1/2 ml-2 px-4 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition"
            onClick={onCancel}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
