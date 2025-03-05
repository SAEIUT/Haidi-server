import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { API_CONFIG } from '../constants/API_CONFIG';
import { PLACE_TYPES } from '../constants/PLACE_TYPES';
import { Segment, Place, Journey } from '../types/customTypes';

interface MapComponentProps {
    selectedDeparture: Place | null;
    selectedArrival: Place | null;
    selectedJourney: Journey | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedDeparture, selectedArrival, selectedJourney }) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const routesRef = useRef<string[]>([]);

    // Helper function to get transport mode stylings
    const getTransportModeStyles = (mode: string) => {
        const normalizedMode = mode.toLowerCase();
        
        switch (normalizedMode) {
            case 'car':
                return {
                    color: '#FF0000', // Rouge vif pour la voiture
                    width: 5,
                    opacity: 0.8,
                    dashArray: [],
                    label: 'Voiture'
                };
            case 'bus':
                return {
                    color: '#FFB800', // Jaune-Orange pour le bus
                    width: 4,
                    opacity: 0.8,
                    dashArray: [1, 1],
                    label: 'Bus'
                };
            case 'train':
                return {
                    color: '#0078FF', // Bleu pour le train
                    width: 4,
                    opacity: 0.8,
                    dashArray: [],
                    label: 'Train'
                };
            case 'plane':
                return {
                    color: '#9C27B0', // Violet pour l'avion
                    width: 4,
                    opacity: 0.8,
                    dashArray: [2, 1],
                    label: 'Avion'
                };
            default:
                return {
                    color: '#9E9E9E', // Gris par défaut
                    width: 3,
                    opacity: 0.7,
                    dashArray: [],
                    label: mode.charAt(0).toUpperCase() + mode.slice(1)
                };
        }
    };

    // Helper function to safely get place type
    const getPlaceTypeStyles = (type: string) => {
        const normalizedType = type.toUpperCase();
        
        switch (normalizedType) {
            case 'STATION':
                return {
                    color: '#0078FF', // Bleu pour les gares
                    label: 'Gare'
                };
            case 'AIRPORT':
                return {
                    color: '#9C27B0', // Violet pour les aéroports
                    label: 'Aéroport'
                };
            case 'CITY':
                return {
                    color: '#4CAF50', // Vert pour les villes
                    label: 'Ville'
                };
            case 'BUS_STOP':
                return {
                    color: '#FFB800', // Jaune-Orange pour les arrêts de bus
                    label: 'Arrêt de bus'
                };
            case 'ADDRESS':
                return {
                    color: '#FF5722', // Orange pour les adresses
                    label: 'Adresse'
                };
            default:
                return {
                    color: '#9E9E9E', // Gris par défaut
                    label: 'Lieu'
                };
        }
    };

    useEffect(() => {
        if (!mapContainer.current) return;

        console.log("Initializing map");
        
        // Initialiser la carte MapBox
        mapboxgl.accessToken = API_CONFIG.mapbox;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.3522, 48.8566], // Paris par défaut
            zoom: 5, // Zoom initial
        });

        // Ajouter les contrôles de navigation
        map.current.addControl(new mapboxgl.NavigationControl());

        // Attendre que la carte soit chargée avant d'ajouter des éléments
        map.current.on('load', () => {
            console.log("Map loaded, ready to display routes");
            updateMap();
        });

        // Nettoyage à la désinstallation du composant
        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    // Mise à jour de la carte lorsque les données changent
    useEffect(() => {
        if (map.current?.loaded()) {
            console.log("Dependencies changed, updating map");
            updateMap();
        } else {
            console.log("Map not yet loaded");
        }
    }, [selectedDeparture, selectedArrival, selectedJourney]);

    // Fonction principale pour mettre à jour la carte
    const updateMap = () => {
        if (!map.current || !map.current.loaded()) {
            console.log("Map not ready yet");
            return;
        }

        console.log("Updating map with:", {
            departure: selectedDeparture,
            arrival: selectedArrival,
            journey: selectedJourney
        });

        // Nettoyer les marqueurs et routes existants
        cleanupMapElements();

        // Créer les limites de la carte pour le zoom automatique
        const bounds = new mapboxgl.LngLatBounds();
        let hasValidBounds = false;

        // Ajouter les marqueurs et étendre les limites
        if (selectedDeparture) {
            addMarker(selectedDeparture, bounds);
            hasValidBounds = true;
        }

        if (selectedArrival) {
            addMarker(selectedArrival, bounds);
            hasValidBounds = true;
        }

        // Ajouter les segments de l'itinéraire sélectionné
        if (selectedJourney) {
            console.log("Adding journey segments:", selectedJourney.segments);
            selectedJourney.segments.forEach((segment, index) => {
                addRouteSegment(segment, index, bounds);
                hasValidBounds = true;
            });
        }

        // Ajuster la vue de la carte pour montrer tous les éléments
        if (hasValidBounds) {
            console.log("Fitting bounds");
            map.current.fitBounds(bounds, {
                padding: 50,
                duration: 1000,
                easing: (t) => t * (2 - t), // Easing function
            });
        }
    };

    // Nettoyer les éléments de la carte
    const cleanupMapElements = () => {
        // Supprimer tous les marqueurs
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Supprimer toutes les routes
        routesRef.current.forEach(routeId => {
            if (map.current?.getLayer(routeId)) {
                map.current.removeLayer(routeId);
            }
            if (map.current?.getSource(routeId)) {
                map.current.removeSource(routeId);
            }
        });
        routesRef.current = [];
    };

    // Ajouter un marqueur pour un lieu
    const addMarker = (place: Place, bounds: mapboxgl.LngLatBounds) => {
        if (!map.current) return;

        console.log("Adding marker for:", place);
        const placeStyle = getPlaceTypeStyles(place.type);
        
        // Créer un élément personnalisé pour le marqueur
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = placeStyle.color;
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid #ffffff';
        el.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
        el.style.cursor = 'pointer';
        el.style.transition = 'transform 0.2s';
        
        // Créer le marqueur
        const marker = new mapboxgl.Marker(el)
            .setLngLat(place.coords)
            .addTo(map.current);
        
        // Ajouter un popup au clic
        marker.getElement().addEventListener('click', () => {
            new mapboxgl.Popup()
                .setLngLat(place.coords)
                .setHTML(`
                    <strong>${place.name}</strong>
                    <br>
                    <span style="color: ${placeStyle.color};">${placeStyle.label}</span>
                `)
                .addTo(map.current!);
        });
        
        // Ajouter un effet hover
        marker.getElement().addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.2)';
        });
        
        marker.getElement().addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
        });
        
        // Ajouter le marqueur à la liste et étendre les limites
        markersRef.current.push(marker);
        bounds.extend(place.coords);
    };

    // Ajouter un segment d'itinéraire
    const addRouteSegment = (segment: Segment, index: number, bounds: mapboxgl.LngLatBounds) => {
        if (!map.current) return;
        if (!segment.geometry) {
            console.warn(`Segment ${index} has no geometry`);
            return;
        }

        console.log(`Adding segment ${index}:`, segment.mode, segment);
        const modeStyle = getTransportModeStyles(segment.mode);
        const routeId = `route-${segment.mode}-${index}`;
        
        try {
            // Vérifier si la source existe déjà et la supprimer si nécessaire
            if (map.current.getSource(routeId)) {
                console.log(`Removing existing source: ${routeId}`);
                map.current.removeSource(routeId);
            }
            
            // Ajouter la source pour le segment - utilisez une conversion de type explicite
            console.log(`Adding source for segment ${index}:`, segment.geometry);
            map.current.addSource(routeId, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {
                        mode: segment.mode
                    },
                    // Conversion explicite pour éviter l'erreur de type
                    geometry: segment.geometry as any
                }
            });
            
            // Ajouter la couche pour visualiser le segment
            map.current.addLayer({
                id: routeId,
                type: 'line',
                source: routeId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                    'visibility': 'visible',
                    'line-sort-key': index, // Pour s'assurer que les segments sont dessinés dans l'ordre
                },
                paint: {
                    'line-color': modeStyle.color,
                    'line-width': modeStyle.width,
                    'line-opacity': modeStyle.opacity,
                    'line-dasharray': modeStyle.dashArray
                }
            });
            
            // Activer la possibilité de cliquer sur le segment pour afficher ses informations
            map.current.on('click', routeId, (e) => {
                // Obtenir les coordonnées du clic
                const coordinates = e.lngLat;
                
                // Créer un popup avec les informations du segment
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(`
                        <strong>${modeStyle.label}</strong>
                        <br>
                        De: ${segment.from.name}
                        <br>
                        À: ${segment.to.name}
                        ${segment.train_number ? `<br>Train: ${segment.train_number}` : ''}
                    `)
                    .addTo(map.current!);
            });
            
            // Changer le curseur au survol du segment
            map.current.on('mouseenter', routeId, () => {
                map.current!.getCanvas().style.cursor = 'pointer';
            });
            
            map.current.on('mouseleave', routeId, () => {
                map.current!.getCanvas().style.cursor = '';
            });
            
            // Ajouter l'ID de la route à la liste pour pouvoir la nettoyer plus tard
            routesRef.current.push(routeId);
            
            // Étendre les limites de la carte pour inclure le segment
            if (segment.geometry.type === 'LineString' && Array.isArray(segment.geometry.coordinates)) {
                segment.geometry.coordinates.forEach((coord: [number, number]) => {
                    bounds.extend(coord as mapboxgl.LngLatLike);
                });
            }
            
            // Ajouter des marqueurs pour les points intermédiaires importants
            // (par exemple, les gares et aéroports dans un itinéraire multimodal)
            if (index > 0) { // Ne pas ajouter de marqueur pour le premier point (déjà marqué comme départ)
                const fromPlace: Place = {
                    id: `segment-start-${index}`,
                    name: segment.from.name,
                    type: segment.mode === 'train' ? 'STATION' : 
                           segment.mode === 'plane' ? 'AIRPORT' : 'ADDRESS',
                    coords: segment.geometry.coordinates[0] as [number, number]
                };
                
                // Ajouter un marqueur pour le point de départ du segment (sauf pour le premier segment)
                addMarker(fromPlace, bounds);
            }
            
        } catch (error) {
            console.error(`Error adding segment ${index}:`, error);
        }
    };

    return (
        <div className="h-full w-full relative" ref={mapContainer}>
            {/* Nous utilisons un style global standard plutôt que <style jsx> */}
            {/* Les styles des marqueurs sont maintenant appliqués directement aux éléments */}
            <div className="mapbox-attribution-fix">
                {/* Ce div est un hack pour masquer les attributions mapbox sur mobile si nécessaire */}
                <style>
                    {`
                    @media (max-width: 640px) {
                        .mapboxgl-ctrl-bottom-left,
                        .mapboxgl-ctrl-bottom-right {
                            display: none;
                        }
                    }
                    `}
                </style>
            </div>
        </div>
    );
};

export default MapComponent;