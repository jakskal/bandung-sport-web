// Disposable checker for S3 — replaced by Vitest when it lands (S17).
// Run: node scripts/check-format-price.mjs
import formatPrice from '../src/lib/formatPrice.js';

// NOTE: the dash between min and max is an EN DASH (U+2013), not a hyphen.
const cases = [
  {
    name: 'range monthly',
    input: {
      priceMin: 500000,
      priceMax: 2500000,
      priceUnit: 'monthly',
      priceVisibility: 'public',
    },
    expected: 'Rp500rb–2,5jt /bulan',
  },
  {
    name: 'min only per-hour',
    input: {
      priceMin: 50000,
      priceMax: null,
      priceUnit: 'per-hour',
      priceVisibility: 'public',
    },
    expected: 'mulai Rp50rb /jam',
  },
  {
    name: 'free (price 0)',
    input: {
      priceMin: 0,
      priceMax: 0,
      priceUnit: 'per-visit',
      priceVisibility: 'public',
    },
    expected: 'Gratis',
  },
  {
    name: 'single price per-visit',
    input: {
      priceMin: 35000,
      priceMax: 35000,
      priceUnit: 'per-visit',
      priceVisibility: 'public',
    },
    expected: 'Rp35rb /kunjungan',
  },
  {
    name: 'on-request',
    input: {
      priceMin: null,
      priceMax: null,
      priceUnit: null,
      priceVisibility: 'on-request',
    },
    expected: 'Harga via WA',
  },
  {
    name: 'unknown',
    input: {
      priceMin: null,
      priceMax: null,
      priceUnit: null,
      priceVisibility: 'unknown',
    },
    expected: 'Harga belum dicek',
  },
];

let failed = 0;
for (const c of cases) {
  const got = formatPrice(c.input);
  const ok = got === c.expected;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}`);
  if (!ok) {
    console.log(`      got      ${JSON.stringify(got)}`);
    console.log(`      expected ${JSON.stringify(c.expected)}`);
  }
}
console.log(`\n${cases.length - failed}/${cases.length} pass`);
process.exit(failed === 0 ? 0 : 1);
