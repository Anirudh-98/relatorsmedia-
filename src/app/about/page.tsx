"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaCheckCircle, FaAward, FaUsers, FaBuilding, FaHandshake, FaGlobe } from "react-icons/fa";

export default function AboutPage() {
  return (
    <PortalLayout
      title="About Realtors Media"
      subtitle="India's Premier Real Estate Media Platform & Professional Ecosystem"
      badge="About Us"
    >
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#073F73] via-[#0B4F8A] to-[#0284C7] rounded-xl text-white p-6 sm:p-10 shadow-md">
          <div className="max-w-3xl">
            <span className="text-[#F7C900] text-[12px] font-black uppercase tracking-widest block mb-2">
              Our Vision & Mission
            </span>
            <h2 className="text-[24px] sm:text-[32px] font-black leading-tight mb-4">
              Empowering India&apos;s Real Estate Ecosystem Through Transparency, Media & Technology
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#BAE6FD] leading-relaxed mb-6">
              Realtors Media (Property Info Pvt. Ltd.) bridges property buyers, developers, certified realtors, legal experts, and investors under one trusted national network.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[12px] font-black px-4 py-2 rounded-md uppercase tracking-wider transition-colors shadow-sm"
              >
                Join As Member
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-[12px] font-bold px-4 py-2 rounded-md uppercase tracking-wider transition-colors"
              >
                Contact Leadership
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#E7F6EA] text-[#168A3A] flex items-center justify-center text-[20px] mb-3">
              <FaAward />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">
              Verified Excellence
            </h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Every realtor and marketing associate receives an authenticated, QR-verifiable corporate ID card and credentials.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEF6FC] text-[#0B4F8A] flex items-center justify-center text-[20px] mb-3">
              <FaGlobe />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">
              National Reach
            </h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Connecting property markets across Maharashtra, Telangana, Karnataka, Andhra Pradesh, Gujarat, and NCR.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#F1E7FA] text-[#6637A8] flex items-center justify-center text-[20px] mb-3">
              <FaBuilding />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">
              Developer Partnerships
            </h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Direct promotions for leading township ventures, RERA-approved layouts, high-rise apartments, and commercial zones.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-[#CBD5E1] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#FFF4B8] text-[#D97706] flex items-center justify-center text-[20px] mb-3">
              <FaHandshake />
            </div>
            <h3 className="text-[15px] font-black text-[#073F73] mb-1">
              Fair Dealings
            </h3>
            <p className="text-[12px] text-[#475569] leading-relaxed">
              Transparent commission structures, legal document verification, and ethical practices in every property transaction.
            </p>
          </div>
        </div>

        {/* Company Profile Details */}
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-[18px] font-black text-[#073F73] mb-3 uppercase tracking-tight">
              Who We Are
            </h3>
            <p className="text-[13px] text-[#334155] leading-relaxed mb-4">
              Realtors Media is an integrated real estate communications and marketplace organization founded to streamline the Indian property sector. Through live studio broadcasts, verified classified hubs, and physical ID accreditations, we bring credibility to every market participant.
            </p>
            <ul className="space-y-2 text-[12.5px] font-semibold text-[#1E293B]">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-[#168A3A] flex-shrink-0" />
                <span>Over 10,000+ registered real estate consultants and agencies</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-[#168A3A] flex-shrink-0" />
                <span>24x7 Digital Media broadcast studio covering market trends</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-[#168A3A] flex-shrink-0" />
                <span>Dedicated Legal Cell for RERA, title check, and contracts</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-[#168A3A] flex-shrink-0" />
                <span>Verified CR80 smart physical and digital member identification cards</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-[14px] font-black text-[#073F73] uppercase mb-2">
                Corporate Headquarters
              </h4>
              <p className="text-[12.5px] text-[#475569] leading-relaxed">
                <strong>Realtors Media</strong><br />
                Property Info Pvt. Ltd.<br />
                Business Bay, Senapati Bapat Road, Pune, Maharashtra - 411016<br />
                CIN: U70109PN2021PTC198765
              </p>
              <div className="mt-4 pt-3 border-t border-gray-200 text-[12px] text-[#475569]">
                <div>Email: <span className="font-bold text-[#073F73]">info@realtorsmedia.world</span></div>
                <div>Helpline: <span className="font-bold text-[#073F73]">+91 20 4567 8900 / +91 98765 43210</span></div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href="/core-committee"
                className="text-[11px] font-bold text-[#0B4F8A] hover:underline"
              >
                View Core Committee →
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/advisors"
                className="text-[11px] font-bold text-[#0B4F8A] hover:underline"
              >
                View Advisors →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
