import React, { useEffect, useState } from 'react';
import Mapbox from '../components/Mapbox';
import { useParams } from 'react-router-dom';
import { getShipment } from '../services/api';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_WS_URL);

export default function Track() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    // Fetch shipment data
    getShipment(id).then(data => setShipment(data));

    // WebSocket for real-time updates
    socket.on('movement', (data) => {
      if (data.tracking === id) {
        setPosition([data.lng, data.lat]);
      }
    });

    return () => socket.off('movement');
  }, [id]);

  return (
    <div className="track-page">
      <h1>Tracking: {shipment?.tracking}</h1>
      <div className="map-container">
        <Mapbox 
          origin={[shipment?.origin_lng, shipment?.origin_lat]}
          destination={[shipment?.dest_lng, shipment?.dest_lat]}
          position={position}
        />
      </div>
      <div className="checkpoints">
        {shipment?.checkpoints.map((cp, i) => (
          <div key={i} className="checkpoint">
            <span>{cp.label}</span>
            <small>{new Date(cp.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
