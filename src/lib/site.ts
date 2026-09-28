/** Canonical production origin, used for the sitemap, robots.txt and absolute metadata URLs. */
export const SITE_URL = "https://www.realtorsmedia.world";

/** Public, indexable pages. Signed-in areas (/admin, /employee, /dashboard) are left out on purpose. */
export const PUBLIC_ROUTES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/properties", priority: 0.9, changeFrequency: "daily" },
  { path: "/projects", priority: 0.9, changeFrequency: "daily" },
  { path: "/categories", priority: 0.8, changeFrequency: "weekly" },
  { path: "/classifieds", priority: 0.8, changeFrequency: "daily" },
  { path: "/post-property", priority: 0.8, changeFrequency: "monthly" },
  { path: "/register", priority: 0.8, changeFrequency: "monthly" },
  { path: "/verify", priority: 0.8, changeFrequency: "monthly" },
  { path: "/news", priority: 0.7, changeFrequency: "daily" },
  { path: "/realtors", priority: 0.7, changeFrequency: "weekly" },
  { path: "/members", priority: 0.7, changeFrequency: "weekly" },
  { path: "/real-estate-hub", priority: 0.7, changeFrequency: "weekly" },
  { path: "/business-opportunities", priority: 0.7, changeFrequency: "weekly" },
  { path: "/investors", priority: 0.7, changeFrequency: "weekly" },
  { path: "/associates", priority: 0.6, changeFrequency: "monthly" },
  { path: "/advisors", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services", priority: 0.6, changeFrequency: "monthly" },
  { path: "/community", priority: 0.6, changeFrequency: "weekly" },
  { path: "/tv", priority: 0.6, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.5, changeFrequency: "monthly" },
  { path: "/core-committee", priority: 0.5, changeFrequency: "monthly" },
  { path: "/legal-cell", priority: 0.5, changeFrequency: "monthly" },
  { path: "/advertise", priority: 0.5, changeFrequency: "monthly" },
  { path: "/mobile-app", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/help", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

/** Official contact details, as printed on the ID card footer. */
export const CONTACT = {
  website: "www.realtorsmedia.world",
  phones: ["+91 8096792778", "+91 9441185799"],
  email: "realtorsmedia.info@gmail.com",
  addressLines: ["Archana Arcade IT Complex,", "South Block, 407"],
};

/** `tel:` link for a phone number written with spaces. */
export const telHref = (phone: string) => `tel:${phone.replace(/\s+/g, "")}`;
