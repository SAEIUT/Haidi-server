// src/types/customTypes.ts

export interface Place {
    id: string;
    name: string;
    type: string;
    coords: [number, number]; // Coordonnées [longitude, latitude]
}

// Définition correcte des types de géométrie pour GeoJSON
export type Point = {
    type: "Point";
    coordinates: [number, number];
};

export type LineString = {
    type: "LineString";
    coordinates: [number, number][];
};

export type Polygon = {
    type: "Polygon";
    coordinates: [number, number][][];
};

export type MultiPoint = {
    type: "MultiPoint";
    coordinates: [number, number][];
};

export type MultiLineString = {
    type: "MultiLineString";
    coordinates: [number, number][][];
};

export type MultiPolygon = {
    type: "MultiPolygon";
    coordinates: [number, number][][][];
};

export type Geometry = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;

// Pour permettre l'utilisation de strings pour le type
export type FlexibleGeometry = Geometry | {
    type: string;
    coordinates: any;
};

export interface Segment {
    mode: string;
    from: { name: string };
    to: { name: string };
    train_number?: string;
    geometry?: FlexibleGeometry;
}

export interface Journey {
    id: string;
    mode: string;
    segments: Segment[];
    departureTime: string;
    arrivalTime: string;
    duration: number;
    distance?: number;
    price: number;
    returnable?: boolean;
}

// Type pour les modes de transport (pour TRANSPORT_MODES)
export interface TransportMode {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
    lineColor: string;
}

// Types pour le service de transport
export interface TransportServiceProps {
    searchStations: (query: string) => Promise<Place[]>;
    searchAddress: (query: string) => Promise<Place[]>;
    getMultiModalRoute: (
        from: Place,
        to: Place,
        modes: string[]
    ) => Promise<Journey[]>;
}

// Types pour la réservation
export interface Reservation {
    id: string;
    journeyId: string;
    userId: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    bookingDate: string;
    passengers: number;
    totalPrice: number;
    contactDetails: {
        email: string;
        phone: string;
    };
    paymentMethod: string;
}