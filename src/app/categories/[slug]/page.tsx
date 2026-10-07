import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { propertyCategories } from "@/data/portalData";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaFilter,
  FaPlusSquare,
  FaDirections,
  FaBuilding,
  FaShieldAlt,
  FaImages,
} from "react-icons/fa";
import { getProperties, PropertyListingData } from "@/lib/firebase/db";
import { CategoryListingsView } from "@/components/properties/CategoryListingsView";
import { matchesPropertyCategory } from "@/lib/utils/propertyCategory";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const category = propertyCategories.find(
    (c) => c.slug === slug || c.id === slug
  ) || {
    id: slug,
    title: slug.replace(/-/g, " ").toUpperCase(),
    iconType: "building",
    iconColor: "#073F73",
  };

  const allListings = await getProperties().catch(() => []);
  const matchingListings = allListings.filter((p) => matchesPropertyCategory(p.propertyType, slug));

  // Firestore Timestamps are class instances and can't cross the Server -> Client boundary
  const toMillis = (value: unknown): number | null =>
    typeof (value as { toMillis?: unknown })?.toMillis === "function"
      ? (value as { toMillis: () => number }).toMillis()
      : null;
  const serializableListings: PropertyListingData[] = matchingListings.map((p) => ({
    ...p,
    createdAt: toMillis(p.createdAt),
    updatedAt: toMillis(p.updatedAt),
  }));

  const getCleanMapUrl =(url?: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  return (
    <PortalLayout
      title={category.title}
      subtitle={`Verified ${category.title} Listings, Verified Brokers, and Direct Developer Partnerships`}
      badge="Category"
      breadcrumbs={[
        { label: "Categories", href: "/categories" },
        { label: category.title },
      ]}
      action={
        <Link
          href="/dashboard?tab=upload"
          className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <FaPlusSquare />
          <span>Upload Property In This Category</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-6 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[#0B4F8A] text-[11px] font-extrabold uppercase tracking-wide block mb-1">
              Category Marketplace
            </span>
            <h2 className="text-[22px] font-black text-[#073F73] mb-2">
              Browse Authenticated {category.title}
            </h2>
            <p className="text-[13px] text-[#475569] leading-relaxed">
              All properties listed under {category.title} are uploaded by authenticated members and include photographs and Google Maps navigation.
            </p>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <Link
              href={`/properties?category=${slug}`}
              className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11.5px] font-black py-2 px-4 rounded-md uppercase tracking-wider text-center transition-colors shadow-2xs"
            >
              Filter in Marketplace
            </Link>
            <Link
              href="/categories"
              className="bg-[#F1F5F9] hover:bg-gray-200 text-[#073F73] text-[11px] font-bold py-2 px-4 rounded-md uppercase tracking-wider text-center transition-colors border border-gray-300"
            >
              All Categories
            </Link>
          </div>
        </div>

        {/* Listings in this category */}
        <CategoryListingsView
          categoryTitle={category.title}
          categorySlug={slug}
          listings={serializableListings}
        />
      </div>
    </PortalLayout>
  );
}
