import React from "react";

const ProfileButton: React.FC = () => {
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.result) {
          localStorage.setItem("profilePhoto", reader.result.toString());
          window.location.reload();
          await fetch('https://localhost/api/user/googleid/upload-photo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photo: reader.result.toString() }),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition">
        Changer la photo
        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
      </label>
    </div>
  );
};

export default ProfileButton;
