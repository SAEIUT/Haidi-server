import React from 'react';
import { Clock, RotateCcw, ChevronRight, BookOpen } from 'lucide-react';
import { TRANSPORT_MODES } from '../constants/TRANSPORT_MODES';
import { formatDuration, formatDistance, formatPrice, formatTime } from '../lib/formatters';
import { Journey, Segment } from '../types/customTypes';

// Définir les props du composant
interface JourneySummaryProps {
    journey: Journey;
    isSelected: boolean;
    onClick: () => void;
    onReserve?: (journey: Journey) => void;
}

const JourneySummary: React.FC<JourneySummaryProps> = ({ journey, isSelected, onClick, onReserve }) => {
    const departureTime = new Date(journey.departureTime); // Conversion en Date
    const arrivalTime = new Date(journey.arrivalTime);     // Conversion en Date

    const isMultimodal = journey.mode === 'multimodal' || journey.segments.length > 1;
    
    // Safely extract unique modes from segments
    const uniqueModes = Array.from(new Set(journey.segments.map(s => s.mode.toLowerCase())));

    // Helper function to safely get a transport mode
    const getTransportMode = (mode: string) => {
        const key = mode.toLowerCase();
        return TRANSPORT_MODES[key] || {
            id: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            icon: ChevronRight, // Fallback icon
            color: 'text-gray-500',
            bgColor: 'bg-gray-200',
            lineColor: '#9ca3af'
        };
    };

    // Handler for reserve button click
    const handleReserveClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the parent onClick
        if (onReserve) {
            // Ensure journey has an id before passing it to onReserve
            const journeyWithId: Journey = {
                ...journey,
                id: journey.id || `journey-${Date.now()}`
            };
            onReserve(journeyWithId);
        }
    };

    return (
        <div
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
            }`}
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium">
                        {formatTime(departureTime)} - {formatTime(arrivalTime)} {/* Utilisation des Dates */}
                    </div>
                    <div className="text-sm text-gray-500">
                        Durée: {formatDuration(journey.duration)}
                        {journey.distance && ` • ${formatDistance(journey.distance)}`}
                    </div>
                    <div className="text-sm font-medium text-blue-600 mt-1">
                        {formatPrice(journey.price)}
                        {journey.returnable &&
                            <span className="ml-2 text-green-600">
                                (Remboursable)
                                <RotateCcw className="h-4 w-4 inline ml-1" />
                            </span>
                        }
                    </div>
                </div>
                <div className={`p-2 rounded-lg ${isMultimodal ? 'bg-gray-100' : getTransportMode(journey.mode).bgColor}`}>
                    <div className="flex gap-1">
                        {uniqueModes.map((mode, index) => {
                            const transportMode = getTransportMode(mode);
                            const Icon = transportMode.icon;
                            return <Icon key={index} className={`h-5 w-5 ${transportMode.color}`} />;
                        })}
                    </div>
                </div>
            </div>

            <div className="mt-3 text-sm space-y-1">
                {journey.segments.map((segment, index) => {
                    const transportMode = getTransportMode(segment.mode);
                    const Icon = transportMode.icon;
                    return (
                        <div key={index} className="flex items-center gap-2 text-gray-600">
                            <Icon className="h-4 w-4" />
                            <span>
                                {segment.mode === 'train' && segment.train_number &&
                                    `Train ${segment.train_number} • `
                                }
                                {segment.from.name}
                                <ChevronRight className="h-4 w-4 inline mx-1" />
                                {segment.to.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Bouton de réservation */}
            {isSelected && onReserve && (
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={handleReserveClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                    >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Réserver
                    </button>
                </div>
            )}
        </div>
    );
};

export default JourneySummary;