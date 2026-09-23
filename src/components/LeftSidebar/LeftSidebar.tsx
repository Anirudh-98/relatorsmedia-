import React from "react";
import { RealEstateHub } from "./RealEstateHub";

export const LeftSidebar: React.FC = () => {
  return (
    <aside className="w-full h-full flex flex-col" aria-label="Real Estate Hub Directory">
      <RealEstateHub />
    </aside>
  );
};
