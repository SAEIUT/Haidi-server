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

// Types pour les étapes du sous-trajet
export type EtapeStatus = 
  | "not_started"    // Pas encore commencé
  | "departing"      // En partance 
  | "en_route"       // En route
  | "arriving"       // En arrivée
  | "completed";     // Terminé

export interface SousTrajetEtape {
  id: string;
  depart: string;
  arrivee: string;
  departureTime: string;
  arrivalTime: string;
  status: EtapeStatus;
}

// Export the Trajet interface avec sous-trajets détaillés
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
  etapes: SousTrajetEtape[];
}

// Export the TrajetListProps interface
export interface TrajetListProps {
  filtre?: string;
  onSelectTrajet: (id: string) => void;
  onViewDetails: (id: string) => void;
  trajets: Trajet[];
}

// Calcul de la progression détaillée selon les étapes
const calculateDetailedProgression = (etapes: SousTrajetEtape[]): number => {
  if (etapes.length === 0) return 0;
  
  // Si toutes les étapes sont terminées, progression 100%
  if (etapes.every(etape => etape.status === "completed")) return 100;
  
  // Si toutes les étapes sont non commencées, progression 0%
  if (etapes.every(etape => etape.status === "not_started")) return 0;
  
  // Déterminer la valeur de progression pour chaque étape
  const etapeValue = 100 / (etapes.length * 2); // Chaque étape a un départ et une arrivée
  
  let progression = 0;
  
  etapes.forEach((etape) => {
    switch (etape.status) {
      case "not_started":
        // Aucun ajout à la progression
        break;
      case "departing":
        progression += etapeValue / 2; // Mi-chemin du départ
        break;
      case "en_route":
        progression += etapeValue; // Départ complet
        break;
      case "arriving":
        progression += etapeValue + (etapeValue / 2); // Départ complet + mi-chemin de l'arrivée
        break;
      case "completed":
        progression += etapeValue * 2; // Départ et arrivée complète
        break;
    }
  });
  
  return Math.min(Math.round(progression), 100); // Limiter à 100% maximum
};

// Fonction pour déterminer le statut global du trajet
const determineOverallStatus = (etapes: SousTrajetEtape[]): "à venir" | "en cours" | "terminé" => {
  if (etapes.some(etape => etape.status === "not_started")) {
    return "à venir";
  } else if (etapes.every(etape => etape.status === "completed")) {
    return "terminé";
  } else {
    return "en cours";
  }
};

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
      <HomeNavbar navLight={true} bgLight={true} />

      {trajetsFiltres.length > 0 ? (
        trajetsFiltres.map((trajet) => (
          <div key={trajet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{trajet.depart} → {trajet.arrivee}</h3>
                  <p className="text-gray-500 text-sm">ID: {trajet.id} • {trajet.date} • {trajet.heure}</p>
                  
                  {/* Affichage des étapes intermédiaires */}
                  {trajet.etapes.length > 1 && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600">Étapes: 
                        {trajet.etapes.map((etape, index) => (
                          <span key={etape.id} className="ml-1">
                            {index > 0 && " → "}
                            <span className={`${etape.status !== "not_started" ? "font-medium" : ""}`}>
                              {index === 0 ? etape.depart : ""}
                              {index > 0 && etape.depart}
                              {index < trajet.etapes.length - 1 && ` → ${etape.arrivee}`}
                              {index === trajet.etapes.length - 1 && etape.arrivee}
                            </span>
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    determineOverallStatus(trajet.etapes) === "à venir" ? "bg-blue-100 text-blue-800" :
                    determineOverallStatus(trajet.etapes) === "en cours" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {determineOverallStatus(trajet.etapes)}
                </span>
              </div>
              
              {/* Progress Bar avec progression détaillée */}
              <ProgressBar progression={calculateDetailedProgression(trajet.etapes)} />
              
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