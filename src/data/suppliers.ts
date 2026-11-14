export interface SupplierOffer {
  id: 'A' | 'B' | 'C';
  name: string;
  tagline: string;
  unitPrice: number;
  deliveryFee: number;
  deliveryTime: string;
  paperSpec: string;
  accentColor: 'blue' | 'indigo' | 'teal';
}

export const SUPPLIER_OFFERS: SupplierOffer[] = [
  {
    id: 'A',
    name: 'A taklif',
    tagline: 'Tezkor yetkazish',
    unitPrice: 40000,
    deliveryFee: 20000,
    deliveryTime: '1 kun',
    paperSpec: 'A4 · 80 g/m² · 500 varaq',
    accentColor: 'blue',
  },
  {
    id: 'B',
    name: 'B taklif',
    tagline: 'Katta hajm uchun qulay',
    unitPrice: 39000,
    deliveryFee: 25000,
    deliveryTime: '2 kun',
    paperSpec: 'A4 · 80 g/m² · 500 varaq',
    accentColor: 'indigo',
  },
  {
    id: 'C',
    name: 'C taklif',
    tagline: 'Eng arzon yetkazib berish',
    unitPrice: 41000,
    deliveryFee: 5000,
    deliveryTime: '1-3 kun',
    paperSpec: 'A4 · 80 g/m² · 500 varaq',
    accentColor: 'teal',
  },
];

export function formatSom(amount: number): string {
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} soʻm`;
}

export function calculateOfferTotal(quantity: number, offer: SupplierOffer): number {
  return quantity * offer.unitPrice + offer.deliveryFee;
}
