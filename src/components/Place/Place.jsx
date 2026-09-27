import './Place.css';
function Place({ place }) {
  return (
    <li className="place-card">
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
      <p>Whatsapp : {place.whatsapp ? place.whatsapp : 'N/A'}</p>
      <p>
        Instagram :{' '}
        {place.instagram ? (
          <a href={place.instagram} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ) : (
          'N/A'
        )}
      </p>
      <p className={`tier-${place.tier ? place.tier.toLowerCase() : ''}`}>
        Tier: {place.tier ? place.tier : 'N/A'}
      </p>
    </li>
  );
}

export default Place;
