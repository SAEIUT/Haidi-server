import React from "react";
import HomeNavbar from "../HomeNavbar";

// Progress Bar Component
const ProgressBar: React.FC<{ progression: number }> = ({ progression }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 mb-2">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${progression}%` }}
      ></div>
    </div>
  );
};

// Export the Trajet interface
export interface Trajet {
  id: string;
  depart: string;
  arrivee: string;
  heure: string;
  date: string;
  duree: string;
  statut: "à venir" | "en cours" | "terminé";
  progression: number;
  transport?: string[];
  sousTrajets: {
    id: string;
    depart: string;
    arrivee: string;
    heure: string;
    date: string;
    duree: string;
    statut: string;
    progression: number;
    statusValue: number;
  }[];
}

// Export the TrajetListProps interface
export interface TrajetListProps {
  filtre?: string;
  onSelectTrajet: (id: string) => void;
  onViewDetails: (id: string) => void;
  trajets: Trajet[];
}

const TrajetList: React.FC<TrajetListProps> = ({ filtre = "", onSelectTrajet, onViewDetails, trajets }) => {
  const trajetsFiltres = filtre ? trajets.filter((trajet) => trajet.statut === filtre) : trajets;
  
  const handleQRButtonClick = (id: string) => {
    onSelectTrajet(id);
  };
  
  const handleDetailsButtonClick = (id: string) => {
    onViewDetails(id);
  };
  
  return (
    <div className="space-y-6">
      {trajetsFiltres.length > 0 ? (
        trajetsFiltres.map((trajet) => (
          <div key={trajet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{trajet.depart} → {trajet.arrivee}</h3>
                  <p className="text-gray-500 text-sm">ID: {trajet.id} • {trajet.date} • {trajet.heure}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    trajet.statut === "à venir" ? "bg-blue-100 text-blue-800" :
                    trajet.statut === "en cours" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {trajet.statut}
                </span>
              </div>
              
              {/* Progress Bar */}
              <ProgressBar progression={trajet.progression} />
              
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  onClick={() => handleQRButtonClick(trajet.id)}
                >
                  Voir QR Code
                </button>
                <button
                  className="text-green-500 hover:text-green-700 text-sm font-medium"
                  onClick={() => handleDetailsButtonClick(trajet.id)}
                >
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">
            Aucun trajet {filtre && `avec le statut "${filtre}"`} enregistré.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrajetList;