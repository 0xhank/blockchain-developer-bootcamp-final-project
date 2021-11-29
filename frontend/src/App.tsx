import React from 'react';
import './App.css';
import { Symfoni } from "./hardhat/SymfoniContext";
import { Stratego } from './components/Stratego';

function App() {

  return (    
  <div className="App">
    <div className = "nav">
      <div className = "center-container">
      <p> Blockchain Stratego</p>
      <p> By Henry Caron</p>
      <p>Connect to Ropsten</p>
    </div>
    </div>
        <Symfoni autoInit={true} >
          <Stratego></Stratego>
        </Symfoni>
    </div>
  );
}

export default App;
