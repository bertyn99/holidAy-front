import React, { useState } from 'react';
import Form from './components/Form';
import Map from './components/Map';
import './App.css';  // Ensure the path is correct according to your folder structure
import Navbar from './components/Navbar';

function App() {
  const [callMap, setCallMap] = useState(false);

  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <div className="flex-grow w-screen pb-10 px-10 bg-primary-bg bg-cover bg-no-repeat flex justify-center overflow-hidden">
        <Form changeCallMap={setCallMap} />
        <Map callMap={callMap} />
      </div>
    </div>
  );
}

export default App;
