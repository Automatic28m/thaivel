'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

function RegionGrid() {
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    axios
      .get('/api/regions/getRegions')
      .then((res) => setRegions(res.data))
      .catch((error) => console.error("Axios error : ", error.message))
  }, [])

  // const regionLink = [
  //   {
  //     id: "North",
  //     name: "North",
  //     link: "north"
  //   },
  //   {
  //     id: "East",
  //     name: "East",
  //     link: "#"
  //   },
  //   {
  //     id: "North-East",
  //     name: "North-East",
  //     link: "#"
  //   },
  //   {
  //     id: "South",
  //     name: "South",
  //     link: "#"
  //   },
  //   {
  //     id: "West",
  //     name: "West",
  //     link: "#"
  //   },
  //   {
  //     id: "Central",
  //     name: "Central",
  //     link: "#"
  //   },
  // ]
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-12 gap-12">
      {regions.map((item) => (
        <Link key={item.id} href={`/attractions?region=${item.name_eng.toLowerCase()}&category=&search=&page=1`} className="group col-span-4">
          <h3 className="font-serif text-lg text-primary uppercase tracking-widest transition-all group-hover:pl-2 group-hover:opacity-70">
            {item.name_eng}
          </h3>
        </Link>
      ))}
    </div>
  );
}

export default RegionGrid;
