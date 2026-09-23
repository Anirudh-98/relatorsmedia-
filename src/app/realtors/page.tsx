"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { realtorsEmployees } from "@/data/portalData";
import { RealtorsMediaEmployee } from "@/types";
import { FaSearch, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaIdCard, FaCheckCircle, FaStar, FaUserPlus } from "react-icons/fa";
import { IdCardModal } from "@/components/ui/IdCardModal";

export default function RealtorsPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState<RealtorsMediaEmployee>(realtorsEmployees[0]);

  const realtorsList: RealtorsMediaEmployee[] = [
    ...realtorsEmployees,
    {
      name: "Suresh Baburao Shinde",
      designation: "WEST PUNE SPECIALIST",
      employeeId: "RMD-GRN-042",
      department: "Residential Brokerage",
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
      designation: "COMMERCIAL ADVISOR",
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
      designation: "SENIOR LAND BROKER",
      employeeId: "RMD-RED-009",
      department: "Mega Projects Division",
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

  const filtered = realtorsList.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      (r.specialization && r.specialization.toLowerCase().includes(search.toLowerCase()));

    const matchesCity = selectedCity === "All" || r.location.includes(selectedCity);

    return matchesSearch && matchesCity;
  });

  const handleOpenIdCard = (r: RealtorsMediaEmployee) => {
    setActiveEmployee(r);
    setModalOpen(true);
  };

  return (
    <PortalLayout
      title="Find Verified Realtors"
      subtitle="Connect with Certified Real Estate Agents, Land Aggregators and Channel Partners Near You"
      badge="Verified Brokers"
      action={
        <Link
          href="/register?type=realtor"
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <FaUserPlus />
          <span>Register as Realtor</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search & City Filter Bar */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96 flex items-center">
            <span className="absolute left-3 text-gray-400 text-[13px]">
              <FaSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search realtor by name, locality, or specialty..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[12px] focus:outline-hidden focus:border-[#073F73]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-[11px] font-bold text-[#475569]">Select City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-3 py-1.5 text-[11.5px] font-bold text-[#073F73]"
            >
              <option value="All">All Cities</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>

        {/* Realtors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((realtor, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border-2 border-[#0284C7]/30 flex-shrink-0">
                    <Image
                      src={realtor.photo || "/images/rohan_deshmukh.png"}
                      alt={realtor.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[15px] font-black text-[#073F73] leading-tight">
                        {realtor.name}
                      </h3>
                      <FaCheckCircle className="text-[#168A3A] text-[12px] flex-shrink-0" />
                    </div>

                    <div className="text-[11px] font-extrabold text-[#0284C7] uppercase mt-0.5">
                      {realtor.designation}
                    </div>

                    <div className="text-[10px] font-bold text-[#64748B] flex items-center gap-1 mt-0.5">
                      <FaMapMarkerAlt className="text-[9px]" />
                      <span>{realtor.location}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 space-y-1 text-[11px] mb-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#64748B]">Accredited ID:</span>
                    <span className="font-mono font-extrabold text-[#073F73]">{realtor.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-[#64748B]">Specialization:</span>
                    <span className="font-bold text-[#1E293B] truncate pl-2">{realtor.specialization || realtor.department}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-[#475569]">
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-[#168A3A] text-[10px]" />
                    <span className="font-semibold">{realtor.phone || "+91 97654 32109"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-[#0B4F8A] text-[10px]" />
                    <span className="font-semibold truncate">{realtor.email || "realtor@realtorsmedia.world"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F1F5F9] border-t border-[#E2E8F0] p-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenIdCard(realtor)}
                  className="flex-1 bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-black py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <FaIdCard className="text-[#38BDF8]" />
                  <span>Inspect ID Card</span>
                </button>

                <a
                  href={`tel:${realtor.phone || "+91 97654 32109"}`}
                  className="bg-white border border-[#CBD5E1] hover:bg-gray-100 text-[#168A3A] font-bold text-[11px] py-1.5 px-3 rounded-md transition-colors flex items-center gap-1"
                >
                  <FaPhoneAlt className="text-[10px]" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <IdCardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialEmployee={activeEmployee}
        initialTier={activeEmployee.theme || "blue"}
      />
    </PortalLayout>
  );
}
