import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import geoJson from "./chicago-parks.json";
import geoJsonTrees from "./trees.geojson";

mapboxgl.accessToken =
  "pk.eyJ1IjoicnlrciIsImEiOiJjbHhjcWxiaDYwZmhrMnFvYWtlbDRlNzFzIn0.u3zAq2Ye9gGAzmkqijKMyQ";

const Map = () => {
  const mapContainerRef = useRef(null);

  // Initialize map when component mounts
  useEffect(() => {
    

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-79.999732, 40.4374],
      zoom: 11
    });

    map.on("load", function () {

      map.addSource('trees', {
        'type': 'geojson',
        'data': geoJsonTrees
      });

      map.addLayer(
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

      map.addLayer(
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
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with multiple points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: geoJson.features,
            },
          });
          // Add a symbol layer
          map.addLayer({
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
    });

    map.on('click', 'trees-point', (event) => {
      new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>DBH:</strong> ${event.features[0].properties.dbh}`)
        .addTo(map);
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
