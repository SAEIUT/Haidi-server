// src/components/JourneyDisplay.tsx
import React from 'react';

interface JourneyDisplayProps {
  journey: {
    id: string;
    mode: string;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    distance: number;
    price: number;
    displaySegments?: string[];
  };
}

const JourneyDisplay: React.FC<JourneyDisplayProps> = ({ journey }) => {
  // Formatage des dates
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Formatage de la durée (minutes → heures et minutes)
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  // Formatage de la distance
  const formatDistance = (meters: number) => {
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Obtenir les icônes pour chaque mode de transport
  const getTransportIcon = (segment: string) => {
    if (segment.includes('Aéroport') && segment.includes('→ Aéroport')) {
      return '✈️';
    } else if (segment.includes('Gare') && segment.includes('→ Gare')) {
      return '🚆';
    } else {
      return '🚗';
    }
  };

  return (
    <div className="journey-card">
      <div className="journey-header">
        <div className="journey-times">
          <span className="departure-time">{formatTime(journey.departureTime)}</span>
          {' - '}
          <span className="arrival-time">{formatTime(journey.arrivalTime)}</span>
        </div>
        <div className="journey-info">
          <span className="duration">Durée: {formatDuration(journey.duration)}</span>
          <span className="distance">{formatDistance(journey.distance)}</span>
        </div>
        <div className="journey-price">
          <span className="price">{journey.price.toFixed(2)} €</span>
          <span className="refundable">(Remboursable)</span>
        </div>
      </div>
      
      <div className="journey-segments">
        {journey.displaySegments && journey.displaySegments.map((segment, index) => (
          <div key={index} className="segment">
            <span className="transport-icon">{getTransportIcon(segment)}</span>
            <span className="segment-text">{segment}</span>
          </div>
        ))}
      </div>
      
      <button className="book-button">Réserver</button>
    </div>
  );
};

export default JourneyDisplay;