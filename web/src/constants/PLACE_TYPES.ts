// src/constants/PLACE_TYPES.ts
import { MapPin, Home, Train, Bus, Building, Plane, Star } from 'lucide-react';

// Types de lieux avec leurs icônes et couleurs associées
export const PLACE_TYPES = {
    HOME: {
        id: 'home',
        icon: Home,
        color: 'text-green-600',
        markerColor: '#10b981'
    },
    STATION: {
        id: 'station',
        icon: Train,
        color: 'text-blue-600',
        markerColor: '#3b82f6'
    },
    BUS_STOP: {
        id: 'bus_stop',
        icon: Bus,
        color: 'text-yellow-600',
        markerColor: '#d97706'
    },
    ADDRESS: {
        id: 'address',
        icon: Building,
        color: 'text-indigo-600',
        markerColor: '#6366f1'
    },
    AIRPORT: {
        id: 'airport',
        icon: Plane,
        color: 'text-red-600',
        markerColor: '#ef4444'
    },
    CITY: {
        id: 'city',
        icon: MapPin,
        color: 'text-purple-600',
        markerColor: '#9333ea'
    },
    POPULAR: {
        id: 'popular',
        icon: Star,
        color: 'text-amber-500',
        markerColor: '#f59e0b'
    }
};