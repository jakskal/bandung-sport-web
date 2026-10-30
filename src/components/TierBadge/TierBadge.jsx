// A null tier means "no band for this unit", not "price unknown" -- the price
// slot already says "Harga belum dicek" when there is no price. Rendering
// nothing keeps the card honest instead of contradicting the price above it.
export default function TierBadge({ tier }) {
  if (!tier) {
    return null;
  }

  return <span className={`tier-badge tier-${tier.toLowerCase()}`}>{tier}</span>;
}
