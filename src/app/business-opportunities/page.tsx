"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaBriefcase, FaHandshake, FaChartLine, FaCheckCircle, FaCity, FaRupeeSign } from "react-icons/fa";

export default function BusinessOpportunitiesPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    model: "City Franchise Partner",
    investmentCapacity: "₹ 10 - 25 Lakhs",
    experience: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PortalLayout
      title="Business Opportunities & Franchises"
      subtitle="Partner with India's Fastest Growing Real Estate Media & Channel Aggregation Network"
      badge="Partnership"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#073F73] via-[#0B4F8A] to-[#0284C7] text-white rounded-xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[#F7C900] text-[11px] font-black uppercase tracking-widest block mb-1">
              Entrepreneurial Growth
            </span>
            <h2 className="text-[22px] sm:text-[28px] font-black mb-2">
              Own a Realtors Media District Chapter or Channel Hub
            </h2>
            <p className="text-[13px] text-[#BAE6FD] leading-relaxed">
              Leverage our national brand reputation, 24x7 broadcast platform, verified smart ID licensing system, and developer inventories to build a highly profitable regional real estate enterprise.
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center min-w-[200px]">
            <div className="text-[11px] font-bold text-[#F7C900] uppercase">ROI Potential</div>
            <div className="text-[22px] font-black text-white mt-0.5">35% - 50%</div>
            <div className="text-[11px] text-[#BAE6FD] mt-0.5">Annual Projected Yield</div>
          </div>
        </div>

        {/* 3 Core Partnership Models */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#EEF6FC] text-[#0B4F8A] flex items-center justify-center text-[22px] mb-3">
                <FaCity />
              </div>
              <h3 className="text-[17px] font-black text-[#073F73] mb-1">
                District Franchise Partner
              </h3>
              <p className="text-[12px] text-[#475569] leading-relaxed mb-3">
                Exclusive operating rights for a dedicated district or municipal corporation. Issue verified ID cards, organize local expos, and manage developer mandates.
              </p>
              <ul className="space-y-1.5 text-[11.5px] font-semibold text-[#1E293B]">
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> Exclusive territorial protection
                </li>
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> 40% share on local member registrations
                </li>
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> Turnkey TV studio interview setup
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-extrabold text-[#0B4F8A]">
              Investment: ₹ 15 - 25 Lakhs
            </div>
          </div>

          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E7F6EA] text-[#168A3A] flex items-center justify-center text-[22px] mb-3">
                <FaHandshake />
              </div>
              <h3 className="text-[17px] font-black text-[#073F73] mb-1">
                Master Channel Partner
              </h3>
              <p className="text-[12px] text-[#475569] leading-relaxed mb-3">
                Designed for established brokerage firms with 10+ agents. Direct developer underwriting, bulk inventory pricing, and marketing fund subsidies.
              </p>
              <ul className="space-y-1.5 text-[11.5px] font-semibold text-[#1E293B]">
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> 50% commission tier payouts
                </li>
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> Red VIP ID cards for entire sales team
                </li>
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> Priority lead distribution engine
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-extrabold text-[#168A3A]">
              Investment: ₹ 5 - 10 Lakhs
            </div>
          </div>

          <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F1E7FA] text-[#6637A8] flex items-center justify-center text-[22px] mb-3">
                <FaChartLine />
              </div>
              <h3 className="text-[17px] font-black text-[#073F73] mb-1">
                Media Lounge & Studio Franchise
              </h3>
              <p className="text-[12px] text-[#475569] leading-relaxed mb-3">
                Setup a physical Realtors Media Broadcast Cafe and Co-working Lounge in prime commercial hubs for broker deal signings and live talks.
              </p>
              <ul className="space-y-1.5 text-[11.5px] font-semibold text-[#1E293B]">
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> Co-working seat revenue
                </li>
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> Podcast and studio recording fees
                </li>
                <li className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-[#168A3A]" /> Corporate sponsorship tie-ins
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-extrabold text-[#6637A8]">
              Investment: ₹ 25 - 40 Lakhs
            </div>
          </div>
        </div>

        {/* Partnership Application Form */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-6 sm:p-8 shadow-2xs">
          <h3 className="text-[18px] font-black text-[#073F73] mb-2 uppercase">
            Apply for Business Partnership
          </h3>
          <p className="text-[12.5px] text-[#475569] mb-5">
            Submit your commercial profile. Our Business Development Director will schedule a one-on-one virtual or in-person briefing.
          </p>

          {submitted ? (
            <div className="bg-[#E7F6EA] border border-[#A3D9B1] p-6 rounded-lg text-center">
              <FaCheckCircle className="text-[#168A3A] text-[32px] mx-auto mb-2" />
              <h4 className="text-[16px] font-black text-[#168A3A]">
                Partnership Application Registered!
              </h4>
              <p className="text-[12.5px] text-[#2D3748] mt-1">
                Thank you, {formData.name}. Our Head of Expansion will review your territory &quot;{formData.city}&quot; and call {formData.phone} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
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
                  Target City / District *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Pune, Nagpur, Hyderabad"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Model of Interest *
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                >
                  <option>District Franchise Partner</option>
                  <option>Master Channel Partner</option>
                  <option>Media Lounge & Studio Franchise</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#334155] mb-1">
                  Investment Capacity *
                </label>
                <select
                  value={formData.investmentCapacity}
                  onChange={(e) => setFormData({ ...formData, investmentCapacity: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                >
                  <option>₹ 5 - 10 Lakhs</option>
                  <option>₹ 10 - 25 Lakhs</option>
                  <option>₹ 25 - 50 Lakhs</option>
                  <option>₹ 50 Lakhs+</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-[#073F73] hover:bg-[#06345F] text-white text-[12px] font-black py-2 rounded-md uppercase tracking-wider transition-colors shadow-2xs"
                >
                  Submit Application →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
