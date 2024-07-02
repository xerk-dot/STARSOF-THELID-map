//https://docs.mapbox.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/

import React from 'react';
import ReactMapGL, { Layer, Feature, GeoJSONLayer, Source} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const accessToken = "pk.eyJ1IjoicnlrciIsImEiOiJjbHhjcWxiaDYwZmhrMnFvYWtlbDRlNzFzIn0.u3zAq2Ye9gGAzmkqijKMyQ";
const style = "mapbox://styles/mapbox/dark-v9";

const Map = ReactMapGL({accessToken,});
const mapStyle = {height: '100vh', width: '100vw',};

const GEOJSON_SOURCE_OPTIONS = {
  "type": "geojson",
  "data": "./geodata_imported/trees.geojson"
};

//const geojson = require('./geodata_imported/stations.geojson'); // Assuming geojson is a valid object
const geojson = require('./geodata_imported/trees.geojson'); // Assuming geojson is a valid object


//CENTERS

//DC
//const center = [-77.01239, 38.91275];

//Pittsburgh
const center = [-79.999732, 40.4374];

// ------------------------------


const heatPaint = {
'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(236,222,239,0)',
    0.2,
    'rgb(208,209,230)',
    0.4,
    'rgb(166,189,219)',
    0.6,
    'rgb(103,169,207)',
    0.8,
    'rgb(28,144,153)'
  ],
}

const goonerPaint = {
  // increase weight as diameter breast height increases
  'heatmap-weight': {
    property: 'dbh',
    type: 'exponential',
    stops: [
      [1, 0],
      [62, 1]
    ]
  },
  // increase intensity as zoom level increases
  'heatmap-intensity': {
    stops: [
      [11, 1],
      [15, 3]
    ]
  },
  // assign color values be applied to points depending on their density
  'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(236,222,239,0)',
    0.2,
    'rgb(208,209,230)',
    0.4,
    'rgb(166,189,219)',
    0.6,
    'rgb(103,169,207)',
    0.8,
    'rgb(28,144,153)'
  ],
  // increase radius as zoom increases
  'heatmap-radius': {
    stops: [
      [11, 15],
      [15, 20]
    ]
  },
  // decrease opacity to transition into the circle layer
  'heatmap-opacity': {
    default: 1,
    stops: [
      [14, 1],
      [15, 0]
    ]
  }
}

const circlePaint = {
'circle-radius': {
  property: 'dbh',
  type: 'exponential',
  stops: [
    [{ zoom: 15, value: 1 }, 5],
    [{ zoom: 15, value: 62 }, 10],
    [{ zoom: 22, value: 1 }, 20],
    [{ zoom: 22, value: 62 }, 50]
  ]
},
'circle-color': {
  property: 'dbh',
  type: 'exponential',
  stops: [
    [0, 'rgba(236,222,239,0)'],
    [10, 'rgb(236,222,239)'],
    [20, 'rgb(208,209,230)'],
    [30, 'rgb(166,189,219)'],
    [40, 'rgb(103,169,207)'],
    [50, 'rgb(28,144,153)'],
    [60, 'rgb(1,108,89)']
  ]
},
'circle-stroke-color': 'white',
'circle-stroke-width': 1,
'circle-opacity': {
  stops: [
    [14, 0],
    [15, 1]
  ]
}
};



const App = () => {
  return (
    <div>
      <Map style={style} containerStyle={mapStyle} center={center}>
        
        <Source id="source_id" geoJsonSource={GEOJSON_SOURCE_OPTIONS} />
        <Layer
          type="heatmap"
          paint={heatPaint}
          sourceId="source_id"
          id="heatmap"
        />


        
{/*         <GeoJSONLayer
          data={geojson}
          type="circle"
          circlePaint={circlePaint}
        />  */}


      </Map>


      <div className="sidebar">
        asdfaksdjhfas dasdfoiuasdf asdfhsdofih
      </div>
    
  </div>
  );
};

export default App;

/*    
    <Map style={style} containerStyle={mapStyle} center={center}>
      <Source id="source_id" geoJsonSource={GEOJSON_SOURCE_OPTIONS} />
      <Layer type="heatmap" id="layer_id" sourceId="source_id" paint={layerPaint}/>
      <Layer type="circle" id="layer_id2" sourceId="source_id" paint={layerPaint2} />
    </Map>
*/


/* 

const symbolLayout = {
  'text-field': '{description}', // Use template literal for string interpolation
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 0.6],
  'text-anchor': 'top',
};

const symbolPaint = {
  'text-color': 'lightgreen',
};

const lineLayout = {
  'circle-color': 'white',
}; 
const circleLayout = {
  visibility: 'visible',
};

const circlePaint = {
  'circle-color': 'green',
};

*/
/*
    
    // The DC metro stops layer
    <GeoJSONLayer
        data={geojson}
        circleLayout={circleLayout}
        circlePaint={circlePaint}
        circleOnClick={onClickCircle} // Optional circle click handler
        symbolLayout={symbolLayout}
        symbolPaint={symbolPaint}
        lineLayout={lineLayout}
      /> 
      
*/