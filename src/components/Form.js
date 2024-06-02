import React, { useState, useEffect, useRef } from "react";
import Input from "./Input";
import Bubble from "./Bubble";
import useChatBotApi from "../services/useChat";

const Form = ({changeCallMap}) => {
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [data, setData] = useState(null);
  const [fileResponse, setFileResponse] = useState(null);
  const { loading, error, sendText, sendFile } = useChatBotApi(
    setData,
    setFileResponse
  );


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
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (error) {
        parsedData =
          "Mince, il y a eu un problème sur l'organisation du voyage. 🤕 Fournissez nous plus d'informations !";
      }

      setConversation((prev) => [
        ...prev,
        {
          text: parsedData,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false,
        },
      ]);
      changeCallMap(true)
      setData("");
      setPrompt("");
    }
    setData('');
  }, [data]);

  useEffect(() => {
    if (fileResponse) {
      let parsedData;
      try {
        parsedData = JSON.parse(fileResponse);
      } catch (error) {
        parsedData =
          "Mince, il y a eu un problème sur l'organisation du voyage. 🤕 Fournissez nous plus d'informations !";
      }

      setConversation((prev) => [
        ...prev,
        {
          text: parsedData,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false,
        },
      ]);
      setFileResponse("");
      setPrompt("");
    }
  }, [fileResponse]);

  const handleSubmit = async (e, selectedFiles) => {
    e.preventDefault();

    // Vérifie si l'utilisateur a saisi du texte ou téléchargé des fichiers, mais pas les deux
    if (prompt && selectedFiles.length === 0) {
      // Ajoute le message de l'utilisateur à la conversation
      setConversation((prev) => [
        ...prev,
        {
          text: prompt,
          timestamp: new Date().toLocaleTimeString(),
          isUser: true,
        },
      ]);

      setPrompt("");
      await sendText(prompt);
    } else if (!prompt && selectedFiles.length > 0) {
      // Ajoute une entrée pour le fichier dans la conversation
      setConversation((prev) => [
        ...prev,
        {
          text: "File sent",
          timestamp: new Date().toLocaleTimeString(),
          isUser: true,
        },
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
      style={{
        boxShadow: "0 0 50px 0 rgba(255, 255, 255, 0.2)",
        border: "0.5px solid",
        borderColor: "#696FFF",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1/20 bg-gradient-to-b from-black to-transparent h-10 rounded-2xl pt-10"></div>
      <div
        className="flex-grow flex flex-col items-center p-4 space-y-4 overflow-y-auto scroll-smooth"
        ref={conversationRef}
      >
        <div className="w-full space-y-4">
          <div className="pt-8 pb-2">
            <h1 className="text-4xl font-semibold font-montserrat px-4 leading-10">
              👋 Hello, racontes moi le voyage de tes rêves
            </h1>
          </div>
          <Bubble key={-1} text="" timestamp="" isUser={false} />
          {conversation.map((conv, index) => (
            <Bubble
              key={index}
              text={conv.text}
              timestamp={conv.timestamp}
              isUser={conv.isUser}
            />
          ))}
        </div>
      </div>
      <Input
        prompt={prompt}
        setPrompt={setPrompt}
        files={files}
        setFiles={setFiles}
        handleSubmit={handleSubmit}
      />
      <style jsx>
        {`
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
          ` }
      </style>
    </div>
  );
};

export default Form;
