import React from 'react';
import { cn } from '../lib/classNames';
import { formatDuration, formatDistance } from '../lib/formatters';

const MyComponent = () => {
    const duration = 125; // Exemple de durée en minutes
    const distance = 2500; // Exemple de distance en mètres

    return (
        <div className={cn('p-4', 'bg-blue-500', 'text-white')}>
            <p>Durée : {formatDuration(duration)}</p>
            <p>Distance : {formatDistance(distance)}</p>
        </div>
    );
};

export default MyComponent;