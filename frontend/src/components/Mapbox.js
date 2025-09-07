import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Mapbox({ origin, destination, position }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: position || origin,
        zoom: 10
      });

      // Add route line
      if (origin && destination) {
        map.current.on('load', () => {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [origin, destination]
              }
            }
          });
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#3b82f6',
              'line-width': 3
            }
          });
        });
      }
    }

    // Update marker position
    if (position) {
      if (!marker.current) {
        marker.current = new mapboxgl.Marker({ color: '#FF5733' })
          .setLngLat(position)
          .addTo(map.current);
      } else {
        marker.current.setLngLat(position);
      }
      map.current.flyTo({ center: position, speed: 0.5 });
    }
  }, [origin, destination, position]);

  return <div ref={mapContainer} className="map" />;
}
