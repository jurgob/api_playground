import React from 'react';
import EventPanel from './components/EventPanel'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          API Playground
        </p>
      </header>
      <EventPanel />
    </div>
  );
}

export default App;
