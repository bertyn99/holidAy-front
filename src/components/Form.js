import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';
import Bubble from './Bubble';
import CardHotel from './CardHotel';

const Form = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState([]);

  const hotel = {

    name: "Hotel de Paris",
    description: "Hotel de Paris is a luxury hotel in the heart of Monaco, established in 1864.",
    city: "Monte Carlo, Monaco",
    rating: "5 stars",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Hotel_de_Paris%2C_Monte_Carlo.jpg/1920px-Hotel_de_Paris%2C_Monte_Carlo.jpg"


  };
  // Référence à la div contenant la conversation
  const conversationRef = useRef(null);

  useEffect(() => {
    // Après le rendu initial, défile vers le bas de la conversation
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mocking the API response for now
    const data = { response: "This is a mock response from the API." };

    setConversation((prev) => [
      ...prev,
      { text: prompt, timestamp: new Date().toLocaleTimeString(), isUser: true },
      { text: data.response, timestamp: new Date().toLocaleTimeString(), isUser: false }
    ]);

    setPrompt('');
  };

  return (
    <div 
      className="flex flex-1 flex-col h-full mb-4 max-w-2xl bg-primary text-white rounded-2xl border-primary-purple shadow-md relative mr-10" 
      style={{ boxShadow: '0 0 50px 0 rgba(255, 255, 255, 0.2)', border: "0.5px solid", borderColor: "#696FFF" }}>
      <div className="absolute top-0 left-0 w-full h-1/20 bg-gradient-to-b from-black to-transparent h-10 rounded-2xl pt-10"></div>
      <div className="flex-grow flex flex-col items-center p-4 space-y-4 overflow-y-auto scroll-smooth" ref={conversationRef}>
        <div className="w-full space-y-4">
          <div className="pt-8 pb-2">
            <h1 className="text-4xl font-semibold font-montserrat px-4 leading-10">Good morning, 👋 Tell us about your trip</h1>
          </div>
          {/* Bulle par défaut de l'interlocuteur */}
          <Bubble key={-1} text="" timestamp="" isUser={false} />
          {/* Bulles de conversation dynamiques */}
          {conversation.map((conv, index) => (
            <Bubble key={index} text={conv.text} timestamp={conv.timestamp} isUser={conv.isUser} />
          ))}


          <CardHotel hotel={hotel} />
        </div>
      </div>
      <Input prompt={prompt} setPrompt={setPrompt} handleSubmit={handleSubmit} />
      <style jsx>{`
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #343943;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}
      </style>
    </div>
  );
};

export default Form;
