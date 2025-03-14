import { API_CONFIG } from '../constants/API_CONFIG';
// Définition des types
interface Place {
  id: string;
  name: string;
  type: string;
  coords: [number, number];
}

interface Segment {
  mode: 'car' | 'train' | 'plane';
  from: { name: string };
  to: { name: string };
  train_number?: string;
  flight_number?: string;
  distance?: number;
  duration?: number;
  departure_time?: string;
  arrival_time?: string;
  platform_departure?: string;
  platform_arrival?: string;
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
}

interface Journey {
  id: string;
  mode: string;
  segments: Segment[];
  departureTime: string;
  arrivalTime: string;
  duration: number;
  distance: number;
  price: number;
  returnable: boolean;
  details?: {
    segments_details: string[];
  };
  displaySegments?: string[];
}

// Service de transport simplifié, ne gardant que l'option multi-modale complexe:
// VOITURE → AÉROPORT → AVION → AÉROPORT → VOITURE → GARE → TRAIN → GARE → VOITURE
const TransportService = {
  // Recherche de gares et autres fonctions inchangées...
  searchStations: async (query: string): Promise<Place[]> => {
    // Simule un appel API avec un délai
    await new Promise(resolve => setTimeout(resolve, 300));

    const stations = [
        // France
        { id: 'gare-lyon', name: 'Gare de Lyon', type: 'STATION', coords: [2.3731, 48.8448] as [number, number] },
        { id: 'gare-nord', name: 'Gare du Nord', type: 'STATION', coords: [2.3553, 48.8809] as [number, number] },
        { id: 'gare-montparnasse', name: 'Gare Montparnasse', type: 'STATION', coords: [2.3219, 48.8414] as [number, number] },
        { id: 'gare-marseille', name: 'Gare Saint-Charles', type: 'STATION', coords: [5.3802, 43.3023] as [number, number] },
        { id: 'gare-part-dieu', name: 'Gare de la Part-Dieu', type: 'STATION', coords: [4.8591, 45.7602] as [number, number] },
        { id: 'gare-bordeaux', name: 'Gare Saint-Jean', type: 'STATION', coords: [-0.5562, 44.8258] as [number, number] },
      
        // Allemagne
        { id: 'gare-berlin-hbf', name: 'Berlin Hauptbahnhof', type: 'STATION', coords: [13.3695, 52.5256] as [number, number] },
        { id: 'gare-munich-hbf', name: 'München Hauptbahnhof', type: 'STATION', coords: [11.5580, 48.1402] as [number, number] },
        { id: 'gare-frankfurt-hbf', name: 'Frankfurt Hauptbahnhof', type: 'STATION', coords: [8.6638, 50.1071] as [number, number] },
      
        // Espagne
        { id: 'gare-madrid-atocha', name: 'Madrid Atocha', type: 'STATION', coords: [-3.6913, 40.4070] as [number, number] },
        { id: 'gare-barcelona-sants', name: 'Barcelona Sants', type: 'STATION', coords: [2.1405, 41.3796] as [number, number] },
      
        // Italie
        { id: 'gare-rome-termini', name: 'Roma Termini', type: 'STATION', coords: [12.5018, 41.9005] as [number, number] },
        { id: 'gare-milan-centrale', name: 'Milano Centrale', type: 'STATION', coords: [9.2043, 45.4856] as [number, number] },
      
        // Royaume-Uni
        { id: 'gare-london-kings-cross', name: 'London King\'s Cross', type: 'STATION', coords: [-0.1257, 51.5308] as [number, number] },
        { id: 'gare-london-paddington', name: 'London Paddington', type: 'STATION', coords: [-0.1762, 51.5160] as [number, number] },
      
        // Pays-Bas
        { id: 'gare-amsterdam-centraal', name: 'Amsterdam Centraal', type: 'STATION', coords: [4.9009, 52.3786] as [number, number] },
      
        // Belgique
        { id: 'gare-bruxelles-midi', name: 'Bruxelles-Midi', type: 'STATION', coords: [4.3365, 50.8357] as [number, number] },
      
        // Suisse
        { id: 'gare-zurich-hb', name: 'Zürich Hauptbahnhof', type: 'STATION', coords: [8.5402, 47.3779] as [number, number] },
      
        // Autriche
        { id: 'gare-vienna-hbf', name: 'Wien Hauptbahnhof', type: 'STATION', coords: [16.3745, 48.1850] as [number, number] },
      
        // République Tchèque
        { id: 'gare-prague-hlavni', name: 'Praha hlavní nádraží', type: 'STATION', coords: [14.4356, 50.0830] as [number, number] },
      
        // Hongrie
        { id: 'gare-budapest-keleti', name: 'Budapest-Keleti', type: 'STATION', coords: [19.0839, 47.5005] as [number, number] },
      
        // Pologne
        { id: 'gare-warsaw-centralna', name: 'Warszawa Centralna', type: 'STATION', coords: [21.0007, 52.2286] as [number, number] },
      
        // Suède
        { id: 'gare-stockholm-central', name: 'Stockholm Centralstation', type: 'STATION', coords: [18.0591, 59.3300] as [number, number] },
      
        // Danemark
        { id: 'gare-copenhagen-hovedbanegard', name: 'København Hovedbanegård', type: 'STATION', coords: [12.5644, 55.6727] as [number, number] },
      
        // Norvège
        { id: 'gare-oslo-s', name: 'Oslo S', type: 'STATION', coords: [10.7525, 59.9106] as [number, number] },
      
        // Finlande
        { id: 'gare-helsinki-central', name: 'Helsinki Central Station', type: 'STATION', coords: [24.9417, 60.1710] as [number, number] },
      
        // Irlande
        { id: 'gare-dublin-heuston', name: 'Dublin Heuston', type: 'STATION', coords: [-6.2923, 53.3465] as [number, number] },
      
        // Portugal
        { id: 'gare-lisbon-oriente', name: 'Lisboa Oriente', type: 'STATION', coords: [-9.0993, 38.7676] as [number, number] },
      
        // Grèce
        { id: 'gare-athens-larissa', name: 'Athens Railway Station', type: 'STATION', coords: [23.7210, 37.9922] as [number, number] },
      ];

    // Filtre les résultats en fonction de la requête
    return stations.filter(station =>
      station.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  searchAddress: async (query: string): Promise<Place[]> => {
    // Simule un appel API avec un délai
    await new Promise(resolve => setTimeout(resolve, 300));

    const places = [
        // Villes
        { id: 'city-paris', name: 'Paris', type: 'CITY', coords: [2.3522, 48.8566] as [number, number] },
        { id: 'city-lyon', name: 'Lyon', type: 'CITY', coords: [4.8357, 45.7640] as [number, number] },
        { id: 'city-marseille', name: 'Marseille', type: 'CITY', coords: [5.3698, 43.2965] as [number, number] },
        { id: 'city-berlin', name: 'Berlin', type: 'CITY', coords: [13.4050, 52.5200] as [number, number] },
        { id: 'city-madrid', name: 'Madrid', type: 'CITY', coords: [-3.7038, 40.4168] as [number, number] },
        { id: 'city-rome', name: 'Rome', type: 'CITY', coords: [12.4964, 41.9028] as [number, number] },
        { id: 'city-london', name: 'London', type: 'CITY', coords: [-0.1276, 51.5074] as [number, number] },
        { id: 'city-amsterdam', name: 'Amsterdam', type: 'CITY', coords: [4.9041, 52.3676] as [number, number] },
        { id: 'city-brussels', name: 'Brussels', type: 'CITY', coords: [4.3517, 50.8503] as [number, number] },
        { id: 'city-vienna', name: 'Vienna', type: 'CITY', coords: [16.3738, 48.2082] as [number, number] },
        { id: 'city-prague', name: 'Prague', type: 'CITY', coords: [14.4378, 50.0755] as [number, number] },
        { id: 'city-budapest', name: 'Budapest', type: 'CITY', coords: [19.0402, 47.4979] as [number, number] },
        { id: 'city-warsaw', name: 'Warsaw', type: 'CITY', coords: [21.0122, 52.2297] as [number, number] },
        { id: 'city-stockholm', name: 'Stockholm', type: 'CITY', coords: [18.0686, 59.3293] as [number, number] },
        { id: 'city-copenhagen', name: 'Copenhagen', type: 'CITY', coords: [12.5683, 55.6761] as [number, number] },
        { id: 'city-oslo', name: 'Oslo', type: 'CITY', coords: [10.7522, 59.9139] as [number, number] },
        { id: 'city-helsinki', name: 'Helsinki', type: 'CITY', coords: [24.9384, 60.1699] as [number, number] },
        { id: 'city-dublin', name: 'Dublin', type: 'CITY', coords: [-6.2603, 53.3498] as [number, number] },
        { id: 'city-lisbon', name: 'Lisbon', type: 'CITY', coords: [-9.1393, 38.7223] as [number, number] },
        { id: 'city-athens', name: 'Athens', type: 'CITY', coords: [23.7275, 37.9838] as [number, number] },
      
        // Aéroports
        { id: 'airport-cdg', name: 'Aéroport Charles de Gaulle', type: 'AIRPORT', coords: [2.5479, 49.0097] as [number, number] },
        { id: 'airport-orly', name: 'Aéroport d\'Orly', type: 'AIRPORT', coords: [2.3795, 48.7262] as [number, number] },
        { id: 'airport-lyon', name: 'Aéroport de Lyon-Saint Exupéry', type: 'AIRPORT', coords: [5.0887, 45.7256] as [number, number] },
        { id: 'airport-marseille', name: 'Aéroport de Marseille Provence', type: 'AIRPORT', coords: [5.2145, 43.4364] as [number, number] },
        { id: 'airport-berlin', name: 'Berlin Brandenburg Airport', type: 'AIRPORT', coords: [13.5033, 52.3667] as [number, number] },
        { id: 'airport-madrid', name: 'Adolfo Suárez Madrid–Barajas Airport', type: 'AIRPORT', coords: [-3.5668, 40.4936] as [number, number] },
        { id: 'airport-rome', name: 'Leonardo da Vinci–Fiumicino Airport', type: 'AIRPORT', coords: [12.2551, 41.8003] as [number, number] },
        { id: 'airport-london', name: 'Heathrow Airport', type: 'AIRPORT', coords: [-0.4619, 51.4700] as [number, number] },
        { id: 'airport-amsterdam', name: 'Amsterdam Airport Schiphol', type: 'AIRPORT', coords: [4.7639, 52.3086] as [number, number] },
        { id: 'airport-brussels', name: 'Brussels Airport', type: 'AIRPORT', coords: [4.4844, 50.9014] as [number, number] },
        { id: 'airport-vienna', name: 'Vienna International Airport', type: 'AIRPORT', coords: [16.5697, 48.1103] as [number, number] },
        { id: 'airport-prague', name: 'Václav Havel Airport Prague', type: 'AIRPORT', coords: [14.2667, 50.1008] as [number, number] },
        { id: 'airport-budapest', name: 'Budapest Ferenc Liszt International Airport', type: 'AIRPORT', coords: [19.2556, 47.4369] as [number, number] },
        { id: 'airport-warsaw', name: 'Warsaw Chopin Airport', type: 'AIRPORT', coords: [20.9675, 52.1657] as [number, number] },
        { id: 'airport-stockholm', name: 'Stockholm Arlanda Airport', type: 'AIRPORT', coords: [17.9186, 59.6519] as [number, number] },
        { id: 'airport-copenhagen', name: 'Copenhagen Airport', type: 'AIRPORT', coords: [12.6508, 55.6180] as [number, number] },
        { id: 'airport-oslo', name: 'Oslo Gardermoen Airport', type: 'AIRPORT', coords: [11.1004, 60.1939] as [number, number] },
        { id: 'airport-helsinki', name: 'Helsinki Airport', type: 'AIRPORT', coords: [24.9633, 60.3172] as [number, number] },
        { id: 'airport-dublin', name: 'Dublin Airport', type: 'AIRPORT', coords: [-6.2700, 53.4214] as [number, number] },
        { id: 'airport-lisbon', name: 'Lisbon Portela Airport', type: 'AIRPORT', coords: [-9.1359, 38.7742] as [number, number] },
        { id: 'airport-athens', name: 'Athens International Airport', type: 'AIRPORT', coords: [23.9445, 37.9364] as [number, number] },
      ];

    // Filtre les résultats en fonction de la requête
    return places.filter(place =>
      place.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Obtenir un itinéraire routier via MapBox Directions API
  getRouteFromMapbox: async (from: [number, number], to: [number, number]): Promise<{
    coordinates: [number, number][];
    distance: number;
    duration: number;
  }> => {
    try {
      // Construction de l'URL pour l'API MapBox Directions
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&overview=full&access_token=${API_CONFIG.mapbox}`;
      
      console.log(`Appel API MapBox Directions: de [${from}] à [${to}]`);
      
      // Appel à l'API
      const response = await fetch(url);
      const data = await response.json();
      
      // Vérification de la réponse
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        return {
          coordinates: route.geometry.coordinates as [number, number][],
          distance: route.distance, // en mètres
          duration: route.duration / 60 // en minutes
        };
      } else {
        console.error('Pas d\'itinéraire trouvé:', data);
        // Itinéraire direct en cas d'échec
        return {
          coordinates: [from, to],
          distance: TransportService.calculateDistance(from, to),
          duration: TransportService.calculateDistance(from, to) / 1000 * 60 / 100 // 100km/h
        };
      }
    } catch (error) {
      console.error('Erreur API MapBox:', error);
      // Itinéraire direct en cas d'erreur
      return {
        coordinates: [from, to],
        distance: TransportService.calculateDistance(from, to),
        duration: TransportService.calculateDistance(from, to) / 1000 * 60 / 100 // 100km/h
      };
    }
  },

  // Trouver la gare ou l'aéroport approprié selon la ville
  getTransportHub: (city: string, type: 'STATION' | 'AIRPORT'): Place => {
    const cityName = city.toLowerCase();
    
    // Mappings des villes vers leurs gares et aéroports
    const transportHubs: Record<string, Record<'STATION' | 'AIRPORT', Place>> = {
      'paris': {
        'STATION': { id: 'gare-lyon', name: 'Gare de Lyon', type: 'STATION', coords: [2.3731, 48.8448] },
        'AIRPORT': { id: 'airport-cdg', name: 'Aéroport Charles de Gaulle', type: 'AIRPORT', coords: [2.5479, 49.0097] }
      },
      'marseille': {
        'STATION': { id: 'gare-marseille', name: 'Gare Saint-Charles', type: 'STATION', coords: [5.3802, 43.3023] },
        'AIRPORT': { id: 'airport-marseille', name: 'Aéroport de Marseille Provence', type: 'AIRPORT', coords: [5.2145, 43.4364] }
      },
      'lyon': {
        'STATION': { id: 'gare-part-dieu', name: 'Gare de la Part-Dieu', type: 'STATION', coords: [4.8591, 45.7602] },
        'AIRPORT': { id: 'airport-lyon', name: 'Aéroport de Lyon-Saint Exupéry', type: 'AIRPORT', coords: [5.0887, 45.7256] }
      },
      'avignon': {
        'STATION': { id: 'gare-avignon', name: 'Gare d\'Avignon TGV', type: 'STATION', coords: [4.7856, 43.9215] },
        'AIRPORT': { id: 'airport-avignon', name: 'Aéroport d\'Avignon-Provence', type: 'AIRPORT', coords: [4.7520, 43.9073] }
      },
      'montpellier': {
        'STATION': { id: 'gare-montpellier', name: 'Gare de Montpellier Saint-Roch', type: 'STATION', coords: [3.8784, 43.6053] },
        'AIRPORT': { id: 'airport-montpellier', name: 'Aéroport de Montpellier-Méditerranée', type: 'AIRPORT', coords: [3.9626, 43.5764] }
      },
      'nice': {
        'STATION': { id: 'gare-nice', name: 'Gare de Nice-Ville', type: 'STATION', coords: [7.2617, 43.7043] },
        'AIRPORT': { id: 'airport-nice', name: 'Aéroport de Nice Côte d\'Azur', type: 'AIRPORT', coords: [7.2150, 43.6584] }
      },
      'bordeaux': {
        'STATION': { id: 'gare-bordeaux', name: 'Gare de Bordeaux-Saint-Jean', type: 'STATION', coords: [-0.5562, 44.8258] },
        'AIRPORT': { id: 'airport-bordeaux', name: 'Aéroport de Bordeaux-Mérignac', type: 'AIRPORT', coords: [-0.7156, 44.8283] }
      },
      'toulouse': {
        'STATION': { id: 'gare-toulouse', name: 'Gare de Toulouse-Matabiau', type: 'STATION', coords: [1.4536, 43.6114] },
        'AIRPORT': { id: 'airport-toulouse', name: 'Aéroport de Toulouse-Blagnac', type: 'AIRPORT', coords: [1.3675, 43.6293] }
      },
      'dijon': {
        'STATION': { id: 'gare-dijon', name: 'Gare de Dijon-Ville', type: 'STATION', coords: [5.0271, 47.3237] },
        'AIRPORT': { id: 'airport-dijon', name: 'Aéroport de Dijon-Bourgogne', type: 'AIRPORT', coords: [5.0900, 47.2689] }
      },
      'lille': {
        'STATION': { id: 'gare-lille', name: 'Gare de Lille-Flandres', type: 'STATION', coords: [3.0694, 50.6370] },
        'AIRPORT': { id: 'airport-lille', name: 'Aéroport de Lille-Lesquin', type: 'AIRPORT', coords: [3.0897, 50.5636] }
      },
      'strasbourg': {
        'STATION': { id: 'gare-strasbourg', name: 'Gare de Strasbourg-Ville', type: 'STATION', coords: [7.7337, 48.5852] },
        'AIRPORT': { id: 'airport-strasbourg', name: 'Aéroport de Strasbourg', type: 'AIRPORT', coords: [7.6282, 48.5383] }
      },
      'nantes': {
        'STATION': { id: 'gare-nantes', name: 'Gare de Nantes', type: 'STATION', coords: [-1.5425, 47.2173] },
        'AIRPORT': { id: 'airport-nantes', name: 'Aéroport de Nantes Atlantique', type: 'AIRPORT', coords: [-1.6110, 47.1569] }
      }
    };
    
    // Recherche de la ville dans notre mapping
    for (const key of Object.keys(transportHubs)) {
      if (cityName.includes(key)) {
        return transportHubs[key][type];
      }
    }
    
    // Par défaut, renvoyer Paris
    return transportHubs['paris'][type];
  },

  // Trouver une ville intermédiaire intelligente sur le trajet
  findIntermediateCity: (from: Place, to: Place): Place => {
    // Villes potentielles pour les étapes intermédiaires
    const cities = [
      { id: 'city-lyon', name: 'Lyon', type: 'CITY', coords: [4.8357, 45.7640] as [number, number] },
      { id: 'city-dijon', name: 'Dijon', type: 'CITY', coords: [5.0415, 47.3220] as [number, number] },
      { id: 'city-avignon', name: 'Avignon', type: 'CITY', coords: [4.8057, 43.9493] as [number, number] },
      { id: 'city-montpellier', name: 'Montpellier', type: 'CITY', coords: [3.8767, 43.6108] as [number, number] },
      { id: 'city-nice', name: 'Nice', type: 'CITY', coords: [7.2620, 43.7102] as [number, number] },
      { id: 'city-bordeaux', name: 'Bordeaux', type: 'CITY', coords: [-0.5795, 44.8378] as [number, number] },
      { id: 'city-toulouse', name: 'Toulouse', type: 'CITY', coords: [1.4442, 43.6047] as [number, number] },
      { id: 'city-nantes', name: 'Nantes', type: 'CITY', coords: [-1.5536, 47.2184] as [number, number] },
      { id: 'city-strasbourg', name: 'Strasbourg', type: 'CITY', coords: [7.7521, 48.5734] as [number, number] },
      { id: 'city-lille', name: 'Lille', type: 'CITY', coords: [3.0573, 50.6292] as [number, number] }
    ];
    
    // Calculer la distance directe
    const directDistance = TransportService.calculateDistance(from.coords, to.coords);
    
    // Choisir la ville qui est la plus proche du trajet direct
    let bestCity = cities[0];
    let bestDetourRatio = Number.MAX_VALUE;
    
    for (const city of cities) {
      // Ignorer les villes de départ et d'arrivée
      if (city.name.toLowerCase() === from.name.toLowerCase() || 
          city.name.toLowerCase() === to.name.toLowerCase()) {
        continue;
      }
      
      // Calculer la distance totale du détour
      const distanceViaCity = 
        TransportService.calculateDistance(from.coords, city.coords) + 
        TransportService.calculateDistance(city.coords, to.coords);
      
      // Calculer le ratio du détour (1.0 = exactement sur le chemin)
      const detourRatio = distanceViaCity / directDistance;
      
      // Si c'est la meilleure ville jusqu'à présent
      if (detourRatio < bestDetourRatio) {
        bestDetourRatio = detourRatio;
        bestCity = city;
      }
    }
    
    console.log(`Ville intermédiaire sélectionnée: ${bestCity.name} (détour: ${Math.round((bestDetourRatio-1)*100)}%)`);
    return bestCity;
  },

  // Créer un itinéraire multimodal combiné avion+train+voiture
  createCombinedJourney: async (from: Place, to: Place): Promise<Journey> => {
    // Trouver une ville intermédiaire appropriée sur le trajet
    const intermediateCity = TransportService.findIntermediateCity(from, to);
    console.log(`Utilisation de ${intermediateCity.name} comme ville intermédiaire`);
    
    const segments: Segment[] = [];
    let totalDistance = 0;
    let totalDuration = 0;
    
    // 1. Voiture: ville de départ → aéroport de départ
    const departureAirport = TransportService.getTransportHub(from.name, 'AIRPORT');
    const carToAirportRoute = await TransportService.getRouteFromMapbox(from.coords, departureAirport.coords);
    
    const segment1: Segment = {
      mode: 'car',
      from: { name: from.name },
      to: { name: departureAirport.name },
      duration: carToAirportRoute.duration,
      distance: carToAirportRoute.distance,
      departure_time: new Date(Date.now() + 40 * 60000).toISOString(),
      arrival_time: new Date(Date.now() + (40 + carToAirportRoute.duration) * 60000).toISOString(),
      geometry: {
        type: 'LineString',
        coordinates: carToAirportRoute.coordinates
      }
    };
    
    segments.push(segment1);
    totalDistance += carToAirportRoute.distance;
    totalDuration += carToAirportRoute.duration;
    
    // 2. Avion: aéroport de départ → aéroport intermédiaire
    const intermediateAirport = TransportService.getTransportHub(intermediateCity.name, 'AIRPORT');
    
    const airportDistance = TransportService.calculateDistance(departureAirport.coords, intermediateAirport.coords);
    const airportDuration = airportDistance / 1000 * 60 / 800 + 120; // 800 km/h pour l'avion + 2h de procédures
    
    const planeDepTime = new Date(Date.now() + (40 + carToAirportRoute.duration + 60) * 60000);
    const planeArrTime = new Date(planeDepTime.getTime() + airportDuration * 60000);
    
    const segment2: Segment = {
      mode: 'plane',
      from: { name: departureAirport.name },
      to: { name: intermediateAirport.name },
      flight_number: `AF${1000 + Math.floor(Math.random() * 1000)}`,
      distance: airportDistance,
      duration: airportDuration,
      departure_time: planeDepTime.toISOString(),
      arrival_time: planeArrTime.toISOString(),
      geometry: {
        type: 'LineString',
        coordinates: [departureAirport.coords, intermediateAirport.coords]
      }
    };
    
    segments.push(segment2);
    
    totalDistance += airportDistance;
    totalDuration += airportDuration;
    
    // 3. Voiture: aéroport intermédiaire → gare intermédiaire
    const intermediateStation = TransportService.getTransportHub(intermediateCity.name, 'STATION');
    const carToStationRoute = await TransportService.getRouteFromMapbox(intermediateAirport.coords, intermediateStation.coords);
    
    const carToStationDepTime = new Date(planeArrTime.getTime() + 30 * 60000); // 30 min après l'arrivée de l'avion
    const carToStationArrTime = new Date(carToStationDepTime.getTime() + carToStationRoute.duration * 60000);
    
    const segment3: Segment = {
      mode: 'car',
      from: { name: intermediateAirport.name },
      to: { name: intermediateStation.name },
      distance: carToStationRoute.distance,
      duration: carToStationRoute.duration,
      departure_time: carToStationDepTime.toISOString(),
      arrival_time: carToStationArrTime.toISOString(),
      geometry: {
        type: 'LineString',
        coordinates: carToStationRoute.coordinates
      }
    };
    
    segments.push(segment3);
    totalDistance += carToStationRoute.distance;
    totalDuration += carToStationRoute.duration;
    
    // 4. Train: gare intermédiaire → gare de destination
    const destinationStation = TransportService.getTransportHub(to.name, 'STATION');
    
    const trainDistance = TransportService.calculateDistance(intermediateStation.coords, destinationStation.coords);
    const trainDuration = trainDistance / 1000 * 60 / 200; // 200 km/h pour le train
    
    const trainDepTime = new Date(carToStationArrTime.getTime() + 20 * 60000); // 20 min après l'arrivée en voiture
    const trainArrTime = new Date(trainDepTime.getTime() + trainDuration * 60000);
    
    const trainNumber = `TGV${5000 + Math.floor(Math.random() * 1000)}`;
    
    const segment4: Segment = {
      mode: 'train',
      train_number: trainNumber,
      from: { name: intermediateStation.name },
      to: { name: destinationStation.name },
      distance: trainDistance,
      duration: trainDuration,
      departure_time: trainDepTime.toISOString(),
      arrival_time: trainArrTime.toISOString(),
      platform_departure: `${1 + Math.floor(Math.random() * 20)}`,
      platform_arrival: `${1 + Math.floor(Math.random() * 20)}`,
      geometry: {
        type: 'LineString',
        coordinates: [intermediateStation.coords, destinationStation.coords]
      }
    };
    
    segments.push(segment4);
    
    totalDistance += trainDistance;
    totalDuration += trainDuration;
    
    // 5. Voiture: gare de destination → ville de destination
    const carFromStationRoute = await TransportService.getRouteFromMapbox(destinationStation.coords, to.coords);
    
    const carFinalDepTime = new Date(trainArrTime.getTime() + 15 * 60000); // 15 min après l'arrivée du train
    const carFinalArrTime = new Date(carFinalDepTime.getTime() + carFromStationRoute.duration * 60000);
    
    const segment5: Segment = {
      mode: 'car',
      from: { name: destinationStation.name },
      to: { name: to.name },
      distance: carFromStationRoute.distance,
      duration: carFromStationRoute.duration,
      departure_time: carFinalDepTime.toISOString(),
      arrival_time: carFinalArrTime.toISOString(),
      geometry: {
        type: 'LineString',
        coordinates: carFromStationRoute.coordinates
      }
    };
    
    segments.push(segment5);
    totalDistance += carFromStationRoute.distance;
    totalDuration += carFromStationRoute.duration;
    
    // Ajouter temps d'attente et correspondance
    totalDuration += 45; // 45 minutes de correspondance
    
    // Heure de départ et d'arrivée
    const now = new Date();
    const departureTime = new Date(now.getTime() + 40 * 60000);
    const arrivalTime = new Date(departureTime.getTime() + (totalDuration * 60 * 1000));
    
    // Prix
    const price = Math.round((totalDistance / 1000) * 0.175 * 100) / 100; // Moyenne entre train et avion
    
    return {
      id: `journey-combined-${Date.now()}`,
      mode: 'multimodal',
      segments,
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      duration: totalDuration,
      distance: totalDistance,
      price,
      returnable: true
    };
  },

  // Obtention d'itinéraires multimodaux (UNIQUEMENT L'OPTION COMBINÉE)
  getMultiModalRoute: async (from: Place, to: Place, modes: string[]): Promise<Journey[]> => {
    console.log("Création d'itinéraire multimodal combiné de", from.name, "à", to.name);
    
    // Simule un appel API avec un délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const journeys: Journey[] = [];
    
    try {
      // On ne garde que l'option avion + train + voiture combinée
      // Cette option est disponible pour tous les trajets, peu importe la destination
      const combinedJourney = await TransportService.createCombinedJourney(from, to);
      
      // Résumé des segments pour l'affichage dans l'interface
      const displaySegments = [
        `${from.name} → ${TransportService.getTransportHub(from.name, 'AIRPORT').name}`,
        `${TransportService.getTransportHub(from.name, 'AIRPORT').name} → ${TransportService.getTransportHub(to.name, 'AIRPORT').name}`,
        `${TransportService.getTransportHub(to.name, 'AIRPORT').name} → ${TransportService.getTransportHub(to.name, 'STATION').name}`,
        `${TransportService.getTransportHub(to.name, 'STATION').name} → ${to.name}`
      ];
      
      // Ajoute les segments au voyage pour l'affichage
      combinedJourney.displaySegments = displaySegments;
      
      // Ajoute des détails formatés pour l'affichage
      const details = {
        segments_details: combinedJourney.segments.map(segment => {
          const s = segment;
          let details = '';
          
          if (s.mode === 'car') {
            details = `Trajet en voiture: ${s.from.name} → ${s.to.name}\n`;
            if (s.departure_time && s.arrival_time) {
              const depTime = new Date(s.departure_time);
              const arrTime = new Date(s.arrival_time);
              details += `Départ: ${depTime.getHours()}:${depTime.getMinutes().toString().padStart(2, '0')}, `;
              details += `Arrivée: ${arrTime.getHours()}:${arrTime.getMinutes().toString().padStart(2, '0')}\n`;
            }
            if (s.distance) {
              details += `Distance: ${Math.round(s.distance/1000)} km\n`;
            }
          } else if (s.mode === 'plane') {
            details = `Vol: ${s.from.name} → ${s.to.name}\n`;
            if (s.flight_number) {
              details += `Vol ${s.flight_number}\n`;
            }
            if (s.departure_time && s.arrival_time) {
              const depTime = new Date(s.departure_time);
              const arrTime = new Date(s.arrival_time);
              details += `Départ: ${depTime.getHours()}:${depTime.getMinutes().toString().padStart(2, '0')}, `;
              details += `Arrivée: ${arrTime.getHours()}:${arrTime.getMinutes().toString().padStart(2, '0')}\n`;
            }
          } else if (s.mode === 'train') {
            details = `Train: ${s.from.name} → ${s.to.name}\n`;
            if (s.train_number) {
              details += `Train ${s.train_number}\n`;
            }
            if (s.platform_departure) {
              details += `Quai de départ: ${s.platform_departure}\n`;
            }
            if (s.platform_arrival) {
              details += `Quai d'arrivée: ${s.platform_arrival}\n`;
            }
            if (s.departure_time && s.arrival_time) {
              const depTime = new Date(s.departure_time);
              const arrTime = new Date(s.arrival_time);
              details += `Départ: ${depTime.getHours()}:${depTime.getMinutes().toString().padStart(2, '0')}, `;
              details += `Arrivée: ${arrTime.getHours()}:${arrTime.getMinutes().toString().padStart(2, '0')}\n`;
            }
          }
          
          return details;
        })
      };
      
      combinedJourney.details = details;
      journeys.push(combinedJourney);
      
      return journeys;
      
    } catch (error) {
      console.error("Erreur lors de la création des itinéraires:", error);
      return [];
    }
  },

  // Calculer la distance entre deux points
  calculateDistance: (point1: [number, number], point2: [number, number]): number => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const lat1 = point1[1];
    const lon1 = point1[0];
    const lat2 = point2[1];
    const lon2 = point2[0];
    
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
             Math.cos(φ1) * Math.cos(φ2) *
             Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
    }
};

export default TransportService;