"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaSearch, FaMapMarkerAlt, FaBed, FaRulerCombined, FaCheckCircle, FaFilter, FaPhoneAlt, FaShieldAlt } from "react-icons/fa";

interface PropertyListing {
  id: string;
  title: string;
  type: string;
  category: string;
  city: string;
  location: string;
  price: string;
  area: string;
  bhk?: string;
  image: string;
  verifiedRealtor: string;
  realtorId: string;
  reraNumber?: string;
  postedDate: string;
}

const mockProperties: PropertyListing[] = [
  {
    id: "prop1",
    title: "East-Facing 200 Sq.Yd RERA Villa Plot in Gated County",
    type: "Plot / Land",
    category: "open-plots",
    city: "Hyderabad",
    location: "Shadnagar Highway Corridor",
    price: "₹ 26.5 Lakhs",
    area: "1800 Sq.Ft.",
    image: "/images/building_watermark.jpg",
    verifiedRealtor: "Ramnath Kumar",
    realtorId: "RMD-GRN-014",
    reraNumber: "P02400033445",
    postedDate: "Yesterday",
  },
  {
    id: "prop2",
    title: "Premium 3 BHK High-Rise Flat with Panoramic Balcony",
    type: "Apartment",
    category: "apartments",
    city: "Pune",
    location: "Baner Highway Junction, Pune",
    price: "₹ 1.15 Cr",
    area: "1480 Sq.Ft.",
    bhk: "3 BHK",
    image: "/images/studio_broadcast.jpg",
    verifiedRealtor: "Rohan Deshmukh",
    realtorId: "RMD-BLU-001",
    reraNumber: "P52100045678",
    postedDate: "2 days ago",
  },
  {
    id: "prop3",
    title: "Luxury 4 BHK Independent Triplex Villa with Private Garden",
    type: "Villa",
    category: "villas",
    city: "Hyderabad",
    location: "Mokila / Financial District West",
    price: "₹ 2.85 Cr",
    area: "3400 Sq.Ft.",
    bhk: "4 BHK",
    image: "/images/studio_broadcast.jpg",
    verifiedRealtor: "K. Naveen Reddy",
    realtorId: "RMD-RED-009",
    reraNumber: "P02500099887",
    postedDate: "3 days ago",
  },
  {
    id: "prop4",
    title: "Grade-A Furnished Corporate IT Office Floor",
    type: "Commercial",
    category: "commercial",
    city: "Bengaluru",
    location: "Outer Ring Road, Marathahalli",
    price: "₹ 3.40 Cr",
    area: "2800 Sq.Ft.",
    image: "/images/building_watermark.jpg",
    verifiedRealtor: "S. Priya Sharma",
    realtorId: "RMD-BLU-089",
    postedDate: "Just now",
  },
  {
    id: "prop5",
    title: "1-Acre Managed Teakwood & Mango Organic Farm Plot",
    type: "Farm House",
    category: "farm-houses",
    city: "Pune",
    location: "Kamshet Valley, Pune-Lonavala",
    price: "₹ 52 Lakhs",
    area: "43,560 Sq.Ft.",
    image: "/images/building_watermark.jpg",
    verifiedRealtor: "Suresh Baburao Shinde",
    realtorId: "RMD-GRN-042",
    postedDate: "4 days ago",
  },
  {
    id: "prop6",
    title: "Ready-to-Move 2 BHK Sunlit Flat with Modular Kitchen",
    type: "Apartment",
    category: "apartments",
    city: "Pune",
    location: "Wakad, Pune West",
    price: "₹ 72 Lakhs",
    area: "980 Sq.Ft.",
    bhk: "2 BHK",
    image: "/images/studio_broadcast.jpg",
    verifiedRealtor: "Rohan Deshmukh",
    realtorId: "RMD-BLU-001",
    reraNumber: "P52100088990",
    postedDate: "5 days ago",
  },
];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";

  const [query, setQuery] = useState(queryParam);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    if (queryParam) setQuery(queryParam);
  }, [queryParam]);

  const filtered = mockProperties.filter((p) => {
    const matchesQuery =
      query === "" ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase()) ||
      p.city.toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase());

    const matchesCity = selectedCity === "All" || p.city === selectedCity;
    const matchesType = selectedType === "All" || p.type === selectedType;
    const matchesCategory = categoryParam === "All" || p.category === categoryParam;

    return matchesQuery && matchesCity && matchesType && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Top Bar */}
      <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96 flex items-center">
          <span className="absolute left-3 text-gray-400 text-[13px]">
            <FaSearch />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by locality, project name, or property type..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[12px] focus:outline-hidden focus:border-[#073F73]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
            <FaFilter className="text-[#0B4F8A]" />
            <span>City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2 py-1 text-[11px] font-bold text-[#073F73]"
            >
              <option value="All">All Cities</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
            <span>Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2 py-1 text-[11px] font-bold text-[#073F73]"
            >
              <option value="All">All Types</option>
              <option value="Plot / Land">Plots & Land</option>
              <option value="Apartment">Flats / Apartments</option>
              <option value="Villa">Luxury Villas</option>
              <option value="Commercial">Commercial</option>
              <option value="Farm House">Farm Houses</option>
            </select>
          </div>

          {(query || selectedCity !== "All" || selectedType !== "All") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCity("All");
                setSelectedType("All");
              }}
              className="text-[10.5px] font-bold text-[#E21F2F] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Properties Count */}
      <div className="flex items-center justify-between text-[12px] font-bold text-[#64748B]">
        <span>
          Showing <strong className="text-[#073F73] font-black">{filtered.length}</strong> Verified Properties
        </span>
        <Link
          href="/post-property"
          className="text-[#E21F2F] hover:underline flex items-center gap-1 text-[11.5px]"
        >
          <span>Have a property to sell or rent? Post it for Free →</span>
        </Link>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prop) => (
          <div
            key={prop.id}
            className="bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
          >
            <div>
              <div className="relative w-full aspect-16/10 bg-gray-900 overflow-hidden">
                <Image
                  src={prop.image}
                  alt={prop.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-[#073F73] text-white text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {prop.type}
                  </span>
                  {prop.bhk && (
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full">
                      {prop.bhk}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#073F73] text-[14px] font-black px-2.5 py-0.5 rounded-md shadow-xs">
                  {prop.price}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-[#64748B] mb-1">
                  <FaMapMarkerAlt className="text-[#0B4F8A]" />
                  <span>{prop.location}</span>
                </div>

                <h3 className="text-[15px] font-black text-[#073F73] leading-snug mb-2 line-clamp-2">
                  {prop.title}
                </h3>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-2 text-[11px] mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 font-bold text-[#1E293B]">
                    <FaRulerCombined className="text-[#0B4F8A]" />
                    <span>{prop.area}</span>
                  </div>
                  {prop.reraNumber && (
                    <div className="text-[10px] text-[#168A3A] font-bold flex items-center gap-1">
                      <FaShieldAlt /> RERA Verified
                    </div>
                  )}
                </div>

                {/* Verified Realtor Info */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[9.5px]">Listed By Verified Realtor</span>
                    <span className="font-extrabold text-[#0C1E36]">{prop.verifiedRealtor}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0B4F8A] bg-[#EEF6FC] px-1.5 py-0.5 rounded-xs">
                    {prop.realtorId}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 flex items-center gap-2">
              <Link
                href={`/contact?prop=${encodeURIComponent(prop.title)}`}
                className="flex-1 bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-black py-2 rounded-md uppercase tracking-wider text-center transition-colors shadow-2xs"
              >
                Contact Realtor
              </Link>
              <Link
                href={`/verify/${prop.realtorId}`}
                className="bg-[#F1F5F9] hover:bg-gray-200 text-[#073F73] text-[10.5px] font-bold py-2 px-2.5 rounded-md transition-colors"
                title="Verify Realtor ID"
              >
                ID Check
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <PortalLayout
      title="Verified Properties Marketplace"
      subtitle="Search RERA-Approved Plots, Villas, Apartments, Commercial Buildings & Agricultural Lands"
      badge="5,000+ Listings"
      action={
        <Link
          href="/post-property"
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-2xs"
        >
          Post Free Property
        </Link>
      }
    >
      <Suspense fallback={<div className="p-8 text-center text-[#073F73] font-bold">Loading Properties...</div>}>
        <PropertiesContent />
      </Suspense>
    </PortalLayout>
  );
}
