import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';
import Bubble from './Bubble';

const Form = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState([]);

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
    <div className="flex flex-col h-screen max-w-2xl bg-primary-bg text-white">
      <div className="border-b border-gray-700 p-4">
        <h1 className="text-xl font-bold">TravelAi</h1>
      </div>
      <div className="flex-grow flex flex-col items-center p-4 space-y-4 overflow-y-auto" ref={conversationRef}>
        <div className="w-full space-y-4">
          {/* Bulle par défaut de l'interlocuteur */}
          <Bubble key={-1} text="" timestamp="" isUser={false} />
          {/* Bulles de conversation dynamiques */}
          {conversation.map((conv, index) => (
            <Bubble key={index} text={conv.text} timestamp={conv.timestamp} isUser={conv.isUser} />
          ))}
        </div>
      </div>
      <Input prompt={prompt} setPrompt={setPrompt} handleSubmit={handleSubmit} />
    </div>
  );
};

export default Form;
