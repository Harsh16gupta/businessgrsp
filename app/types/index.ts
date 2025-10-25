export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  serviceCharge: number;
  duration: string;
  rating: string;
  features: string[];
  image: string;
  categoryId: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  details: string;
  duration?: string;
  basePrice?: number;
  serviceCharge?: number;
}