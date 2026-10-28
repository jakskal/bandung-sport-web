import PriceTag from "../PriceTag/PriceTag";

function OfferingRow({ offering }) {
    const lastVerified = offering.lastVerified ? new Date(offering.lastVerified).toLocaleDateString('id-ID',{
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : null;
    return (
        <div className="offering-row">
            <h4>{offering.title}</h4>
            <PriceTag
                priceMin={offering.priceMin}
                priceMax={offering.priceMax}
                priceUnit={offering.priceUnit}
                priceVisibility={offering.priceVisibility}
                />
                { lastVerified &&  (<p>Harga di cek: {lastVerified}</p>) }
        </div>
    )
}

export default OfferingRow;