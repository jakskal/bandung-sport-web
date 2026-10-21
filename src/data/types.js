/**
 * Shapes of the v2 data files (docs/plan-v2.md § 6).
 * JSDoc only — no runtime code. These typedefs mirror the Go structs
 * built in S6, so keep both sides in sync when the model changes.
 *
 * Conventions:
 * - `null` = not verified yet, never a made-up value.
 * - Fields that do not apply may be omitted; treat `undefined` as `null`.
 * - Enums are locked: add a value via PR, not by typing a new string.
 */

/** Canonical lowercase sport keys; Indonesian labels live in `sports.js`. */
/** @typedef {'fitness'|'futsal'|'padel'|'badminton'|'basketball'|'swimming'|'running'|'football'|'yoga'|'pilates'|'zumba'|'muay-thai'|'hiking'} Sport */

/** @typedef {'umum'|'anak'|'remaja'|'lansia'|'prenatal'|'pemula'|'perempuan'} Audience */

/** @typedef {'membership'|'visit-pass'|'personal-training'|'class'|'court-rental'|'program'|'community-session'|'free-access'} OfferingType */

/** @typedef {'monthly'|'weekly'|'per-visit'|'per-hour'|'per-session-pack'|'per-year'|'free'} PriceUnit */

/** @typedef {'walk-in'|'wa'|'daftar-online'} JoinMethod */

/**
 * @typedef {Object} ScheduleSlot
 * @property {('mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun')[]} days
 * @property {string} start HH:MM (24h)
 * @property {string} end HH:MM (24h), must be after start
 */

/**
 * A physical place. It knows nothing about prices.
 * @typedef {Object} Venue
 * @property {string} id Prefixed `v-`, stable in URLs.
 * @property {string} name
 * @property {string} area
 * @property {Sport[]} sports One venue can host several sports.
 * @property {number|null} lat Parsed from a Google Maps `sourceUrl`; null until looked up.
 * @property {number|null} lng Same as `lat`.
 * @property {string|null} whatsapp `+62...` format.
 * @property {string|null} address
 * @property {string|null} instagram
 * @property {string|null} website
 * @property {string|null} sourceUrl Where the data came from (Maps, IG, site).
 * @property {string[]} tags Curation tags; `[]` = checked, none yet.
 * @property {string|null} lastVerified ISO date confirmed from a primary source.
 */

/**
 * Something a person can join or pay for. Offers carry the price, not venues.
 * @typedef {Object} Offering
 * @property {string} id Prefixed `of-`.
 * @property {string|null} venueId Null for roaming offers; at least one of venueId/organizerId must be set.
 * @property {string|null} organizerId Always null in Fase 0 (organizers.json arrives in Fase 3).
 * @property {Sport} sport
 * @property {OfferingType} offeringType
 * @property {string} title
 * @property {Audience[]} audience
 * @property {number|null} ageMin Years; only meaningful when audience includes `anak`/`remaja`.
 * @property {number|null} ageMax
 * @property {'public'|'on-request'|'unknown'} priceVisibility Why a price is missing: published, withheld by the venue, or not checked yet.
 * @property {number|null} priceMin IDR, raw unit; required when priceVisibility is `public`.
 * @property {number|null} priceMax IDR, raw unit; `null` = open-ended, not unknown.
 * @property {PriceUnit|null} priceUnit Unit that priceMin/priceMax refer to.
 * @property {number|null} sessionsPerPack Required for `per-session-pack`.
 * @property {number|null} groupSize People sharing one price (court rental).
 * @property {number|null} durationMin Minutes per session (court rental, class).
 * @property {JoinMethod[]} joinMethod
 * @property {ScheduleSlot[]} schedule `[]` = no fixed schedule (check IG/WA).
 * @property {string|null} locationNote Free text for roaming venues.
 * @property {string|null} lastVerified ISO date; scrape date is not verification.
 */
