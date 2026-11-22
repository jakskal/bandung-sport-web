import './Place.css';
import PriceTag from '../PriceTag/PriceTag';
import TierBadge from '../TierBadge/TierBadge';
function Place({ venue }) {
  return (
    <article className="place-card">
      <header className="place-card-header">
        <h2>{venue.name}</h2>
        <TierBadge tier={venue.tier} />
      </header>
      {venue.priceFrom ? (
        <PriceTag {...venue.priceFrom} />
      ) : (
        <span>Harga belum dicek</span>
      )}
      <footer className="place-card-footer">
        <p className="place-card-meta">
          {venue.sports.join(', ')} · {venue.area}
        </p>
        {/* The whole card is one link, so this is a label, not a second link. */}
        <span className="place-card-cta">
          {venue.hasWhatsApp ? 'Tanya via WA' : 'Lihat kontak'}
          <span className="place-card-arrow" aria-hidden="true">
            →
          </span>
        </span>
      </footer>
    </article>
  );
}

export default Place;
