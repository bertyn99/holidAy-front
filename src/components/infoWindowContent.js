import React from 'react';

const InfoWindowContent = ({ index, name, address, photos }) => {
  return (
    <div className="custom-marker p-2 bg-white rounded-lg shadow-lg">
      <div className="photo-slider overflow-hidden whitespace-nowrap">
        {photos.map((photo, idx) => (
          <img key={idx} src={photo.getUrl()} className="inline-block w-32 h-32 mr-2 rounded" alt={name} />
        ))}
      </div>
      <h3 className="text-sm font-semibold">{index}. {name}</h3>
      <p className="text-xs">{address}</p>
    </div>
  );
};

export default InfoWindowContent;
