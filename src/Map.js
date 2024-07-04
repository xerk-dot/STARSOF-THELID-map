import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { createRoot } from "react-dom/client";

import "./Map.css";
import geoJson from "./chicago-parks.json";
import geoJsonTrees from "./trees.geojson";
import 'mapbox-gl/dist/mapbox-gl.css';

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

  const [data, setData] = useState();

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnlrciIsImEiOiJjbHhjcWxiaDYwZmhrMnFvYWtlbDRlNzFzIn0.u3zAq2Ye9gGAzmkqijKMyQ';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-79.999732, 40.4374],
      zoom: 11
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

      mapRef.current.addLayer(
        {
          'id': 'trees-heat',
          'type': 'heatmap',
          'source': 'trees',
          'maxzoom': 15,
          'paint': {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
              'property': 'dbh',
              'type': 'exponential',
              'stops': [
                [1, 0],
                [62, 1]
              ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
              'stops': [
                [11, 1],
                [15, 3]
              ]
            },
            // use sequential color palette to use exponentially as the weight increases
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(33,102,172,0)',
                0.2,
                'rgb(103,169,207)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(239,138,98)',
                1,
                'rgb(178,24,43)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
              'stops': [
                [11, 15],
                [15, 20]
              ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
              'default': 1,
              'stops': [
                [14, 1],
                [15, 0]
              ]
            }
          }
        },
        'waterway-label'
      );

      mapRef.current.addLayer(
        {
          'id': 'trees-point',
          'type': 'circle',
          'source': 'trees',
          'minzoom': 14,
          'paint': {
            // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
              'property': 'dbh',
              'type': 'exponential',
              'stops': [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50]
              ]
            },
            'circle-color': {
              'property': 'dbh',
              'type': 'exponential',
              'stops': [
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
              'stops': [
                [14, 0],
                [15, 1]
              ]
            }
          }
        },
        'waterway-label'
      );

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
          mapRef.current.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
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

      mapRef.current.addLayer({
        id: 'iss',
        type: 'symbol',
        source: 'iss',
        layout: {
          'icon-image': 'rocket'
        }
      });

      const updateSource = setInterval(async () => {
        await getLocation(updateSource);
      }, 5000);

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

  return <div ref={mapContainerRef} id="map" style={{ height: '100%' }} />;
};

export default MapboxExample;