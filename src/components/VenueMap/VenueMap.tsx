import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { Link } from 'react-router';
import type { VenueSummary } from '../../types/venue';

L.Icon.Default.imagePath = '';
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

type VenueMapProps = {
  venues: VenueSummary[];
};

function VenueMap({ venues }: VenueMapProps) {
  return (
    <MapContainer
      center={[-6.914744, 107.60981]}
      zoom={13}
      style={{ height: '400px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {venues
        .filter((venue) => venue.lat !== null && venue.lng !== null)
        .map((venue) => (
          <Marker key={venue.id} position={[venue.lat!, venue.lng!]}>
            <Popup>
              <Link to={`/tempat/${venue.id}`}>Lihat detail</Link>
              <br />
              <strong>{venue.name}</strong>
              <br />
              {venue.sports.join(', ')}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}

export default VenueMap;
