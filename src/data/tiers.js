/**
 * Tier thresholds per sport (docs/plan-v2.md § 6).
 *
 * Thresholds compare the raw price in each sport's natural unit, never a
 * monthly-normalised cost. A sport without a rule has no tier (null) until
 * a rule is added via PR.
 *
 * Current scope: the table only. The bucket function lands with the data
 * layer (tier = bucket of the cheapest `public` + `umum` offering whose
 * priceUnit matches the rule's unit; price 0 or `free` → Gratis).
 */

/**
 * @typedef {Object} TierRule
 * @property {import('./types.js').PriceUnit} unit Unit this sport's prices use.
 * @property {number} murah Price < this → Murah.
 * @property {number} sedang Price < this → Sedang; above → Mahal.
 */

/**
 * Initial guesses — tune them in the weekly ritual once the real price
 * distribution is visible.
 * @type {Partial<Record<import('./types.js').Sport, TierRule>>}
 */
export const TIER_RULES = {
  fitness: { unit: 'monthly', murah: 200000, sedang: 600000 },
  swimming: { unit: 'per-visit', murah: 25000, sedang: 60000 },
  futsal: { unit: 'per-hour', murah: 120000, sedang: 250000 },
  padel: { unit: 'per-hour', murah: 250000, sedang: 450000 },
  running: { unit: 'per-visit', murah: 10000, sedang: 30000 },
};
