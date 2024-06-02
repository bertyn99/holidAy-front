import React from 'react';

const Bubble = ({ text, timestamp, isUser }) => {
  // Vérifie si le texte est un objet ou une chaîne de caractères
  if (typeof text === 'string') {
    text = { response: text };
  }

  // Extrait les aventures du texte
  const adventures = Object.keys(text)
    .filter(key => key.startsWith("Adventure"))
    .map(adventure => ({
      name: adventure,
      days: text[adventure]
    }));

  // Vérifie si la réponse est vide et que ce n'est pas l'utilisateur
  if (!text.response && !isUser) {
    return (
      <div className="p-4 mr-32 bg-secondary rounded-t-lg rounded-lg rounded-tl-none">
        <p className="font-normal">Hi, my name is Holly, where do you want to go?</p>
        <p className="font-normal text-gray-500">{timestamp}</p>
      </div>
    );
  }

  return (
    <div className='h-sceen'>
      <div className={`p-4 ${isUser ? 'ml-32 bg-bubble-user self-end rounded-t-lg rounded-l-lg rounded-br-none' : 'mr-32 bg-secondary rounded-t-lg rounded-lg rounded-tl-none'}`}>
        <p className={`font-normal ${isUser ? 'text-gray-800' : 'text-white'}`}>{isUser ? text.response : text.response}</p>
        <p className={`font-normal ${isUser ? 'text-gray-800' : 'text-gray-500'}`}>{timestamp}</p>
      </div>

      {adventures.map((adventure, index) => (
        <div key={index} className="bg-secondary p-4 mr-32 rounded-t-lg rounded-lg rounded-tl-none mb-4">
          <h2 className="font-bold text-lg mb-2">{adventure.name}</h2>
          {Object.keys(adventure.days).map((day, dayIndex) => (
            <div key={dayIndex} className="mb-2">
              <h3 className="font-semibold">{day}</h3>
              <ul className="list-disc list-inside ml-4">
                {Object.keys(adventure.days[day]).map((activity, activityIndex) => (
                  <li key={activityIndex} className="font-normal">{adventure.days[day][activity]}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Bubble;