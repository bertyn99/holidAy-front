import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import InfoWindowContent from './infoWindowContent';

const Marker = ({ map, position, name, address, photos, index }) => {
  useEffect(() => {
    if (!map || !position) return;

    const marker = new window.google.maps.Marker({
      position,
      map,
      title: name
    });

    const infowindow = new window.google.maps.InfoWindow({
      content: `<div id="info-window-${index}"></div>`
    });

    marker.addListener('click', () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false
      });

      window.google.maps.event.addListenerOnce(infowindow, 'domready', () => {
        const container = document.getElementById(`info-window-${index}`);
        if (container) {
          const content = (
            <InfoWindowContent 
              index={index + 1}
              name={name}
              address={address}
              photos={photos}
            />
          );
          ReactDOM.render(content, container);
        } else {
          console.error(`Container not found for ID: info-window-${index}`);
        }
      });
    });

    return () => {
      marker.setMap(null);
    };
  }, [map, position, name, address, photos, index]);

  return null;
};

export default Marker;
