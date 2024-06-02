import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import pin from "../assets/pin.png";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const mockFetchItinerary = async () => {
 try {
  const response = await fetch('http://localhost:8000/map', {
    method: 'GET',
  });
const data =  JSON.parse(await response.text());
console.log(data.itinerary)
return data.itinerary

}
catch (error) {
  console.log(error)
}} ;

const Map = ({ callMap }) => {
  const [map, setMap] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [currentDay, setCurrentDay] = useState(0); // State to keep track of the current day
  const [places, setPlaces] = useState([]);
  const [directionsResponseCar, setDirectionsResponseCar] = useState(null);
  const [directionsResponsesWalking, setDirectionsResponsesWalking] = useState([]);
  const [markers, setMarkers] = useState([]);
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
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  }, [markers]);

  useEffect(() => {
    if (callMap) {
      const fetchItinerary = async () => {
        try {
          const itinerary = await mockFetchItinerary();
          setItinerary(itinerary);
          setCurrentDay(0); // Set initial day to day 1
        } catch (error) {
          console.error('Failed to fetch itinerary:', error);
        }
      };
      fetchItinerary();
    }
  }, [callMap]);

  useEffect(() => {
    if (itinerary.length > 0) {
      const places = itinerary[currentDay]?.destinations.map(destination => destination.name) || [];
      setPlaces(places);
    }
  }, [itinerary, currentDay]);

  useEffect(() => {
    if (isLoaded && map && places.length > 0) {
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
                photoUrl: result.photos && result.photos.length > 0 ? result.photos[0].getUrl() : null,
                originalIndex: index
              });
              resolve();
            } else {
              reject(`Failed to fetch place: ${placeName}`);
            }
          });
        });
      };

      Promise.all(places.map(fetchPlace)).then(() => {
        fetchedPlaces.sort((a, b) => a.originalIndex - b.originalIndex);
        setPlaces(fetchedPlaces);
      }).catch(error => {
        console.error(error);
      });
    }
  }, [isLoaded, map, places]);

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
    if (places.length >= 2 && places[0]?.geometry) {
      const origin = places[0].geometry.location;
      const waypoints = places.slice(1, -1).map(place => place.geometry ? { location: place.geometry.location, stopover: true } : null).filter(Boolean);
      const destination = places[places.length - 1].geometry.location;

      generateRoute(window.google.maps.TravelMode.DRIVING, origin, destination, waypoints, (carResult) => {
        setDirectionsResponseCar(carResult);

        const walkingPromises = carResult.routes[0].legs.map((leg, index) => {
          const carEndLocation = leg.end_location;
          const placeLocation = places[index + 1]?.geometry.location;

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
          generateRoute(window.google.maps.TravelMode.WALKING, origin, places[0].geometry.location, [], (walkingResult) => {
            resolve(walkingResult);
          });
        }));

        Promise.all(walkingPromises).then(walkingResults => {
          setDirectionsResponsesWalking(walkingResults.filter(Boolean));
        });
      });
    }
  }, [places, generateRoute]);

  useEffect(() => {
    if (map && places.length && places[0]?.geometry) {
      markers.forEach(marker => marker.setMap(null)); // Clear existing markers

      const customIcon = {
        url: pin, // URL to your custom icon
        scaledSize: new window.google.maps.Size(32, 32), // Scale size of the icon
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(16, 16) // Anchor the icon
      };

      const newMarkers = places.map((place, index) => {
        if (!place.geometry) return null;
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
          icon: customIcon // Use the custom icon here
        });

        const infowindow = new window.google.maps.InfoWindow({
          content: `
            <div class="border bg-card text-card-foreground bg-black bg-opacity-50 shadow-sm rounded-lg overflow-hidden w-[314px]">
              ${place.photoUrl ? `<img src="${place.photoUrl}" alt="${place.name}" class="w-full" style="aspect-ratio: 314 / 200; object-fit: cover;" width="314" height="200"/>` : ''}
              <div class="bg-black bg-opacity-50 p-4 text-white">
                <div class="text-sm">Day #${currentDay + 1}</div>
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
      places.forEach(place => {
        if (place.geometry) bounds.extend(place.geometry.location);
      });
      map.fitBounds(bounds);
    }
  }, [map, places, currentDay]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!callMap || places.length === 0) {
    return <div>Loading places...</div>;
  }

  const handlePrevDay = () => {
    setCurrentDay((prevDay) => (prevDay > 0 ? prevDay - 1 : itinerary.length - 1));
  };

  const handleNextDay = () => {
    setCurrentDay((prevDay) => (prevDay < itinerary.length - 1 ? prevDay + 1 : 0));
  };

  return (
    <div className="h-full flex flex-1 relative rounded-2xl overflow-hidden">
      <div className="absolute top-0 left-0 z-10 p-2 bg-white">
        <button onClick={handlePrevDay}>Prev</button>
        <span>Day {currentDay + 1}</span>
        <button onClick={handleNextDay}>Next</button>
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
