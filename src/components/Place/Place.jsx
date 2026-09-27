import './Place.css';
function Place({ place }) {
  return (
    <li className="place-card">
      <h2>{place.name}</h2>
      <p>{place.area}</p>
      <p>{place.category}</p>
      {place.priceMin === place.priceMax ? (
        <p>Harga: Rp {place.priceMin.toLocaleString('id-ID')}</p>
      ) : (
        <p>
          Harga: Rp {place.priceMin.toLocaleString('id-ID')} - Rp{' '}
          {place.priceMax.toLocaleString('id-ID')}
        </p>
      )}
      <p className={`tier-${place.tier.toLowerCase()}`}>Tier: {place.tier}</p>
    </li>
  );
}

export default Place;
