import React from "react";
import Map from "./components/Map";

const App = () => {
  return (
    <div style={{alignContent: 'center'}}>
        <a href="/" style={{textDecoration: 'none', color: 'black'}}>
            <h1 style={{fontFamily: 'monospace'}}>Oslo bysykkel - available bikes and parking</h1>
        </a>
        <Map/>
    </div>
  );
};

export default App;
