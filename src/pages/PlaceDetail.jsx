import { useEffect , useCallback} from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import useFetch from '../hooks/useFetch';
import { fetchVenue } from '../api/client';
import formatPrice from '../lib/formatPrice';
import '../styles/place-detail.css';

function PlaceDetail() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const fetcher = useCallback((signal) => fetchVenue(venueId, signal), [venueId]);
  const { data: venue, error, loading, retry } = useFetch(fetcher);


  useEffect(() => {
      document.title = venue ?  `${venue.name} — Bandung Sport`: 'Bandung Sport — Direktori olahraga Bandung';
  }, [venue]);

  if (loading) {
    return <div className="container">Memuat...</div>;
  }

  if (error?.status === 404){
    return (
      <div className="container">
        <h2>Tempat tidak ditemukan</h2>
        <Link className="place-detail-back-button" to="/">
          Kembali
        </Link>
      </div>
    )
  }
  if (error) {
    return (
      <div className="container fetch-error">
        <p>Gagal memuat tempat.</p>
        <p className="fetch-error-details">{error.message}</p>
        <button className="reset-button" onClick={retry}>
          Coba lagi
        </button>
      </div>
    );
  }

  if (!venue) return null;

    // temporary until v2 (s5)
  const priceFormatted = venue.priceFrom ? formatPrice(venue.priceFrom) : formatPrice({priceVisibility: 'unknown'});
  const tierClass=venue.tier ? `tier-${venue.tier.toLowerCase()}` : '';
  
  const hasContacts = venue.whatsapp || venue.instagram || venue.website;
  return (
    <div className="container">
      <button className="place-detail-back-button" onClick={() => navigate(-1)}>
        Kembali
      </button>
      <h1>{venue.name}</h1>
      <p className="place-sports">
        {venue.sports.join(', ')} — {venue.area}
      </p>

      <p className="place-detail-price">
        {priceFormatted}
      </p>

      <p
        className={`place-detail-tier ${tierClass}`}
      >
        Tier: {venue.tier ??'Belum dicek'}
      </p>
      {venue.address && <p>{venue.address}</p>}
      {hasContacts && (
        <div className="place-detail-contacts">
          <h3>Kontak</h3>
          {venue.whatsapp && (
            <p>
              <a
                href={`https://wa.me/${venue.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Whatsapp
              </a>
            </p>
          )}
          {venue.instagram && (
            <p>
              <a
                href={venue.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </p>
          )}
          {venue.website && (
            <p>
              <a href={venue.website} target="_blank" rel="noopener noreferrer">
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
