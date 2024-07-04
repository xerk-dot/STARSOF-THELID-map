import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

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

    mapRef.current.on('load', async () => {
      const geojson = await getLocation();

      mapRef.current.addSource('iss', {
        type: 'geojson',
        data: geojson
      });

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