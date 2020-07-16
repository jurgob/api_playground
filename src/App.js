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
      <div className="App-content">
        <p className="App-intro" >
          This is a playground where you can run api request in sequence. <br />
          in every request you can specify an <i>id</i> <br />
          the request is specified in the <i>req</i> property, it use the <a href="https://github.com/axios/axios#request-config">axios format</a> <br/>
          you can futfill your request using previous request responses using  {"{{}}"}. every response is stored in <i>responses.REQ_ID</i>.  <br />
        </p>
        <EventPanel />
      </div>
    </div>
  );
}

export default App;
