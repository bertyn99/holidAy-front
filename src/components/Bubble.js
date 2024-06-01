import React from 'react';

const Bubble = ({ text, timestamp, isUser }) => {
  // Bulle par défaut de l'utilisateur
  if (!text && isUser) {
    return (
      <div className="p-4 ml-32 bg-purple-600 self-end rounded-t-lg rounded-l-lg rounded-br-none">
        <p className="text-sm">Welcome to TravelAi!</p>
        <p className="text-xs text-gray-500">12:00 PM</p>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isUser ? 'ml-32 bg-purple-600 self-end rounded-t-lg rounded-l-lg rounded-br-none' : 'mr-32 bg-gray-800 rounded-t-lg rounded-lg rounded-tl-none'}`}>
      <p className="text-sm">{text}</p>
      <p className="text-xs text-gray-500">{timestamp}</p>
    </div>
  );
};

export default Bubble;
