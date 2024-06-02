import React from 'react';
import Form from './components/Form';
import Map from './components/Map';
import './App.css';  // Assurez-vous que le chemin est correct selon la structure de vos dossiers
import Navbar from './components/Navbar';
import TravelDocument from './pages/TravelDocument';
import { PDFViewer } from '@react-pdf/renderer';

function App() {
  return (     
   <div className='h-screen flex flex-col'>

      <Navbar/>   

      <div className="flex-grow w-screen pb-10 px-10 bg-primary-bg bg-cover bg-no-repeat flex justify-center">
      <Form />
      <Map></Map>
      
    </div>
    </div> 
   /*  <PDFViewer width="100%" height="1000">
       <TravelDocument />
     
      </PDFViewer> */
    );
}

export default App;
