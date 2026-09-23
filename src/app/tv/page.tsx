"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaPlay, FaCalendarCheck, FaBroadcastTower, FaClock, FaCheckCircle, FaTv } from "react-icons/fa";

interface TVProgram {
  time: string;
  title: string;
  host: string;
  genre: string;
  status: "Live Now" | "Upcoming" | "Completed";
}

const schedule: TVProgram[] = [
  {
    time: "09:00 AM - 10:00 AM",
    title: "Morning Market Pulse: Prime Land & Corridor Valuations",
    host: "Rohan Deshmukh & Market Analysts",
    genre: "Market Analysis",
    status: "Completed",
  },
  {
    time: "11:30 AM - 12:30 PM",
    title: "Developer Spotlight: Megaproject Launches in Hyderabad & Pune",
    host: "S. Priya Sharma",
    genre: "Project Showcase",
    status: "Live Now",
  },
  {
    time: "03:00 PM - 04:00 PM",
    title: "The Legal Hour: RERA Disputes, Mutation & 7/12 Guidance",
    host: "Adv. Rajeshwari Joshi",
    genre: "Legal Advice",
    status: "Upcoming",
  },
  {
    time: "05:30 PM - 06:30 PM",
    title: "Architects Roundtable: Sustainable Green Homes of 2026",
    host: "Ar. Shrikant Deshpande",
    genre: "Design & Planning",
    status: "Upcoming",
  },
  {
    time: "08:00 PM - 09:30 PM",
    title: "Prime Real Estate Debate: Interest Rates & Home Buyer Sentiments",
    host: "Dr. Vikramaditya Rao",
    genre: "Prime Time Discussion",
    status: "Upcoming",
  },
];

export default function TVPage() {
  const [activeChannel, setActiveChannel] = useState("Main Stream (HD)");

  return (
    <PortalLayout
      title="Realtors Media TV"
      subtitle="India's First 24x7 Dedicated Real Estate News, Project Launches & Market Broadcast Network"
      badge="LIVE 24x7"
      action={
        <Link
          href="/contact?dept=studio"
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-2xs"
        >
          Book Studio Interview
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Main TV Player and Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Live Video Stream */}
          <div className="lg:col-span-2 space-y-3">
            <div className="w-full bg-black rounded-xl overflow-hidden border-2 border-[#0B4F8A] shadow-xl relative aspect-16/9">
              <iframe
                src="https://www.youtube-nocookie.com/embed/Ih-Fr67qdkE?rel=0&modestbranding=1&autoplay=0"
                title="Realtors Media TV Live Broadcast"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Stream Info Bar */}
            <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#E21F2F] text-white text-[9.5px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider animate-pulse">
                    <FaBroadcastTower /> LIVE STREAM
                  </span>
                  <span className="text-[11px] font-bold text-[#64748B]">1080p Full HD • Low Latency</span>
                </div>
                <h2 className="text-[17px] font-black text-[#073F73] leading-snug">
                  Developer Spotlight: Megaproject Launches in Hyderabad & Pune Growth Corridors
                </h2>
                <p className="text-[12px] text-[#475569] mt-0.5">
                  Hosted by S. Priya Sharma with guest developer executives.
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {["Main Stream (HD)", "Studio 2", "Expo Feed"].map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => setActiveChannel(channel)}
                    className={`text-[10.5px] font-extrabold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      activeChannel === channel
                        ? "bg-[#073F73] text-white"
                        : "bg-[#F1F5F9] text-[#475569] hover:bg-gray-200"
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Today's Broadcast Schedule */}
          <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5 mb-3">
                <div className="flex items-center gap-1.5">
                  <FaTv className="text-[#073F73] text-[15px]" />
                  <h3 className="text-[14px] font-black text-[#073F73] uppercase tracking-wide">
                    Today&apos;s Lineup
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full">
                  LIVE 24x7
                </span>
              </div>

              <div className="space-y-2.5">
                {schedule.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-[11.5px] transition-colors ${
                      item.status === "Live Now"
                        ? "bg-[#EEF6FC] border-[#0284C7] shadow-2xs"
                        : "bg-[#F8FAFC] border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-[#64748B] flex items-center gap-1">
                        <FaClock className="text-[9px]" /> {item.time}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-xs ${
                          item.status === "Live Now"
                            ? "bg-[#E21F2F] text-white"
                            : item.status === "Upcoming"
                            ? "bg-[#0B4F8A] text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="font-extrabold text-[#0C1E36] leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-[#475569] mt-0.5 font-medium">
                      Host: {item.host}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link
                href="/advertise"
                className="w-full bg-[#F7C900] hover:bg-yellow-400 text-[#073F73] text-[11px] font-black py-2 rounded-md uppercase tracking-wider flex items-center justify-center transition-colors shadow-2xs"
              >
                Advertise on TV Channel →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
