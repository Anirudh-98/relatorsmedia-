"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { realEstateHubItems } from "@/data/portalData";
import { FaFolder, FaSearch, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaPlusSquare, FaFilter } from "react-icons/fa";

interface ClassifiedAd {
  id: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  name: string;
  location: string;
  phone: string;
  badge: string;
  description: string;
  price?: string;
}

const mockAds: ClassifiedAd[] = [
  {
    id: "ad1",
    categoryId: "1",
    categoryTitle: "Area wise Realtors (B & D)",
    title: "Authorized RERA Realtor for Baner & Balewadi Luxury Apartments",
    name: "Deshmukh Realty Associates",
    location: "Baner, Pune",
    phone: "+91 97654 32109",
    badge: "Verified Broker",
    description: "Specialized in 2, 3 & 4 BHK luxury resale and developer inventory with zero litigation guarantee.",
  },
  {
    id: "ad2",
    categoryId: "1",
    categoryTitle: "Area wise Realtors (B & D)",
    title: "Prime Gachibowli & Kokapet Commercial Space Aggregator",
    name: "Capital Channel Partners",
    location: "Gachibowli, Hyderabad",
    phone: "+91 99887 76655",
    badge: "VIP Agency",
    description: "Exclusive corporate leasing and bare-shell IT office floors from 5,000 to 50,000 sq.ft.",
  },
  {
    id: "ad3",
    categoryId: "2",
    categoryTitle: "CM Enggs & Contractors",
    title: "Turnkey Civil Construction & Structural Engineering Contractors",
    name: "Apex BuildTech Infrastructure",
    location: "Hadapsar, Pune",
    phone: "+91 98220 33445",
    badge: "Govt. Registered",
    description: "Quality residential bungalow and multi-story RCC building construction with 10-year warranty.",
  },
  {
    id: "ad4",
    categoryId: "3",
    categoryTitle: "Builders & Developers",
    title: "20-Acre RERA & PMRDA Sanctioned Open Plot Gated Community",
    name: "Green Corridors Township LLP",
    location: "Shadnagar Highway Corridor",
    phone: "+91 94480 11223",
    badge: "Direct Developer",
    description: "Ready for construction with grand arch, clubhouse, underground electricity, and 40ft roads.",
    price: "₹ 18,000 / Sq.Yd.",
  },
  {
    id: "ad5",
    categoryId: "4",
    categoryTitle: "Architects & Planners",
    title: "Vastu-Compliant 3D Villa Elevations & Municipal Sanction Drawings",
    name: "Studio Vastu & Design Architects",
    location: "Kothrud, Pune",
    phone: "+91 98201 44556",
    badge: "COA Certified",
    description: "Complete architectural blueprints, interior styling, landscape planning, and structural stability audits.",
  },
  {
    id: "ad6",
    categoryId: "5",
    categoryTitle: "Interior Designers",
    title: "Premium Modular Kitchens, Wardrobes & Complete Home Interiors",
    name: "Urban Living Interiors",
    location: "Whitefield, Bengaluru",
    phone: "+91 97400 99887",
    badge: "Verified Studio",
    description: "Factory-finish marine ply modular designs delivered and installed in 45 days with 10-year warranty.",
  },
  {
    id: "ad7",
    categoryId: "6",
    categoryTitle: "Construction Materials",
    title: "Wholesale TMT 550D Steel & Grade-53 OPC Cement Direct Dispatch",
    name: "National Building Materials Depo",
    location: "Secunderabad, Hyderabad",
    phone: "+91 98490 22334",
    badge: "Direct Factory",
    description: "Authorized distributor of Tata Tiscon, JSW Steel, and UltraTech Cement for major project sites.",
  },
  {
    id: "ad8",
    categoryId: "9",
    categoryTitle: "Technicians (Electricians, Carpenters, Plumbers)",
    title: "Certified Building Maintenance & Plumbing Contracting Squad",
    name: "Reliable Facility Technicians",
    location: "Wakad, Pune",
    phone: "+91 93250 88776",
    badge: "Verified Agency",
    description: "Rapid on-call plumbing, high-voltage electrical rewiring, and society water pipeline maintenance.",
  },
];

function ClassifiedsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredAds = mockAds.filter((ad) => {
    const matchesCategory =
      selectedCategory === "All" || ad.categoryId === selectedCategory;
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#073F73] text-white p-5 sm:p-7 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[#F7C900] text-[11px] font-black uppercase tracking-widest block mb-1">
            Real Estate Hub Classifieds
          </span>
          <h2 className="text-[20px] sm:text-[24px] font-black leading-tight">
            Verified Vendors, Professionals, Material Suppliers & Land Realtors
          </h2>
          <p className="text-[12.5px] text-[#BAE6FD] mt-1 max-w-2xl">
            Browse ads across 15 real estate service verticals or publish your own classified listing to reach thousands of active home buyers.
          </p>
        </div>
        <Link
          href="/post-property"
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[12px] font-black px-4 py-2.5 rounded-md uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm flex-shrink-0"
        >
          <FaPlusSquare />
          <span>Post Your Free Ad</span>
        </Link>
      </div>

      {/* Main Grid: Left Sidebar Categories (15 items) & Right Ads List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Categories Filter Column */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs h-fit">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-2">
            <h3 className="text-[13px] font-black text-[#073F73] uppercase tracking-wide flex items-center gap-1.5">
              <FaFolder />
              <span>15 Hub Verticals</span>
            </h3>
            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="text-[10px] font-bold text-[#E21F2F] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <ul className="space-y-0.5 text-[11.5px]">
            <li key="all">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-2.5 py-1.5 rounded-md font-bold transition-colors cursor-pointer flex items-center justify-between ${
                  selectedCategory === "All"
                    ? "bg-[#073F73] text-white"
                    : "text-[#143B5D] hover:bg-[#EEF6FC]"
                }`}
              >
                <span>All Classified Categories</span>
                <span className="text-[10px] opacity-75">{mockAds.length}</span>
              </button>
            </li>

            {realEstateHubItems.map((hub) => {
              const isSelected = selectedCategory === hub.id;
              return (
                <li key={hub.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(hub.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center justify-between text-[11.5px] ${
                      isSelected
                        ? "bg-[#073F73] text-white font-extrabold"
                        : "text-[#143B5D] hover:bg-[#EEF6FC]"
                    }`}
                  >
                    <span className="truncate pr-1">{hub.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Ads List Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search bar & count */}
          <div className="bg-white border border-[#CBD5E1] rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80 flex items-center">
              <span className="absolute left-3 text-gray-400 text-[12px]">
                <FaSearch />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ads by service, agency or city..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[12px] focus:outline-hidden focus:border-[#073F73]"
              />
            </div>

            <div className="text-[11.5px] font-bold text-[#64748B]">
              Showing <span className="text-[#073F73] font-black">{filteredAds.length}</span> Verified Classified Ads
            </div>
          </div>

          {/* Ads Cards */}
          {filteredAds.length === 0 ? (
            <div className="bg-white border border-[#CBD5E1] rounded-xl p-8 text-center text-[#64748B]">
              <FaFolder className="text-[32px] text-gray-300 mx-auto mb-2" />
              <p className="text-[14px] font-bold">No ads currently found in this category.</p>
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="mt-3 text-[12px] font-black text-[#073F73] hover:underline"
              >
                Reset Filter to All
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white border border-[#CBD5E1] rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#0B4F8A] bg-[#EEF6FC] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                        {ad.categoryTitle}
                      </span>
                      <span className="text-[10px] font-black uppercase text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#A3D9B1]">
                        <FaCheckCircle className="text-[8.5px]" /> {ad.badge}
                      </span>
                      {ad.price && (
                        <span className="text-[11px] font-black text-[#E21F2F]">
                          {ad.price}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-black text-[#073F73] leading-snug">
                      {ad.title}
                    </h3>

                    <p className="text-[12px] text-[#475569] leading-relaxed">
                      {ad.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#1E293B] pt-1">
                      <span className="font-extrabold text-[#0C1E36]">{ad.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#64748B]">
                        <FaMapMarkerAlt className="text-[#0B4F8A]" /> {ad.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                    <a
                      href={`tel:${ad.phone}`}
                      className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-extrabold px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs w-full justify-center"
                    >
                      <FaPhoneAlt className="text-[10px]" />
                      <span>Call Advertiser</span>
                    </a>
                    <Link
                      href="/contact"
                      className="bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-gray-100 text-[#073F73] text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors w-full text-center"
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClassifiedsPage() {
  return (
    <PortalLayout
      title="Real Estate Hub & Classifieds"
      subtitle="Connecting Verified Area Realtors, Civil Engineers, Material Suppliers, Architects & Vastu Consultants"
      badge="Classifieds Directory"
    >
      <Suspense fallback={<div className="p-8 text-center text-[#073F73] font-bold">Loading Classifieds...</div>}>
        <ClassifiedsContent />
      </Suspense>
    </PortalLayout>
  );
}
