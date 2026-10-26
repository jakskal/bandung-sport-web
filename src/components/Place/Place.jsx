import './Place.css';
import formatPrice from '../../lib/formatPrice';
function Place({ venue }) {
  const priceFormatted = venue.priceFrom ? formatPrice(venue.priceFrom) : 
  formatPrice({priceVisibility: 'unknown'});
  const tierClass = venue.tier ? `tier-${venue.tier.toLowerCase()}` : '';
  return (
    <>
      <h2>{venue.name}</h2>
      <p>{venue.area}</p>
      <p className="place-sports">{venue.sports.join(', ')}</p>
      <p>{priceFormatted}</p>
      <p className={tierClass}>
        Tier: {venue.tier ? venue.tier : 'Belum dicek'}
      </p>
    </>
  );
}

export default Place;
