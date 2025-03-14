import React, { useState, useEffect } from "react";
import TrajetList from "../components/MesTrajets/TrajetList";
import HomeNavbar from '../components/HomeNavbar';

// Définition des données exemple
const exampleData = {
    idDossier: 4321,
    idPMR: 1,
    googleId: "QZc8mk3YpfcYRhZ2o9VNG96IAQs1",
    enregistre: true,
    bagage: {
        bagagesList: [1111, 2222],
        specialBagage: ""
    },
    specialAssistance: {
        wheelchair: false,
        visualAssistance: false,
        hearingAssistance: false,
        otherAssistance: ""
    },
    security: {
        securityQuestions: {
            packedOwn: false,
            leftUnattended: false,
            acceptedItems: false,
            receivedItems: false,
            dangerousGoods: false
        },
        declarations: {
            weaponsFirearms: false,
            explosives: false,
            flammableMaterials: false,
            radioactiveMaterials: false,
            toxicSubstances: false,
            compressedGases: false,
            illegalDrugs: false
        },
        validDocuments: false,
        documentsExpiry: "",
        dangerousItems: [],
        liquidVolume: "",
        medicalEquipment: ""
    },
    additionalInfo: {
        emergencyContact: "",
        medicalInfo: "",
        dietaryRestrictions: ""
    },
    sousTrajets: [
        {
            BD: "SNCF",
            numDossier: 1234,
            statusValue: 0, // Pas encore commencé
            departure: "Courbevoie",
            arrival: "CDG",
            departureTime: "2024-12-23T03:25:44.000Z",
            arrivalTime: "2024-12-24T04:25:44.000Z"
        },
        {
            BD: "SNCF",
            numDossier: 5678,
            statusValue: 1, // En cours
            departure: "CDG",
            arrival: "Courbevoie",
            departureTime: "2024-12-23T05:25:44.000Z",
            arrivalTime: "2024-12-24T06:25:44.000Z"
        }
    ]
};

// Enumération pour l'état des étapes
export type EtapeStatus = "not_started" | "en_route" | "completed"; 

// Interface pour définir les étapes
export interface SousTrajetEtape {
    id: string;
    depart: string;
    arrivee: string;
    departureTime: string;
    arrivalTime: string;
    status: EtapeStatus;
}

// Interface pour définir un trajet
export interface Trajet {
    id: string;
    depart: string;
    arrivee: string;
    date: string;
    heure: string;
    duree: string;
    statut: "à venir" | "en cours" | "terminé";
    progression: number;
    etapes: SousTrajetEtape[];
}

// Formater la date pour l'affichage
const formatDate = (dateString: string): { date: string, heure: string } => {
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('fr-FR'),
        heure: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
};

// Calculer la durée entre deux dates
const calculateDuration = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
};

// Déterminer le statut global d'un trajet multi-étapes
const determineOverallStatus = (sousTrajets: { statusValue: number }[]): "à venir" | "en cours" | "terminé" => {
  const hasNotStarted = sousTrajets.some(st => st.statusValue === 0);
  const hasInProgress = sousTrajets.some(st => st.statusValue === 1);
  const hasCompleted = sousTrajets.every(st => st.statusValue === 2);

  if (hasNotStarted) {
      return "à venir";
  } 
  if (hasCompleted) {
      return "terminé";
  } 
  if (hasInProgress) {
      return "en cours";
  }
  return "à venir"; // Par défaut
};

const MesTrajets: React.FC = () => {
    const [filtre, setFiltre] = useState("");
    const [trajets, setTrajets] = useState<Trajet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Charger les données des trajets au montage du composant
    useEffect(() => {
        setIsLoading(true);
        
        // Créer des objets Trajet à partir de exampleData.sousTrajets
        const formattedTrajets: Trajet[] = exampleData.sousTrajets.map((sousTrajet, index) => {
            const departFormatted = formatDate(sousTrajet.departureTime);
            
            // Conversion de statusValue à un Enum EtapeStatus
            const statusEtape: EtapeStatus = sousTrajet.statusValue === 0
                ? "not_started"
                : sousTrajet.statusValue === 1
                ? "en_route"
                : "completed"; // On suppose que 2 est pour "terminé"
            
            return {
                id: `${exampleData.idDossier}-${sousTrajet.numDossier}`,
                depart: sousTrajet.departure,
                arrivee: sousTrajet.arrival,
                date: departFormatted.date,
                heure: departFormatted.heure,
                duree: calculateDuration(sousTrajet.departureTime, sousTrajet.arrivalTime),
                statut: determineOverallStatus(exampleData.sousTrajets), // Utilisation corrigée
                progression: 0, // Peut être calculée dynamiquement
                etapes: [{
                    id: `${exampleData.idDossier}-etape-${index}`,
                    depart: sousTrajet.departure,
                    arrivee: sousTrajet.arrival,
                    departureTime: sousTrajet.departureTime,
                    arrivalTime: sousTrajet.arrivalTime,
                    status: statusEtape // Utilise le type d'état compatible
                }]
            };
        });
        
        setTrajets(formattedTrajets);
        setIsLoading(false);
    }, []);

    const handleSelectTrajet = (id: string) => {
        console.log("Trajet sélectionné:", id);
    };

    const handleViewDetails = (id: string) => {
        console.log("Détails du trajet:", id);
    };

    const handleFilterChange = (newFilter: string) => {
        setFiltre(newFilter);
    };

    return (
        <div className="flex-grow p-6">
            <HomeNavbar navLight={true} bgLight={true} />
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">📍 Mes Trajets</h1>
                    <p className="text-gray-600">Visualisez et gérez tous vos trajets</p>
                </div>

                <div className="mb-6">
                    <div className="flex space-x-4">
                        <button 
                            onClick={() => handleFilterChange("")}
                            className={`px-4 py-2 text-sm rounded-full ${filtre === "" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            Tous
                        </button>
                        <button 
                            onClick={() => handleFilterChange("à venir")}
                            className={`px-4 py-2 text-sm rounded-full ${filtre === "à venir" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            À venir
                        </button>
                        <button 
                            onClick={() => handleFilterChange("en cours")}
                            className={`px-4 py-2 text-sm rounded-full ${filtre === "en cours" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            En cours
                        </button>
                        <button 
                            onClick={() => handleFilterChange("terminé")}
                            className={`px-4 py-2 text-sm rounded-full ${filtre === "terminé" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            Terminés
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold mb-4">Trajets {filtre && `(${filtre})`}</h2>
                            <TrajetList 
                                filtre={filtre} 
                                onSelectTrajet={handleSelectTrajet} 
                                onViewDetails={handleViewDetails} 
                                trajets={trajets} 
                            />
                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold mb-4">Résumé des activités</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <h3 className="font-medium text-gray-700">Trajets à venir</h3>
                                    <p className="text-2xl font-bold mt-2">{trajets.filter(t => t.statut === "à venir").length}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <h3 className="font-medium text-gray-700">Trajets en cours</h3>
                                    <p className="text-2xl font-bold mt-2">{trajets.filter(t => t.statut === "en cours").length}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-md">
                                    <h3 className="font-medium text-gray-700">Trajets terminés</h3>
                                    <p className="text-2xl font-bold mt-2">{trajets.filter(t => t.statut === "terminé").length}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MesTrajets;