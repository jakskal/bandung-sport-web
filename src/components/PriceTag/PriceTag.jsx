import formatPrice from '../../lib/formatPrice';
function PriceTag({priceMin, priceMax, priceUnit, priceVisibility}) {
    const priceFormatted = priceMin != null
        ? formatPrice({priceMin, priceMax, priceUnit, priceVisibility: priceVisibility})
        : formatPrice({ priceVisibility: 'unknown' });
    return (
        <div>
            <p className="place-tag">{priceFormatted}</p>
        </div>
    )
} 

export default PriceTag;