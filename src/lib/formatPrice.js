export const PRICE_UNIT_LABEL = {
  'per-hour': '/jam',
  'per-visit': '/kunjungan',
  monthly: '/bulan',
  weekly: '/minggu',
  'per-session-pack': '/sesi',
  'per-year': '/tahun',
};

const formatPriceValue = (value) => {
  const numberFormatter = new Intl.NumberFormat('id-ID');
  if (value >= 1000000) {
    return `${numberFormatter.format(value / 1000000)}jt`;
  } else if (value >= 1000) {
    return `${numberFormatter.format(value / 1000)}rb`;
  } else {
    return `${numberFormatter.format(value)}`;
  }
};

export default function formatPrice({
  priceMin,
  priceMax,
  priceUnit,
  priceVisibility,
  sessionsPerPack,
}) {
  if (priceVisibility === 'on-request') {
    return 'Harga via WA';
  }
  if (priceVisibility === 'unknown') {
    return 'Harga belum dicek';
  }
  if (priceMin === 0 && priceMax === 0) {
    return 'Gratis';
  }

  const minPrice = priceMin != null ? formatPriceValue(priceMin) : null;
  const maxPrice = priceMax != null ? formatPriceValue(priceMax) : null;
  let priceString = '';
  if (minPrice !== null) {
    if (minPrice && maxPrice && minPrice !== maxPrice) {
      priceString = `Rp${minPrice}–${maxPrice}`;
    } else if (minPrice && maxPrice && minPrice === maxPrice) {
      priceString = `Rp${minPrice}`;
    } else if (minPrice) {
      priceString = `mulai Rp${minPrice}`;
    }
  } else {
    return 'Harga belum dicek';
  }

  const unitString =
    priceUnit === 'per-session-pack' && sessionsPerPack > 1
      ? `/${sessionsPerPack} sesi`
      : priceUnit
        ? PRICE_UNIT_LABEL[priceUnit] || ''
        : '';

  return `${priceString} ${unitString}`.trim();
}
