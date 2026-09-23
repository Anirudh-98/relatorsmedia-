"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaPlusSquare, FaCheckCircle, FaUpload, FaShieldAlt, FaRupeeSign, FaHome } from "react-icons/fa";

export default function PostPropertyPage() {
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Open Plots",
    listingType: "For Sale",
    city: "Pune",
    locality: "",
    price: "",
    area: "",
    bhk: "N/A",
    reraNumber: "",
    name: "",
    phone: "",
    email: "",
    role: "Owner",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PortalLayout
      title="Post Free Property"
      subtitle="Reach Over 50,000+ Genuine Buyers & Verified Realtors Across India Without Any Brokerage"
      badge="100% Free Listing"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-[#168A3A] text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-yellow-200 text-[11px] font-black uppercase tracking-widest block mb-1">
              Zero Commission • Direct Leads
            </span>
            <h2 className="text-[20px] sm:text-[24px] font-black">
              Sell or Rent Your Property Fast on Realtors Media
            </h2>
            <p className="text-[12.5px] text-green-100 mt-1 max-w-xl">
              Post residential plots, flats, luxury villas, or commercial properties in under 2 minutes. Verified realtors in your area will also assist in closing genuine buyers.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-bold bg-white/10 px-4 py-2 rounded-lg border border-white/20 whitespace-nowrap">
            <FaCheckCircle className="text-yellow-300" />
            <span>Instant Portal Activation</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-6 sm:p-8 shadow-2xs">
          {submitted ? (
            <div className="bg-[#E7F6EA] border border-[#A3D9B1] p-8 rounded-xl text-center space-y-3">
              <FaCheckCircle className="text-[#168A3A] text-[40px] mx-auto" />
              <h3 className="text-[20px] font-black text-[#168A3A]">
                Property Successfully Published!
              </h3>
              <p className="text-[13px] text-[#2D3748] max-w-lg mx-auto leading-relaxed">
                Your listing &ldquo;<strong className="text-[#073F73]">{formData.title}</strong>&rdquo; has been registered under reference ID:{" "}
                <span className="font-mono font-black text-[#073F73]">
                  PROP-2026-{Math.floor(10000 + Math.random() * 90000)}
                </span>
                . It will appear live across the Real Estate Hub and Classifieds within 15 minutes.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <Link
                  href="/properties"
                  className="bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] font-bold px-4 py-2 rounded-md transition-colors"
                >
                  View in Marketplace
                </Link>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="bg-white border border-[#CBD5E1] text-[#073F73] text-[12px] font-bold px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Post Another Property
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-[14px] font-black uppercase text-[#073F73] pb-1.5 border-b border-[#E2E8F0] mb-3">
                  1. Basic Property Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Listing Purpose *
                    </label>
                    <select
                      value={formData.listingType}
                      onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>For Sale</option>
                      <option>For Rent / Lease</option>
                      <option>Joint Venture (JV)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Property Category *
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>Open Plots</option>
                      <option>Gated Community Plots</option>
                      <option>Apartments / Flats</option>
                      <option>Duplex Houses</option>
                      <option>Villas</option>
                      <option>Independent Houses</option>
                      <option>Farm Houses</option>
                      <option>Commercial Plots</option>
                      <option>Industrial Properties</option>
                      <option>Agriculture Lands</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Configuration / BHK
                    </label>
                    <select
                      value={formData.bhk}
                      onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>N/A (Plot / Land)</option>
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4 BHK</option>
                      <option>5+ BHK / Penthouse</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Property Title / Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. East Facing 200 Sq.Yd RERA Villa Plot near Shadnagar Highway"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-2 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                  />
                </div>
              </div>

              {/* Section 2: Location & Pricing */}
              <div>
                <h3 className="text-[14px] font-black uppercase text-[#073F73] pb-1.5 border-b border-[#E2E8F0] mb-3">
                  2. Location & Pricing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pune, Hyderabad, Bengaluru"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Locality / Area Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.locality}
                      onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      placeholder="e.g. Hinjawadi Phase 1 / Gachibowli"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Expected Price (₹) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. ₹ 45 Lakhs or ₹ 1.25 Cr"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Plot Area / Carpet Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. 1500 Sq.Ft. or 200 Sq.Yds."
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      RERA Registration No. (If applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.reraNumber}
                      onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                      placeholder="e.g. P52100034567"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Contact Details */}
              <div>
                <h3 className="text-[14px] font-black uppercase text-[#073F73] pb-1.5 border-b border-[#E2E8F0] mb-3">
                  3. Advertiser & Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      I am the *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>Owner / Landlord</option>
                      <option>Certified Realtor / Agent</option>
                      <option>Builder / Developer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kadam"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Property Description & Key Amenities
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mention road width, water/electricity connection, facing direction, nearby landmarks, or negotiation details..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#168A3A] hover:bg-[#116e2e] text-white text-[13px] font-black py-3 rounded-md uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Publish Free Property Listing Now →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
