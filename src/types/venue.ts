export type Tier = 'Gratis' | 'Murah' | 'Sedang' | 'Mahal';

export type PriceUnit =
  'monthly' | 'per-hour' | 'per-session-pack' | 'per-visit';

export type PriceVisibility = 'public' | 'on-request' | 'unknown';
export type PriceFrom = {
  priceMin: number;
  priceMax: number | null;
  priceUnit: PriceUnit | null;
  priceVisibility: PriceVisibility;
  sessionsPerPack: number | null;
};

export type VenueSummary = {
  id: string;
  name: string;
  sports: string[];
  lat: number | null;
  lng: number | null;
  tier: Tier | null;
  priceFrom: PriceFrom | null;
  offeringCount: number;
  lastVerified: string | null;
  hasWhatsApp: boolean;
  area: string;
};
