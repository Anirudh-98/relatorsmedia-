"use client";

import React, { useState } from "react";
import { FaTimes, FaBullhorn, FaCheck, FaShieldAlt } from "react-icons/fa";
import { realEstateHubItems } from "@/data/portalData";
import { CITIES_LIST, ClassifiedAd } from "@/data/classifiedsData";

export interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCreated: (newAd: ClassifiedAd) => void;
  defaultCategoryId?: string;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  onAdCreated,
  defaultCategoryId = "1",
}) => {
  const [formData, setFormData] = useState({
    categoryId: defaultCategoryId,
    title: "",
    businessName: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "Hyderabad",
    location: "",
    experience: "5+ Years",
    priceRange: "",
    description: "",
    servicesInput: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const category =
      realEstateHubItems.find((c) => c.id === formData.categoryId) ||
      realEstateHubItems[0];

    const servicesList = formData.servicesInput
      ? formData.servicesInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : ["Verified Service", "Direct Contact"];

    const newAd: ClassifiedAd = {
      id: `user-ad-${Date.now()}`,
      categoryId: formData.categoryId,
      categoryName: category.title,
      title: formData.title,
      businessName: formData.businessName,
      contactPerson: formData.contactPerson || formData.businessName,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone.replace(/[^0-9]/g, ""),
      email: formData.email,
      city: formData.city,
      location: formData.location,
      experience: formData.experience,
      rating: 5.0,
      reviewCount: 1,
      priceRange: formData.priceRange || "Contact for Quote",
      verified: true,
      featured: true,
      description: formData.description,
      services: servicesList,
      postedDate: "Today",
      badge: "NEW LISTING",
    };

    onAdCreated(newAd);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071E36]/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#CBD5E1] overflow-hidden flex flex-col my-auto max-h-[95vh]">
        {/* Header */}
        <div className="bg-[#073F73] px-4 py-3 flex items-center justify-between text-white border-b border-[#0B4F8A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F7C900] text-[#073F73] flex items-center justify-center font-black">
              <FaBullhorn className="text-[14px]" />
            </div>
            <div>
              <h2 className="text-[15px] font-black uppercase tracking-wide">
                Post Free Classified Ad
              </h2>
              <p className="text-[11.5px] text-[#BAE6FD]">
                Real Estate Hub • Verified Business & Services Directory
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <FaTimes className="text-[14px]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-[#FAFBFD]">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 text-[24px]">
                <FaCheck />
              </div>
              <h3 className="text-[18px] font-black text-[#0B213D] mb-1">
                Classified Ad Posted Successfully!
              </h3>
              <p className="text-[13px] text-[#64748B] max-w-md">
                Your listing is now live in the Real Estate Hub directory. Buyers and investors can now reach you directly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                  Select Real Estate Hub Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white cursor-pointer"
                >
                  {realEstateHubItems.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ad Title */}
              <div>
                <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                  Ad Title / Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Authorized Channel Partner for HMDA Plots & Luxury Villas"
                  className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                />
              </div>

              {/* Business Name & Contact Person */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                    Business / Firm Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="e.g. Landmark Realty Services"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                    placeholder="e.g. K. Rajesh"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                  />
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                  />
                </div>
              </div>

              {/* City & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white cursor-pointer"
                  >
                    {CITIES_LIST.filter((c) => c !== "All Cities").map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                    Area / Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Hitec City, Gachibowli"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                  />
                </div>
              </div>

              {/* Experience & Price Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder="e.g. 8+ Years"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                    Price Range / Rate (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.priceRange}
                    onChange={(e) =>
                      setFormData({ ...formData, priceRange: e.target.value })
                    }
                    placeholder="e.g. Starting ₹25 L or ₹1,800/sq.ft"
                    className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                  />
                </div>
              </div>

              {/* Services Tags */}
              <div>
                <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                  Key Services / Specializations (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.servicesInput}
                  onChange={(e) =>
                    setFormData({ ...formData, servicesInput: e.target.value })
                  }
                  placeholder="e.g. Gated Communities, HMDA Approvals, Spot Registration"
                  className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-[11px] font-black uppercase text-[#334155] mb-1">
                  Description / Offer Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your services, completed projects, special deals, or client advantages..."
                  className="w-full px-3 py-2 text-[12.5px] font-semibold border border-[#CBD5E1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] bg-white"
                />
              </div>

              {/* Notice */}
              <div className="p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-md flex items-center gap-2 text-[#1E40AF] text-[11.5px]">
                <FaShieldAlt className="text-[#3B82F6] flex-shrink-0" />
                <span>
                  Your classified ad will be published on the Realtors Media Classifieds Hub with verified badge and direct contact buttons.
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-[12px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#073F73] hover:bg-[#052E54] text-white font-black text-[12px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FaBullhorn className="text-[11px]" />
                  <span>Publish Classified Ad</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
