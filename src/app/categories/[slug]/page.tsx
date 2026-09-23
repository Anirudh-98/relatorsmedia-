import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { propertyCategories } from "@/data/portalData";
import { FaCheckCircle, FaMapMarkerAlt, FaFilter, FaPlusSquare } from "react-icons/fa";

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

  const sampleListings = [
    {
      title: `RERA-Approved Premium ${category.title} Venture`,
      location: "Growth Corridor, Pune / Hyderabad Highway",
      price: "₹ 35 Lakhs Onwards*",
      realtor: "Rohan Deshmukh (RMD-BLU-001)",
      status: "Ready for Registration",
    },
    {
      title: `Prime Highway Facing Gated ${category.title}`,
      location: "Near International Airport Zone",
      price: "₹ 75 Lakhs Onwards*",
      realtor: "Ramnath Kumar (RMD-GRN-014)",
      status: "Direct Developer Allocation",
    },
    {
      title: `Corner Bit Luxury ${category.title} Scheme`,
      location: "West Metropolitan Growth Belt",
      price: "₹ 1.20 Cr Onwards*",
      realtor: "S. Priya Sharma (RMD-BLU-089)",
      status: "Limited Units Available",
    },
  ];

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
          href="/post-property"
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <FaPlusSquare />
          <span>Post In This Category</span>
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
              All properties listed under {category.title} undergo preliminary title verification, RERA layout check, and certified surveyor boundary demarcation.
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
        <div>
          <h3 className="text-[16px] font-black text-[#073F73] mb-3 uppercase tracking-tight">
            Curated Listings in {category.title}
          </h3>
          <div className="space-y-3">
            {sampleListings.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E7F6EA] text-[#168A3A] text-[9.5px] font-black px-2 py-0.5 rounded-full border border-[#A3D9B1]">
                      {item.status}
                    </span>
                    <span className="text-[#E21F2F] font-black text-[13px]">
                      {item.price}
                    </span>
                  </div>

                  <h4 className="text-[15px] font-black text-[#073F73]">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-1 text-[11.5px] text-[#64748B] font-semibold">
                    <FaMapMarkerAlt className="text-[#0B4F8A]" />
                    <span>{item.location}</span>
                  </div>

                  <div className="text-[11px] text-[#475569] font-medium pt-1">
                    Certified Broker: <strong className="text-[#0C1E36]">{item.realtor}</strong>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/contact?subject=${encodeURIComponent(item.title)}`}
                    className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-extrabold px-4 py-2 rounded-md transition-colors shadow-2xs w-full text-center"
                  >
                    Contact Realtor
                  </Link>
                  <Link
                    href="/classifieds"
                    className="bg-white border border-[#CBD5E1] hover:bg-gray-50 text-[#073F73] text-[10.5px] font-bold px-4 py-1.5 rounded-md transition-colors w-full text-center"
                  >
                    View in Hub
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
