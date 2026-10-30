import formatPrice from '../../lib/formatPrice';
import './PriceTag.css';
function PriceTag({
  priceMin,
  priceMax,
  priceUnit,
  priceVisibility,
  sessionsPerPack,
}) {
  const priceFormatted =
    priceMin != null
      ? formatPrice({
          priceMin,
          priceMax,
          priceUnit,
          priceVisibility: priceVisibility,
          sessionsPerPack,
        })
      : formatPrice({ priceVisibility: 'unknown' });
  return (
    <div>
      <p className="price-tag">{priceFormatted}</p>
    </div>
  );
}

export default PriceTag;
