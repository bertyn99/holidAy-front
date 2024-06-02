import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import pin from "../assets/pin.png";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const libraries = ['places']; // Move libraries array outside the component

const mockFetchItinerary = async () => {
  try {
    const response = await fetch('http://localhost:8000/map', {
      method: 'GET',
    });
    const data = await response.json();
    return data.itinerary;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Map = ({ callMap }) => {
  const [map, setMap] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [currentAdventure, setCurrentAdventure] = useState(0);
  const [currentDay, setCurrentDay] = useState(0);
  const [places, setPlaces] = useState([]);
  const [directionsResponseCar, setDirectionsResponseCar] = useState(null);
  const [directionsResponsesWalking, setDirectionsResponsesWalking] = useState([]);
  const [markers, setMarkers] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries // Use the static libraries array
  });

  const onLoad = useCallback((mapInstance) => {
    console.log('Map loaded');
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    console.log('Map unmounted');
    setMap(null);
  }, []);

  const clearMarkersAndDirections = useCallback(() => {
    console.log('Clearing markers and directions');
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
    setDirectionsResponseCar(null);
    setDirectionsResponsesWalking([]);
  }, [markers]);

  const updateItinerary = useCallback(async (adventureIndex, dayIndex) => {
    console.log('Updating itinerary', adventureIndex, dayIndex);
    if (itinerary.length > 0) {
      const adventureDays = itinerary[adventureIndex]?.adventure?.days || [];
      const selectedPlaces = adventureDays[dayIndex]?.destinations || [];

      // Clear previous markers and directions
      clearMarkersAndDirections();

      if (isLoaded && map && selectedPlaces.length > 0) {
        console.log('Fetching places');
        const service = new window.google.maps.places.PlacesService(map);
        const fetchedPlaces = [];

        const fetchPlace = (name, index) => {
          return new Promise((resolve, reject) => {
            if (!name) {
              reject(`Invalid name: ${name}`);
              return;
            }

            const request = {
              query: name,
              fields: ['name', 'geometry', 'formatted_address', 'photos'],
            };

            service.findPlaceFromQuery(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                const result = results[0];
                fetchedPlaces.push({
                  name: result.name,
                  formatted_address: result.formatted_address,
                  geometry: result.geometry,
                  photoUrl: result.photos && result.photos.length > 0 ? result.photos[0].getUrl() : null,
                  originalIndex: index
                });
                resolve();
              } else {
                reject(`Failed to fetch place: ${name}, status: ${status}`);
              }
            });
          });
        };

        try {
          await Promise.all(selectedPlaces.map((place, index) => fetchPlace(place.name, index)));

          fetchedPlaces.sort((a, b) => a.originalIndex - b.originalIndex);
          setPlaces(fetchedPlaces);

          console.log('Creating markers');
          // Create markers for the places
          const customIcon = {
            url: pin,
            scaledSize: new window.google.maps.Size(32, 32),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(16, 16)
          };

          const newMarkers = fetchedPlaces.map((place, index) => {
            if (!place.geometry) return null;
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: map,
              title: place.name,
              icon: customIcon
            });

            const infowindow = new window.google.maps.InfoWindow({
              content: `
                <div class="border bg-card text-card-foreground bg-black bg-opacity-50 shadow-sm rounded-lg overflow-hidden w-[314px]">
                  ${place.photoUrl ? `<img src="${place.photoUrl}" alt="${place.name}" class="w-full" style="aspect-ratio: 314 / 200; object-fit: cover;" width="314" height="200"/>` : ''}
                  <div class="bg-black bg-opacity-50 p-4 text-white">
                    <div class="text-sm">Day #${dayIndex + 1}</div>
                    <div class="text-xl font-bold">${place.name}</div>
                    <div class="text-sm opacity-75">${place.formatted_address}</div>
                    <button class="bg-grey mt-4 px-4 py-2 rounded text-white">BOOK</button>
                  </div>
                </div>
              `
            });

            marker.addListener('click', () => {
              infowindow.open({
                anchor: marker,
                map,
                shouldFocus: false
              });
            });

            return marker;
          }).filter(Boolean);

          setMarkers(newMarkers);

          const bounds = new window.google.maps.LatLngBounds();
          fetchedPlaces.forEach(place => {
            if (place.geometry) bounds.extend(place.geometry.location);
          });
          map.fitBounds(bounds);

          console.log('Generating directions');
          // Generate directions
          if (fetchedPlaces.length >= 2 && fetchedPlaces[0]?.geometry) {
            const origin = fetchedPlaces[0].geometry.location;
            const waypoints = fetchedPlaces.slice(1, -1).map(place => place.geometry ? { location: place.geometry.location, stopover: true } : null).filter(Boolean);
            const destination = fetchedPlaces[fetchedPlaces.length - 1].geometry.location;

            const generateRoute = (travelMode, origin, destination, waypoints, callback) => {
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
            };

            generateRoute(window.google.maps.TravelMode.DRIVING, origin, destination, waypoints, (carResult) => {
              setDirectionsResponseCar(carResult);

              const walkingPromises = carResult.routes[0].legs.map((leg, index) => {
                const carEndLocation = leg.end_location;
                const placeLocation = fetchedPlaces[index + 1]?.geometry.location;

                return new Promise((resolve) => {
                  if (placeLocation) {
                    generateRoute(window.google.maps.TravelMode.WALKING, carEndLocation, placeLocation, [], (walkingResult) => {
                      resolve(walkingResult);
                    });
                  } else {
                    resolve(null);
                  }
                });
              });

              walkingPromises.unshift(new Promise((resolve) => {
                generateRoute(window.google.maps.TravelMode.WALKING, origin, fetchedPlaces[0].geometry.location, [], (walkingResult) => {
                  resolve(walkingResult);
                });
              }));

              Promise.all(walkingPromises).then(walkingResults => {
                setDirectionsResponsesWalking(walkingResults.filter(Boolean));
              });
            });
          }
        } catch (error) {
          console.error('Error fetching places:', error);
        }
      }
    }
  }, [isLoaded, map, itinerary, clearMarkersAndDirections]);

  useEffect(() => {
    if (callMap) {
      const fetchItinerary = async () => {
        console.log('Fetching itinerary');
        try {
          const itineraryData = await mockFetchItinerary();
          setItinerary(itineraryData);
          setCurrentAdventure(0);
          setCurrentDay(0);
        } catch (error) {
          console.error('Failed to fetch itinerary:', error);
        }
      };
      fetchItinerary();
    }
  }, [callMap]);

  useEffect(() => {
    if (itinerary.length > 0) {
      console.log('Itinerary updated', itinerary);
      updateItinerary(currentAdventure, currentDay);
    }
  }, [currentAdventure, currentDay, updateItinerary, itinerary]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleAdventureSelection = (adventureIndex) => {
    console.log('Selected adventure', adventureIndex);
    setCurrentAdventure(adventureIndex);
    setCurrentDay(0);
  };

  const handleDaySelection = (dayIndex) => {
    console.log('Selected day', dayIndex);
    setCurrentDay(dayIndex);
  };

  return (
    <div className="h-full flex flex-1 relative rounded-2xl overflow-hidden">
      <div className="absolute top-0 left-0 z-10 p-2 bg-white">
        {itinerary.map((adventure, advIndex) => (
          <button key={advIndex} onClick={() => handleAdventureSelection(advIndex)}>
            Adventure {advIndex + 1}
          </button>
        ))}
        {itinerary[currentAdventure]?.adventure?.days.map((_, dayIndex) => (
          <button key={dayIndex} onClick={() => handleDaySelection(dayIndex)}>
            Day {dayIndex + 1}
          </button>
        ))}
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {directionsResponseCar && (
          <DirectionsRenderer
            directions={directionsResponseCar}
            options={{ suppressMarkers: true, preserveViewport: true }}
          />
        )}
        {directionsResponsesWalking.map((directions, index) => (
          <DirectionsRenderer
            key={index}
            directions={directions}
            options={{ suppressMarkers: true, polylineOptions: { strokeColor: 'blue' }, preserveViewport: true }}
          />
        ))}
        {markers.map((marker, index) => (
          <React.Fragment key={index}></React.Fragment>
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
