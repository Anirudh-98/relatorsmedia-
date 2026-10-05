"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaDirections,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaCheckCircle,
  FaRulerCombined,
  FaBed,
  FaBath,
  FaCompass,
  FaCouch,
  FaShieldAlt,
  FaBuilding,
  FaUserCheck,
  FaImages,
  FaChevronLeft,
  FaChevronRight,
  FaShareAlt,
} from "react-icons/fa";
import { PropertyListingData } from "@/lib/firebase/db";

export interface PropertyDetailsModalProps {
  property: PropertyListingData | null;
  onClose: () => void;
  isOpen?: boolean;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  isOpen = true,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Reset active photo when property changes
  useEffect(() => {
    setActivePhotoIdx(0);
    setCopiedLink(false);
  }, [property]);

  if (!property || !isOpen) return null;

  // Compile photo gallery
  const photos: string[] = [];
  if (Array.isArray(property.images) && property.images.length > 0) {
    property.images.forEach((img) => {
      if (img && typeof img === "string" && !photos.includes(img)) photos.push(img);
    });
  }
  if (property.imageUrl && !photos.includes(property.imageUrl)) {
    photos.unshift(property.imageUrl);
  }
  if (photos.length === 0) {
    photos.push("/images/building_watermark.jpg");
  }

  // Google Map link formatter
  const rawMapUrl = property.googleMapUrl || property.mapUrl || "";
  const mapLink = rawMapUrl
    ? /^https?:\/\//i.test(rawMapUrl.trim())
      ? rawMapUrl.trim()
      : `https://${rawMapUrl.trim()}`
    : "";

  // Clean phone number for tel: and WhatsApp
  const rawPhone = property.phone || "";
  const cleanPhoneDigits = rawPhone.replace(/[^0-9]/g, "");
  const whatsappNumber = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out ${property.title} on Realtors Media`,
          url,
        });
      } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#073F73] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#06345F] shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="bg-[#168A3A] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
              {property.status || "Active"}
            </span>
            <span className="bg-white/15 text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full truncate">
              {property.propertyType || "Property Listing"}
            </span>
            {property.listingType && (
              <span className="hidden sm:inline-block bg-white/10 text-blue-100 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {property.listingType}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="Share listing"
            >
              <FaShareAlt />
              <span className="hidden sm:inline text-[11px] font-bold">
                {copiedLink ? "Link Copied!" : "Share"}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-md transition-colors text-base cursor-pointer"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="space-y-1">
              <h2
                id="property-modal-title"
                className="text-[18px] sm:text-[22px] font-black text-[#073F73] leading-tight"
              >
                {property.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-bold">
                <FaMapMarkerAlt className="text-[#E21F2F] shrink-0" />
                <span>
                  {property.address
                    ? `${property.address}, ${property.locality || ""}, ${property.city}`
                    : property.locality
                    ? `${property.locality}, ${property.city}`
                    : property.city}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0 bg-[#EEF6FC] sm:bg-transparent p-2.5 sm:p-0 rounded-lg">
              <div className="text-[20px] sm:text-[24px] font-black text-[#168A3A] leading-none">
                {property.price}
              </div>
              <span className="text-[11px] text-gray-500 font-bold block mt-0.5">
                {property.area} • {property.bhk || property.propertyType}
              </span>
            </div>
          </div>

          {/* Photo Gallery Showcase */}
          <div className="space-y-2">
            {/* Hero Photo with Prev/Next buttons */}
            <div className="relative w-full aspect-16/9 sm:aspect-21/9 max-h-[360px] bg-gray-900 rounded-lg overflow-hidden group">
              <img
                src={photos[activePhotoIdx]}
                alt={`${property.title} - photo ${activePhotoIdx + 1}`}
                className="w-full h-full object-cover transition-opacity duration-200"
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-transform active:scale-90 cursor-pointer shadow-md"
                    aria-label="Previous photo"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition-transform active:scale-90 cursor-pointer shadow-md"
                    aria-label="Next photo"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                    <FaImages className="text-[9px]" />
                    <span>
                      Photo {activePhotoIdx + 1} of {photos.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Row */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-16 sm:w-20 h-12 sm:h-14 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === idx
                        ? "border-[#073F73] ring-2 ring-[#073F73]/30 scale-102"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Grid */}
          <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-4 sm:p-5">
            <h3 className="text-[12px] font-black uppercase text-[#073F73] tracking-wider mb-3">
              Property Specifications & Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-gray-400 block text-[10px] font-bold uppercase">Price</span>
                <span className="font-extrabold text-[#168A3A] text-sm">{property.price}</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase">
                  <FaRulerCombined className="text-[#0B4F8A]" />
                  <span>Total Area</span>
                </div>
                <span className="font-extrabold text-[#0C1E36] text-sm">{property.area}</span>
              </div>

              {property.bhk && (
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase">
                    <FaBed className="text-[#0B4F8A]" />
                    <span>Configuration</span>
                  </div>
                  <span className="font-extrabold text-[#0C1E36] text-sm">{property.bhk}</span>
                </div>
              )}

              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase">
                  <FaBuilding className="text-[#0B4F8A]" />
                  <span>Category</span>
                </div>
                <span className="font-extrabold text-[#0C1E36] truncate block">
                  {property.propertyType}
                </span>
              </div>

              {property.facing && (
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase">
                    <FaCompass className="text-[#0B4F8A]" />
                    <span>Facing Direction</span>
                  </div>
                  <span className="font-extrabold text-[#0C1E36]">{property.facing}</span>
                </div>
              )}

              {property.furnishing && (
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase">
                    <FaCouch className="text-[#0B4F8A]" />
                    <span>Furnishing</span>
                  </div>
                  <span className="font-extrabold text-[#0C1E36]">{property.furnishing}</span>
                </div>
              )}

              {property.bathrooms && (
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase">
                    <FaBath className="text-[#0B4F8A]" />
                    <span>Bathrooms</span>
                  </div>
                  <span className="font-extrabold text-[#0C1E36]">{property.bathrooms}</span>
                </div>
              )}

              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-gray-400 block text-[10px] font-bold uppercase">City / Region</span>
                <span className="font-extrabold text-[#0C1E36]">{property.city}</span>
              </div>
            </div>

            {property.reraNumber && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs font-bold text-[#168A3A]">
                <FaShieldAlt className="text-sm shrink-0" />
                <span>RERA Registration Number: <strong className="font-mono text-[#073F73]">{property.reraNumber}</strong> (Government Approved)</span>
              </div>
            )}
          </div>

          {/* Google Maps Direct Navigation Banner */}
          {mapLink ? (
            <div className="bg-gradient-to-r from-[#EEF6FC] to-[#E0EFFC] border-2 border-[#0B4F8A] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#073F73] uppercase tracking-wide">
                  <FaDirections className="text-[#168A3A] text-base" />
                  <span>Direct GPS / Google Maps Navigation Available</span>
                </div>
                <p className="text-[11.5px] text-[#475569]">
                  Get real-time driving directions directly to this property location using your mobile GPS.
                </p>
              </div>

              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-xs shrink-0 cursor-pointer uppercase tracking-wider"
              >
                <FaDirections className="text-sm" />
                <span>Navigate on Google Maps ↗</span>
              </a>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-500 flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400 shrink-0" />
              <span>Location: {property.locality ? `${property.locality}, ${property.city}` : property.city} (Direct map coordinates not provided by realtor)</span>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="space-y-2">
              <h3 className="text-[13px] font-black uppercase text-[#073F73] tracking-wide">
                Detailed Property Description
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-[12.5px] text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </div>
          )}

          {/* Amenities & Features */}
          {Array.isArray(property.amenities) && property.amenities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[13px] font-black uppercase text-[#073F73] tracking-wide">
                Amenities & Community Highlights
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {property.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-md p-2 flex items-center gap-1.5 text-[11px] font-bold text-[#166534]"
                  >
                    <FaCheckCircle className="text-[#16A34A] shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Realtor Contact Card */}
          <div className="bg-gradient-to-br from-[#073F73] to-[#0A4E87] text-white rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-lg font-black text-yellow-300 shrink-0">
                  {property.name ? property.name.charAt(0).toUpperCase() : <FaUserCheck />}
                </div>
                <div>
                  <span className="text-[10px] text-yellow-300 font-extrabold uppercase tracking-widest block">
                    Verified Listing Agent / Owner
                  </span>
                  <h4 className="text-[16px] font-black text-white">{property.name}</h4>
                  {property.agencyName && (
                    <span className="text-[11px] text-blue-100 font-semibold block">
                      {property.agencyName}
                    </span>
                  )}
                </div>
              </div>

              {property.memberId && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-blue-200 block">Realtors Media ID</span>
                  <span className="font-mono text-xs font-black bg-white/20 px-2 py-0.5 rounded-sm">
                    {property.memberId}
                  </span>
                  <Link
                    href={`/verify/${property.memberId}`}
                    className="block text-[10px] text-yellow-300 hover:underline font-bold mt-1"
                  >
                    Verify ID Card Credential →
                  </Link>
                </div>
              )}
            </div>

            {/* Direct Realtor Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {property.phone && (
                <a
                  href={`tel:${property.phone}`}
                  className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-xs"
                >
                  <FaPhoneAlt className="text-xs" />
                  <span>Call {property.phone}</span>
                </a>
              )}

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hello ${property.name}, I am interested in your property: "${property.title}" listed on Realtors Media. Please share further details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-xs"
                >
                  <FaWhatsapp className="text-sm" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}

              {property.email && (
                <a
                  href={`mailto:${property.email}?subject=${encodeURIComponent(
                    `Inquiry regarding ${property.title}`
                  )}`}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg border border-white/20 flex items-center gap-1.5 transition-colors"
                >
                  <FaEnvelope className="text-xs" />
                  <span>Email Realtor</span>
                </a>
              )}

              <Link
                href={`/contact?subject=${encodeURIComponent(property.title)}`}
                className="bg-yellow-400 hover:bg-yellow-300 text-[#073F73] text-xs font-black px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs ml-auto uppercase tracking-wide"
              >
                <span>Send Portal Inquiry</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="bg-[#F8FAFC] border-t border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-500 font-semibold">
            Realtors Media Verified Property Network
          </div>
          <div className="flex items-center gap-2">
            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#EEF6FC] hover:bg-[#E0EFFC] text-[#073F73] text-xs font-black py-1.5 px-3 rounded border border-[#A5CEE8] transition-colors flex items-center gap-1"
              >
                <FaDirections className="text-[#168A3A]" />
                <span>Navigate</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-4 py-1.5 rounded transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
