"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaPlay, FaImages, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface GalleryItem {
  id: string;
  title: string;
  category: "Events" | "Studio" | "Awards" | "Launches";
  image: string;
  date: string;
  location: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    title: "National Realtors Media Property Expo 2026",
    category: "Events",
    image: "/images/studio_broadcast.jpg",
    date: "15 AUG 2026",
    location: "HITEX Exhibition Center, Hyderabad",
    description: "Over 500+ builders and 12,000+ home buyers gathered for the annual real estate summit.",
  },
  {
    id: "g2",
    title: "Live Studio Broadcast: Budget Impact on Real Estate",
    category: "Studio",
    image: "/images/studio_broadcast.jpg",
    date: "01 FEB 2026",
    location: "Realtors Media TV Studios, Pune",
    description: "Panel discussion with economic advisors and CREDAI representatives on affordable housing tax slabs.",
  },
  {
    id: "g3",
    title: "Western India Real Estate Leadership Awards",
    category: "Awards",
    image: "/images/realtor_ramnath.jpg",
    date: "10 JAN 2026",
    location: "JW Marriott, Senapati Bapat Road, Pune",
    description: "Felicitation of top 50 verified channel partners and sustainable green developers.",
  },
  {
    id: "g4",
    title: "Launch of 200-Acre Luxury Villa Township",
    category: "Launches",
    image: "/images/realtor_priya.jpg",
    date: "25 JUL 2026",
    location: "Gachibowli Growth Corridor, Hyderabad",
    description: "Exclusive broker pre-launch meeting and on-site master plan reveal.",
  },
  {
    id: "g5",
    title: "RERA Compliance & Broker Empowerment Workshop",
    category: "Events",
    image: "/images/studio_broadcast.jpg",
    date: "18 MAY 2026",
    location: "World Trade Center, Bengaluru",
    description: "Practical certification training on digital agreements, RERA licensing, and consumer trust.",
  },
  {
    id: "g6",
    title: "Women in Real Estate Leadership Conclave",
    category: "Awards",
    image: "/images/realtor_priya.jpg",
    date: "08 MAR 2026",
    location: "Bandra Kurla Complex, Mumbai",
    description: "Celebrating visionary women architects, marketing heads, and successful brokerage founders.",
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredItems =
    activeTab === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeTab);

  return (
    <PortalLayout
      title="Media & Events Gallery"
      subtitle="Visual Highlights from Realtors Media Expos, Conclaves, Live Studio Broadcasts and Award Shows"
      badge="Gallery"
    >
      <div className="space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#CBD5E1] pb-3">
          {["All", "Events", "Studio", "Awards", "Launches"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === tab
                  ? "bg-[#073F73] text-white shadow-2xs"
                  : "bg-white text-[#475569] border border-[#CBD5E1] hover:bg-gray-50"
              }`}
            >
              {tab === "All" ? "All Highlights" : tab}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#CBD5E1] rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full aspect-16/9 bg-gray-900 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-[#073F73]/90 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-3 text-[10.5px] font-bold text-[#64748B] mb-1.5">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-[#E21F2F]" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-[#0B4F8A]" />
                      {item.location}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-black text-[#073F73] leading-snug mb-1">
                    {item.title}
                  </h3>

                  <p className="text-[12px] text-[#475569] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-4 py-2 flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-[#073F73] flex items-center gap-1">
                  <FaImages className="text-[#0B4F8A]" /> Realtors Media Archive
                </span>
                <span className="text-[11px] font-bold text-[#0B4F8A] group-hover:translate-x-0.5 transition-transform">
                  View Album →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
