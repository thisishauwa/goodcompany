"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StarFlair } from "@/components/ui/Illustrations";
import {
  Book1,
  ArchiveBook,
  Heart,
  ShieldSecurity,
  HambergerMenu,
} from "iconsax-react";
import { X, ArrowRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("current-read");

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Section observer for homepage sections
  useEffect(() => {
    if (pathname !== "/") return;

    // Check hash on load
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["current-read", "shelf", "about", "shelves"].includes(hash)) {
        setActiveSection(hash === "shelves" ? "shelf" : hash);
      }
    }

    const handleScroll = () => {
      const sections = ["about", "shelf", "current-read"];
      const scrollPos = window.scrollY + 200;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navLinks = [
    {
      name: "Current Read",
      href: "/#current-read",
      sectionId: "current-read",
      path: "/",
      desc: "Active book selection & pacing",
      icon: Book1,
    },
    {
      name: "Our Shelf",
      href: "/#shelf",
      sectionId: "shelf",
      path: "/",
      desc: "Browse our catalog & archives",
      icon: ArchiveBook,
    },
    {
      name: "The Club",
      href: "/#about",
      sectionId: "about",
      path: "/",
      desc: "Our story, community & gatherings",
      icon: Heart,
    },
    {
      name: "Guidelines",
      href: "/guidelines",
      sectionId: "guidelines",
      path: "/guidelines",
      desc: "WhatsApp etiquette & house rules",
      icon: ShieldSecurity,
    },
  ];

  const isLinkActive = (link: (typeof navLinks)[0]) => {
    if (link.path === "/guidelines") {
      return pathname === "/guidelines";
    }
    if (pathname === "/") {
      return activeSection === link.sectionId;
    }
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#F6EEE9]/95 backdrop-blur-sm border-b border-[#5B2302]/10 transition-all">
        <nav
          aria-label="Main navigation"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between"
        >
          {/* Official Brand Logo */}
          <Link
            href="/"
            className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2302] rounded-lg py-1"
          >
            <img
              src="/images/logo-web.png"
              alt="Good Company Book Club"
              className="h-14 sm:h-16 md:h-18 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links — darker active, transparent inactive, no underline */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-extrabold transition-colors py-2 px-3 tracking-wider uppercase font-body flex items-center ${
                    active
                      ? "text-[#5B2302]"
                      : "text-[#5B2302]/45 hover:text-[#5B2302]/80"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold uppercase rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] border border-[#5B2302] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <StarFlair className="w-3.5 h-3.5 text-[#FFA5D5]" />
              Apply to Join
            </Link>
          </div>

          {/* Mobile/Tablet Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="p-2.5 rounded-full text-[#5B2302] hover:bg-[#5B2302]/10 transition-colors border border-[#5B2302]/20"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#5B2302]" strokeWidth={2.2} />
              ) : (
                <HambergerMenu size={22} color="#5B2302" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown — overlays below the main header so the logo never moves */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden absolute top-full left-0 right-0 border-b border-[#5B2302]/15 bg-[#F6EEE9] shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
              <div className="flex flex-col divide-y divide-[#5B2302]/10">
                {navLinks.map((link) => {
                  const active = isLinkActive(link);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`py-3.5 flex items-center justify-between transition-colors ${
                        active
                          ? "text-[#5B2302]"
                          : "text-[#5B2302]/45 hover:text-[#5B2302]"
                      }`}
                    >
                      <span className="font-block text-2xl uppercase tracking-tight">
                        {link.name}
                      </span>
                      <ArrowRight
                        className="w-5 h-5 shrink-0"
                        strokeWidth={2}
                      />
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-full bg-[#5B2302] text-[#F6EEE9] text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#3D1600] active:scale-[0.99] transition-all border border-[#5B2302]"
              >
                <StarFlair className="w-4 h-4 text-[#FFA5D5]" />
                Apply to Join
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
