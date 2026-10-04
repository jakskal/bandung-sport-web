import './Place.css';
function Place({ place }) {
  return (
    <>
      <h2>{place.name}</h2>
      <p>{place.area}</p>
      <p>{place.category}</p>
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
    </>
  );
}

export default Place;
