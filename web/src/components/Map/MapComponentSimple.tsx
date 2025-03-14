// src/components/MapComponentSimple.tsx
import React from 'react';
import { Place, Journey } from '../../types/customTypes';

const MapComponentSimple: React.FC<{
  selectedDeparture: Place | null;
  selectedArrival: Place | null;
  selectedJourney: Journey | null;
}> = ({ selectedDeparture, selectedArrival, selectedJourney }) => {
  // Référence à l'élément de carte
  const mapRef = React.useRef<HTMLDivElement>(null);
  
  // État pour les données
  const [routes, setRoutes] = React.useState<Journey[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showReservationModal, setShowReservationModal] = React.useState<boolean>(false);
  const [selectedRouteForReservation, setSelectedRouteForReservation] = React.useState<Journey | null>(null);

  // Fonction pour formatter la durée
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h${mins < 10 ? '0' : ''}${mins}` : `${mins}min`;
  };

  // Fonction pour formatter le prix
  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} €`;
  };

  // Fonction pour gérer la réservation
  const handleReservation = (route: Journey, event?: React.MouseEvent): void => {
    if (event) {
      event.stopPropagation();
    }
    
    setSelectedRouteForReservation(route);
    setShowReservationModal(true);
    alert(`Réservation pour l'itinéraire ${route.id} confirmée !`);
  };

  // Fermer le modal de réservation
  const handleCloseReservationModal = (): void => {
    setShowReservationModal(false);
  };

  // Fonction pour confirmer la réservation
  const handleConfirmReservation = (): void => {
    setShowReservationModal(false);
    alert('Votre réservation a été confirmée !');
  };

  // Effet pour initialiser les données
  React.useEffect(() => {
    if (selectedDeparture && selectedArrival && selectedJourney) {
      setLoading(true);
      
      // Simuler l'appel API avec un délai
      setTimeout(() => {
        setRoutes([selectedJourney]);
        setLoading(false);
      }, 500);
    }
  }, [selectedDeparture, selectedArrival, selectedJourney]);

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {/* En-tête avec les informations de trajet */}
      <div style={{ padding: '15px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
        <h2>Détails de l'itinéraire</h2>
        {selectedDeparture && selectedArrival && (
          <div>
            <p>
              <strong>De:</strong> {selectedDeparture.name} <br />
              <strong>À:</strong> {selectedArrival.name}
            </p>
          </div>
        )}
      </div>
      
      {/* Zone de la carte (affichage simplifié) */}
      <div 
        ref={mapRef} 
        style={{ 
          flex: 1, 
          backgroundColor: '#e5e5e5', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Message temporaire à la place de la carte */}
        <div style={{ 
          position: 'absolute', 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          <h3>Visualisation de carte</h3>
          <p>Départ: {selectedDeparture?.name || "Non spécifié"}</p>
          <p>Arrivée: {selectedArrival?.name || "Non spécifiée"}</p>
          {selectedJourney && (
            <div>
              <p>Durée totale: {formatDuration(selectedJourney.duration)}</p>
              <p>Distance: {selectedJourney.distance ? `${(selectedJourney.distance / 1000).toFixed(1)} km` : "Non spécifiée"}</p>
            </div>
          )}
          <small>La carte interactive n'est pas disponible actuellement.</small>
        </div>
      </div>
      
      {/* Panneau des itinéraires */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px',
        borderTop: '1px solid #ddd',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <h2 style={{ 
          marginTop: 0, 
          marginBottom: '20px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Itinéraires disponibles ({routes.length})
        </h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Chargement des itinéraires...
          </div>
        ) : (
          <div>
            {routes.map((route: Journey) => (
              <div 
                key={route.id}
                style={{ 
                  marginBottom: '15px', 
                  padding: '15px', 
                  backgroundColor: selectedJourney?.id === route.id ? '#e3f2fd' : '#f5f5f5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedJourney?.id === route.id ? '1px solid #2196F3' : '1px solid #ddd'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <div>
                    {route.segments.map((segment, index) => (
                      <span 
                        key={index}
                        style={{ 
                          display: 'inline-block',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          marginRight: '5px',
                          fontSize: '12px'
                        }}
                      >
                        {segment.mode.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {formatPrice(route.price)}
                  </div>
                </div>
                
                <div style={{ fontSize: '14px', color: '#555' }}>
                  Durée: {formatDuration(route.duration)}
                  {route.distance && ` • ${Math.round(route.distance / 1000)} km`}
                </div>
                
                <button
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    marginTop: '10px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold'
                  }}
                  onClick={(e: React.MouseEvent) => handleReservation(route, e)}
                >
                  Réserver
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de réservation */}
      {showReservationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2>Confirmation de réservation</h2>
            <p>Votre réservation a été enregistrée avec succès !</p>
            
            {selectedRouteForReservation && (
              <div>
                <h3>Détails de l'itinéraire</h3>
                <p>Prix : {formatPrice(selectedRouteForReservation.price)}</p>
                <p>Durée : {formatDuration(selectedRouteForReservation.duration)}</p>
                <p>Segments :</p>
                <ul>
                  {selectedRouteForReservation.segments.map((segment, index) => (
                    <li key={index}>
                      {segment.mode.toUpperCase()} : {segment.from.name} → {segment.to.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  minWidth: '150px'
                }}
                onClick={handleCloseReservationModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponentSimple;