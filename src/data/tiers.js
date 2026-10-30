/**
 * Tier thresholds per sport (docs/plan-v2.md § 6).
 *
 * Thresholds compare the raw price in each sport's natural unit, never a
 * monthly-normalised cost. Bands are keyed by `(sport, priceUnit)`: a unit
 * without a band has no tier (null) instead of a guessed bucket — e.g. a
 * per-session-pack price cannot be compared with a per-hour court rate while
 * session length is unknown.
 *
 * Mirror only: since S9 the bucket is computed in the Go backend
 * (`be/internal/catalog/tier.go`), which is the source of truth for
 * `/api/venues`. Keep this table in sync when the Go rules change.
 */

/**
 * @typedef {Object} TierBand
 * @property {number} murah Price < this → Murah.
 * @property {number} sedang Price < this → Sedang; above → Mahal.
 */

/**
 * Initial guesses — tune them in the weekly ritual once the real price
 * distribution is visible.
 * @type {Partial<Record<import('./types.js').Sport, Partial<Record<import('./types.js').PriceUnit, TierBand>>>>}
 */
export const TIER_RULES = {
  fitness: {
    monthly: { murah: 200000, sedang: 600000 },
    'per-visit': { murah: 35000, sedang: 75000 },
  },
  swimming: { 'per-visit': { murah: 25000, sedang: 60000 } },
  futsal: { 'per-hour': { murah: 120000, sedang: 250000 } },
  padel: { 'per-hour': { murah: 250000, sedang: 450000 } },
  running: { 'per-visit': { murah: 10000, sedang: 30000 } },
};
