import type { Metadata } from "next";
import { Inter, Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-card",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "REALTORS MEDIA | Real Estate Information, People, Properties & Opportunities",
  description:
    "Real estate information, properties, projects, professionals, opportunities, market insights and networking through REALTORS MEDIA.",
  keywords: [
    "Realtors Media",
    "Real Estate Portal",
    "Properties",
    "Projects",
    "Realtors",
    "Plots",
    "Apartments",
    "Hyderabad Real Estate",
    "India Real Estate",
  ],
  openGraph: {
    title: "REALTORS MEDIA | Real Estate Information, People, Properties & Opportunities",
    description:
      "Real estate information, properties, projects, professionals, opportunities, market insights and networking through REALTORS MEDIA.",
    siteName: "REALTORS MEDIA",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-[#F4F7F9] text-[#18324A] font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
