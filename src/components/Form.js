import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';
import Bubble from './Bubble';
import useChatBotApi from '../services/useChat';

const Form = () => {
  const [prompt, setPrompt] = useState('');
  const [conversation, setConversation] = useState([]);
  const [data, setData] = useState(null);
  const { loading, error, fetchData } = useChatBotApi(setData);

  // Référence à la div contenant la conversation
  const conversationRef = useRef(null);

  useEffect(() => {
    // Après le rendu initial, défile vers le bas de la conversation
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    console.log('Data changed:', data); // Ajout de log pour vérifier les changements de data
    if (data) {
      setConversation((prev) => [
        ...prev,
        { text: data, timestamp: new Date().toLocaleTimeString(), isUser: false }
      ]);
    }
    setData('');
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ajoute le message de l'utilisateur à la conversation
    setConversation((prev) => [
      ...prev,
      { text: prompt, timestamp: new Date().toLocaleTimeString(), isUser: true }
    ]);

    // Appel API
    await fetchData(prompt, '');
    setPrompt('');
  };

  return (
    <div 
      className="flex flex-1 flex-col h-full mb-4 max-w-2xl bg-primary text-white rounded-2xl border-primary-purple shadow-md relative mr-10 overflow-hidden" 
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
