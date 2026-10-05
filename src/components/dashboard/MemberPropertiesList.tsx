"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBuilding,
  FaHome,
  FaMapMarkerAlt,
  FaDirections,
  FaExternalLinkAlt,
  FaTrash,
  FaPlusCircle,
  FaSpinner,
  FaCheckCircle,
  FaRulerCombined,
  FaRupeeSign,
  FaBed,
  FaShieldAlt,
  FaEye,
  FaImages,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { PropertyListingData, getMemberListings, deletePropertyListing, updatePropertyListing } from "@/lib/firebase/db";
import { useAuth } from "@/context/AuthContext";

interface MemberPropertiesListProps {
  onUploadClick?: () => void;
}

export const MemberPropertiesList: React.FC<MemberPropertiesListProps> = ({ onUploadClick }) => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<PropertyListingData | null>(null);

  const loadProperties = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const items = await getMemberListings(user.uid);
      setProperties(items);
    } catch (err) {
      console.error("Error loading member properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user?.uid]);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setDeletingId(id);
    try {
      await deletePropertyListing(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Failed to delete property. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "Active" | "Under Offer" | "Sold") => {
    setUpdatingId(id);
    try {
      await updatePropertyListing(id, { status: newStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Error updating property status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(search.toLowerCase()) ||
      prop.locality.toLowerCase().includes(search.toLowerCase()) ||
      prop.city.toLowerCase().includes(search.toLowerCase()) ||
      prop.propertyType.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = selectedFilter === "All" || prop.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getCleanMapUrl = (url?: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  return (
    <div className="space-y-5">
      {/* Top Bar with Search & Action */}
      <div className="bg-white rounded-[6px] border border-[#C9D7E3] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">
              <FaSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search my properties..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#073F73]"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-500 font-bold hidden md:inline">Status:</span>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded bg-[#F8FAFC] text-[#073F73] font-bold focus:outline-none"
            >
              <option value="All">All Status ({properties.length})</option>
              <option value="Active">Active</option>
              <option value="Under Offer">Under Offer</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={onUploadClick}
          className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-4 py-2 rounded-[3px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
        >
          <FaPlusCircle />
          <span>Upload New Property</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-[6px] border border-[#C9D7E3] p-12 text-center shadow-xs flex flex-col items-center justify-center gap-3">
          <FaSpinner className="text-3xl text-[#073F73] animate-spin" />
          <p className="text-xs font-bold text-[#073F73]">Loading your uploaded properties from database...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-[6px] border border-[#C9D7E3] p-10 text-center shadow-xs space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#EEF6FC] text-[#073F73] flex items-center justify-center mx-auto text-2xl border border-[#CBD5E1]">
            <FaBuilding />
          </div>
          <div>
            <h3 className="text-base font-black text-[#073F73]">
              {properties.length === 0 ? "No Properties Uploaded Yet" : "No Matching Properties Found"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {properties.length === 0
                ? "Start listing your open plots, flats, villas, and commercial spaces with Google Maps navigation links."
                : "Try adjusting your search keywords or status filter."}
            </p>
          </div>
          {properties.length === 0 ? (
            <button
              type="button"
              onClick={onUploadClick}
              className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-5 py-2.5 rounded-[3px] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <FaPlusCircle />
              <span>Upload Your First Property</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedFilter("All");
              }}
              className="text-xs text-[#073F73] font-bold underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((prop) => {
            const mapLink = getCleanMapUrl(prop.googleMapUrl || prop.mapUrl);
            const imageCount = prop.images?.length || (prop.imageUrl ? 1 : 0);
            const coverImage = prop.imageUrl || prop.images?.[0] || "/images/building_watermark.jpg";

            return (
              <div
                key={prop.id}
                className="bg-white border border-[#CBD5E1] rounded-[6px] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative w-full aspect-16/10 bg-gray-900 overflow-hidden">
                    <img
                      src={coverImage}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="bg-[#073F73] text-white text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {prop.propertyType}
                      </span>
                      {prop.bhk && prop.bhk !== "N/A (Plot / Land)" && (
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full">
                          {prop.bhk}
                        </span>
                      )}
                    </div>

                    {imageCount > 1 && (
                      <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FaImages className="text-[8px]" />
                        <span>{imageCount} Photos</span>
                      </span>
                    )}

                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-[#073F73] text-[13px] font-black px-2.5 py-0.5 rounded shadow-xs">
                      {prop.price}
                    </div>

                    <div className="absolute bottom-2 right-2">
                      <span
                        className={`text-[9.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs ${
                          prop.status === "Sold"
                            ? "bg-gray-800 text-white"
                            : prop.status === "Under Offer"
                            ? "bg-amber-500 text-white"
                            : "bg-[#168A3A] text-white"
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center gap-1 text-[10.5px] font-bold text-gray-500">
                      <FaMapMarkerAlt className="text-[#E21F2F] shrink-0" />
                      <span className="truncate">
                        {prop.locality}, {prop.city}
                      </span>
                    </div>

                    <h4 className="text-[13.5px] font-black text-[#073F73] leading-snug line-clamp-2">
                      {prop.title}
                    </h4>

                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2 text-[11px] flex items-center justify-between font-bold text-gray-700">
                      <div className="flex items-center gap-1">
                        <FaRulerCombined className="text-[#0B4F8A]" />
                        <span>{prop.area}</span>
                      </div>
                      {prop.reraNumber && (
                        <div className="text-[10px] text-[#168A3A] flex items-center gap-1">
                          <FaShieldAlt /> RERA: {prop.reraNumber}
                        </div>
                      )}
                    </div>

                    {/* GOOGLE MAPS NAVIGATION HIGHLIGHT BUTTON */}
                    {mapLink ? (
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#EEF6FC] hover:bg-[#E0EFFC] text-[#073F73] border border-[#A5CEE8] py-2 px-3 rounded text-xs font-black flex items-center justify-center gap-2 transition-colors group cursor-pointer shadow-2xs"
                        title="Click to navigate with Google Maps"
                      >
                        <FaDirections className="text-sm text-[#168A3A] group-hover:scale-110 transition-transform" />
                        <span>Navigate via Google Maps ↗</span>
                      </a>
                    ) : (
                      <div className="text-[10.5px] text-gray-400 italic text-center py-1 bg-gray-50 rounded">
                        No Google Map navigation link added
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls: Status & Delete */}
                <div className="p-3 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-semibold">Status:</span>
                    <select
                      value={prop.status}
                      disabled={updatingId === prop.id}
                      onChange={(e) =>
                        handleStatusChange(
                          prop.id!,
                          e.target.value as "Active" | "Under Offer" | "Sold"
                        )
                      }
                      className="text-[10.5px] font-bold text-[#073F73] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Under Offer">Under Offer</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPropertyDetails(prop)}
                      className="p-1.5 text-gray-500 hover:text-[#073F73] hover:bg-gray-100 rounded transition-colors"
                      title="Quick View Details"
                    >
                      <FaEye className="text-xs" />
                    </button>

                    {deleteConfirmId === prop.id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded border border-red-200">
                        <button
                          type="button"
                          onClick={() => handleDelete(prop.id)}
                          disabled={deletingId === prop.id}
                          className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          {deletingId === prop.id ? "..." : "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-gray-500 text-[10px] px-1 hover:text-gray-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(prop.id || null)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Delete Property"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Details Modal */}
      {selectedPropertyDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-[6px] border border-[#CBD5E1] max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-black text-[#073F73] uppercase">
                Property Overview
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPropertyDetails(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-900 text-sm">
                {selectedPropertyDetails.title}
              </h4>
              <p className="text-gray-500">
                {selectedPropertyDetails.address || selectedPropertyDetails.locality},{" "}
                {selectedPropertyDetails.city}
              </p>

              <div className="grid grid-cols-2 gap-2 bg-[#F8FAFC] p-3 rounded border border-gray-200">
                <div>
                  <span className="text-gray-400 block text-[10px]">Price:</span>
                  <strong className="text-[#073F73]">{selectedPropertyDetails.price}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Total Area:</span>
                  <strong>{selectedPropertyDetails.area}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Category:</span>
                  <strong>{selectedPropertyDetails.propertyType}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Purpose:</span>
                  <strong>{selectedPropertyDetails.listingType}</strong>
                </div>
              </div>

              {selectedPropertyDetails.description && (
                <div>
                  <span className="text-gray-400 block text-[10px]">Description:</span>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedPropertyDetails.description}
                  </p>
                </div>
              )}

              {selectedPropertyDetails.amenities && selectedPropertyDetails.amenities.length > 0 && (
                <div>
                  <span className="text-gray-400 block text-[10px] mb-1">Amenities:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedPropertyDetails.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200"
                      >
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {getCleanMapUrl(selectedPropertyDetails.googleMapUrl || selectedPropertyDetails.mapUrl) && (
                <div className="pt-2">
                  <a
                    href={getCleanMapUrl(
                      selectedPropertyDetails.googleMapUrl || selectedPropertyDetails.mapUrl
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#168A3A] hover:bg-[#126f2f] text-white py-2 px-3 rounded text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FaDirections />
                    <span>Open in Google Maps Navigation ↗</span>
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 text-right">
              <button
                type="button"
                onClick={() => setSelectedPropertyDetails(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-1.5 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
