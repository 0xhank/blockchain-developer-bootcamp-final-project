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
    </div>
    </div>
      <div className = "body">
        <Symfoni autoInit={true} >
          <Stratego></Stratego>
        </Symfoni>
      </div>
    </div>
  );
}

export default App;
