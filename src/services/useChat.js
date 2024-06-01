import { useState, useCallback } from 'react';

const useChatBotApi = (setData) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (formData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('formData : ', formData);
      /*const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data', // Spécifier le bon type de contenu
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log('Fetched data:', data);
      setData(data);*/
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [setData]);

  return { loading, error, fetchData };
};

export default useChatBotApi;
