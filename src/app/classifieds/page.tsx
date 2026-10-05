"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { realEstateHubItems } from "@/data/portalData";
import { FaFolder, FaSearch, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaPlusSquare, FaFilter } from "react-icons/fa";

import { PostAdModal } from "@/components/Classifieds/PostAdModal";
import { ClassifiedAd as PostModalAd } from "@/data/classifiedsData";

interface ClassifiedAd {
  id: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  name: string;
  location: string;
  phone: string;
  badge: string;
  description: string;
  price?: string;
}

function ClassifiedsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleAdCreated = (newAd: PostModalAd) => {
    const transformed: ClassifiedAd = {
      id: newAd.id,
      categoryId: newAd.categoryId,
      categoryTitle: newAd.categoryName,
      title: newAd.title,
      name: newAd.businessName || newAd.contactPerson,
      location: `${newAd.location}, ${newAd.city}`,
      phone: newAd.phone,
      badge: "Verified Member",
      description: newAd.description,
      price: newAd.priceRange,
    };
    setAds((prev) => [transformed, ...prev]);
    setIsPostModalOpen(false);
  };

  const filteredAds = ads.filter((ad) => {
    const matchesCategory =
      selectedCategory === "All" || ad.categoryId === selectedCategory;
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#073F73] text-white p-5 sm:p-7 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[#F7C900] text-[11px] font-black uppercase tracking-widest block mb-1">
            Real Estate Hub Classifieds
          </span>
          <h2 className="text-[20px] sm:text-[24px] font-black leading-tight">
            Verified Vendors, Professionals, Material Suppliers & Land Realtors
          </h2>
          <p className="text-[12.5px] text-[#BAE6FD] mt-1 max-w-2xl">
            Browse ads across 15 real estate service verticals or publish your own classified listing to reach thousands of active home buyers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPostModalOpen(true)}
          className="bg-[#E21F2F] hover:bg-[#F11D32] text-white text-[12px] font-black px-4 py-2.5 rounded-md uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm flex-shrink-0 cursor-pointer"
        >
          <FaPlusSquare />
          <span>Post Your Free Ad</span>
        </button>
      </div>

      {/* Main Grid: Left Sidebar Categories (15 items) & Right Ads List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Categories Filter Column */}
        <div className="bg-white border border-[#CBD5E1] rounded-xl p-4 shadow-2xs h-fit">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 mb-2">
            <h3 className="text-[13px] font-black text-[#073F73] uppercase tracking-wide flex items-center gap-1.5">
              <FaFolder />
              <span>15 Hub Verticals</span>
            </h3>
            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="text-[10px] font-bold text-[#E21F2F] hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <ul className="space-y-0.5 text-[11.5px]">
            <li key="all">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-2.5 py-1.5 rounded-md font-bold transition-colors cursor-pointer flex items-center justify-between ${
                  selectedCategory === "All"
                    ? "bg-[#073F73] text-white"
                    : "text-[#143B5D] hover:bg-[#EEF6FC]"
                }`}
              >
                <span>All Classified Categories</span>
                <span className="text-[10px] opacity-75">{ads.length}</span>
              </button>
            </li>

            {realEstateHubItems.map((hub) => {
              const isSelected = selectedCategory === hub.id;
              return (
                <li key={hub.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(hub.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center justify-between text-[11.5px] ${
                      isSelected
                        ? "bg-[#073F73] text-white font-extrabold"
                        : "text-[#143B5D] hover:bg-[#EEF6FC]"
                    }`}
                  >
                    <span className="truncate pr-1">{hub.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Ads List Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search bar & count */}
          <div className="bg-white border border-[#CBD5E1] rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80 flex items-center">
              <span className="absolute left-3 text-gray-400 text-[12px]">
                <FaSearch />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ads by service, agency or city..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[12px] focus:outline-hidden focus:border-[#073F73]"
              />
            </div>

            <div className="text-[11.5px] font-bold text-[#64748B]">
              Showing <span className="text-[#073F73] font-black">{filteredAds.length}</span> Verified Classified Ads
            </div>
          </div>

          {/* Ads Cards */}
          {filteredAds.length === 0 ? (
            <div className="bg-white border border-[#CBD5E1] rounded-xl p-10 text-center text-[#64748B] space-y-3">
              <FaFolder className="text-[36px] text-[#073F73]/30 mx-auto" />
              <div>
                <h4 className="text-base font-black text-[#073F73]">
                  No Classified Ads in this Category Yet
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  Be the first verified vendor, contractor, architect, material supplier, or realtor to advertise in this vertical.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(true)}
                  className="bg-[#168A3A] hover:bg-[#126f2f] text-white text-xs font-black uppercase px-4 py-2 rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FaPlusSquare />
                  <span>Post Free Classified Ad</span>
                </button>
                {selectedCategory !== "All" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="bg-gray-100 hover:bg-gray-200 text-[#073F73] text-xs font-bold px-3 py-2 rounded-md transition-colors cursor-pointer"
                  >
                    View All Categories
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white border border-[#CBD5E1] rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#0B4F8A] bg-[#EEF6FC] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                        {ad.categoryTitle}
                      </span>
                      <span className="text-[10px] font-black uppercase text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#A3D9B1]">
                        <FaCheckCircle className="text-[8.5px]" /> {ad.badge}
                      </span>
                      {ad.price && (
                        <span className="text-[11px] font-black text-[#E21F2F]">
                          {ad.price}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-black text-[#073F73] leading-snug">
                      {ad.title}
                    </h3>

                    <p className="text-[12px] text-[#475569] leading-relaxed">
                      {ad.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#1E293B] pt-1">
                      <span className="font-extrabold text-[#0C1E36]">{ad.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#64748B]">
                        <FaMapMarkerAlt className="text-[#0B4F8A]" /> {ad.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                    <a
                      href={`tel:${ad.phone}`}
                      className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-extrabold px-3 py-2 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs w-full justify-center"
                    >
                      <FaPhoneAlt className="text-[10px]" />
                      <span>Call Advertiser</span>
                    </a>
                    <Link
                      href="/contact"
                      className="bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-gray-100 text-[#073F73] text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors w-full text-center"
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Classified Ad Modal */}
      <PostAdModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAdCreated={handleAdCreated}
        defaultCategoryId={selectedCategory === "All" ? "1" : selectedCategory}
      />
    </div>
  );
}

export default function ClassifiedsPage() {
  return (
    <PortalLayout
      title="Real Estate Hub & Classifieds"
      subtitle="Connecting Verified Area Realtors, Civil Engineers, Material Suppliers, Architects & Vastu Consultants"
      badge="Classifieds Directory"
    >
      <Suspense fallback={<div className="p-8 text-center text-[#073F73] font-bold">Loading Classifieds...</div>}>
        <ClassifiedsContent />
      </Suspense>
    </PortalLayout>
  );
}
