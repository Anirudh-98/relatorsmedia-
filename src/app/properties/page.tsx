"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBed,
  FaRulerCombined,
  FaCheckCircle,
  FaFilter,
  FaPhoneAlt,
  FaShieldAlt,
  FaDirections,
  FaImages,
  FaSpinner,
  FaBuilding,
  FaPlusCircle,
  FaEye,
} from "react-icons/fa";
import { getProperties, PropertyListingData } from "@/lib/firebase/db";
import { PropertyDetailsModal } from "@/components/properties/PropertyDetailsModal";

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
  images?: string[];
  googleMapUrl?: string;
  verifiedRealtor: string;
  realtorId: string;
  reraNumber?: string;
  postedDate: string;
  raw: PropertyListingData;
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";

  const [query, setQuery] = useState(queryParam);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [allProperties, setAllProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListingData | null>(null);

  useEffect(() => {
    async function fetchLiveProperties() {
      setLoading(true);
      try {
        const live = await getProperties();
        if (live && live.length > 0) {
          const transformed: PropertyListing[] = live.map((fp) => ({
            id: fp.id || `live_${Math.random()}`,
            title: fp.title,
            type: fp.propertyType || "Property",
            category: (fp.propertyType || "").toLowerCase().replace(/[^a-z0-9]/g, "-"),
            city: fp.city || "India",
            location: fp.address ? `${fp.locality || ""}, ${fp.city || ""}` : (fp.locality ? `${fp.locality}, ${fp.city}` : fp.city || "India"),
            price: fp.price,
            area: fp.area,
            bhk: fp.bhk && !fp.bhk.includes("Plot") ? fp.bhk : undefined,
            image: fp.imageUrl || fp.images?.[0] || "/images/building_watermark.jpg",
            images: fp.images,
            googleMapUrl: fp.googleMapUrl || fp.mapUrl,
            verifiedRealtor: fp.name || "Verified Member",
            realtorId: fp.memberId || "RM-MEMBER",
            reraNumber: fp.reraNumber,
            postedDate: "Verified Member Listing",
            raw: fp,
          }));
          setAllProperties(transformed);
        } else {
          setAllProperties([]);
        }
      } catch (err) {
        console.warn("Could not fetch live properties:", err);
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveProperties();
  }, []);

  useEffect(() => {
    if (queryParam) setQuery(queryParam);
  }, [queryParam]);

  const filtered = allProperties.filter((p) => {
    const matchesQuery =
      query === "" ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase()) ||
      p.city.toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase());

    const matchesCity = selectedCity === "All" || p.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesType =
      selectedType === "All" ||
      p.type.toLowerCase().includes(selectedType.toLowerCase()) ||
      selectedType.toLowerCase().includes(p.type.toLowerCase());
    const matchesCategory =
      categoryParam === "All" ||
      p.category === categoryParam ||
      p.type.toLowerCase().includes(categoryParam.toLowerCase().replace(/-/g, " "));

    return matchesQuery && matchesCity && matchesType && matchesCategory;
  });

  // Extract available unique cities from live listings
  const availableCities = Array.from(new Set(allProperties.map((p) => p.city).filter(Boolean)));

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
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
              {!availableCities.includes("Pune") && <option value="Pune">Pune</option>}
              {!availableCities.includes("Hyderabad") && <option value="Hyderabad">Hyderabad</option>}
              {!availableCities.includes("Bengaluru") && <option value="Bengaluru">Bengaluru</option>}
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
              <option value="Apartments / Flats">Flats / Apartments</option>
              <option value="Open Plots">Open Plots</option>
              <option value="Gated Villa Plots">Gated Villa Plots</option>
              <option value="Luxury Villas">Luxury Villas</option>
              <option value="Independent Houses">Independent Houses</option>
              <option value="Commercial Plots / Offices">Commercial</option>
              <option value="Farm Houses / Agriculture">Farm Houses / Agriculture</option>
              <option value="Industrial / Warehouses">Industrial / Warehouses</option>
            </select>
          </div>

          {(query || selectedCity !== "All" || selectedType !== "All" || categoryParam !== "All") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCity("All");
                setSelectedType("All");
              }}
              className="text-[10.5px] font-bold text-[#E21F2F] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Properties Count */}
      <div className="flex items-center justify-between text-[12px] font-bold text-[#64748B]">
        <span>
          Showing <strong className="text-[#073F73] font-black">{filtered.length}</strong> Real Member Properties
        </span>
        <Link
          href="/dashboard?tab=upload"
          className="text-[#168A3A] font-black hover:underline flex items-center gap-1 text-[11.5px]"
        >
          <FaPlusCircle />
          <span>Upload Property from Member Dashboard →</span>
        </Link>
      </div>

      {/* Realtime Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-16 text-center shadow-2xs flex flex-col items-center justify-center gap-3">
          <FaSpinner className="text-3xl text-[#073F73] animate-spin" />
          <p className="text-sm font-bold text-[#073F73]">Loading real member properties from database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-12 text-center shadow-2xs space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#EEF6FC] text-[#073F73] flex items-center justify-center mx-auto text-2xl border border-[#CBD5E1]">
            <FaBuilding />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#073F73]">
              {allProperties.length === 0
                ? "No Properties Uploaded Yet"
                : "No Properties Match Your Filter"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {allProperties.length === 0
                ? "Properties uploaded by members from their dashboard will appear here in real-time with verified photos and Google Maps navigation."
                : "Try resetting your search query or city / category filters."}
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <Link
              href="/dashboard?tab=upload"
              className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-5 py-2.5 rounded-md transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <FaPlusCircle />
              <span>Upload Property as Member</span>
            </Link>
          </div>
        </div>
      ) : (
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
                  unoptimized
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

                {prop.images && prop.images.length > 1 && (
                  <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FaImages className="text-[8px]" />
                    <span>{prop.images.length} Photos</span>
                  </span>
                )}

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
              <button
                type="button"
                onClick={() => setSelectedProperty(prop.raw)}
                className="flex-1 bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-black py-2 rounded-md uppercase tracking-wider text-center transition-colors shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <FaEye className="text-xs" />
                <span>View Details</span>
              </button>
              {prop.googleMapUrl && (
                <a
                  href={
                    prop.googleMapUrl.startsWith("http")
                      ? prop.googleMapUrl
                      : `https://${prop.googleMapUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#EEF6FC] hover:bg-[#E0EFFC] text-[#073F73] text-[10.5px] font-black py-2 px-2.5 rounded-md border border-[#A5CEE8] transition-colors flex items-center gap-1 shadow-2xs whitespace-nowrap"
                  title="Navigate with Google Maps"
                >
                  <FaDirections className="text-[#168A3A] text-sm" />
                  <span>Navigate</span>
                </a>
              )}
              <Link
                href={`/contact?prop=${encodeURIComponent(prop.title)}`}
                className="bg-[#F1F5F9] hover:bg-gray-200 text-[#073F73] text-[10.5px] font-bold py-2 px-2.5 rounded-md transition-colors whitespace-nowrap"
                title="Contact Realtor"
              >
                Inquire
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Full Property Details Modal */}
    <PropertyDetailsModal
      property={selectedProperty}
      onClose={() => setSelectedProperty(null)}
    />
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
