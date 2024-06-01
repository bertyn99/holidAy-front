import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import Marker from './Marker';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const mockFetchPlaces = async () => {
  // Simulate fetching JSON from an API
  const response = {
    "trip": {
      "start_date": "12/12/2024",
      "duration": "5 days",
      "budget_per_person": "2000€",
      "interests": ["culture", "food", "shopping"],
      "travelers": 2
    },
    "itinerary": [
      {
        "day": 1,
        "destinations": [
          {
            "name": "Tokyo Tower",
            "address": "4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan",
            "coordinates": {"latitude": 35.6586, "longitude": 139.7454},
            "transport": "Subway - Oedo Line to Akabanebashi Station",
            "ticket_price": "¥900",
            "ticket_link": "https://www.tokyotower.co.jp/en.html",
            "weather": "Average temperature: 10°C, partly cloudy"
          },
          {
            "name": "Roppongi Hills",
            "address": "6 Chome-10-1 Roppongi, Minato City, Tokyo 106-6108, Japan",
            "coordinates": {"latitude": 35.6604, "longitude": 139.7292},
            "transport": "Walk or short subway ride from Tokyo Tower",
            "ticket_price": "Free",
            "ticket_link": "https://www.roppongihills.com/en/",
            "weather": "Average temperature: 10°C, partly cloudy"
          }
        ]
      },
      {
        "day": 2,
        "destinations": [
          {
            "name": "Senso-ji Temple",
            "address": "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
            "coordinates": {"latitude": 35.7146, "longitude": 139.7966},
            "transport": "Subway - Ginza Line to Asakusa Station",
            "ticket_price": "Free admission",
            "ticket_link": "https://www.senso-ji.jp/",
            "weather": "Average temperature: 12°C, sunny"
          },
          {
            "name": "Nakamise Shopping Street",
            "address": "Asakusa, Taito City, Tokyo 111-0032, Japan",
            "coordinates": {"latitude": 35.7142, "longitude": 139.7966},
            "transport": "Walk from Senso-ji Temple",
            "ticket_price": "Free",
            "ticket_link": "N/A",
            "weather": "Average temperature: 12°C, sunny"
          },
          {
            "name": "Sumida Aquarium",
            "address": "1-1-2 Oshiage, Sumida City, Tokyo 131-0045, Japan",
            "coordinates": {"latitude": 35.7101, "longitude": 139.8107},
            "transport": "Subway - Hanzomon Line to Oshiage Station",
            "ticket_price": "¥2050",
            "ticket_link": "https://www.sumida-aquarium.com/en/",
            "weather": "Average temperature: 12°C, sunny"
          }
        ]
      },
      {
        "day": 3,
        "destinations": [
          {
            "name": "Shibuya Crossing",
            "address": "2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan",
            "coordinates": {"latitude": 35.6614, "longitude": 139.7041},
            "transport": "JR Yamanote Line to Shibuya Station",
            "ticket_price": "Free",
            "ticket_link": "N/A",
            "weather": "Average temperature: 15°C, clear skies"
          },
          {
            "name": "Shibuya Center-Gai",
            "address": "Udagawacho, Shibuya City, Tokyo 150-0042, Japan",
            "coordinates": {"latitude": 35.6607, "longitude": 139.7004},
            "transport": "Walk from Shibuya Crossing",
            "ticket_price": "Free",
            "ticket_link": "N/A",
            "weather": "Average temperature: 15°C, clear skies"
          },
          {
            "name": "Omotesando Shopping Street",
            "address": "Jingumae, Shibuya City, Tokyo 150-0001, Japan",
            "coordinates": {"latitude": 35.6681, "longitude": 139.7085},
            "transport": "Subway - Ginza Line to Omotesando Station",
            "ticket_price": "Free",
            "ticket_link": "N/A",
            "weather": "Average temperature: 15°C, clear skies"
          }
        ]
      },
      {
        "day": 4,
        "destinations": [
          {
            "name": "Meiji Shrine",
            "address": "1-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-0052, Japan",
            "coordinates": {"latitude": 35.6764, "longitude": 139.6993},
            "transport": "JR Yamanote Line to Harajuku Station",
            "ticket_price": "Free admission",
            "ticket_link": "https://www.meijijingu.or.jp/",
            "weather": "Average temperature: 14°C, partly cloudy"
          },
          {
            "name": "Takeshita Street",
            "address": "1 Chome-17 Jingumae, Shibuya City, Tokyo 150-0001, Japan",
            "coordinates": {"latitude": 35.6704, "longitude": 139.7065},
            "transport": "Walk from Meiji Shrine",
            "ticket_price": "Free",
            "ticket_link": "N/A",
            "weather": "Average temperature: 14°C, partly cloudy"
          },
          {
            "name": "Yoyogi Park",
            "address": "2-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-0052, Japan",
            "coordinates": {"latitude": 35.6717, "longitude": 139.6949},
            "transport": "Walk from Takeshita Street",
            "ticket_price": "Free",
            "ticket_link": "N/A",
            "weather": "Average temperature: 14°C, partly cloudy"
          }
        ]
      },
      {
        "day": 5,
        "destinations": [
          {
            "name": "Tsukiji Fish Market",
            "address": "5 Chome-2-1 Tsukiji, Chuo City, Tokyo 104-0045, Japan",
            "coordinates": {"latitude": 35.6654, "longitude": 139.7707},
            "transport": "Subway - Hibiya Line to Tsukiji Station",
            "ticket_price": "Free admission",
            "ticket_link": "N/A",
            "weather": "Average temperature: 13°C, chance of rain"
          },
          {
            "name": "Ginza Shopping District",
            "address": "Ginza, Chuo City, Tokyo 104-0061, Japan",
            "coordinates": {"latitude": 35.6717, "longitude": 139.7647},
            "transport": "Subway - Hibiya Line to Ginza Station",
            "ticket_price": "Free",
            "ticket_link": "N/A",
            "weather": "Average temperature: 13°C, chance of rain"
          },
          {
            "name": "Kabuki-za Theatre",
            "address": "4 Chome-12-15 Ginza, Chuo City, Tokyo 104-0061, Japan",
            "coordinates": {"latitude": 35.6692, "longitude": 139.7641},
            "transport": "Walk from Ginza Shopping District",
            "ticket_price": "Varies",
            "ticket_link": "https://www.kabukiweb.net/",
            "weather": "Average temperature: 13°C, chance of rain"
          }
        ]
      }
    ]
  };

  // Parse the JSON and extract the list of place names
  const places = response.itinerary.flatMap(day => day.destinations.map(destination => destination.name));
  return places;
};

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
    const fetchPlaces = async () => {
      try {
        const places = await mockFetchPlaces();
        setPlaces(places);
      } catch (error) {
        console.error('Failed to fetch places:', error);
      }
    };

    fetchPlaces();
  }, []);

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
    if (places.length >= 2 && places[0].geometry) {
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
    if (map && places.length && places[0].geometry) {
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

  if (places.length === 0) {
    return <div>Loading places...</div>;
  }

  return (
    <div className="h-full flex-1 relative">
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
