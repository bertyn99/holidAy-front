import React from "react";
import Collapsible from "./Collapsible";

const Bubble = ({ text, timestamp, isUser }) => {
  // Vérifie si le texte est un objet ou une chaîne de caractères
  if (typeof text === "string") {
    text = { response: text };
  }

  // Extrait les aventures du texte
  const adventures = Object.keys(text)
    .filter(
      (key) =>
        key.startsWith("Aventure") && Object.values(text[key]).length > 0
    )
    .map((adventure) => ({
      name: adventure,
      days: text[adventure],
    }))
    .filter((adventure) => Object.values(adventure.days).length > 0)
    .filter((adventure) => Object.values(adventure.days["Jour 1"]).length > 0)
    .filter((adventure) => adventure.days["Jour 1"]["Activité 1"].trim() !== "");

  console.log(adventures);

  // Vérifie si la réponse est vide et que ce n'est pas l'utilisateur
  if (!text.response && !isUser) {
    return (
        <>
            <div className="p-4 mr-32 bg-secondary rounded-lg shadow-lg">
                <p className="font-normal mb-2">Pour commencer, j'aurais besoin de quelques informations :</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li className="font-normal">🏖️ Destination</li>
                    <li className="font-normal">💰 Budget</li>
                    <li className="font-normal">⏳ Durée</li>
                </ul>
            </div>
        </>
    );
  }

  return (
    <div className="h-sceen">
      <div
        className={`p-4 ${
          isUser
            ? "ml-32 bg-bubble-user self-end rounded-t-lg rounded-l-lg rounded-br-none"
            : "mr-32 bg-secondary rounded-t-lg rounded-lg rounded-tl-none mb-4"
        }`}
        style={
          isUser
            ? { background: "linear-gradient(90deg, #DFD5EF 0%, #9297FF 100%)" }
            : {}
        }
      >
        <p className={`font-normal ${isUser ? "text-gray-800" : "text-white"}`}>
          {isUser ? text.response : text.response}
        </p>
        <p
          className={`font-normal ${
            isUser ? "text-gray-800" : "text-gray-500"
          }`}
        >
          <span className="timestamp">{timestamp}</span>
        </p>
      </div>

      {adventures.map((adventure, index) => (
        <div
          key={index}
          className="bg-secondary p-4 mr-32 rounded-t-lg rounded-lg rounded-tl-none mb-4"
        >
          <Collapsible title={adventure.name}>
            {Object.keys(adventure.days).map((day, dayIndex) => (
              <div key={dayIndex} className="mb-2">
                <h3 className="font-semibold">{day}</h3>
                <ul className="list-disc list-inside ml-4">
                  {Object.keys(adventure.days[day]).map(
                    (activity, activityIndex) => (
                      <li key={activityIndex} className="font-normal">
                        {adventure.days[day][activity]}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </Collapsible>
        </div>
      ))}

      {adventures.length > 1 && (
        <div className="p-4 mr-32 bg-secondary rounded-lg shadow-lg">
          <p className="font-normal mb-2">Quelle aventure te ferais le plus plaisir ?</p>
        </div>
      )}
    </div>
  );
};

export default Bubble;
