import React from 'react';
import { Car, Train, Plane, Bus, ArrowRight, RotateCcw } from 'lucide-react';
import { Journey, Segment } from '../types/customTypes';
import { formatDuration, formatDistance, formatPrice, formatTime } from '../lib/formatters';

interface MultimodalJourneySummaryProps {
    journey: Journey;
    isSelected: boolean;
    onClick: () => void;
    onReserve: () => void;
}

// Formater le prix avec 2 décimales
const formatPriceExact = (price: number): string => {
    return `${price.toFixed(2)} €`;
};

const MultimodalJourneySummary: React.FC<MultimodalJourneySummaryProps> = ({ 
    journey, 
    isSelected, 
    onClick, 
    onReserve 
}) => {
    const departureTime = new Date(journey.departureTime);
    const arrivalTime = new Date(journey.arrivalTime);

    // Obtenir l'icône appropriée pour un mode de transport
    const ModeIcon = (mode: string) => {
        switch(mode.toLowerCase()) {
            case 'car': return <Car className="h-5 w-5 inline text-gray-600 mr-1" />;
            case 'train': return <Train className="h-5 w-5 inline text-blue-600 mr-1" />;
            case 'plane': return <Plane className="h-5 w-5 inline text-purple-600 mr-1" />;
            case 'bus': return <Bus className="h-5 w-5 inline text-yellow-600 mr-1" />;
            default: return <Car className="h-5 w-5 inline text-gray-600 mr-1" />;
        }
    };

    // Styles adaptés à l'image de référence
    return (
        <div 
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div className="text-gray-700">
                    {/* Horaires et durée, exactement comme dans l'image */}
                    <div className="text-lg font-medium">
                        {formatTime(departureTime)} - {formatTime(arrivalTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                        Durée:
                        <br />
                        {formatDuration(journey.duration)} 
                        {journey.distance && ` • ${formatDistance(journey.distance)}`}
                    </div>
                    <div className="mt-1">
                        <span className="text-lg font-medium text-blue-600">
                            {formatPriceExact(journey.price)}
                        </span>
                        {journey.returnable && (
                            <span className="ml-2 text-green-600 inline-flex items-center">
                                (Remboursable) <RotateCcw className="h-3 w-3 ml-1" />
                            </span>
                        )}
                    </div>
                </div>

                {/* Icônes de mode à droite */}
                <div className="flex flex-col items-end text-right">
                    {journey.segments.map((segment, idx) => (
                        <span key={idx} className={idx > 0 ? "mt-1" : ""}>
                            {ModeIcon(segment.mode)}
                        </span>
                    ))}
                </div>
            </div>

            {/* Liste des segments, exactement comme dans l'image */}
            <div className="mt-3 text-sm">
                {journey.segments.map((segment, index) => (
                    <div key={index} className="mb-2">
                        {/* Segment 1: Voiture */}
                        {index === 0 && (
                            <div className="flex items-center text-gray-700">
                                {ModeIcon(segment.mode)}
                                <span>
                                    {segment.from.name} <ArrowRight className="h-3 w-3 inline mx-1" /> {segment.to.name}
                                </span>
                            </div>
                        )}
                        
                        {/* Segment 2: Train ou Avion */}
                        {index === 1 && (
                            <div className="ml-0">
                                <div className="flex items-center text-blue-600">
                                    {ModeIcon(segment.mode)}
                                    <span>
                                        {segment.from.name} <ArrowRight className="h-3 w-3 inline mx-1" /> {segment.to.name}
                                    </span>
                                </div>
                                {segment.train_number && (
                                    <div className="ml-6 text-gray-600">
                                        Train {segment.train_number}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Segment 3: Voiture */}
                        {index === 2 && (
                            <div className="flex items-center text-gray-700">
                                {ModeIcon(segment.mode)}
                                <span>
                                    {segment.from.name} <ArrowRight className="h-3 w-3 inline mx-1" /> {segment.to.name}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bouton Réserver au même format que dans l'image */}
            <div className="mt-3">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onReserve();
                    }}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                    Réserver
                </button>
            </div>
        </div>
    );
};

export default MultimodalJourneySummary;