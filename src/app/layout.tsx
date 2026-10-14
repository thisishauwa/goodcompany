import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/lib/store/app-context";

const bertholdBlock = localFont({
  src: "../fonts/blockberthold.otf",
  variable: "--font-block",
  display: "swap",
});

const goodtimeScript = localFont({
  src: "../fonts/made-goodtime-script.otf",
  variable: "--font-script",
  display: "swap",
});

const ttInterphases = localFont({
  src: [
    {
      path: "../fonts/tt-interphases-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/tt-interphases-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/tt-interphases-demibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/tt-interphases-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Good Company — Good Books. Better Conversations.",
  description:
    "A warm, thoughtful book club for passionate readers. Come for the books. Stay for the debates, friendships, and opinions about fictional people.",
  openGraph: {
    title: "Good Company — Good Books. Better Conversations.",
    description: "A warm, thoughtful book club for passionate readers.",
    url: "https://readwithgoodcompany.com",
    siteName: "Good Company",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Good Company — Good Books. Better Conversations.",
    description: "A warm, thoughtful book club for passionate readers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${ttInterphases.variable} ${bertholdBlock.variable} ${goodtimeScript.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F6EEE9] text-[#5B2302] selection:bg-[#FFA5D5]/60 selection:text-[#5B2302]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
