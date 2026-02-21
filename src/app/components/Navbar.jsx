"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Updated navItems with distinct names and destination links
  const navItems = [
    { id: "Home", name: "Home", link: "/" },
    { id: "About", name: "About", link: "/about" },
    { id: "Attractions", name: "Attractions", link: "/allAttractions" },
    { id: "Regions", name: "Regions", link: "/aboutThailand" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 z-50 flex items-center border-b border-secondary/20 bg-primary/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <Link href="/" className="z-60 flex items-center gap-2">
            <span className="font-serif text-2xl tracking-tighter text-secondary uppercase">
              Thaivels
            </span>
          </Link>

          {/* FIX: Map using item.link and item.name */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="text-secondary font-serif text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 z-[60]">
            <button className="text-secondary cursor-pointer hover:scale-110 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            <button
              className="md:hidden text-secondary p-2 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-secondary transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-secondary transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-secondary transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* FIX: Mobile menu mapping using item.link and item.name */}
      <div
        className={`fixed inset-0 bg-primary/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 transition-all duration-500 md:hidden z-40
        ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            onClick={() => setIsOpen(false)}
            className="text-secondary font-serif text-3xl uppercase tracking-widest hover:scale-110 transition-transform"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
}
