"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  FaChartLine,
  FaShieldAlt,
  FaBuilding,
  FaPercent,
  FaCoins,
  FaFileContract,
  FaCheckCircle,
  FaCalculator,
  FaArrowRight,
  FaPhoneAlt,
  FaHandshake,
} from "react-icons/fa";

interface InvestmentDeal {
  id: string;
  title: string;
  location: string;
  category: "Commercial" | "Land Bank" | "Township" | "Warehousing";
  targetYield: string;
  minTicket: string;
  tenure: string;
  status: "Open" | "Filling Fast" | "Under Review";
  reraNo: string;
  description: string;
}

const DEALS: InvestmentDeal[] = [
  {
    id: "deal-1",
    title: "Hyderabad Airport Growth Corridor Tech Park",
    location: "Shamshabad, Hyderabad",
    category: "Commercial",
    targetYield: "9.4% Annual Yield",
    minTicket: "₹ 50 Lakhs",
    tenure: "5-7 Years",
    status: "Filling Fast",
    reraNo: "P02400008892",
    description: "Grade-A pre-leased office floor to multinational IT services tenant with 9-year triple-net lease.",
  },
  {
    id: "deal-2",
    title: "Chakan Phase-III Logistics & Warehousing Hub",
    location: "Pune Industrial Belt, Maharashtra",
    category: "Warehousing",
    targetYield: "10.2% ROI",
    minTicket: "₹ 75 Lakhs",
    tenure: "3-5 Years",
    status: "Open",
    reraNo: "P52100078120",
    description: "E-commerce fulfilment centre land and pre-engineered PEB shed syndication with tier-1 3PL operator.",
  },
  {
    id: "deal-3",
    title: "Regional Highway Mega Township Land Bank",
    location: "Kollur Outer Ring Road, Telangana",
    category: "Land Bank",
    targetYield: "22% Anticipated CAGR",
    minTicket: "₹ 35 Lakhs",
    tenure: "2-4 Years",
    status: "Filling Fast",
    reraNo: "P02400006741",
    description: "HMDA & RERA plotted development syndicate preceding major regional radial road connection.",
  },
  {
    id: "deal-4",
    title: "Bengaluru Peripheral IT Sub-Market Mixed Development",
    location: "Sarjapur-Attibele Road, Bengaluru",
    category: "Township",
    targetYield: "11.5% IRR",
    minTicket: "₹ 1 Crore",
    tenure: "4-6 Years",
    status: "Open",
    reraNo: "PRM/KA/RERA/1251/310/PR/240101",
    description: "Integrated 40-acre gated villa and commercial retail arcade joint development syndicate.",
  },
];

export default function InvestorsPage() {
  // Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(50); // in Lakhs
  const [calcYears, setCalcYears] = useState<number>(5);
  const [calcRate, setCalcRate] = useState<number>(12); // percent

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    budget: "50L - 1Cr",
    preferredAsset: "Commercial Pre-Leased",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Calculated values
  const principal = calcAmount * 100000;
  const estimatedReturn = principal * Math.pow(1 + calcRate / 100, calcYears);
  const estimatedProfit = estimatedReturn - principal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <PortalLayout
      title="INVESTOR HUB & CAPITAL OPPORTUNITIES"
      subtitle="Exclusive high-yield real estate syndications, pre-leased commercial assets, and strategic land banks across India"
      badge="INSTITUTIONAL & HNI SYNDICATE"
      breadcrumbs={[{ label: "Investors" }]}
    >
      <div className="space-y-6">
        {/* Hero Value Proposition */}
        <div className="bg-gradient-to-r from-[#073F73] via-[#0B4F8A] to-[#143B5D] text-white p-5 sm:p-7 rounded-[4px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-[#F7C900] text-[#073F73] text-[10px] font-black px-2 py-0.5 rounded-xs uppercase tracking-wider">
              High Growth Opportunities
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Invest with Confidence in Verified High-Yield Real Estate
            </h2>
            <p className="text-[12.5px] sm:text-[13px] text-gray-200 leading-relaxed">
              Realtors Media connects HNIs, NRIs, and institutional investors directly to vetted builder syndicates, pre-leased corporate offices, and fast-appreciating arterial land corridors with complete legal transparency.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <FaCheckCircle /> 100% RERA & Title Due-Diligence
              </span>
              <span className="flex items-center gap-1.5 text-yellow-300">
                <FaShieldAlt /> Legal Cell Verification
              </span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <FaPercent /> Structured Returns & Yields
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <a
              href="#opportunities"
              className="bg-[#E21F2F] hover:bg-[#c91826] text-white text-[12px] font-black uppercase px-5 py-2.5 rounded-[3px] text-center shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Deals</span>
              <FaArrowRight className="text-[10px]" />
            </a>
            <a
              href="#calculator"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-[12px] font-bold px-5 py-2.5 rounded-[3px] text-center transition-colors flex items-center justify-center gap-2"
            >
              <FaCalculator className="text-[11px]" />
              <span>ROI Estimator</span>
            </a>
          </div>
        </div>

        {/* 4 Pillars of Investment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-[4px] border border-[#C9D7E3] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#073F73] flex items-center justify-center flex-shrink-0 text-lg">
              <FaBuilding />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#073F73]">Pre-Leased Commercial</h3>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Instant rental cash flow from Day 1 with Grade-A corporate and bank tenants.
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-[4px] border border-[#C9D7E3] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#168A3A] flex items-center justify-center flex-shrink-0 text-lg">
              <FaChartLine />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#168A3A]">Express Growth Corridors</h3>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Strategic acreage and plotted layouts aligned with airport and metro expansions.
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-[4px] border border-[#C9D7E3] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 text-lg">
              <FaFileContract />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-amber-800">Title & RERA Scrutiny</h3>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Every deal backed by 30-year link documents vetted by our Legal Cell advisors.
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-[4px] border border-[#C9D7E3] flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0 text-lg">
              <FaHandshake />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-purple-800">Direct Builder Access</h3>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Zero brokerage markups on syndicate pre-launches with preferential pricing.
              </p>
            </div>
          </div>
        </div>

        {/* Investment Opportunities Grid */}
        <div id="opportunities" className="bg-white rounded-[4px] border border-[#C9D7E3] overflow-hidden">
          <div className="bg-[#073F73] px-4 py-2.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCoins className="text-[#F7C900]" />
              <h3 className="text-[13px] font-black uppercase tracking-wider">
                Current Curated Syndicates & Opportunities
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-gray-200">
              Showing 4 Live Projects
            </span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEALS.map((deal) => (
              <div
                key={deal.id}
                className="border border-[#DCE4EC] hover:border-[#073F73] rounded-[4px] p-4 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="bg-[#EEF6FC] text-[#073F73] text-[10px] font-black px-2 py-0.5 rounded-xs uppercase">
                      {deal.category}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        deal.status === "Filling Fast"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {deal.status}
                    </span>
                  </div>

                  <h4 className="text-[14.5px] font-black text-[#073F73] leading-snug mb-1">
                    {deal.title}
                  </h4>
                  <p className="text-[11.5px] text-gray-500 font-medium mb-3">
                    📍 {deal.location} • RERA: {deal.reraNo}
                  </p>
                  <p className="text-[12px] text-gray-700 leading-relaxed mb-4">
                    {deal.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">
                      Target Yield
                    </span>
                    <span className="text-[13.5px] font-black text-[#168A3A]">
                      {deal.targetYield}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">
                      Min. Ticket
                    </span>
                    <span className="text-[13px] font-bold text-[#073F73]">
                      {deal.minTicket}
                    </span>
                  </div>
                  <a
                    href="#contact-form"
                    className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold px-3 py-1.5 rounded-xs transition-colors"
                  >
                    Inquire
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Calculator & Inquiry Form Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Calculator (7 cols) */}
          <div id="calculator" className="lg:col-span-7 bg-white rounded-[4px] border border-[#C9D7E3] p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-200">
              <FaCalculator className="text-[#073F73] text-lg" />
              <h3 className="text-[14px] font-black uppercase text-[#073F73] tracking-wider">
                Real Estate Investment Yield & Growth Estimator
              </h3>
            </div>

            <div className="space-y-4 text-[12px]">
              <div>
                <div className="flex justify-between items-center mb-1 font-bold text-[#143B5D]">
                  <span>Investment Capital:</span>
                  <span className="text-[#073F73] text-[13px] font-black">₹ {calcAmount} Lakhs</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full accent-[#073F73] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>₹10 Lakhs</span>
                  <span>₹2.5 Crores</span>
                  <span>₹5.0 Crores</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 font-bold text-[#143B5D]">
                  <span>Holding Period (Years):</span>
                  <span className="text-[#073F73] text-[13px] font-black">{calcYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={calcYears}
                  onChange={(e) => setCalcYears(Number(e.target.value))}
                  className="w-full accent-[#073F73] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>1 Year</span>
                  <span>7 Years</span>
                  <span>15 Years</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 font-bold text-[#143B5D]">
                  <span>Expected Annual Appreciation / Yield:</span>
                  <span className="text-[#168A3A] text-[13px] font-black">{calcRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="25"
                  step="0.5"
                  value={calcRate}
                  onChange={(e) => setCalcRate(Number(e.target.value))}
                  className="w-full accent-[#168A3A] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>6% (Conservative)</span>
                  <span>14% (Balanced)</span>
                  <span>25% (High Growth Corridor)</span>
                </div>
              </div>

              {/* Result Summary Box */}
              <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-3.5 rounded-[4px] mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-white rounded border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">
                    Estimated Profit
                  </span>
                  <span className="text-[15px] font-black text-[#168A3A]">
                    ₹ {(estimatedProfit / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div className="p-2 bg-white rounded border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">
                    Total Maturity Value
                  </span>
                  <span className="text-[15px] font-black text-[#073F73]">
                    ₹ {(estimatedReturn / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Investor Callback Form (5 cols) */}
          <div id="contact-form" className="lg:col-span-5 bg-white rounded-[4px] border border-[#C9D7E3] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-200">
                <FaPhoneAlt className="text-[#E21F2F]" />
                <h3 className="text-[14px] font-black uppercase text-[#073F73] tracking-wider">
                  Request Confidential Prospectus
                </h3>
              </div>

              {formSubmitted ? (
                <div className="bg-[#E7F6EA] border border-[#A3D9B1] text-[#168A3A] p-4 rounded-[4px] text-center space-y-2">
                  <FaCheckCircle className="text-3xl mx-auto text-[#168A3A]" />
                  <h4 className="font-black text-[14px]">Request Received Successfully</h4>
                  <p className="text-[11.5px] leading-relaxed">
                    Our Senior Capital Syndication Officer will connect with you within 2 business hours with verified project brochures and yield audits.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-2 text-[11px] font-bold underline cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-[12px]">
                  <div>
                    <label className="block font-bold text-[#143B5D] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#143B5D] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98490..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#143B5D] mb-1">City / NRI Country</label>
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad / Dubai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#143B5D] mb-1">Investment Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] bg-white focus:outline-none focus:border-[#073F73]"
                    >
                      <option value="25L - 50L">₹ 25 Lakhs – ₹ 50 Lakhs</option>
                      <option value="50L - 1Cr">₹ 50 Lakhs – ₹ 1 Crore</option>
                      <option value="1Cr - 5Cr">₹ 1 Crore – ₹ 5 Crores</option>
                      <option value="5Cr+">₹ 5 Crores+ (Institutional / Family Office)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#143B5D] mb-1">Asset Preference</label>
                    <select
                      value={formData.preferredAsset}
                      onChange={(e) => setFormData({ ...formData, preferredAsset: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-[#C9D7E3] rounded-[3px] bg-white focus:outline-none focus:border-[#073F73]"
                    >
                      <option value="Commercial Pre-Leased">Commercial Pre-Leased (High Yield)</option>
                      <option value="Growth Corridor Land Bank">Growth Corridor Land Bank (High Growth)</option>
                      <option value="Warehousing & Logistics">Warehousing & Logistics</option>
                      <option value="Residential Joint Ventures">Residential Plotted Joint Ventures</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E21F2F] hover:bg-[#c91826] text-white font-black py-2 rounded-[3px] uppercase tracking-wider text-[12px] shadow-sm transition-colors mt-2"
                  >
                    Submit Investment Inquiry
                  </button>
                </form>
              )}
            </div>

            <p className="text-[10px] text-gray-500 mt-4 text-center">
              🔒 Confidentiality Guaranteed. Your details are never shared with unsolicited third-party brokers.
            </p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
