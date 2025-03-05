import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Calendar, Clock } from 'lucide-react';
import { Place, Journey } from '../types/customTypes';
import { TRANSPORT_MODES } from '../constants/TRANSPORT_MODES';
import EnhancedPlaceSearch from './EnhancedPlaceSearch';
import MultimodalJourneySummary from './MultimodalJourneySummary';
import ReservationModal, { ReservationData } from './ReservationModal';
import TransportService from '../services/TransportService';

interface MultimodalTransitProps {
    onDepartureSelect?: (place: Place | null) => void;
    onArrivalSelect?: (place: Place | null) => void;
    onJourneySelect?: (journey: Journey | null) => void;
    onJourneysChange?: (journeys: Journey[]) => void;
    onReservationComplete?: (reservationData: ReservationData) => void;
    selectedDeparture?: Place | null;
    selectedArrival?: Place | null;
    selectedJourney?: Journey | null;
    journeys?: Journey[];
}

const MultimodalTransit: React.FC<MultimodalTransitProps> = ({
    onDepartureSelect,
    onArrivalSelect,
    onJourneySelect,
    onJourneysChange,
    onReservationComplete,
    selectedDeparture: propSelectedDeparture,
    selectedArrival: propSelectedArrival,
    selectedJourney: propSelectedJourney,
    journeys: propJourneys
}) => {
    const [departure, setDeparture] = useState<string>('');
    const [arrival, setArrival] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isReservationModalOpen, setIsReservationModalOpen] = useState<boolean>(false);
    const [journeyToReserve, setJourneyToReserve] = useState<Journey | null>(null);
    
    // Internal state for when component is used standalone
    const [localSelectedDeparture, setLocalSelectedDeparture] = useState<Place | null>(null);
    const [localSelectedArrival, setLocalSelectedArrival] = useState<Place | null>(null);
    const [localSelectedJourney, setLocalSelectedJourney] = useState<Journey | null>(null);
    const [localJourneys, setLocalJourneys] = useState<Journey[]>([]);

    // Use either props or local state
    const selectedDeparture = propSelectedDeparture !== undefined ? propSelectedDeparture : localSelectedDeparture;
    const selectedArrival = propSelectedArrival !== undefined ? propSelectedArrival : localSelectedArrival;
    const selectedJourney = propSelectedJourney !== undefined ? propSelectedJourney : localSelectedJourney;
    const journeys = propJourneys !== undefined ? propJourneys : localJourneys;
    
    // Fixed transport modes - always multimodal with car, train, plane
    const fixedModes = [
        TRANSPORT_MODES.train.id,
        TRANSPORT_MODES.plane.id,
        TRANSPORT_MODES.car.id
    ];

    useEffect(() => {
        // Set today's date as default
        const today = new Date();
        setDate(today.toISOString().split('T')[0]);
        
        // Set current time as default
        setTime(today.toTimeString().substring(0, 5));
    }, []);

    // Mise à jour des noms de lieux lorsque les sélections changent
    useEffect(() => {
        if (selectedDeparture) {
            setDeparture(selectedDeparture.name);
        }
        
        if (selectedArrival) {
            setArrival(selectedArrival.name);
        }
    }, [selectedDeparture, selectedArrival]);

    const handleSearch = async () => {
        if (!selectedDeparture || !selectedArrival) {
            setError('Veuillez sélectionner un point de départ et une destination');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Obtenir un itinéraire multimodal via le service
            const multimodalJourneys = await TransportService.getMultiModalRoute(
                selectedDeparture,
                selectedArrival,
                fixedModes
            );

            if (multimodalJourneys.length > 0) {
                // Mettre à jour les itinéraires
                if (onJourneysChange) {
                    onJourneysChange(multimodalJourneys);
                } else {
                    setLocalJourneys(multimodalJourneys);
                }
                
                // Sélectionner le premier itinéraire
                if (onJourneySelect) {
                    onJourneySelect(multimodalJourneys[0]);
                } else {
                    setLocalSelectedJourney(multimodalJourneys[0]);
                }
            } else {
                setError('Aucun itinéraire trouvé pour ces critères');
            }
        } catch (error) {
            console.error('Erreur recherche:', error);
            setError('Une erreur est survenue lors de la recherche d\'itinéraires');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setDeparture('');
        setArrival('');
        setError(null);
        
        // Use provided callbacks if available, otherwise update local state
        if (onDepartureSelect) {
            onDepartureSelect(null);
        } else {
            setLocalSelectedDeparture(null);
        }
        
        if (onArrivalSelect) {
            onArrivalSelect(null);
        } else {
            setLocalSelectedArrival(null);
        }
        
        if (onJourneySelect) {
            onJourneySelect(null);
        } else {
            setLocalSelectedJourney(null);
        }
        
        if (onJourneysChange) {
            onJourneysChange([]);
        } else {
            setLocalJourneys([]);
        }
    };

    const handleReserveJourney = (journey: Journey) => {
        setJourneyToReserve(journey);
        setIsReservationModalOpen(true);
    };

    const handleReservationConfirm = (reservationData: ReservationData) => {
        // Si un callback est fourni, l'appeler avec les données de réservation
        if (onReservationComplete) {
            onReservationComplete(reservationData);
        } else {
            // Sinon, afficher une alerte simple pour confirmer la réservation
            console.log('Réservation confirmée:', reservationData);
            // On pourrait ajouter ici une logique pour sauvegarder la réservation localement ou l'envoyer à une API
        }
        
        // Fermer le modal
        setIsReservationModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Transport Mode Buttons - Always all selected */}
            <div className="flex flex-wrap gap-2">
                {Object.values(TRANSPORT_MODES).map((mode) => {
                    const Icon = mode.icon;
                    return (
                        <div
                            key={mode.id}
                            className={`flex items-center px-3 py-2 rounded-lg ${mode.bgColor} ${mode.color} border-2 border-current`}
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            <span>{mode.label}</span>
                        </div>
                    );
                })}
            </div>

            <div className="space-y-4">
                <EnhancedPlaceSearch 
                    value={departure} 
                    onChange={setDeparture} 
                    onPlaceSelect={(place: Place) => {
                        if (onDepartureSelect) {
                            onDepartureSelect(place);
                        } else {
                            setLocalSelectedDeparture(place);
                        }
                    }} 
                    placeholder="Point de départ" 
                />
                <EnhancedPlaceSearch 
                    value={arrival} 
                    onChange={setArrival} 
                    onPlaceSelect={(place: Place) => {
                        if (onArrivalSelect) {
                            onArrivalSelect(place);
                        } else {
                            setLocalSelectedArrival(place);
                        }
                    }} 
                    placeholder="Destination" 
                />
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        min={new Date().toISOString().split('T')[0]} 
                        className="w-full pl-12 pr-4 py-3 border rounded-lg" 
                    />
                </div>
                <div className="flex-1 relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                        type="time" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                        className="w-full pl-12 pr-4 py-3 border rounded-lg" 
                    />
                </div>
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <div className="flex gap-2">
                <button 
                    onClick={handleSearch} 
                    disabled={loading} 
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <span>Recherche...</span> : <><Search className="h-5 w-5" /><span>Rechercher</span></>}
                </button>
                <button 
                    onClick={handleReset} 
                    className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <RotateCcw className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            {journeys.length > 0 && (
                <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto">
                    <h2 className="font-semibold">Itinéraires disponibles ({journeys.length})</h2>
                    {journeys.map((journey) => (
                        <MultimodalJourneySummary
                            key={journey.id} 
                            journey={journey} 
                            isSelected={selectedJourney?.id === journey.id}
                            onClick={() => {
                                if (onJourneySelect) {
                                    onJourneySelect(journey);
                                } else {
                                    setLocalSelectedJourney(journey);
                                }
                            }}
                            onReserve={() => handleReserveJourney(journey)}
                        />
                    ))}
                </div>
            )}

            {/* Modal de réservation */}
            {journeyToReserve && (
                <ReservationModal
                    journey={journeyToReserve}
                    isOpen={isReservationModalOpen}
                    onClose={() => setIsReservationModalOpen(false)}
                    onConfirm={handleReservationConfirm}
                />
            )}
        </div>
    );
};

export default MultimodalTransit;