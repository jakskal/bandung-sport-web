import formatPrice from '../../lib/formatPrice';
import './PriceTag.css';
function PriceTag({
  priceMin,
  priceMax,
  priceUnit,
  priceVisibility,
  sessionsPerPack,
}) {
  // Visibility is passed through even when priceMin is null: an "on-request"
  // offering has a known answer ("Harga via WA"), not an unchecked one.
  const priceFormatted = formatPrice({
    priceMin,
    priceMax,
    priceUnit,
    priceVisibility,
    sessionsPerPack,
  });
  return (
    <div>
      <p className="price-tag">{priceFormatted}</p>
    </div>
  );
}

export default PriceTag;
