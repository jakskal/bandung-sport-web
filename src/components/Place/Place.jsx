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
      <p className="place-card-meta">
        {venue.sports.join(', ')} · {venue.area}
      </p>
    </article>
  );
}

export default Place;
