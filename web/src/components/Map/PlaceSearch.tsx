import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Home, Train, Bus, Building, Plane } from 'lucide-react';
import { PLACE_TYPES } from '../../constants/PLACE_TYPES';
import TransportService from '../../services/TransportService';
import { Place } from '../../types/customTypes';

interface PlaceSearchProps {
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
        default: return MapPin;
    }
};

const PlaceSearch: React.FC<PlaceSearchProps> = ({ value, onChange, onPlaceSelect, placeholder }) => {
    // États pour gérer les suggestions et leur affichage
    const [suggestions, setSuggestions] = useState<Place[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

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

        // Si la requête est trop courte, on ne fait rien
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        // Afficher un état de chargement
        setLoading(true);

        // Déclenche la recherche après un délai de 300ms pour éviter trop d'appels API
        searchTimeout.current = setTimeout(async () => {
            try {
                // Recherche simultanée des gares et des adresses
                const [stations, addresses] = await Promise.all([
                    TransportService.searchStations(query),
                    TransportService.searchAddress(query)
                ]);
                
                // Combine les résultats et met à jour les suggestions
                const allSuggestions = [...stations, ...addresses];
                setSuggestions(allSuggestions);
                
                // Si des suggestions sont trouvées, les afficher
                if (allSuggestions.length > 0) {
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error('Erreur recherche:', error);
                setSuggestions([]); // En cas d'erreur, on vide les suggestions
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
            }, 200);
        }
    };

    // Fermer les suggestions lors d'un clic en dehors
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
                inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
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
            setSuggestions([]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className="relative">
            {/* Input de recherche */}
            <div className="flex items-center border rounded-lg bg-white">
                <MapPin className="ml-3 h-5 w-5 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full p-3 rounded-lg focus:outline-none"
                />
                {loading && (
                    <div className="mr-3 animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                )}
            </div>

            {/* Affichage des suggestions */}
            {showSuggestions && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {suggestions.map((place) => {
                        // Détermine l'icône et la couleur en fonction du type de lieu
                        const normalizedType = place.type.toUpperCase();
                        const placeType = PLACE_TYPES[normalizedType as keyof typeof PLACE_TYPES];
                        const Icon = getPlaceIcon(place.type);

                        return (
                            <button
                                key={place.id}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                                onClick={() => {
                                    onChange(place.name); // Met à jour l'input avec le nom du lieu
                                    onPlaceSelect(place); // Transmet le lieu sélectionné au parent
                                    setShowSuggestions(false); // Cache les suggestions
                                    setSuggestions([]); // Vide les suggestions
                                }}
                                tabIndex={0}
                            >
                                <Icon className={`h-4 w-4 mr-2 ${placeType?.color || 'text-gray-400'}`} />
                                <span>{place.name}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PlaceSearch;