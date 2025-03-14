// src/components/MapWrapper.tsx
import React from 'react';
import { Place, Journey } from '../../types/customTypes';

// Importation dynamique pour éviter les erreurs de SSR
const MapComponent = React.lazy(() => import('./MapComponentSimple'));

interface MapWrapperProps {
  selectedDeparture: Place | null;
  selectedArrival: Place | null;
  selectedJourney: Journey | null;
}

const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  // Vérifier si nous sommes côté client
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Chargement de la carte...</div>;
  }

  return (
    <React.Suspense fallback={<div>Chargement de la carte...</div>}>
      <MapComponent
        selectedDeparture={props.selectedDeparture}
        selectedArrival={props.selectedArrival}
        selectedJourney={props.selectedJourney}
      />
    </React.Suspense>
  );
};

export default MapWrapper;