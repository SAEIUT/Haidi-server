import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import HomeNavbar from '../components/HomeNavbar';
import ProfileScreen from '../components/Profile/ProfileScreen';
import EditProfile from '../components/Profile/EditProfile';

interface ProfileData {
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>({ firstname: '', lastname: '', email: '', tel: '' });
  const [user, setUser] = useState(auth.currentUser);
  const [status, setStatus] = useState('profile');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const retrieveProfile = async () => {
      try {
        if (user) {
          const response = await fetch(`http://localhost/api/user/byGoogleid/${user.uid}`);
          if (!response.ok) throw new Error('Erreur lors de la récupération du profil');
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    retrieveProfile();
  }, [user]);

  const handleSave = () => {
    console.log("Profil mis à jour :", profile);
    setStatus('profile');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HomeNavbar navLight={true} bgLight={true} />
      <div className="flex-grow pt-16">
        {status === 'profile' ? (
          <ProfileScreen {...profile} onEdit={() => setStatus('edit')} />
        ) : (
          <EditProfile
            editedProfile={profile}
            onChange={(updatedProfile: Partial<ProfileData>) => setProfile((prev) => ({ ...prev, ...updatedProfile }))}
            onSave={handleSave}
            onCancel={() => setStatus('profile')}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
