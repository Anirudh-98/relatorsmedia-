"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaShieldAlt, FaFileContract, FaBalanceScale, FaCheckCircle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function LegalCellPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    serviceType: "Title Verification",
    propertyDetails: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PortalLayout
      title="Real Estate Legal Cell"
      subtitle="Expert Legal Verification, RERA Guidance, Title Clearances & Contract Drafting"
      badge="Legal Assurance"
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#073F73] text-white p-6 sm:p-8 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[#F7C900] text-[11px] font-black uppercase tracking-widest block mb-1">
              Protect Your Investments
            </span>
            <h2 className="text-[22px] sm:text-[28px] font-black mb-2">
              Comprehensive Legal Scrutiny for Buyers, Sellers & Realtors
            </h2>
            <p className="text-[13px] text-[#BAE6FD] leading-relaxed">
              Every real estate transaction carries legal consequences. Our dedicated panel of experienced property advocates and RERA consultants ensures 100% clean documentation, mutation verification, and contract security.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-lg border border-white/20 text-center min-w-[200px]">
            <div className="text-[11px] font-bold text-[#F7C900] uppercase">Legal Cell Helpline</div>
            <div className="text-[16px] font-black text-white mt-1">+91 20 4567 8999</div>
            <div className="text-[11px] text-[#BAE6FD] mt-1">legal@realtorsmedia.world</div>
          </div>
        </div>

        {/* 4 Core Legal Services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#E7F6EA] text-[#168A3A] flex items-center justify-center text-[20px] mb-3">
              <FaFileContract />
            </div>
            <h3 className="text-[14px] font-black text-[#073F73] mb-1">Title & 30-Yr Search</h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Detailed search of encumbrance certificates (EC), 7/12 extracts, link deeds, and revenue records up to 30 years.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEF6FC] text-[#0B4F8A] flex items-center justify-center text-[20px] mb-3">
              <FaShieldAlt />
            </div>
            <h3 className="text-[14px] font-black text-[#073F73] mb-1">RERA Adjudication</h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Filing complaints before RERA authorities, builder delay compensations, possession disputes, and project approvals check.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#F1E7FA] text-[#6637A8] flex items-center justify-center text-[20px] mb-3">
              <FaBalanceScale />
            </div>
            <h3 className="text-[14px] font-black text-[#073F73] mb-1">Contract Drafting</h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Drafting bulletproof Agreements for Sale, Sale Deeds, Development Agreements, Power of Attorney, and Lease Deeds.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#FFF4B8] text-[#D97706] flex items-center justify-center text-[20px] mb-3">
              <FaCheckCircle />
            </div>
            <h3 className="text-[14px] font-black text-[#073F73] mb-1">Dispute Redressal</h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Arbitration and pre-litigation mediation for family partition suits, boundary disputes, and delayed handover settlements.
            </p>
          </div>
        </div>

        {/* Request Consultation Form */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-6 shadow-2xs grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-[18px] font-black text-[#073F73] mb-2 uppercase">
              Book a Legal Consultation
            </h3>
            <p className="text-[13px] text-[#475569] leading-relaxed mb-4">
              Submit your property legal requirement to receive a call back from an empanelled High Court advocate and real estate legal consultant within 24 working hours.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#1E293B]">
                <FaCheckCircle className="text-[#168A3A]" />
                <span>Strict confidentiality guaranteed under Advocate-Client privilege</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#1E293B]">
                <FaCheckCircle className="text-[#168A3A]" />
                <span>Standardized, affordable fixed legal fee schedules</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#1E293B]">
                <FaCheckCircle className="text-[#168A3A]" />
                <span>Digital document upload and remote legal opinion report</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-lg">
            {submitted ? (
              <div className="bg-[#E7F6EA] border border-[#A3D9B1] p-5 rounded-md text-center">
                <FaCheckCircle className="text-[#168A3A] text-[28px] mx-auto mb-2" />
                <h4 className="text-[15px] font-black text-[#168A3A]">
                  Consultation Request Registered!
                </h4>
                <p className="text-[12px] text-[#2D3748] mt-1">
                  Our Senior Legal Officer will review your submission and contact you at {formData.phone} shortly. Reference ID: <span className="font-mono font-bold">LEG-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-[11px] font-bold text-[#073F73] hover:underline"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
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
                      className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pune, Hyderabad, Mumbai"
                      className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#334155] mb-1">
                      Service Required *
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                    >
                      <option>Title & Search Report</option>
                      <option>RERA Complaint / Check</option>
                      <option>Sale Deed / Agreement Drafting</option>
                      <option>Dispute Arbitration</option>
                      <option>Mutation & Revenue Papers</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#334155] mb-1">
                    Property Brief / Legal Query
                  </label>
                  <textarea
                    rows={3}
                    value={formData.propertyDetails}
                    onChange={(e) => setFormData({ ...formData, propertyDetails: e.target.value })}
                    placeholder="Briefly describe property type, survey number, builder name, or issue..."
                    className="w-full bg-white border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[12px] focus:outline-hidden focus:border-[#073F73]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#073F73] hover:bg-[#06345F] text-white font-extrabold text-[12px] py-2 rounded-md uppercase tracking-wider transition-colors shadow-xs"
                >
                  Submit Legal Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
