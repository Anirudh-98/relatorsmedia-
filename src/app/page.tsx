"use client";

import React, { useState } from "react";
import { TopHeader } from "@/components/Header/TopHeader";
import { MainNavigation } from "@/components/Header/MainNavigation";
import { LeftSidebar } from "@/components/LeftSidebar/LeftSidebar";
import { MediaHero } from "@/components/CenterContent/MediaHero";
import { LatestUpdates } from "@/components/CenterContent/LatestUpdates";
import { PropertyCategories } from "@/components/CenterContent/PropertyCategories";
import { ServicesSection } from "@/components/CenterContent/ServicesSection";
import { AudienceCards } from "@/components/CenterContent/AudienceCards";
import { RightSidebar } from "@/components/RightSidebar/RightSidebar";
import { StatisticsBar } from "@/components/Bottom/StatisticsBar";
import { Footer } from "@/components/Bottom/Footer";
import { MobileDrawer } from "@/components/ui/MobileDrawer";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F9] text-[#18324A] w-full overflow-x-hidden justify-between">
      {/* 1. TOP HEADER (Full Width) */}
      <TopHeader />

      {/* 2. MAIN NAVIGATION BAR (Full Width) */}
      <MainNavigation
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Drawer Navigation */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 3. MAIN THREE-COLUMN AREA (Full Width, fills remaining viewport height on desktop) */}
      <main className="flex-1 min-h-0 w-full px-2 sm:px-3 xl:px-4 py-1 flex flex-col justify-between">
        {/* Proportional full-screen columns: Left ~19%, Center ~57%, Right ~24% */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,19%)_minmax(0,1fr)_minmax(280px,24%)] xl:grid-cols-[minmax(235px,19%)_minmax(0,1fr)_minmax(300px,24%)] gap-2 xl:gap-2.5 items-stretch w-full h-full min-h-0">
          {/* LEFT SIDEBAR (REAL ESTATE HUB) */}
          <div className="w-full min-w-0 order-2 lg:order-1 h-full min-h-0 flex flex-col">
            <LeftSidebar />
          </div>

          {/* CENTER CONTENT */}
          <div className="w-full min-w-0 order-1 lg:order-2 h-full min-h-0 flex flex-col justify-between">
            {/* Featured Media / Live Broadcast Studio */}
            <MediaHero />

            {/* Latest Updates Ticker */}
            <LatestUpdates />

            {/* Property & Project Categories (5x2 Grid) */}
            <PropertyCategories />

            {/* Services & Opportunities */}
            <ServicesSection />

            {/* Four Audience Cards */}
            <AudienceCards />
          </div>

          {/* RIGHT SIDEBAR (MEMBER LOGIN, ID CARDS, QUICK ACTIONS) */}
          <div className="w-full min-w-0 order-3 lg:order-3 h-full min-h-0 flex flex-col">
            <RightSidebar />
          </div>
        </div>
      </main>

      {/* 4. STATISTICS BAR (Full Width) */}
      <StatisticsBar />

      {/* 5. FOOTER (Full Width) */}
      <Footer />
    </div>
  );
}
