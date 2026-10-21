import './Place.css';
import formatPrice from '../../lib/formatPrice';
function Place({ place }) {
  // temporary until v2 (s5)
  const priceVisibility = place.priceMin == null ? 'unknown' : 'public';
  const priceFormatted = formatPrice({
    priceMin: place?.priceMin,
    priceMax: place?.priceMax,
    priceUnit: place?.priceUnit,
    priceVisibility: priceVisibility,
  });
  return (
    <>
      <h2>{place.name}</h2>
      <p>{place.area}</p>
      <p>{place.category}</p>
      <p>{priceFormatted}</p>
      <p className={`tier-${place.tier ? place.tier.toLowerCase() : ''}`}>
        Tier: {place.tier ? place.tier : 'N/A'}
      </p>
    </>
  );
}

export default Place;
