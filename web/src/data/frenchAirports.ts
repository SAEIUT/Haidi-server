// src/data/frenchAirports.ts
import { Place } from '../types/customTypes';

export const FRENCH_AIRPORTS: Place[] = [
    {
        id: "cdg",
        name: "Aéroport Paris Charles de Gaulle",
        type: "airport",
        coords: [2.5479, 49.0097]
    },
    {
        id: "ory",
        name: "Aéroport Paris Orly",
        type: "airport",
        coords: [2.3794, 48.7262]
    },
    {
        id: "mrs",
        name: "Aéroport Marseille Provence",
        type: "airport",
        coords: [5.2145, 43.4365]
    },
    {
        id: "nce",
        name: "Aéroport Nice Côte d'Azur",
        type: "airport",
        coords: [7.2675, 43.6584]
    },
    {
        id: "bod",
        name: "Aéroport Bordeaux-Mérignac",
        type: "airport",
        coords: [-0.7156, 44.8283]
    },
    {
        id: "tls",
        name: "Aéroport Toulouse-Blagnac",
        type: "airport",
        coords: [1.3676, 43.6293]
    },
    {
        id: "lys",
        name: "Aéroport Lyon-Saint Exupéry",
        type: "airport",
        coords: [5.0887, 45.7234]
    }
];