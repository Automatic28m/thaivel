"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/getCategories")
      .then((res) => {
        setCategories(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Category fetch failed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-primary font-serif uppercase tracking-widest animate-pulse">
          Loading Categories...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-12">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          // 1. UPDATED ROUTE: Point directly to our new filter page logic!
          href={`/attractions?category=${cat.id}&search=&page=1`}
          className="aspect-square w-full col-span-6 md:col-span-4 relative flex flex-col justify-end p-3 md:p-6 overflow-hidden group shadow-lg rounded"
        >
          {cat.thumbnail ? (
            <Image
              src={cat.thumbnail}
              alt={`${cat.name} Category`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
              <span className="text-primary/40 font-serif text-sm uppercase tracking-widest">No Image</span>
            </div>
          )}

          {/* Unified Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors duration-300" />

          {/* Unified Animated Text Content */}
          <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
            <span className="block font-serif text-xl md:text-2xl text-secondary uppercase leading-tight">
              {cat.name}
            </span>
            {/* Added a small 'Explore' subtitle to match the two-line style of attractions */}
            <span className="block font-serif text-[10px] md:text-xs text-secondary/70 uppercase tracking-[0.2em] mt-1">
              Explore Collection
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}