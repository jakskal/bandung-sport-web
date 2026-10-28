import formatPrice from '../../lib/formatPrice';
import './PriceTag.css';
function PriceTag({ priceMin, priceMax, priceUnit, priceVisibility }) {
  const priceFormatted =
    priceMin != null
      ? formatPrice({
          priceMin,
          priceMax,
          priceUnit,
          priceVisibility: priceVisibility,
        })
      : formatPrice({ priceVisibility: 'unknown' });
  return (
    <div>
      <p className="price-tag">{priceFormatted}</p>
    </div>
  );
}

export default PriceTag;
