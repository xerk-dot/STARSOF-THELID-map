import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { createRoot } from "react-dom/client";
import Button from "./button";
import "./Map.css";
import geoJson from "../geojson/chicago-parks.json";
import geoJsonTrees from "../geojson/trees.geojson";
import 'mapbox-gl/dist/mapbox-gl.css';

import heatmapLayer from "../layer_styles/heatmapLayer.json";
import circleLayer from "../layer_styles/circleLayer.json";
import symbolLayer from "../layer_styles/symbolLayer.json";
import issLayer from "../layer_styles/issLayer.json";

const Marker = ({ onClick, children, feature }) => {
  const _onClick = () => {
    onClick(feature.properties.description);
  };

  return (
    <button onClick={_onClick} className="marker">
      {children}
    </button>
  );
};

const MapboxExample = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  const [data, setData, mapStyle] = useState();
  
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnlrciIsImEiOiJjbHhjcWxiaDYwZmhrMnFvYWtlbDRlNzFzIn0.u3zAq2Ye9gGAzmkqijKMyQ';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/rykr/cly7tbems00tv01qjan5d7zm9',
      center: [-79.999732, 40.4374],
      zoom: 13,
      maxZoom: 18
    });

    mapRef.current.on('load', async () => { //    map.on("load", function () {
      const geojson = await getLocation();

      mapRef.current.addSource('iss', {
        type: 'geojson',
        data: geojson
      });

      mapRef.current.addSource('trees', {
        'type': 'geojson',
        'data': geoJsonTrees
      });

      //trees

      mapRef.current.addLayer(heatmapLayer,'waterway-label');
      mapRef.current.addLayer(circleLayer, 'waterway-label');

      // Add an image to use as a custom marker
      mapRef.current.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          mapRef.current.addImage("custom-marker", image);
          // Add a GeoJSON source with multiple points
          mapRef.current.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: geoJson.features,
            },
          });
          // Add a symbol layer
          mapRef.current.addLayer(symbolLayer);
        }
      );
    
      mapRef.current.on('click', 'trees-point', (event) => {
        new mapboxgl.Popup()
          .setLngLat(event.features[0].geometry.coordinates)
          .setHTML(`<strong>DBH:</strong> ${event.features[0].properties.dbh}`)
          .addTo(mapRef.current);
      });

      // Render custom marker components
    geoJson.features.forEach((feature) => {
      // Create a React ref
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement('div');
      // Render a Marker Component on our new DOM node
      createRoot(ref.current).render(
        <Marker onClick={markerClicked} feature={feature} />
      );

      // Create a Mapbox Marker at our new DOM node
      new mapboxgl.Marker(ref.current)
        .setLngLat(feature.geometry.coordinates)
        .addTo(mapRef.current);
    });

      //iss

      mapRef.current.addLayer(issLayer);

      const updateSource = setInterval(async () => {await getLocation(updateSource);}, 5000);

      async function getLocation(updateSource) {
        try {
          const response = await fetch(
            'https://api.wheretheiss.at/v1/satellites/25544',
            { method: 'GET' }
          );
          const { latitude, longitude } = await response.json();

          setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                }
              }
            ]
          });
        } catch (err) {
          if (updateSource) clearInterval(updateSource);
          throw new Error(err);
        }
      }
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const markerClicked = (title) => {
    window.alert(title);
  };

  useEffect(() => {
    if (!data) return;

    mapRef.current.getSource('iss').setData(data);

    //upon the creation of a new feature, fly to that feature.
    
/*      
    mapRef.current.flyTo({
      center: data.features[0].geometry.coordinates,
      speed: 0.5,
      zoom: 11
    }); 

 */
  }, [data]);

  

  return <div ref={mapContainerRef} id="map" style={{ height: '100%' }}><Button asdf></Button></div>;
};

export default MapboxExample;