import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import Marker from './Marker';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Predefined array of place names
const placeNames = [
  "Restaurant Le Coquillage - Saint-Méloir-des-Ondes",
  "Hôtel Le Magic Hall - Rennes",
  "Site touristique Alignements de Carnac - Carnac",
  "Restaurant La Table Breizh Café - Cancale",
  "Hôtel Le Continental - Brest",
];

const Map = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [directionsResponseCar, setDirectionsResponseCar] = useState(null);
  const [directionsResponsesWalking, setDirectionsResponsesWalking] = useState([]); // Multiple walking routes
  const [markers, setMarkers] = useState([]); // Initialize markers state
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    // Clear markers when the map unmounts
    setMarkers((prevMarkers) => {
      prevMarkers.forEach(marker => marker.setMap(null));
      return [];
    });
  }, []);

  useEffect(() => {
    if (isLoaded && map) {
      const service = new window.google.maps.places.PlacesService(map);
      const fetchedPlaces = [];

      const fetchPlace = (placeName, index) => {
        return new Promise((resolve, reject) => {
          const request = {
            query: placeName,
            fields: ['name', 'geometry', 'formatted_address', 'photos'],
          };

          service.findPlaceFromQuery(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
              const result = results[0];
              fetchedPlaces.push({
                name: result.name,
                formatted_address: result.formatted_address,
                geometry: result.geometry,
                photos: result.photos || [],
                originalIndex: index
              });
              resolve();
            } else {
              reject(`Failed to fetch place: ${placeName}`);
            }
          });
        });
      };

      Promise.all(placeNames.map(fetchPlace)).then(() => {
        fetchedPlaces.sort((a, b) => a.originalIndex - b.originalIndex);
        setPlaces(fetchedPlaces);
      }).catch(error => {
        console.error(error);
      });
    }
  }, [isLoaded, map]);

  const generateRoute = useCallback((travelMode, origin, destination, waypoints, callback) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        travelMode: travelMode,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          callback(result);
        } else {
          console.error(`Error fetching directions: ${result}`);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (places.length >= 2) {
      const origin = places[0].geometry.location;
      const waypoints = places.slice(1, -1).map(place => ({ location: place.geometry.location, stopover: true }));
      const destination = places[places.length - 1].geometry.location;

      generateRoute(window.google.maps.TravelMode.DRIVING, origin, destination, waypoints, (carResult) => {
        setDirectionsResponseCar(carResult);

        const walkingPromises = carResult.routes[0].legs.map((leg, index) => {
          const carEndLocation = leg.end_location;
          const placeLocation = places[index + 1].geometry.location;

          return new Promise((resolve) => {
            generateRoute(window.google.maps.TravelMode.WALKING, carEndLocation, placeLocation, [], (walkingResult) => {
              resolve(walkingResult);
            });
          });
        });

        // Generate walking route for the first place from the initial origin point
        walkingPromises.unshift(new Promise((resolve) => {
          generateRoute(window.google.maps.TravelMode.WALKING, origin, places[0].geometry.location, [], (walkingResult) => {
            resolve(walkingResult);
          });
        }));

        Promise.all(walkingPromises).then(walkingResults => {
          setDirectionsResponsesWalking(walkingResults);
        });
      });
    }
  }, [places, generateRoute]);

  useEffect(() => {
    if (map && places.length) {
      // Clear existing markers to avoid duplicates
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = places.map((place, index) => (
        <Marker
          key={index}
          map={map}
          position={place.geometry.location}
          name={place.name}
          address={place.formatted_address}
          photos={place.photos}
          index={index}
        />
      ));

      // Store new markers in state
      setMarkers(newMarkers);

      // Fit map bounds to include all markers
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach(place => {
        bounds.extend(place.geometry.location);
      });
      map.fitBounds(bounds);
    }
  }, [map, places]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {directionsResponseCar && (
          <DirectionsRenderer
            directions={directionsResponseCar}
            options={{ suppressMarkers: true, preserveViewport: true }} // Suppress default markers and preserve viewport
          />
        )}
        {directionsResponsesWalking.map((directions, index) => (
          <DirectionsRenderer
            key={index}
            directions={directions}
            options={{ suppressMarkers: true, polylineOptions: { strokeColor: 'blue' }, preserveViewport: true }} // Different color for walking route and preserve viewport
          />
        ))}
        {markers}
      </GoogleMap>
    </div>
  );
}

export default Map;
