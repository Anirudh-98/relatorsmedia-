import React from "react";
import { MemberLogin } from "./MemberLogin";
import { UniqueIdCards } from "./UniqueIdCards";
import { QuickActions } from "./QuickActions";

export const RightSidebar: React.FC = () => {
  return (
    <aside className="w-full flex flex-col gap-1 sm:gap-1.5" aria-label="Member Area and Actions">
      <MemberLogin />
      <UniqueIdCards />
      <QuickActions />
    </aside>
  );
};
