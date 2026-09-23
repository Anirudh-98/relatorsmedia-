"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaBullhorn, FaTv, FaDesktop, FaEnvelopeOpenText, FaAward, FaCheckCircle, FaDownload } from "react-icons/fa";

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    packageChoice: "Corporate Builder Package",
    budget: "₹ 50,000 - 1 Lakh",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PortalLayout
      title="Advertise With Realtors Media"
      subtitle="Promote Your Townships, Open Plots, Brokerage or Building Materials to 100,000+ Active Real Estate Stakeholders"
      badge="Media Kit 2026"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#7C3AED] via-[#6637A8] to-[#073F73] text-white rounded-xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[#F7C900] text-[11px] font-black uppercase tracking-widest block mb-1">
              High Impact Omnichannel Reach
            </span>
            <h2 className="text-[22px] sm:text-[28px] font-black mb-2">
              Accelerate Inquiries & Property Closures
            </h2>
            <p className="text-[13px] text-purple-100 leading-relaxed">
              Combine prime portal display advertising, real-time push broadcasts, 24x7 TV interviews, and ground expo sponsorships to generate verified buyer footfalls.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert("Downloading Realtors Media 2026 Media Kit & Rate Card (PDF)...")}
            className="bg-[#F7C900] hover:bg-yellow-400 text-[#073F73] text-[12px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm flex-shrink-0 cursor-pointer"
          >
            <FaDownload />
            <span>Download Media Kit</span>
          </button>
        </div>

        {/* 4 Advertising Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#F1E7FA] text-[#6637A8] flex items-center justify-center text-[20px] mb-3">
              <FaTv />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">TV Studio Broadcasts</h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              15-minute dedicated project walkthroughs, developer executive interviews, and prime-time ticker scrolls on Realtors Media TV.
            </p>
          </div>

          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEF6FC] text-[#0B4F8A] flex items-center justify-center text-[20px] mb-3">
              <FaDesktop />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">Portal Display Banners</h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              High-visibility Top Leaderboard banners, sidebar quick-cards, and featured pinned placements on category result pages.
            </p>
          </div>

          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#E7F6EA] text-[#168A3A] flex items-center justify-center text-[20px] mb-3">
              <FaEnvelopeOpenText />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">Direct Push Broadcast</h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Targeted WhatsApp & Email newsletters sent directly to 10,000+ verified channel partners and registered HNI investors.
            </p>
          </div>

          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#FFF4B8] text-[#D97706] flex items-center justify-center text-[20px] mb-3">
              <FaAward />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">Expo Sponsorships</h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Title and Co-sponsor privileges at our physical Property Conclaves, Real Estate Awards, and Regional Realtor Conventions.
            </p>
          </div>
        </div>

        {/* Pricing Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full inline-block mb-2">
                Fast Growth
              </span>
              <h3 className="text-[18px] font-black text-[#073F73]">Digital Launch Pack</h3>
              <div className="text-[22px] font-black text-[#E21F2F] my-2">₹ 25,000 <span className="text-[12px] font-normal text-gray-500">/ month</span></div>
              <ul className="space-y-1.5 text-[12px] font-semibold text-[#334155]">
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#168A3A]" /> 2 Featured Category Ads</li>
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#168A3A]" /> 1 Ticker Ad on Homepage</li>
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#168A3A]" /> 50 Guaranteed Buyer Leads</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#EEF6FC] border-2 border-[#0B4F8A] rounded-xl p-5 shadow-md flex flex-col justify-between relative">
            <div className="absolute top-3 right-3 bg-[#E21F2F] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
              Most Popular
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#0B4F8A] bg-white px-2 py-0.5 rounded-full inline-block mb-2">
                Developer Choice
              </span>
              <h3 className="text-[18px] font-black text-[#073F73]">Corporate Builder Pack</h3>
              <div className="text-[22px] font-black text-[#073F73] my-2">₹ 75,000 <span className="text-[12px] font-normal text-gray-500">/ month</span></div>
              <ul className="space-y-1.5 text-[12px] font-semibold text-[#1E293B]">
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#0B4F8A]" /> 1 Studio Interview on Realtors Media TV</li>
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#0B4F8A]" /> Homepage Featured Media Hero Slot</li>
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#0B4F8A]" /> WhatsApp Push to 5,000 Verified Realtors</li>
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#0B4F8A]" /> 250+ Filtered Site-Visit Leads</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#6637A8] bg-[#F1E7FA] px-2 py-0.5 rounded-full inline-block mb-2">
                Total Dominance
              </span>
              <h3 className="text-[18px] font-black text-[#073F73]">National Media Partner</h3>
              <div className="text-[22px] font-black text-[#6637A8] my-2">₹ 1,75,000 <span className="text-[12px] font-normal text-gray-500">/ quarter</span></div>
              <ul className="space-y-1.5 text-[12px] font-semibold text-[#334155]">
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#6637A8]" /> 4 Multi-Camera Studio Episodes</li>
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#6637A8]" /> Prime Expo Stall & Co-Sponsorship</li>
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#6637A8]" /> Dedicated Channel Partner Meetup</li>
                <li className="flex items-center gap-1.5"><FaCheckCircle className="text-[#6637A8]" /> Unlimited Verified Project Inquiries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-6 sm:p-8 shadow-2xs">
          <h3 className="text-[18px] font-black text-[#073F73] mb-2 uppercase">
            Request an Advertising Proposal
          </h3>
          <p className="text-[12.5px] text-[#475569] mb-5">
            Fill in your campaign parameters. Our Media Sales Strategist will contact you with customized slot availability.
          </p>

          {submitted ? (
            <div className="bg-[#E7F6EA] border border-[#A3D9B1] p-6 rounded-lg text-center">
              <FaCheckCircle className="text-[#168A3A] text-[32px] mx-auto mb-2" />
              <h4 className="text-[16px] font-black text-[#168A3A]">
                Advertising Request Received!
              </h4>
              <p className="text-[12.5px] text-[#2D3748] mt-1">
                Thank you, {formData.contactPerson} ({formData.companyName}). Our Media Sales Director will reach out at {formData.phone} with the official rate card and sample broadcast slots.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Company / Developer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Apex Realty Developers"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Meera Saxena (Marketing Head)"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Phone Number *
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
                  placeholder="e.g. marketing@developer.com"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Target Package *
                </label>
                <select
                  value={formData.packageChoice}
                  onChange={(e) => setFormData({ ...formData, packageChoice: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                >
                  <option>Digital Launch Pack (₹ 25,000)</option>
                  <option>Corporate Builder Pack (₹ 75,000)</option>
                  <option>National Media Partner (₹ 1,75,000)</option>
                  <option>Custom TV Studio Broadcast</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] font-black py-2 rounded-md uppercase tracking-wider transition-colors shadow-2xs"
                >
                  Request Proposal →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
