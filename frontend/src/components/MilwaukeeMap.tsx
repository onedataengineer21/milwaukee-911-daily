import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface HeatmapData {
  lat: number;
  lon: number;
  value: number;
  status?: string;
  callNumber?: string;
  natureOfCall?: string;
}

interface MilwaukeeMapProps {
  heatmapData: HeatmapData[];
}

export function MilwaukeeMap({ heatmapData }: MilwaukeeMapProps) {
  // Milwaukee center coordinates
  const center: [number, number] = [43.0389, -87.9065];

  return (
    <div style={{ height: '635px', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {heatmapData.map((point, index) => {
          // Active calls (Dispatched or Enroute) are shown in red
          const isActive = point.status === 'Dispatched' || point.status === 'Enroute';
          const color = isActive ? '#DC2626' : '#9CA3AF'; // Red for active, gray for completed
          const radius = isActive ? 8 : 5;

          return (
            <CircleMarker
              key={index}
              center={[point.lat, point.lon]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                color: '#ffffff',
                weight: 1,
                opacity: 0.9,
                fillOpacity: isActive ? 0.8 : 0.4,
              }}
            >
              <Popup>
                <div style={{ color: '#002147' }}>
                  <strong>{isActive ? '🔴 ACTIVE CALL' : '✓ Completed Call'}</strong><br />
                  {point.callNumber && <><strong>Call:</strong> {point.callNumber}<br /></>}
                  {point.natureOfCall && <><strong>Type:</strong> {point.natureOfCall}<br /></>}
                  <strong>Status:</strong> {point.status}<br />
                  <strong>Location:</strong> {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
