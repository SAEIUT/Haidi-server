import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Home, Train, Bus, Building, Plane, Search, Star } from 'lucide-react';
import { PLACE_TYPES } from '../../constants/PLACE_TYPES';
import TransportService from '../../services/TransportService';
import { Place } from '../../types/customTypes';

interface EnhancedPlaceSearchProps {
    value: string;
    onChange: (value: string) => void;
    onPlaceSelect: (place: Place) => void;
    placeholder: string;
}

// Helper to get icon
const getPlaceIcon = (type: string) => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
        case 'HOME': return Home;
        case 'STATION': return Train;
        case 'BUS_STOP': return Bus;
        case 'ADDRESS': return Building;
        case 'AIRPORT': return Plane;
        case 'CITY': return MapPin;
        case 'POPULAR': return Star;
        default: return MapPin;
    }
};

// Suggestions populaires préchargées pour améliorer l'expérience utilisateur
const popularPlaces: Place[] = [
    // Grandes villes
    { id: 'city-paris', name: 'Paris', type: 'CITY', coords: [2.3522, 48.8566] },
    { id: 'city-lyon', name: 'Lyon', type: 'CITY', coords: [4.8357, 45.7640] },
    { id: 'city-marseille', name: 'Marseille', type: 'CITY', coords: [5.3698, 43.2965] },
    { id: 'city-bordeaux', name: 'Bordeaux', type: 'CITY', coords: [-0.5792, 44.8378] },
    { id: 'city-lille', name: 'Lille', type: 'CITY', coords: [3.0570, 50.6292] },
    
    // Principales gares
    { id: 'station-gare-lyon', name: 'Gare de Lyon, Paris', type: 'STATION', coords: [2.3730, 48.8448] },
    { id: 'station-gare-nord', name: 'Gare du Nord, Paris', type: 'STATION', coords: [2.3553, 48.8809] },
    { id: 'station-gare-montparnasse', name: 'Gare Montparnasse, Paris', type: 'STATION', coords: [2.3219, 48.8414] },
    { id: 'station-gare-lyon-perrache', name: 'Gare de Lyon-Perrache', type: 'STATION', coords: [4.8277, 45.7491] },
    
    // Aéroports principaux
    { id: 'airport-cdg', name: 'Aéroport Charles de Gaulle (CDG)', type: 'AIRPORT', coords: [2.5479, 49.0097] },
    { id: 'airport-orly', name: 'Aéroport d\'Orly (ORY)', type: 'AIRPORT', coords: [2.3795, 48.7262] },
    { id: 'airport-nice', name: 'Aéroport de Nice Côte d\'Azur (NCE)', type: 'AIRPORT', coords: [7.2661, 43.6584] },
    { id: 'airport-lyon', name: 'Aéroport de Lyon-Saint Exupéry (LYS)', type: 'AIRPORT', coords: [5.0887, 45.7256] },
    
    // Points d'intérêt populaires
    { id: 'poi-tour-eiffel', name: 'Tour Eiffel, Paris', type: 'ADDRESS', coords: [2.2945, 48.8584] },
    { id: 'poi-louvre', name: 'Musée du Louvre, Paris', type: 'ADDRESS', coords: [2.3376, 48.8606] },
    { id: 'poi-notre-dame', name: 'Cathédrale Notre-Dame, Paris', type: 'ADDRESS', coords: [2.3499, 48.8529] },
];

const EnhancedPlaceSearch: React.FC<EnhancedPlaceSearchProps> = ({ value, onChange, onPlaceSelect, placeholder }) => {
    // États pour gérer les suggestions et leur affichage
    const [suggestions, setSuggestions] = useState<Place[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPopular, setShowPopular] = useState(false);

    // Références pour gérer les timeouts et les clics en dehors des suggestions
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const suggestionsRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Fonction pour gérer la recherche
    const handleSearch = async (query: string) => {
        onChange(query); // Met à jour la valeur de l'input
        
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current); // Annule le timeout précédent
        }

        // Si la requête est vide, afficher les suggestions populaires
        if (query.length === 0) {
            setShowPopular(true);
            setSuggestions([]);
            setShowSuggestions(true);
            return;
        } else {
            setShowPopular(false);
        }

        // Si la requête est trop courte, on ne fait rien
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Afficher un état de chargement
        setLoading(true);

        // Déclenche la recherche après un délai de 300ms pour éviter trop d'appels API
        searchTimeout.current = setTimeout(async () => {
            try {
                // Recherche dans les données populaires préchargées
                const popularMatches = popularPlaces.filter(place => 
                    place.name.toLowerCase().includes(query.toLowerCase())
                );
                
                // Recherche simultanée des gares et des adresses
                const [stations, addresses] = await Promise.all([
                    TransportService.searchStations(query),
                    TransportService.searchAddress(query)
                ]);
                
                // Combine les résultats et met à jour les suggestions
                const allSuggestions = [...popularMatches, ...stations, ...addresses];
                
                // Déduplication des suggestions par ID
                const uniqueSuggestions = allSuggestions.filter((v, i, a) => 
                    a.findIndex(t => t.id === v.id) === i
                );
                
                setSuggestions(uniqueSuggestions);
                
                // Si des suggestions sont trouvées, les afficher
                if (uniqueSuggestions.length > 0) {
                    setShowSuggestions(true);
                } else {
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.error('Erreur recherche:', error);
                setSuggestions([]); // En cas d'erreur, on vide les suggestions
                setShowSuggestions(false);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    // Fonction pour gérer la perte de focus de l'input
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Ne ferme les suggestions que si le clic n'est pas sur une suggestion
        if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
            setTimeout(() => {
                setShowSuggestions(false);
                setShowPopular(false);
            }, 200);
        }
    };

    // Fermer les suggestions lors d'un clic en dehors
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
                inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
                setShowPopular(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Si une seule suggestion est présente, permettre de la sélectionner avec Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && suggestions.length === 1) {
            e.preventDefault();
            onChange(suggestions[0].name);
            onPlaceSelect(suggestions[0]);
            setShowSuggestions(false);
            setShowPopular(false);
            setSuggestions([]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setShowPopular(false);
        }
    };

    // Fonction pour afficher les suggestions populaires au focus
    const handleFocus = () => {
        if (value.length === 0) {
            setShowPopular(true);
            setShowSuggestions(true);
        } else if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    return (
        <div className="relative">
            {/* Input de recherche */}
            <div className="flex items-center border rounded-lg bg-white overflow-hidden">
                <div className="pl-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full py-3 px-2 focus:outline-none"
                    autoComplete="off"
                />
                {loading ? (
                    <div className="mr-3 animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                ) : (
                    <div className="mr-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Affichage des suggestions ou des lieux populaires */}
            {(showSuggestions && (suggestions.length > 0 || showPopular)) && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {showPopular && (
                        <div className="p-2">
                            <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                                Destinations populaires
                            </div>
                            {popularPlaces.slice(0, 8).map((place) => {
                                const Icon = getPlaceIcon(place.type);
                                const placeType = PLACE_TYPES[place.type.toUpperCase() as keyof typeof PLACE_TYPES] || {
                                    id: 'default',
                                    color: 'text-gray-600',
                                };
                                
                                return (
                                    <button
                                        key={place.id}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center rounded-md"
                                        onClick={() => {
                                            onChange(place.name);
                                            onPlaceSelect(place);
                                            setShowSuggestions(false);
                                            setShowPopular(false);
                                            setSuggestions([]);
                                        }}
                                    >
                                        <Icon className={`h-4 w-4 mr-2 ${placeType.color}`} />
                                        <span>{place.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    
                    {suggestions.length > 0 && (
                        <div className="p-2">
                            {!showPopular && (
                                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                                    Résultats de recherche
                                </div>
                            )}
                            
                            {suggestions.map((place) => {
                                const Icon = getPlaceIcon(place.type);
                                const placeType = PLACE_TYPES[place.type.toUpperCase() as keyof typeof PLACE_TYPES] || {
                                    id: 'default',
                                    color: 'text-gray-600',
                                };
                                
                                return (
                                    <button
                                        key={place.id}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center rounded-md"
                                        onClick={() => {
                                            onChange(place.name);
                                            onPlaceSelect(place);
                                            setShowSuggestions(false);
                                            setShowPopular(false);
                                            setSuggestions([]);
                                        }}
                                    >
                                        <Icon className={`h-4 w-4 mr-2 ${placeType.color}`} />
                                        <span>{place.name}</span>
                                        <span className="ml-2 text-xs text-gray-500">
                                            {place.type === 'STATION' ? 'Gare' : 
                                             place.type === 'AIRPORT' ? 'Aéroport' :
                                             place.type === 'CITY' ? 'Ville' : 
                                             place.type === 'BUS_STOP' ? 'Arrêt de bus' : 
                                             place.type === 'ADDRESS' ? 'Adresse' : ''}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnhancedPlaceSearch;