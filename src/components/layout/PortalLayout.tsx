"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopHeader } from "@/components/Header/TopHeader";
import { MainNavigation } from "@/components/Header/MainNavigation";
import { MobileDrawer } from "@/components/ui/MobileDrawer";
import { StatisticsBar } from "@/components/Bottom/StatisticsBar";
import { Footer } from "@/components/Bottom/Footer";
import { FaChevronRight, FaHome } from "react-icons/fa";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PortalLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  breadcrumbs,
  title,
  subtitle,
  badge,
  action,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F9] text-[#18324A] w-full">
      {/* 1. TOP HEADER */}
      <TopHeader />

      {/* 2. MAIN NAVIGATION BAR */}
      <MainNavigation
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 3. BREADCRUMBS & PAGE HEADER (If not homepage) */}
      {pathname !== "/" && (
        <div className="w-full bg-white border-b border-[#C9D7E3] px-3 sm:px-4 lg:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Breadcrumb links */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-bold text-[#64748B]">
              <Link
                href="/"
                className="hover:text-[#073F73] flex items-center gap-1 transition-colors"
              >
                <FaHome className="text-[12px] text-[#073F73]" />
                <span>Home</span>
              </Link>

              {breadcrumbs && breadcrumbs.length > 0 ? (
                breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <FaChevronRight className="text-[8px] text-gray-400" />
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-[#073F73] transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[#073F73] font-extrabold">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <>
                  <FaChevronRight className="text-[8px] text-gray-400" />
                  <span className="text-[#073F73] font-extrabold capitalize">
                    {title || pathname.replace("/", "").replace(/-/g, " ")}
                  </span>
                </>
              )}
            </nav>

            {/* Right Action / Info badge */}
            <div className="flex items-center gap-2">
              {badge && (
                <span className="bg-[#E7F6EA] text-[#168A3A] border border-[#A3D9B1] text-[10px] sm:text-[10.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {badge}
                </span>
              )}
              {action}
            </div>
          </div>

          {/* Title and Subtitle banner if provided */}
          {title && (
            <div className="max-w-7xl mx-auto pt-2 pb-1 border-t border-gray-100 mt-1.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h1 className="text-[18px] sm:text-[22px] font-black text-[#073F73] tracking-tight uppercase">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-[12px] sm:text-[13px] font-medium text-[#475569]">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {children}
      </main>

      {/* 5. STATISTICS BAR */}
      <StatisticsBar />

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
};
