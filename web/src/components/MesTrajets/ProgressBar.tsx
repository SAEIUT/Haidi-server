import React from "react";

interface ProgressBarProps {
  progression: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progression }) => {
  // Ajouter un console.log pour vérifier que la valeur est bien reçue
  console.log("ProgressBar reçoit:", progression);
  
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded">
      <div 
        className="absolute h-4 bg-green-500 rounded" 
        style={{ width: `${progression}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;