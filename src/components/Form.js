import React, { useState, useEffect, useRef } from "react";
import Input from "./Input";
import Bubble from "./Bubble";
import useChatBotApi from "../services/useChat";


const Form = () => {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [data, setData] = useState(null);
  const [fileResponse, setFileResponse] = useState(null);
  const [loading, setLoading] = useState(false); // Initialize loading as true
  const {error, sendText, sendFile } = useChatBotApi(
    setData,
    setFileResponse
  );

  const conversationRef = useRef(null);

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
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
      setData("");
      setPrompt("");
      setLoading(false); // Set loading to false once the data is processed
    }
  }, [data]);

  useEffect(() => {
    if (fileResponse) {
      let parsedData;
      try {
        parsedData = JSON.parse(fileResponse);
      } catch (error) {
        console.log(error);
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
      setFile(null);
      setPrompt("");
      setLoading(false); // Set loading to false once the file response is processed
    }
  }, [fileResponse]);

  const handleSubmit = async (e, selectedFile) => {
    e.preventDefault();

    if (prompt && !selectedFile) {
      setConversation((prev) => [
        ...prev,
        {
          text: prompt,
          timestamp: new Date().toLocaleTimeString(),
          isUser: true,
        },
      ]);
      setPrompt("");
      setLoading(true); // Set loading to true when sending text
      await sendText(prompt);
    } else if (!prompt && selectedFile) {
      setConversation((prev) => [
        ...prev,
        {
          text: "Fichier transmit. ✅",
          timestamp: new Date().toLocaleTimeString(),
          isUser: true,
        },
      ]);

 setLoading(true); 
      setFile(null);
      await sendFile(selectedFile);

    }
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
          <div className="pt-8 pb-2 lg:flex hidden">
            <h1 className="text-4xl font-semibold font-montserrat px-4 leading-10">
              👋 Hello, raconte moi le voyage de tes rêves
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
            {loading && (
            <div className="w-full flex justify-start py-4">
              <div className="loader"></div> {/* Add your spinner styling here */}
            </div>
            )}
          </div>
      </div>
      <Input
        prompt={prompt}
        setPrompt={setPrompt}
        file={file}
        setFile={setFile}
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
        `}
      </style>
    </div>
  );
};

export default Form;
