"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaUserTie, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";

interface CommitteeMember {
  name: string;
  role: string;
  wing: string;
  location: string;
  phone: string;
  email: string;
  image?: string;
  experience: string;
}

const committeeMembers: CommitteeMember[] = [
  {
    name: "Dr. Vikramaditya Rao",
    role: "National President & Managing Director",
    wing: "Executive Governing Council",
    location: "Pune / Mumbai",
    phone: "+91 98220 11223",
    email: "president@realtorsmedia.world",
    image: "/images/realtor_ramnath.jpg",
    experience: "24+ years in Real Estate Development & Urban Infrastructure",
  },
  {
    name: "S. Priya Sharma",
    role: "Vice President - Operations & Marketing",
    wing: "Media & Channel Development",
    location: "Bengaluru / Hyderabad",
    phone: "+91 97400 44556",
    email: "priya.sharma@realtorsmedia.world",
    image: "/images/realtor_priya.jpg",
    experience: "16+ years in High-Volume Property Sales & Broadcast Media",
  },
  {
    name: "Rohan Deshmukh",
    role: "General Secretary - Realtor Welfare & ID Licensing",
    wing: "Membership & Accreditation Cell",
    location: "Pune, Maharashtra",
    phone: "+91 97654 32109",
    email: "rohan.deshmukh@realtorsmedia.world",
    image: "/images/rohan_deshmukh.png",
    experience: "12+ years in Channel Networking & Verification Systems",
  },
  {
    name: "Adv. Rajeshwari Joshi",
    role: "Chief Legal Advisor & RERA Head",
    wing: "Legal Cell & Consumer Redressal",
    location: "Mumbai, Maharashtra",
    phone: "+91 98201 99887",
    email: "legal@realtorsmedia.world",
    experience: "20+ years practicing Real Estate Law & RERA Tribunals",
  },
  {
    name: "K. Naveen Reddy",
    role: "Director - Telangana & AP Region",
    wing: "Zonal Operations & Developer Liaison",
    location: "Hyderabad, Telangana",
    phone: "+91 99887 76655",
    image: "/images/realtor_ramnath.jpg",
    email: "naveen.k@realtorsmedia.world",
    experience: "15+ years in Gated Communities & Land Acquisition",
  },
  {
    name: "Sunil G. Patil",
    role: "Treasurer & Head of Financial Advisory",
    wing: "Finance, Banking & Capital Alliances",
    location: "Pune, Maharashtra",
    phone: "+91 94220 33445",
    email: "accounts@realtorsmedia.world",
    experience: "18+ years in Project Finance & Home Loan Synergies",
  },
];

export default function CoreCommitteePage() {
  return (
    <PortalLayout
      title="Core Committee Leadership"
      subtitle="The Governing Body Guiding Realtors Media Strategy, Welfare, and Policy Standards"
      badge="Governance"
    >
      <div className="space-y-6">
        {/* Intro Banner */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-[16px] sm:text-[18px] font-black text-[#073F73] mb-1">
              Guiding India&apos;s Real Estate Community with Integrity
            </h2>
            <p className="text-[12.5px] text-[#475569] leading-relaxed">
              The Realtors Media Core Committee comprises seasoned developers, legal stalwarts, marketing heads, and regional realtor representatives committed to empowering members and ensuring consumer protection.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/legal-cell"
              className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <FaShieldAlt />
              <span>Legal Cell</span>
            </Link>
            <Link
              href="/contact"
              className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors shadow-2xs"
            >
              Contact Committee
            </Link>
          </div>
        </div>

        {/* Committee Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {committeeMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-5">
                {/* Photo & Role Info */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F1F5F9] border-2 border-[#0B4F8A]/30 flex-shrink-0 flex items-center justify-center">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <FaUserTie className="text-[#073F73] text-[24px]" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-[15px] font-black text-[#073F73] leading-tight">
                      {member.name}
                    </h3>
                    <div className="text-[11px] font-extrabold text-[#0284C7] mt-0.5 leading-tight">
                      {member.role}
                    </div>
                    <div className="text-[10px] font-bold text-[#64748B] mt-0.5">
                      {member.wing}
                    </div>
                  </div>
                </div>

                <p className="text-[11.5px] text-[#475569] leading-relaxed mb-3 bg-[#F8FAFC] p-2 rounded-md border border-gray-100">
                  {member.experience}
                </p>

                {/* Details */}
                <div className="space-y-1 text-[11px] font-semibold text-[#334155]">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#0B4F8A] text-[10px]" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-[#168A3A] text-[10px]" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-[#E21F2F] text-[10px]" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#64748B]">Active Tenure: 2026-2028</span>
                <span className="text-[10px] font-extrabold text-[#073F73] bg-[#EEF6FC] px-2 py-0.5 rounded-full">
                  Verified Member
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
