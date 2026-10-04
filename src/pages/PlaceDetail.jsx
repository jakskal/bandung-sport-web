import { useParams, Link } from 'react-router';
import places from '../data/places';

function PlaceDetail() {
  const { id } = useParams();
  const place = places.find((p) => p.id === parseInt(id));

  if (!place) {
    return <div>Place not found</div>;
  }

  return (
    <div className="container">
      <Link to="/">Kembali</Link>
      <h1>{place.name}</h1>
      <p>
        {place.category} - {place.area}
      </p>

      {place.priceMin == null ? (
        <p>Harga: N/A</p>
      ) : place.priceMax == null || place.priceMin === place.priceMax ? (
        <p>
          Harga: Rp {place.priceMin.toLocaleString('id-ID')}{' '}
          {place.priceUnit ? `/ ${place.priceUnit}` : '  '}
        </p>
      ) : (
        <p>
          Harga: Rp {place.priceMin.toLocaleString('id-ID')} - Rp{' '}
          {place.priceMax.toLocaleString('id-ID')}{' '}
          {place.priceUnit ? `/ ${place.priceUnit}` : '  '}
        </p>
      )}

      <p className={`tier-${place.tier ? place.tier.toLowerCase() : ''}`}>
        Tier: {place.tier ? place.tier : 'N/A'}
      </p>
      <p>Whatsapp: {place.whatsapp ?? 'N/A'}</p>
      <p>
        Instagram:{' '}
        {place.instagram ? (
          <a href={place.instagram} target="_blank" rel="noopener noreferrer">
            {place.instagram}
          </a>
        ) : (
          'N/A'
        )}
      </p>
      {place.website && (
        <p>
          Website:{' '}
          <a href={place.website} target="_blank" rel="noopener noreferrer">
            {place.website}
          </a>
        </p>
      )}
    </div>
  );
}

export default PlaceDetail;
