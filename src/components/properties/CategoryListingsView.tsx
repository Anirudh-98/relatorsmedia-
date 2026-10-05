"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaDirections,
  FaImages,
  FaMapMarkerAlt,
  FaBuilding,
  FaPlusSquare,
  FaEye,
  FaShieldAlt,
} from "react-icons/fa";
import { PropertyListingData } from "@/lib/firebase/db";
import { PropertyDetailsModal } from "./PropertyDetailsModal";

interface CategoryListingsViewProps {
  categoryTitle: string;
  categorySlug: string;
  listings: PropertyListingData[];
}

export const CategoryListingsView: React.FC<CategoryListingsViewProps> = ({
  categoryTitle,
  categorySlug,
  listings,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyListingData | null>(null);

  const getCleanMapUrl = (url?: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-black text-[#073F73] uppercase tracking-tight">
          Real Member Listings in {categoryTitle}
        </h3>
        <span className="text-xs font-bold text-gray-500">
          {listings.length} {listings.length === 1 ? "Property" : "Properties"} Found
        </span>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-10 text-center shadow-2xs space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#EEF6FC] text-[#073F73] flex items-center justify-center mx-auto text-2xl border border-[#CBD5E1]">
            <FaBuilding />
          </div>
          <div>
            <h4 className="text-base font-black text-[#073F73]">
              No Verified Properties in {categoryTitle} Yet
            </h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Be the first member to upload a property in this category from your dashboard with direct Google Maps navigation and photos.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard?tab=upload"
              className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-5 py-2.5 rounded-[3px] transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <FaPlusSquare />
              <span>Upload Property as Member</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((item) => {
            const mapLink = getCleanMapUrl(item.googleMapUrl || item.mapUrl);
            const cover = item.imageUrl || item.images?.[0] || "/images/building_watermark.jpg";
            const photosCount = Array.isArray(item.images) && item.images.length > 0 ? item.images.length : (item.imageUrl ? 1 : 0);

            return (
              <div
                key={item.id}
                className="bg-white border border-[#CBD5E1] rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto cursor-pointer flex-1"
                  onClick={() => setSelectedProperty(item)}
                >
                  <div className="w-full sm:w-36 h-28 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                    <img
                      src={cover}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {photosCount > 1 && (
                      <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                        <FaImages className="text-[8px]" />
                        <span>{photosCount}</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-[#E7F6EA] text-[#168A3A] text-[9.5px] font-black px-2 py-0.5 rounded-full border border-[#A3D9B1]">
                        {item.status || "Active"}
                      </span>
                      <span className="text-[#073F73] font-black text-[15px]">
                        {item.price}
                      </span>
                      <span className="text-[11.5px] text-gray-500 font-bold">
                        • {item.area}
                      </span>
                      {item.bhk && (
                        <span className="text-[11px] bg-blue-50 text-[#073F73] font-bold px-1.5 py-0.5 rounded">
                          {item.bhk}
                        </span>
                      )}
                    </div>

                    <h4 className="text-[15px] sm:text-[16px] font-black text-[#073F73] leading-snug hover:text-[#0B4F8A] transition-colors">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[11.5px] text-[#64748B] font-semibold">
                      <FaMapMarkerAlt className="text-[#E21F2F] shrink-0" />
                      <span className="truncate">
                        {item.locality ? `${item.locality}, ${item.city}` : item.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#475569] font-medium pt-0.5">
                      <span>
                        Verified Member: <strong className="text-[#0C1E36]">{item.name}</strong> ({item.memberId || "RM-MEMBER"})
                      </span>
                      {item.reraNumber && (
                        <span className="text-[#168A3A] font-bold flex items-center gap-1">
                          <FaShieldAlt className="text-[10px]" /> RERA
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-stretch gap-2 shrink-0 w-full sm:w-44">
                  {/* VIEW DETAILS BUTTON (User Requested Core Feature) */}
                  <button
                    type="button"
                    onClick={() => setSelectedProperty(item)}
                    className="flex-1 sm:flex-none bg-[#073F73] hover:bg-[#06345F] text-white text-[11.5px] font-black py-2 px-3.5 rounded-md transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <FaEye className="text-xs" />
                    <span>View Details</span>
                  </button>

                  {/* NAVIGATE VIA GOOGLE MAPS */}
                  {mapLink && (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none bg-[#EEF6FC] hover:bg-[#E0EFFC] text-[#073F73] text-[11px] font-black py-1.5 px-3 rounded-md border border-[#A5CEE8] transition-colors flex items-center justify-center gap-1.5 shadow-2xs whitespace-nowrap"
                      title="Navigate to location with Google Maps"
                    >
                      <FaDirections className="text-[#168A3A] text-sm" />
                      <span>Navigate ↗</span>
                    </a>
                  )}

                  {/* CONTACT REALTOR */}
                  <Link
                    href={`/contact?subject=${encodeURIComponent(item.title)}`}
                    className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-[#073F73] text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors border border-gray-300 text-center"
                  >
                    Contact Realtor
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Property Details Modal */}
      <PropertyDetailsModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
};
