import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 47.804, // Center between Nantes and Brest
  lng: -3.02
};

const waypoints = [
  {
    location: { lat: 47.4736, lng: -0.5518 }, // Example restaurant 1
    stopover: true
  },
  {
    location: { lat: 47.7398, lng: -3.4881 }, // Example restaurant 2
    stopover: true
  },
  {
    location: { lat: 48.1147, lng: -3.7101 }, // Example restaurant 3
    stopover: true
  }
];

const Map = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);

  useEffect(() => {
    const fetchDirections = () => {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: 47.2184, lng: -1.5536 }, // Nantes
          destination: { lat: 48.3904, lng: -4.4861 }, // Brest
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`Error fetching directions ${result}`);
          }
        }
      );
    };

    if (!directionsResponse) {
      fetchDirections();
    }
  }, [directionsResponse]);

  return (
    <div className="h-screen w-full">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        loadingElement={<div>Loading...</div>}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
        >
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
