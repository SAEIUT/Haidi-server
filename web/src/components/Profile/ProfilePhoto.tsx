import React, { useState, useEffect } from "react";

const ProfilePhoto: React.FC<{ className?: string }> = ({ className }) => {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const storedPhoto = localStorage.getItem("profilePhoto");
    if (storedPhoto) {
      setPhoto(storedPhoto);
    } else {
      setPhoto("https://www.example.com/default-photo.jpg"); // Photo par dÃ©faut
    }
  }, []);

  return (
    <div className={`flex justify-center ${className?.includes('w-8') ? '' : 'mb-6'}`}>
      <img
        src={photo || "https://www.example.com/default-photo.jpg"}
        alt="Profile"
        className={`aspect-square rounded-full object-cover overflow-hidden ${className || 'w-32 h-32'}`}
        style={{ borderRadius: '50%' }}
      />
    </div>
  );
};

export default ProfilePhoto;