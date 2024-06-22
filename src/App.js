import React, { Component } from 'react';
import ReactMap from 'react-mapbox-gl';

//import ReactMapboxGl, { Layer, Feature } from '../../../';

// tslint:disable-next-line:no-var-requires
//const data = require('./heatmapData.json');
// tslint:disable-next-line:no-var-requires
//const { token, styles } = require('./config.json');




const accessToken = "pk.eyJ1IjoicnlrciIsImEiOiJjbHhjcWxiaDYwZmhrMnFvYWtlbDRlNzFzIn0.u3zAq2Ye9gGAzmkqijKMyQ";
const style = "mapbox://styles/mapbox/dark-v9";

const Map = ReactMap({
  accessToken
});

const mapStyle = {
  height: '100vh',
  width: '100vw'
};

class App extends Component {
  render() {
    return (
      <Map
        style={style}
        containerStyle={mapStyle}
      />
    );
  }
}

export default App;
