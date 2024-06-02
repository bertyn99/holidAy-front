import React from 'react';

const Bubble = ({ text, timestamp, isUser }) => {
  // Bulle par défaut de l'interlocuteur
  if (text === "" && !isUser) {
    return (
      <div className="p-4 mr-32 bg-secondary rounded-t-lg rounded-lg rounded-tl-none">
        <p className="font-normal">Hi, my name is Holly, where do you want to go ?</p>
        <p className="font-normal text-gray-500">12:00 PM</p>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isUser ? 'ml-32 bg-bubble-user self-end rounded-t-lg rounded-l-lg rounded-br-none' : 'mr-32 bg-secondary rounded-t-lg rounded-lg rounded-tl-none'}`}>
      <p className={`font-normal ${isUser ? 'text-gray-800' : 'text-gray-500'}`}>{text}</p>
      <p className={`font-normal ${isUser ? 'text-gray-800' : 'text-gray-500'}`}>{timestamp}</p>
    </div>
  );
};

export default Bubble;
