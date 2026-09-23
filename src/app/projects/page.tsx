"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaBuilding, FaMapMarkerAlt, FaCheckCircle, FaSearch, FaBed, FaRulerCombined, FaRupeeSign, FaShieldAlt } from "react-icons/fa";

interface ProjectItem {
  id: string;
  name: string;
  developer: string;
  type: string;
  city: string;
  location: string;
  priceStart: string;
  units: string;
  reraNumber: string;
  status: "Ready to Move" | "Under Construction" | "New Launch";
  image: string;
  highlights: string[];
}

const projectsList: ProjectItem[] = [
  {
    id: "p1",
    name: "Kohinoor Grandeur Corridors",
    developer: "Kohinoor Group Alliance",
    type: "2 & 3 BHK Luxury Residences",
    city: "Pune",
    location: "Hinjawadi Phase 1, Pune",
    priceStart: "₹ 78 Lakhs*",
    units: "850 - 1450 Sq.Ft.",
    reraNumber: "P52100034567",
    status: "Under Construction",
    image: "/images/studio_broadcast.jpg",
    highlights: ["Next to Metro Station", "Podium Clubhouse", "Zero Brokerage Through Portal"],
  },
  {
    id: "p2",
    name: "Aparna CyberHeights Luxury Towers",
    developer: "Aparna Constructions",
    type: "3 & 4 BHK Smart Condos",
    city: "Hyderabad",
    location: "Gachibowli Financial District, Hyderabad",
    priceStart: "₹ 1.45 Cr*",
    units: "1850 - 3200 Sq.Ft.",
    reraNumber: "P02400012345",
    status: "New Launch",
    image: "/images/studio_broadcast.jpg",
    highlights: ["Overlooking Golf Course", "EV Charging Stations", "100% Vastu Compliant"],
  },
  {
    id: "p3",
    name: "Green Meadows County Open Plots",
    developer: "Realtors Media Verified Developers",
    type: "Gated Villa Plots (RERA & DTCP)",
    city: "Hyderabad",
    location: "Shadnagar Highway Growth Zone",
    priceStart: "₹ 24 Lakhs*",
    units: "150 - 500 Sq.Yds.",
    reraNumber: "P02500078901",
    status: "Ready to Move",
    image: "/images/building_watermark.jpg",
    highlights: ["Blacktop 40ft Roads", "Clubhouse & Swimming Pool", "Instant Spot Registration"],
  },
  {
    id: "p4",
    name: "Godrej Urban Retreat Skyvillas",
    developer: "Godrej Properties",
    type: "Duplex Penthouses & 4 BHK",
    city: "Bengaluru",
    location: "Whitefield Ext., Bengaluru",
    priceStart: "₹ 2.10 Cr*",
    units: "2600 - 4100 Sq.Ft.",
    reraNumber: "PRM/KA/RERA/1251/446/PR/210326",
    status: "Under Construction",
    image: "/images/studio_broadcast.jpg",
    highlights: ["Private Terrace Jacuzzi", "Helipad Access", "Pre-Certified Gold IGBC"],
  },
  {
    id: "p5",
    name: "One World Corporate IT Tower",
    developer: "Supreme Holdings",
    type: "Commercial Office Spaces & Retail",
    city: "Mumbai",
    location: "BKC Annex, Bandra East, Mumbai",
    priceStart: "₹ 1.85 Cr*",
    units: "650 - 12000 Sq.Ft.",
    reraNumber: "P51800045678",
    status: "Ready to Move",
    image: "/images/building_watermark.jpg",
    highlights: ["Grade-A Leased Tenants", "Double Height Lobby", "8.5% Rental Yield"],
  },
  {
    id: "p6",
    name: "Sylvan Whispers Farm Villas",
    developer: "Green Leaf Developers",
    type: "Managed Organic Farmhouses",
    city: "Pune",
    location: "Mulshi Lake Valley, Pune",
    priceStart: "₹ 65 Lakhs*",
    units: "0.25 - 1.0 Acre Plots",
    reraNumber: "P52100067890",
    status: "Ready to Move",
    image: "/images/building_watermark.jpg",
    highlights: ["Fruit Orchard Plantations", "Clubhouse & Spa", "24x7 Security & Caretaker"],
  },
];

export default function ProjectsPage() {
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.developer.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());

    const matchesCity = selectedCity === "All" || p.city === selectedCity;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;

    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <PortalLayout
      title="Featured Real Estate Projects"
      subtitle="Discover Top RERA-Approved Residential Townships, Commercial Towers, and Open Plot Layouts"
      badge="1,000+ Projects"
      action={
        <Link
          href="/post-property"
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-2xs"
        >
          List Your Project
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80 flex items-center">
            <span className="absolute left-3 text-gray-400 text-[12px]">
              <FaSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Project, Builder or Location..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[12px] focus:outline-hidden focus:border-[#073F73]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
              <span>City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2 py-1 text-[11px] font-bold text-[#073F73]"
              >
                <option value="All">All Cities</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#475569]">
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md px-2 py-1 text-[11px] font-bold text-[#073F73]"
              >
                <option value="All">All Statuses</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                <option value="New Launch">New Launch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-16/9 bg-gray-900 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                        project.status === "Ready to Move"
                          ? "bg-[#168A3A] text-white"
                          : project.status === "New Launch"
                          ? "bg-[#E21F2F] text-white"
                          : "bg-[#073F73] text-white"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-[#F7C900] text-[12px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>Starts {project.priceStart}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 text-[10.5px] font-bold text-[#0B4F8A] mb-1">
                    <FaMapMarkerAlt className="text-[10px]" />
                    <span>{project.location}</span>
                  </div>

                  <h3 className="text-[16px] font-black text-[#073F73] leading-snug mb-0.5">
                    {project.name}
                  </h3>

                  <div className="text-[11.5px] font-bold text-[#64748B] mb-2">
                    By {project.developer}
                  </div>

                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-2 text-[11px] mb-3 grid grid-cols-2 gap-1">
                    <div>
                      <span className="text-gray-500 font-medium">Config: </span>
                      <span className="font-bold text-[#1E293B]">{project.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Sizes: </span>
                      <span className="font-bold text-[#1E293B]">{project.units}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-gray-100 flex items-center gap-1 text-[10px] text-[#168A3A] font-bold">
                      <FaShieldAlt /> RERA: {project.reraNumber}
                    </div>
                  </div>

                  <ul className="space-y-1 mb-3">
                    {project.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="text-[11px] font-semibold text-[#334155] flex items-center gap-1.5">
                        <FaCheckCircle className="text-[#168A3A] text-[9px] flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/contact?project=${encodeURIComponent(project.name)}`}
                  className="w-full bg-[#073F73] hover:bg-[#06345F] text-white text-[11.5px] font-black py-2 rounded-md uppercase tracking-wider flex items-center justify-center transition-colors shadow-2xs"
                >
                  Request Brochure & Visit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
