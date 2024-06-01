import React from 'react';
import Form from './components/Form';
import Map from './components/Map';
import './App.css';  // Assurez-vous que le chemin est correct selon la structure de vos dossiers

function App() {
  return (
    <div className="w-screen h-screen p-10 bg-primary-bg bg-cover bg-no-repeat flex justify-center">
      <Form />
      <Map></Map>
      
    </div>
  );
}

export default App;
