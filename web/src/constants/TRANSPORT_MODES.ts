// src/constants/TRANSPORT_MODES.ts
import { BusIcon, CarIcon, PlaneIcon, TrainIcon } from 'lucide-react';
import { TransportMode } from '../types/customTypes';

export const TRANSPORT_MODES: Record<string, TransportMode> = {
    train: { id: 'train', label: 'Train', icon: TrainIcon, bgColor: 'bg-blue-200', color: 'text-blue-600', lineColor: '#3b82f6' },
    plane: { id: 'plane', label: 'Avion', icon: PlaneIcon, bgColor: 'bg-red-200', color: 'text-red-600', lineColor: '#dc2626' },
    bus: { id: 'bus', label: 'Bus', icon: BusIcon, bgColor: 'bg-yellow-200', color: 'text-yellow-600', lineColor: '#eab308' },
    car: { id: 'car', label: 'Voiture', icon: CarIcon, bgColor: 'bg-gray-200', color: 'text-gray-600', lineColor: '#6b7280' }
};