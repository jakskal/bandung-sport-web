import './Place.css';
import PriceTag from '../PriceTag/PriceTag';
function Place({ venue }) {
  const tierClass = venue.tier ? `tier-${venue.tier.toLowerCase()}` : '';
  return (
    <>
      <h2>{venue.name}</h2>
      <p>{venue.area}</p>
      <p className="place-sports">{venue.sports.join(', ')}</p>
      <PriceTag {...venue.priceFrom} />
      <p className={tierClass}>
        Tier: {venue.tier ? venue.tier : 'Belum dicek'}
      </p>
    </>
  );
}

export default Place;
