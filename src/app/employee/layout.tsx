import type { Metadata } from "next";

// Signed-in area: keep it out of search results
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
