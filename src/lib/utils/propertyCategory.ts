import { propertyCategories } from "@/data/portalData";

// Words in a listing's property type that place it in a category whose title reads differently
// (e.g. the "Gated Villa Plots" type belongs under "Gated Community Plots / Flats")
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "gated-communities": ["gated"],
  duplex: ["duplex"],
  villas: ["villa"],
  commercial: ["commercial", "office"],
  industrial: ["industrial", "warehouse"],
  agriculture: ["agricultur"],
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

/** True when a listing's property type belongs to the category with this slug (or id). */
export function matchesPropertyCategory(propertyType: string | undefined, categorySlug: string): boolean {
  const type = (propertyType || "").toLowerCase().trim();
  if (!type) return false;

  const slug = categorySlug.toLowerCase();
  const category = propertyCategories.find((c) => c.slug === slug || c.id === slug);
  const title = (category?.title || slug.replace(/-/g, " ")).toLowerCase();
  const keywords = CATEGORY_KEYWORDS[category?.slug || slug] || [];

  return (
    type.includes(title) ||
    title.includes(type) ||
    normalize(type).includes(normalize(slug)) ||
    keywords.some((keyword) => type.includes(keyword))
  );
}
