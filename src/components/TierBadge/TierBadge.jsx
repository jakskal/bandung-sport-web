export default function TierBadge({ tier }) {
  const tierClass = tier ? `tier-${tier.toLowerCase()}` : '';
  return (
    <span className={`tier-badge ${tierClass}`}>
      {tier ? `${tier}` : 'Belum dicek'}
    </span>
  );
}
