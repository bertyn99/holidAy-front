import React from 'react';

const Bubble = ({ text, timestamp, isUser }) => {
  // Tente de parser le texte en JSON
  console.log('text : ', text);

  const adventures = Object.keys(text)
    .filter(key => key.startsWith("Adventure"))
    .map(adventure => ({
        name: adventure,
        days: text[adventure]
    }));

  if (text === "" && !isUser) {
    return (
      <div className="p-4 mr-32 bg-secondary rounded-t-lg rounded-lg rounded-tl-none">
        <p className="font-normal">Hi, my name is Holly, where do you want to go ?</p>
        <p className="font-normal text-gray-500">{timestamp}</p>
      </div>
    );
  }

  return (
    <>
        <div className={`p-4 ${isUser ? 'ml-32 bg-bubble-user self-end rounded-t-lg rounded-l-lg rounded-br-none' : 'mr-32 bg-secondary rounded-t-lg rounded-lg rounded-tl-none'}`}>
            <p className={`font-normal ${isUser ? 'text-gray-800' : 'text-gray-500'}`}>{isUser ? text : text.response}</p>
            <p className={`font-normal ${isUser ? 'text-gray-800' : 'text-gray-500'}`}>{timestamp}</p>
        </div>

        {adventures.map(() => {
            return(
                <div>
                    <p>{adventures.name}</p>
                </div>
            )
        }
        )}
    </>
  );
};

export default Bubble;
