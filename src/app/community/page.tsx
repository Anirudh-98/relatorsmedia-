"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaUsers, FaComments, FaCalendarAlt, FaCity, FaHandshake, FaCheckCircle, FaUserPlus } from "react-icons/fa";

interface ForumTopic {
  title: string;
  category: string;
  replies: number;
  author: string;
  time: string;
}

const forumTopics: ForumTopic[] = [
  {
    title: "How are members navigating the new stamp duty revisions in Maharashtra?",
    category: "Legal & Regulatory",
    replies: 42,
    author: "Rohan Deshmukh",
    time: "2 hours ago",
  },
  {
    title: "Best growth corridors in Hyderabad post Regional Ring Road (RRR) land surveys",
    category: "Market Insights",
    replies: 89,
    author: "K. Naveen Reddy",
    time: "5 hours ago",
  },
  {
    title: "Channel partner commission agreements: Standardizing 30-day payout cycles",
    category: "Realtor Welfare",
    replies: 64,
    author: "Ramnath Kumar",
    time: "1 day ago",
  },
  {
    title: "Upcoming Bangalore Realtors Media Meetup - RSVP & Networking Agenda",
    category: "Events & Meetups",
    replies: 31,
    author: "S. Priya Sharma",
    time: "2 days ago",
  },
];

export default function CommunityPage() {
  return (
    <PortalLayout
      title="Realtors Media Community"
      subtitle="Connect, Collaborate & Grow with India's Largest Network of Real Estate Professionals"
      badge="15,000+ Strong"
      action={
        <Link
          href="/register"
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <FaUserPlus />
          <span>Join Community</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-[#073F73] text-white p-6 sm:p-8 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[#F7C900] text-[11px] font-black uppercase tracking-widest block mb-1">
              Together We Grow
            </span>
            <h2 className="text-[22px] sm:text-[28px] font-black mb-2">
              A Safe, Ethical & Progressive Real Estate Fraternity
            </h2>
            <p className="text-[13px] text-[#BAE6FD] leading-relaxed">
              The Realtors Media Community is built on peer support, co-brokering transparency, code of ethics, and unified advocacy for realtor welfare across municipal, state, and central bodies.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-[200px]">
            <Link
              href="/register"
              className="bg-[#F7C900] hover:bg-yellow-400 text-[#073F73] font-black text-[12px] px-4 py-2 rounded-md uppercase tracking-wider text-center transition-colors shadow-sm"
            >
              Sign Up Free
            </Link>
            <Link
              href="/classifieds"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-[12px] px-4 py-2 rounded-md uppercase tracking-wider text-center border border-white/20 transition-colors"
            >
              Explore Hub Ads
            </Link>
          </div>
        </div>

        {/* 4 Community Regional Chapters */}
        <div>
          <h3 className="text-[16px] font-black text-[#073F73] mb-3 uppercase tracking-tight">
            Active Regional Chapters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs">
              <div className="text-[10px] font-extrabold text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full inline-block mb-2">
                4,200+ Members
              </div>
              <h4 className="text-[15px] font-black text-[#073F73] mb-1">Pune Chapter</h4>
              <p className="text-[11.5px] text-[#475569] leading-relaxed mb-3">
                Covering Hinjawadi, Baner, Wakad, Kharadi, Wagholi, and PCMC industrial belts.
              </p>
              <span className="text-[11px] font-bold text-[#0B4F8A]">Coordinator: Rohan D.</span>
            </div>

            <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs">
              <div className="text-[10px] font-extrabold text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full inline-block mb-2">
                3,800+ Members
              </div>
              <h4 className="text-[15px] font-black text-[#073F73] mb-1">Hyderabad Chapter</h4>
              <p className="text-[11.5px] text-[#475569] leading-relaxed mb-3">
                Active in Gachibowli, Kokapet, Financial District, Shadnagar, and Medchal corridors.
              </p>
              <span className="text-[11px] font-bold text-[#0B4F8A]">Coordinator: K. Naveen R.</span>
            </div>

            <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs">
              <div className="text-[10px] font-extrabold text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full inline-block mb-2">
                3,100+ Members
              </div>
              <h4 className="text-[15px] font-black text-[#073F73] mb-1">Bengaluru Chapter</h4>
              <p className="text-[11.5px] text-[#475569] leading-relaxed mb-3">
                Focusing on Whitefield, Sarjapur, North Bangalore Airport Road, and Electronic City.
              </p>
              <span className="text-[11px] font-bold text-[#0B4F8A]">Coordinator: S. Priya S.</span>
            </div>

            <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs">
              <div className="text-[10px] font-extrabold text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full inline-block mb-2">
                2,900+ Members
              </div>
              <h4 className="text-[15px] font-black text-[#073F73] mb-1">Mumbai & MMR Chapter</h4>
              <p className="text-[11.5px] text-[#475569] leading-relaxed mb-3">
                Spanning BKC, Thane, Navi Mumbai, Panvel, and Western Suburb redevelopments.
              </p>
              <span className="text-[11px] font-bold text-[#0B4F8A]">Coordinator: Dr. Vikramaditya</span>
            </div>
          </div>
        </div>

        {/* Community Forum Discussions */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-[16px] font-black text-[#073F73] uppercase tracking-tight">
                Trending Community Discussions
              </h3>
              <p className="text-[12px] text-[#64748B]">
                Active conversations between brokers, developers, legal experts, and investors.
              </p>
            </div>
            <Link
              href="/register"
              className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors"
            >
              Start New Topic
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {forumTopics.map((topic, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors">
                <div>
                  <span className="text-[10px] font-bold bg-[#EEF6FC] text-[#073F73] px-2 py-0.5 rounded-full inline-block mb-1">
                    {topic.category}
                  </span>
                  <h4 className="text-[13.5px] font-bold text-[#1E293B] hover:text-[#073F73] cursor-pointer">
                    {topic.title}
                  </h4>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    Posted by <strong className="text-[#334155]">{topic.author}</strong> • {topic.time}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#0B4F8A] bg-[#F1F5F9] px-3 py-1 rounded-md self-start sm:self-center">
                  <FaComments />
                  <span>{topic.replies} replies</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
