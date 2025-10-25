// lib/utils/constant.ts
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  serviceCharge: number;
  duration: string;
  image: string;
  tags: string[];
  seoKeywords: string[];
  popularity: number;
  featured?: boolean;
  isActive?: boolean; // ✅ ADD THIS
}

export const SERVICE_CHARGE_PERCENTAGE = 18;
export const MINIMUM_SERVICE_CHARGE = 50;

export const SERVICE_CATEGORIES = [
  { id: "all", name: "All Business Services", icon: "🏢", count: 0 },
  { id: "hospitality", name: "Hospitality Staff", icon: "🏨", count: 0 },
  { id: "transportation", name: "Transport Staff", icon: "🚚", count: 0 },
  { id: "healthcare", name: "Hospital Staff", icon: "🏥", count: 0 },
  { id: "retail", name: "Retail & Warehouse", icon: "🛍️", count: 0 },
  { id: "industrial", name: "Factory Staff", icon: "🏭", count: 0 }
];

export const calculateTotalPrice = (basePrice: number): number => {
  const serviceCharge = Math.max(
    (basePrice * SERVICE_CHARGE_PERCENTAGE) / 100,
    MINIMUM_SERVICE_CHARGE
  );
  return Math.round(basePrice + serviceCharge);
};