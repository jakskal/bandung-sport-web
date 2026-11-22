import { useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import useFetch from '../hooks/useFetch';
import { fetchVenue } from '../api/client';
import '../styles/place-detail.css';
import OfferingRow from '../components/Offering/OfferingRow';

function PlaceDetail() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const fetcher = useCallback(
    (signal) => fetchVenue(venueId, signal),
    [venueId],
  );
  const { data: venue, error, loading, retry } = useFetch(fetcher);

  useEffect(() => {
    document.title = venue
      ? `${venue.name} — Bandung Sport`
      : 'Bandung Sport — Direktori olahraga Bandung';
  }, [venue]);

  if (loading) {
    return <div className="container">Memuat...</div>;
  }

  if (error?.status === 404) {
    return (
      <div className="container">
        <h2>Tempat tidak ditemukan</h2>
        <Link className="place-detail-back" to="/">
          ← Kembali
        </Link>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container fetch-error">
        <p>Gagal memuat tempat.</p>
        <p className="fetch-error-detail">{error.message}</p>
        <button className="reset-button" onClick={retry}>
          Coba lagi
        </button>
      </div>
    );
  }

  if (!venue) return null;

  const tierClass = venue.tier ? `tier-${venue.tier.toLowerCase()}` : '';
  const waLink = venue.whatsapp
    ? `https://wa.me/${venue.whatsapp.replace(/\D/g, '')}`
    : null;
  const hasContacts = venue.whatsapp || venue.instagram || venue.website;

  // One primary action, built from whatever contact the venue actually has.
  // Before this the per-offering WA button rendered even without a number,
  // linking to wa.me/undefined.
  const primaryContact = waLink
    ? { href: waLink, label: 'Tanya via WhatsApp' }
    : venue.instagram
      ? { href: venue.instagram, label: 'Lihat Instagram' }
      : venue.website
        ? { href: venue.website, label: 'Buka website' }
        : null;

  const offerings = venue.offerings ?? [];

  return (
    <div className="container place-detail">
      <button
        className="place-detail-back"
        onClick={() => navigate(-1)}
        type="button"
      >
        ← Kembali
      </button>

      <header className="place-detail-header">
        <div className="place-detail-title-row">
          <h1 className="place-detail-name">{venue.name}</h1>
          {venue.tier && (
            <span className={`tier-badge ${tierClass}`}>{venue.tier}</span>
          )}
        </div>
        <p className="place-detail-meta">
          {venue.sports.join(' · ')} — {venue.area}
        </p>
      </header>

      {primaryContact && (
        <a
          className="place-detail-cta"
          href={primaryContact.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {primaryContact.label}
        </a>
      )}

      <section className="place-detail-section">
        <h2 className="place-detail-section-title">Penawaran</h2>
        {offerings.length > 0 ? (
          <ul className="offering-list">
            {offerings.map((offering) => (
              <li key={offering.id} className="offering-card">
                <OfferingRow offering={offering} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-offerings">Belum ada paket terverifikasi.</p>
        )}
      </section>

      {venue.address && (
        <section className="place-detail-section">
          <h2 className="place-detail-section-title">Alamat</h2>
          <p className="place-detail-address">{venue.address}</p>
        </section>
      )}

      {hasContacts && (
        <section className="place-detail-section">
          <h2 className="place-detail-section-title">Kontak</h2>
          <ul className="contact-list">
            {venue.whatsapp && (
              <li>
                <a
                  className="contact-row"
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-label">WhatsApp</span>
                  <span className="contact-value">{venue.whatsapp}</span>
                  <span className="contact-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            )}
            {venue.instagram && (
              <li>
                <a
                  className="contact-row"
                  href={venue.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-label">Instagram</span>
                  <span className="contact-value">Buka profil</span>
                  <span className="contact-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            )}
            {venue.website && (
              <li>
                <a
                  className="contact-row"
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-label">Website</span>
                  <span className="contact-value">Buka situs</span>
                  <span className="contact-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}

export default PlaceDetail;
