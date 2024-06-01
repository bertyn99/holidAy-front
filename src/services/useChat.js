import { useState, useCallback } from 'react';

const useChatBotApi = (setData) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data); // Ajout de log pour vérifier la réponse
      setData(data); // Utilise le setData passé en paramètre
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [setData]);

  return { loading, error, fetchData };
};

export default useChatBotApi;
