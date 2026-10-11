import { useParams, Link } from 'react-router';
import places from '../data/places';
import '../styles/place-detail.css';

function PlaceDetail() {
  const { id } = useParams();
  const place = places.find((p) => p.id === parseInt(id));

  if (!place) {
    return (
      <div>
        <h2>Tempat tidak ditemukan</h2>
        <Link to="/">Kembali</Link>
      </div>
    );
  }

  const hasContacts = place.whatsapp || place.instagram || place.website;
  return (
    <div className="container">
      <Link to="/">Kembali</Link>
      <h1>{place.name}</h1>
      <p>
        {place.category} - {place.area}
      </p>

      {place.priceMin == null ? (
        <p>Hubungi untuk harga</p>
      ) : place.priceMax == null || place.priceMin === place.priceMax ? (
        <p className="place-detail-price">
          Harga: Rp {place.priceMin.toLocaleString('id-ID')}{' '}
          {place.priceUnit ? `/ ${place.priceUnit}` : '  '}
        </p>
      ) : (
        <p className="place-detail-price">
          Harga: Rp {place.priceMin.toLocaleString('id-ID')} - Rp{' '}
          {place.priceMax.toLocaleString('id-ID')}{' '}
          {place.priceUnit ? `/ ${place.priceUnit}` : '  '}
        </p>
      )}

      <p
        className={`tier-${place.tier ? place.tier.toLowerCase() : ''} place-detail-tier`}
      >
        Tier: {place.tier ? place.tier : 'N/A'}
      </p>
      {hasContacts && (
        <div className="place-detail-contacts">
          <h3>Kontak</h3>
          {place.whatsapp && (
            <p>
              <a
                href={`https://wa.me/${place.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Whatsapp
              </a>
            </p>
          )}
          {place.instagram && (
            <p>
              <a
                href={place.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </p>
          )}
          {place.website && (
            <p>
              <a href={place.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PlaceDetail;
