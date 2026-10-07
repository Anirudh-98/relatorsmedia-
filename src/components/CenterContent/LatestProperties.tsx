"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getProperties, PropertyListingData } from "@/lib/firebase/db";
import { PropertyDetailsModal } from "@/components/properties/PropertyDetailsModal";

const MAX_LISTINGS = 8;

/** Newest posted properties, shown on the home page once at least one listing exists. */
export const LatestProperties: React.FC = () => {
  const [listings, setListings] = useState<PropertyListingData[]>([]);
  const [selected, setSelected] = useState<PropertyListingData | null>(null);

  useEffect(() => {
    getProperties()
      .then((all) => setListings(all.filter((p) => p.status !== "Sold").slice(0, MAX_LISTINGS)))
      .catch((err) => console.warn("Could not load latest properties:", err));
  }, []);

  if (listings.length === 0) return null;

  return (
    <section className="w-full my-0.5 sm:my-1 flex-shrink-0" aria-label="Latest Properties">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[12.5px] sm:text-[13px] font-black uppercase tracking-wide text-[#073F73]">
          LATEST PROPERTIES
        </h3>
        <Link
          href="/properties"
          className="bg-[#0B4F8A] hover:bg-[#073F73] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer"
        >
          View All
        </Link>
      </div>

      {/* Horizontal strip of listing cards */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {listings.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item)}
            className="w-[150px] sm:w-[165px] flex-shrink-0 bg-white rounded-[4px] border border-[#C9D7E3] shadow-2xs hover:border-[#0B4F8A] hover:shadow-xs transition-all text-left overflow-hidden cursor-pointer"
          >
            <div className="relative w-full h-[76px] bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl || item.images?.[0] || "/images/building_watermark.jpg"}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 bg-[#168A3A] text-white text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-[2px]">
                {item.listingType || "For Sale"}
              </span>
            </div>
            <div className="px-1.5 py-1 space-y-0.5">
              <div className="text-[11.5px] font-black text-[#073F73] truncate">{item.price}</div>
              <div className="text-[10.5px] font-bold text-[#143B5D] truncate">{item.title}</div>
              <div className="text-[9.5px] text-gray-500 flex items-center gap-1 min-w-0">
                <FaMapMarkerAlt className="text-[8px] flex-shrink-0" />
                <span className="truncate">
                  {item.locality ? `${item.locality}, ` : ""}
                  {item.city}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <PropertyDetailsModal property={selected} isOpen={true} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};
