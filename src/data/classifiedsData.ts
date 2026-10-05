export interface ClassifiedAd {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  city: string;
  experience: string;
  rating: number;
  reviewCount: number;
  priceRange?: string;
  verified: boolean;
  featured?: boolean;
  description: string;
  services: string[];
  postedDate: string;
  badge?: string;
}

export const CITIES_LIST = [
  "All Cities",
  "Hyderabad",
  "Bengaluru",
  "Pune",
  "Mumbai",
  "Chennai",
  "Delhi-NCR",
];

export const INITIAL_CLASSIFIED_ADS: ClassifiedAd[] = [];
