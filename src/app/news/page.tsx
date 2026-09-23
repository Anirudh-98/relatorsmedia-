"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaTag,
  FaSearch,
  FaBell,
  FaShareAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

interface NewsArticle {
  id: string;
  title: string;
  category: "RERA & Legal" | "Infrastructure" | "Market Trends" | "Project Launch";
  date: string;
  readTime: string;
  summary: string;
  content: string;
  source: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title: "Hyderabad Outer Ring Road Radial Corridor 7 Fast-Tracked for 2026 Completion",
    category: "Infrastructure",
    date: "22 SEP 2026",
    readTime: "3 min read",
    source: "Realtors Media Bureau",
    summary:
      "State infrastructure authorities have expedited the 4-lane radial corridor linking Kokapet and Shamshabad, spurring immediate commercial land appreciation across west Hyderabad.",
    content:
      "The dedicated 18km high-speed arterial stretch is poised to decongest peak tech traffic and expand the premium residential belt toward Kollur and Mokila. Real estate analysts project a 15-20% capital value increment over the next 18 months for verified plotted developments along the corridor.",
  },
  {
    id: "news-2",
    title: "State RERA Enforces Mandatory Geo-Tagging & Digital Boundary Cadastre for Plotted Schemes",
    category: "RERA & Legal",
    date: "20 SEP 2026",
    readTime: "4 min read",
    source: "Legal Cell Advisory",
    summary:
      "New compliance mandate requires all open plot promoters to submit GIS-tagged boundary coordinates before issuing public marketing permissions.",
    content:
      "Aiming to eliminate encroachment and fraudulent layout overlaps, the RERA bench has made digital GIS verification compulsory. Realtors Media Legal Cell welcomes this move as it protects retail buyers and reinforces verified dealer credibility nationwide.",
  },
  {
    id: "news-3",
    title: "Pre-Leased Commercial Assets Outperform Conventional Debt with 9.4% Rental Yields",
    category: "Market Trends",
    date: "18 SEP 2026",
    readTime: "5 min read",
    source: "Investment Research Wing",
    summary:
      "Institutional and NRI capital inflows into Grade-A office parks in Bengaluru, Hyderabad, and Pune hit record numbers in Q3 2026.",
    content:
      "With IT global capability centers (GCCs) renewing long-term leases, fractional and syndicated commercial real estate investments continue to provide reliable quarterly cash yields coupled with solid capital appreciation.",
  },
  {
    id: "news-4",
    title: "Bengaluru Satellite Town Ring Road (STRR) Land Pooling Reaches Final Phase",
    category: "Infrastructure",
    date: "15 SEP 2026",
    readTime: "3 min read",
    source: "Urban Planning Desk",
    summary:
      "NHAI and BMRDA conclude public hearings for land consolidation on the Dobbaspet-Hoskote bypass connector.",
    content:
      "The massive ring project is transforming Hoskote and Devanahalli into prime logistics and industrial hubs, triggering heightened inquiries for industrial land banks and gated warehouse layouts.",
  },
  {
    id: "news-5",
    title: "Supreme Court Affirms Homebuyer Status as Secured Creditors in Builder Insolvencies",
    category: "RERA & Legal",
    date: "12 SEP 2026",
    readTime: "4 min read",
    source: "Apex Court Reporter",
    summary:
      "Landmark ruling reinforces that individual allottees hold equal rights as financial institutions during insolvency resolution proceedings.",
    content:
      "The ruling provides critical safeguards for property purchasers. Realtors Media continues to audit all builder ventures featured on the portal to ensure full project escrow compliance.",
  },
  {
    id: "news-6",
    title: "Chakan Phase-IV Industrial Corridor Attracts ₹ 3,200 Cr In EV & Clean Mobility Investments",
    category: "Project Launch",
    date: "08 SEP 2026",
    readTime: "3 min read",
    source: "Maharashtra Industrial Bureau",
    summary:
      "Automotive suppliers and German tier-1 component manufacturers break ground on integrated assembly facilities in Pune.",
    content:
      "Demand for industrial PEB sheds and engineer residential housing in Talegaon and Chakan has risen by 28% year-on-year, driving investor interest in surrounding residential layouts.",
  },
];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState("");

  const categories = ["All", "Infrastructure", "RERA & Legal", "Market Trends", "Project Launch"];

  const filteredNews = NEWS_ARTICLES.filter((article) => {
    const matchesCat = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subEmail.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <PortalLayout
      title="REAL ESTATE NEWS & POLICY BULLETIN"
      subtitle="Authoritative market insights, infrastructure updates, RERA regulations, and property growth corridors"
      badge="LIVE MEDIA FEED"
      breadcrumbs={[{ label: "News & Updates" }]}
    >
      <div className="space-y-6">
        {/* Top Filter and Search Bar */}
        <div className="bg-white rounded-[4px] border border-[#C9D7E3] p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-[3px] transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#073F73] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news & policies..."
              className="w-full pl-8 pr-3 py-1.5 text-[11.5px] border border-[#C9D7E3] rounded-[3px] focus:outline-none focus:border-[#073F73]"
            />
            <FaSearch className="absolute left-2.5 top-2.5 text-gray-400 text-xs" />
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="bg-white rounded-[4px] border border-[#C9D7E3] hover:border-[#073F73] transition-all hover:shadow-md flex flex-col justify-between overflow-hidden"
            >
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold">
                  <span className="bg-[#EEF6FC] text-[#073F73] px-2 py-0.5 rounded-xs uppercase">
                    {news.category}
                  </span>
                  <span>{news.date}</span>
                </div>

                <h3 className="text-[14px] font-black text-[#073F73] leading-snug hover:text-[#E21F2F] transition-colors">
                  {news.title}
                </h3>

                <p className="text-[11.5px] text-gray-600 leading-relaxed">
                  {news.summary}
                </p>

                <p className="text-[11.5px] text-gray-700 leading-relaxed pt-1 border-t border-gray-100">
                  {news.content}
                </p>
              </div>

              <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-gray-100 flex items-center justify-between text-[10.5px]">
                <span className="text-gray-500 font-semibold">{news.source}</span>
                <span className="text-[#073F73] font-bold">{news.readTime}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription Banner */}
        <div className="bg-[#073F73] text-white p-5 rounded-[4px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-xl text-[#F7C900] flex-shrink-0">
              <FaBell />
            </div>
            <div>
              <h4 className="text-[14.5px] font-black uppercase tracking-wide">
                Subscribe to Daily Real Estate Bulletins
              </h4>
              <p className="text-[11.5px] text-gray-200">
                Get morning market digests, RERA notifications, and project pre-launches delivered directly to your inbox.
              </p>
            </div>
          </div>

          {subscribed ? (
            <div className="bg-emerald-600 text-white text-[12px] font-bold px-4 py-2 rounded-[3px] flex items-center gap-1.5">
              <FaCheckCircle />
              <span>Subscribed Successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                className="px-3 py-1.5 text-[12px] text-gray-800 bg-white rounded-[3px] focus:outline-none w-full md:w-64"
              />
              <button
                type="submit"
                className="bg-[#E21F2F] hover:bg-[#c91826] text-white text-[11px] font-black uppercase px-4 py-1.5 rounded-[3px] transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
