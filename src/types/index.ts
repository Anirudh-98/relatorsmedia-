export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface RealEstateHubItem {
  id: string;
  title: string;
  subtitle?: string;
  iconName?: string;
  count?: string | number;
}

export interface MediaStreamItem {
  id: string;
  title: string;
  color: string;
  badge?: string;
}

export interface PropertyCategory {
  id: string;
  title: string;
  slug?: string;
  subTitle?: string;
  iconType: string;
  iconColor: string;
  tag?: string;
  href?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  badge?: string;
  iconType: string;
  bgColor: string;
  iconColor: string;
  href?: string;
}

export interface AudienceCardItem {
  id: string;
  title: string;
  themeColor: "green" | "blue" | "purple" | "red";
  iconType: string;
  bullets: string[];
  ctaText: string;
  ctaLink: string;
}

export interface IdCardItem {
  id: string;
  name: string;
  position: string;
  grade: string;
  idNumber: string;
  tierTheme: "green" | "blue" | "orange" | "red";
  planName: string;
  commission: string;
  photoUrl?: string;
  borderColor: string;
  badgeColor: string;
  btnBg: string;
}

export interface CardTierPlan {
  id: string;
  tierTheme: "green" | "blue" | "orange" | "red";
  title: string;
  price: string;
  priceLabel: string;
  tagline: string;
  badge: string;
  commission: string;
  features: string[];
  idPrefix: string;
}

export interface RealtorsMediaEmployee {
  name: string;
  designation: string;
  employeeId: string;
  department: string;
  location: string;
  issuedDate: string;
  validTill: string;
  photo?: string;
  verificationUrl?: string;
  theme?: "green" | "blue" | "orange" | "red";
  phone?: string;
  email?: string;
  reraNumber?: string;
  agencyName?: string;
  specialization?: string;
  experience?: string;
  licenseNumber?: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  iconType: string;
  isRightCol?: boolean;
  hasChevron?: boolean;
  href?: string;
}

export interface StatisticItem {
  id: string;
  label: string;
  value: string;
  iconType: string;
}
