/**
 * Validates the v2 data files against docs/plan-v2.md § 6.
 * Runs before `vite build` (`npm run validate`). Exit code 1 on errors.
 *
 * Disposable: replaced by the Go `catalog.Validate()` test in S6 and
 * deleted from the FE in S9. Enum arrays below mirror `types.js` by hand.
 */
import { readFile } from 'node:fs/promises';

const DATA_DIR = new URL('../src/data/', import.meta.url);

const SPORTS = [
  'fitness',
  'futsal',
  'padel',
  'badminton',
  'basketball',
  'swimming',
  'running',
  'football',
  'yoga',
  'pilates',
  'zumba',
  'muay-thai',
  'hiking',
];
const AUDIENCES = [
  'umum',
  'anak',
  'remaja',
  'lansia',
  'prenatal',
  'pemula',
  'perempuan',
];
const OFFERING_TYPES = [
  'membership',
  'visit-pass',
  'personal-training',
  'class',
  'court-rental',
  'program',
  'community-session',
  'free-access',
];
const PRICE_UNITS = [
  'monthly',
  'weekly',
  'per-visit',
  'per-hour',
  'per-session-pack',
  'per-year',
  'free',
];
const JOIN_METHODS = ['walk-in', 'wa', 'daftar-online'];
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const VISIBILITIES = ['public', 'on-request', 'unknown'];

const BBOX = { latMin: -7.2, latMax: -6.7, lngMin: 107.4, lngMax: 107.9 };
const FRESH_DAYS = 45;
const WA_RE = /^\+62\d{8,13}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const errors = [];
const warnings = [];

const error = (where, message) => errors.push(`${where}: ${message}`);
const warn = (where, message) => warnings.push({ where, message });

const isObject = (v) =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v) => Number.isInteger(v);
const isDate = (v) =>
  typeof v === 'string' &&
  DATE_RE.test(v) &&
  !Number.isNaN(Date.parse(`${v}T00:00:00Z`));

const daysAgo = (dateStr) =>
  Math.floor((Date.now() - Date.parse(`${dateStr}T00:00:00Z`)) / 86_400_000);

const load = async (file) => {
  try {
    return JSON.parse(await readFile(new URL(file, DATA_DIR), 'utf8'));
  } catch (err) {
    error(file, `cannot read/parse (${err.message})`);
    return [];
  }
};

const checkEnum = (where, value, allowed) => {
  if (!allowed.includes(value))
    error(where, `"${value}" is not one of ${allowed.join(' | ')}`);
};

const checkEnumArray = (where, values, allowed) => {
  if (!Array.isArray(values)) return error(where, 'must be an array');
  if (values.length === 0) warn(where, 'empty array');
  for (const [i, value] of values.entries())
    checkEnum(`${where}[${i}]`, value, allowed);
  if (new Set(values).size !== values.length)
    error(where, 'contains duplicates');
};

const checkLastVerified = (where, value, whatsapp) => {
  if (value === null) return;
  if (!isDate(value))
    return error(where, `"${value}" is not a YYYY-MM-DD date`);
  if (Date.parse(`${value}T00:00:00Z`) > Date.now())
    return error(where, 'is in the future');

  const age = daysAgo(value);
  if (age <= FRESH_DAYS) return;

  const text = encodeURIComponent(
    `Halo, saya dari Bandung Sport. Mau konfirmasi harga/jadwal yang masih berlaku. Terima kasih.`,
  );
  const link = whatsapp
    ? ` https://wa.me/${whatsapp.replace('+', '')}?text=${text}`
    : '';
  warn(where, `${age} days old — re-verify${link}`);
};

const validateVenue = (venue, index, ids, offeringsByVenue) => {
  const where = `venues[${index}]`;
  if (!isObject(venue)) return error(where, 'must be an object');

  if (typeof venue.id !== 'string' || !venue.id.startsWith('v-')) {
    error(`${where}.id`, 'must be a string starting with "v-"');
  } else if (ids.has(venue.id)) {
    error(`${where}.id`, `duplicate id "${venue.id}"`);
  } else {
    ids.add(venue.id);
  }

  for (const field of ['name', 'area']) {
    if (typeof venue[field] !== 'string' || venue[field].trim() === '') {
      error(`${where}.${field}`, 'must be a non-empty string');
    }
  }

  if (!Array.isArray(venue.sports) || venue.sports.length === 0) {
    error(`${where}.sports`, 'must be a non-empty array');
  } else {
    for (const [i, sport] of venue.sports.entries())
      checkEnum(`${where}.sports[${i}]`, sport, SPORTS);
  }

  const { lat, lng } = venue;
  if (lat === null && lng === null) {
    // Allowed: coordinates are filled during the curation pass.
  } else if (typeof lat !== 'number' || typeof lng !== 'number') {
    error(where, 'lat and lng must both be numbers or both be null');
  } else {
    if (lat < BBOX.latMin || lat > BBOX.latMax)
      error(`${where}.lat`, `${lat} is outside Bandung Raya`);
    if (lng < BBOX.lngMin || lng > BBOX.lngMax)
      error(`${where}.lng`, `${lng} is outside Bandung Raya`);
  }

  if (
    venue.whatsapp !== null &&
    (typeof venue.whatsapp !== 'string' || !WA_RE.test(venue.whatsapp))
  ) {
    error(`${where}.whatsapp`, `"${venue.whatsapp}" is not +62... format`);
  }

  for (const field of ['address', 'instagram', 'website', 'sourceUrl']) {
    const value = venue[field];
    if (value !== null && typeof value !== 'string')
      error(`${where}.${field}`, 'must be a string or null');
  }

  if (!Array.isArray(venue.tags))
    error(`${where}.tags`, 'must be an array ([] when none)');

  checkLastVerified(
    `${where}.lastVerified`,
    venue.lastVerified,
    venue.whatsapp,
  );

  if (!offeringsByVenue.has(venue.id)) {
    warn(where, `no offering yet — ${venue.name}`);
  }
};

const validateOffering = (offering, index, ids, venueIds) => {
  const where = `offerings[${index}]`;
  if (!isObject(offering)) return error(where, 'must be an object');

  if (typeof offering.id !== 'string' || !offering.id.startsWith('of-')) {
    error(`${where}.id`, 'must be a string starting with "of-"');
  } else if (ids.has(offering.id)) {
    error(`${where}.id`, `duplicate id "${offering.id}"`);
  } else {
    ids.add(offering.id);
  }

  if (offering.venueId !== null && !venueIds.has(offering.venueId)) {
    error(
      `${where}.venueId`,
      `"${offering.venueId}" does not exist in venues.json`,
    );
  }
  if (offering.organizerId !== null) {
    error(
      `${where}.organizerId`,
      'must stay null until Fase 3 (organizers.json)',
    );
  }
  const linkedVenue =
    typeof offering.venueId === 'string' && venueIds.has(offering.venueId);
  if (!linkedVenue && offering.organizerId === null) {
    error(where, 'needs at least one of venueId / organizerId');
  }

  checkEnum(`${where}.sport`, offering.sport, SPORTS);
  checkEnum(`${where}.offeringType`, offering.offeringType, OFFERING_TYPES);
  checkEnumArray(`${where}.audience`, offering.audience, AUDIENCES);
  checkEnumArray(`${where}.joinMethod`, offering.joinMethod, JOIN_METHODS);

  if (typeof offering.title !== 'string' || offering.title.trim() === '') {
    error(`${where}.title`, 'must be a non-empty string');
  }

  const visibility = offering.priceVisibility;
  checkEnum(`${where}.priceVisibility`, visibility, VISIBILITIES);

  const { priceMin, priceMax, priceUnit } = offering;
  if (visibility === 'public') {
    if (!isInt(priceMin) || priceMin < 0)
      error(`${where}.priceMin`, 'public price needs an integer >= 0');
    if (priceUnit === null) {
      error(`${where}.priceUnit`, 'public price needs a unit');
    } else {
      checkEnum(`${where}.priceUnit`, priceUnit, PRICE_UNITS);
    }
  } else if (visibility === 'on-request' || visibility === 'unknown') {
    if (priceMin !== null || priceMax !== null) {
      error(where, `${visibility} requires priceMin and priceMax to be null`);
    }
    if (priceUnit !== null)
      error(`${where}.priceUnit`, `${visibility} requires a null unit`);
  }

  if (priceMin !== null && priceMax !== null && priceMax < priceMin) {
    error(where, `priceMax (${priceMax}) is below priceMin (${priceMin})`);
  }
  if (priceUnit === 'per-session-pack' && !isInt(offering.sessionsPerPack)) {
    error(`${where}.sessionsPerPack`, 'per-session-pack needs sessionsPerPack');
  }
  if (
    offering.sessionsPerPack !== null &&
    (!isInt(offering.sessionsPerPack) || offering.sessionsPerPack < 1)
  ) {
    error(`${where}.sessionsPerPack`, 'must be an integer >= 1 or null');
  }
  if (
    offering.groupSize !== null &&
    (!isInt(offering.groupSize) || offering.groupSize < 1)
  ) {
    error(`${where}.groupSize`, 'must be an integer >= 1 or null');
  }
  if (
    offering.durationMin !== null &&
    (!isInt(offering.durationMin) || offering.durationMin < 1)
  ) {
    error(`${where}.durationMin`, 'must be an integer >= 1 or null');
  }

  const { ageMin, ageMax } = offering;
  if (ageMin !== null && (!isInt(ageMin) || ageMin < 0))
    error(`${where}.ageMin`, 'must be an integer >= 0 or null');
  if (ageMax !== null && (!isInt(ageMax) || ageMax < 0))
    error(`${where}.ageMax`, 'must be an integer >= 0 or null');
  if (isInt(ageMin) && isInt(ageMax) && ageMin > ageMax) {
    error(where, `ageMin (${ageMin}) is above ageMax (${ageMax})`);
  }
  if (
    (ageMin !== null || ageMax !== null) &&
    !offering.audience?.some((a) => a === 'anak' || a === 'remaja')
  ) {
    warn(where, 'age fields set but audience has no anak/remaja');
  }

  if (!Array.isArray(offering.schedule)) {
    error(`${where}.schedule`, 'must be an array ([] when unknown)');
  } else {
    offering.schedule.forEach((slot, i) => {
      const at = `${where}.schedule[${i}]`;
      if (!isObject(slot)) return error(at, 'must be an object');
      if (!Array.isArray(slot.days) || slot.days.length === 0) {
        error(`${at}.days`, 'must be a non-empty array');
      } else {
        for (const [j, day] of slot.days.entries())
          checkEnum(`${at}.days[${j}]`, day, DAYS);
      }
      if (!TIME_RE.test(slot.start)) error(`${at}.start`, 'must be HH:MM');
      if (!TIME_RE.test(slot.end)) error(`${at}.end`, 'must be HH:MM');
      if (
        TIME_RE.test(slot.start) &&
        TIME_RE.test(slot.end) &&
        slot.start >= slot.end
      ) {
        error(at, 'start must be before end');
      }
    });
  }

  if (
    offering.locationNote !== null &&
    typeof offering.locationNote !== 'string'
  ) {
    error(`${where}.locationNote`, 'must be a string or null');
  }

  checkLastVerified(`${where}.lastVerified`, offering.lastVerified, null);
};

const run = async () => {
  const venues = await load('venues.json');
  const offerings = await load('offerings.json');

  if (!Array.isArray(venues)) error('venues.json', 'must contain an array');
  if (!Array.isArray(offerings))
    error('offerings.json', 'must contain an array');

  const venueIds = new Set();
  const offeringsByVenue = new Set();
  for (const offering of offerings) {
    if (typeof offering?.venueId === 'string')
      offeringsByVenue.add(offering.venueId);
  }

  venues.forEach((venue, i) =>
    validateVenue(venue, i, venueIds, offeringsByVenue),
  );

  const offeringIds = new Set();
  offerings.forEach((offering, i) =>
    validateOffering(offering, i, offeringIds, venueIds),
  );

  const unpriced = venues.filter((v) => !offeringsByVenue.has(v.id)).length;
  console.log(
    `validate-data: ${venues.length} venues, ${offerings.length} offerings (${unpriced} without offering)`,
  );

  if (errors.length > 0) {
    console.error(`\n${errors.length} error(s):`);
    for (const message of errors) console.error(`  ✗ ${message}`);
  }
  if (warnings.length > 0) {
    const byAge = [...warnings].sort((a, b) => {
      const age = (w) => Number(w.message.match(/^(\d+) days old/)?.[1] ?? -1);
      return age(b) - age(a);
    });
    console.log(`\n${warnings.length} warning(s):`);
    for (const { where, message } of byAge)
      console.log(`  ⚠ ${where}: ${message}`);
  }

  if (errors.length > 0) {
    console.error('\nFAILED');
    process.exit(1);
  }
  console.log(errors.length === 0 ? 'OK' : '');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
