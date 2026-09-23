"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { realtorsEmployees } from "@/data/portalData";
import { RealtorsMediaEmployee } from "@/types";
import { FaSearch, FaIdCard, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaFilter } from "react-icons/fa";
import { IdCardModal } from "@/components/ui/IdCardModal";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState<RealtorsMediaEmployee>(realtorsEmployees[0]);

  // Extended member list for rich directory
  const allMembers: RealtorsMediaEmployee[] = [
    ...realtorsEmployees,
    {
      name: "Suresh Baburao Shinde",
      designation: "RESIDENTIAL BROKER",
      employeeId: "RMD-GRN-042",
      department: "West Pune Channel",
      location: "Pune, Maharashtra",
      issuedDate: "05 MAR 2026",
      validTill: "04 MAR 2028",
      photo: "/images/realtor_ramnath.jpg",
      verificationUrl: "https://realtorsmedia.com/verify/RMD-GRN-042",
      theme: "green",
      phone: "+91 98224 55667",
      email: "suresh.shinde@realtorsmedia.world",
      specialization: "Plots & Bungalow Schemes",
    },
    {
      name: "Meenakshi Sundaram",
      designation: "COMMERCIAL SPECIALIST",
      employeeId: "RMD-BLU-105",
      department: "Corporate Leasing Cell",
      location: "Bengaluru, Karnataka",
      issuedDate: "12 APR 2026",
      validTill: "11 APR 2028",
      photo: "/images/realtor_priya.jpg",
      verificationUrl: "https://realtorsmedia.com/verify/RMD-BLU-105",
      theme: "blue",
      phone: "+91 94480 33221",
      email: "meenakshi.s@realtorsmedia.world",
      specialization: "IT Parks & High Street Retail",
    },
    {
      name: "K. Venkateshwarlu",
      designation: "LAND AGGREGATOR",
      employeeId: "RMD-RED-009",
      department: "Capital Ventures & Mega Projects",
      location: "Hyderabad, Telangana",
      issuedDate: "20 JAN 2026",
      validTill: "19 JAN 2028",
      photo: "/images/realtor_ramnath.jpg",
      verificationUrl: "https://realtorsmedia.com/verify/RMD-RED-009",
      theme: "red",
      phone: "+91 98490 88776",
      email: "venkat.k@realtorsmedia.world",
      specialization: "Open Land & Joint Ventures",
    },
  ];

  const filteredMembers = allMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase()) ||
      m.designation.toLowerCase().includes(search.toLowerCase());

    const matchesCity = selectedCity === "All" || m.location.includes(selectedCity);
    const matchesTheme = selectedTheme === "All" || (m.theme || "blue") === selectedTheme;

    return matchesSearch && matchesCity && matchesTheme;
  });

  const handleInspectCard = (emp: RealtorsMediaEmployee) => {
    setActiveEmployee(emp);
    setInspectModalOpen(true);
  };

  return (
    <PortalLayout
      title="Verified Members Directory"
      subtitle="Accredited Real Estate Consultants, Brokers, and Channel Partners with Authenticated ID Credentials"
      badge="10,000+ Verified"
      action={
        <Link
          href="/register"
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-2xs"
        >
          Register as Member
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="relative w-full md:w-96 flex items-center">
            <span className="absolute left-3 text-[#94A3B8] text-[13px]">
              <FaSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Member Name, ID, or Department..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[12px] focus:outline-hidden focus:border-[#073F73]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
              <FaFilter className="text-[#0B4F8A]" />
              <span>City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2 py-1 text-[11px] font-semibold text-[#073F73]"
              >
                <option value="All">All Cities</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
              <span>ID Tier:</span>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2 py-1 text-[11px] font-semibold text-[#073F73]"
              >
                <option value="All">All Tiers</option>
                <option value="green">Green (Free)</option>
                <option value="blue">Blue (A Grade)</option>
                <option value="orange">Orange (Gold)</option>
                <option value="red">Red (VIP)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, idx) => {
            const theme = member.theme || "blue";
            const borderBadge =
              theme === "green"
                ? "border-[#10B981] bg-[#ECFDF5] text-[#059669]"
                : theme === "orange"
                ? "border-[#F97316] bg-[#FFF7ED] text-[#EA580C]"
                : theme === "red"
                ? "border-[#EF4444] bg-[#FEF2F2] text-[#DC2626]"
                : "border-[#0284C7] bg-[#F0F9FF] text-[#0284C7]";

            return (
              <div
                key={idx}
                className="bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-300 flex-shrink-0">
                        <Image
                          src={member.photo || "/images/rohan_deshmukh.png"}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-black text-[#073F73] leading-tight">
                          {member.name}
                        </h3>
                        <div className="text-[11px] font-extrabold text-[#0284C7] uppercase tracking-wide mt-0.5">
                          {member.designation}
                        </div>
                        <div className="text-[10px] font-bold text-[#64748B] flex items-center gap-1 mt-0.5">
                          <FaMapMarkerAlt className="text-[9px]" />
                          <span>{member.location}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${borderBadge}`}
                    >
                      {theme}
                    </span>
                  </div>

                  {/* ID & Dept details */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 space-y-1 text-[11px] mb-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#64748B]">Member ID:</span>
                      <span className="font-extrabold font-mono text-[#073F73]">{member.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-[#64748B]">Department:</span>
                      <span className="font-bold text-[#1E293B]">{member.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-[#64748B]">Valid Till:</span>
                      <span className="font-bold text-[#168A3A]">{member.validTill}</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-[11px] text-[#475569]">
                    <div className="flex items-center gap-2">
                      <FaPhoneAlt className="text-[#168A3A] text-[10px]" />
                      <span className="font-semibold">{member.phone || "+91 98200 12345"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-[#0B4F8A] text-[10px]" />
                      <span className="font-semibold">{member.email || "member@realtorsmedia.world"}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="bg-[#F1F5F9] border-t border-[#E2E8F0] p-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInspectCard(member)}
                    className="flex-1 bg-[#073F73] hover:bg-[#06345F] text-white text-[10.5px] font-extrabold py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <FaIdCard className="text-[11px] text-[#38BDF8]" />
                    <span>View ID Card</span>
                  </button>

                  <Link
                    href={`/verify/${member.employeeId}`}
                    className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] hover:bg-gray-50 text-[#073F73] text-[10.5px] font-bold rounded-md transition-colors text-center"
                  >
                    Verify
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <IdCardModal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        initialEmployee={activeEmployee}
        initialTier={activeEmployee.theme || "blue"}
      />
    </PortalLayout>
  );
}
