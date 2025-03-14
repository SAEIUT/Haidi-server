import React from "react";
import HomeNavbar from "../HomeNavbar";

interface FiltreTrajetProps {
  onFiltreChange: (statut: string) => void;
}

const FiltreTrajets: React.FC<FiltreTrajetProps> = ({ onFiltreChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
       <HomeNavbar navLight={true} bgLight={false} /> 
      <h2 className="text-lg font-semibold mb-3">Filtrer par statut</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFiltreChange("")}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
        >
          Tous
        </button>
        <button
          onClick={() => onFiltreChange("à venir")}
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          À venir
        </button>
        <button
          onClick={() => onFiltreChange("en cours")}
          className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
        >
          En cours
        </button>
        <button
          onClick={() => onFiltreChange("terminé")}
          className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
        >
          Terminé
        </button>
      </div>
    </div>
  );
};

export default FiltreTrajets;