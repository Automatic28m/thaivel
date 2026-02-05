import React from "react";
import Link from "next/link";

function regionGrid() {
    const regionLink = [
        {
            id: "North",
            name: "North",
            link: "#"
        },
        {
            id: "East",
            name: "East",
            link: "#"
        },
        {
            id: "North-East",
            name: "North-East",
            link: "#"
        },
        {
            id: "South",
            name: "South",
            link: "#"
        },
        {
            id: "West",
            name: "West",
            link: "#"
        },
        {
            id: "Central",
            name: "Central",
            link: "#"
        },
    ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-12 gap-12">
      {regionLink.map((item) => (
        <Link key={item.id} href={item.link} className="group col-span-4">
          <h3 className="font-serif text-lg text-primary uppercase tracking-widest transition-all group-hover:pl-2 group-hover:opacity-70">
            {item.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}

export default regionGrid;
