import React from 'react';
import './App.css';
import Map from './Map.jsx'


function App() {

  return (
    <>
    <div href = "nav" id = "container">
    <div id="title">Educational Attainment in the United States</div>
        <div id="description">
          Percentage of adults age 25 and older with a bachelor's degree or higher
          (2010-2014)
        </div>
    </div>
    
    <Map />
        
      
    </>

  );
  
}

export default App;
