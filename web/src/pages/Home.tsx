import React, { useState, useEffect } from 'react';
import HomeNavbar from '../components/HomeNavbar';
import MultimodalTransit from '../components/Map/MultimodalTransit';
import MapComponent from '../components/Map/MapComponent';
import { Place, Journey } from '../types/customTypes';
import { FRENCH_AIRPORTS } from '../data/frenchAirports';
import TransportService from '../services/TransportService';
import { Search } from 'lucide-react';

const Home = () => {
    // Shared state between MultimodalTransit and MapComponent
    const [selectedDeparture, setSelectedDeparture] = useState<Place | null>(null);
    const [selectedArrival, setSelectedArrival] = useState<Place | null>(null);
    const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Function to manually generate routes for testing
    const generateTestRoutes = async () => {
        if (!selectedDeparture || !selectedArrival) {
            console.error("Departure or arrival not selected");
            setError("Veuillez sélectionner un point de départ et une destination");
            return;
        }

        setLoading(true);
        setError(null);
        console.log("Generating test routes between:", selectedDeparture.name, "and", selectedArrival.name);

        try {
            const allModes = ['train', 'plane', 'bus', 'car'];
            const routes = await TransportService.getMultiModalRoute(
                selectedDeparture,
                selectedArrival,
                allModes
            );

            console.log("Generated routes:", routes);
            if (routes.length > 0) {
                setJourneys(routes);
                setSelectedJourney(routes[0]);
            } else {
                setError("Aucun itinéraire trouvé");
            }
        } catch (error) {
            console.error("Error generating routes:", error);
            setError("Erreur lors de la génération des itinéraires");
        } finally {
            setLoading(false);
        }
    };

    // Auto-fill Paris and Marseille airports for testing
    useEffect(() => {
        const parisAirport = FRENCH_AIRPORTS.find(airport => airport.id === "cdg");
        const marseilleAirport = FRENCH_AIRPORTS.find(airport => airport.id === "mrs");
        
        if (parisAirport && marseilleAirport) {
            console.log("Pre-filling Paris and Marseille airports for testing");
            setSelectedDeparture(parisAirport);
            setSelectedArrival(marseilleAirport);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation bar */}
            <HomeNavbar navLight={false} bgLight={true} />

            {/* Main content - Full height flex layout */}
            <div className="flex h-screen">
                {/* Map takes up most of the screen */}
                <MapComponent
                    selectedDeparture={selectedDeparture}
                    selectedArrival={selectedArrival}
                    selectedJourney={selectedJourney}
                />

                {/* Route planner sidebar */}
                <div className="w-96 bg-white shadow-xl overflow-auto p-4">
                    <h1 className="text-xl font-bold mb-4">Planificateur d'itinéraire</h1>
                    
                    {/* Test button for quick route generation */}
                    <div className="mb-4">
                        <button 
                            onClick={generateTestRoutes}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 
                                <span>Génération...</span> : 
                                <><Search className="h-5 w-5" /><span>Générer Paris-Marseille (Test)</span></>
                            }
                        </button>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    
                    <MultimodalTransit 
                        onDepartureSelect={setSelectedDeparture}
                        onArrivalSelect={setSelectedArrival}
                        onJourneySelect={setSelectedJourney}
                        onJourneysChange={setJourneys}
                        selectedDeparture={selectedDeparture}
                        selectedArrival={selectedArrival}
                        selectedJourney={selectedJourney}
                        journeys={journeys}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
