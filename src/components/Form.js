import React, { useState, useEffect, useRef } from 'react';
import Input from './Input';
import Bubble from './Bubble';
import useChatBotApi from '../services/useChat';

const Form = () => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [data, setData] = useState(null);
  const { loading, error, sendText, sendFile } = useChatBotApi(setData);

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

  const handleSubmit = async (e, selectedFiles) => {
    e.preventDefault();

    // Vérifie si l'utilisateur a saisi du texte ou téléchargé des fichiers, mais pas les deux
    if (prompt && selectedFiles.length === 0) {
      // Ajoute le message de l'utilisateur à la conversation
      setConversation((prev) => [
        ...prev,
        { text: prompt, timestamp: new Date().toLocaleTimeString(), isUser: true }
      ]);

      // Envoie le texte
      await sendText(prompt);
    } else if (!prompt && selectedFiles.length > 0) {
      // Ajoute une entrée pour le fichier dans la conversation
      setConversation((prev) => [
        ...prev,
        { text: 'File sent', timestamp: new Date().toLocaleTimeString(), isUser: true }
      ]);

      // Envoie les fichiers
      for (let file of selectedFiles) {
        await sendFile(file);
      }
    }

    setPrompt('');
    setFiles([]);
  };

  return (
    <div 
      className="flex flex-1 flex-col h-full mb-4 max-w-2xl bg-primary text-white rounded-2xl border-primary-purple shadow-md relative mr-10 overflow-hidden px-4" 
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
      <Input prompt={prompt} setPrompt={setPrompt} files={files} setFiles={setFiles} handleSubmit={handleSubmit} />
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
