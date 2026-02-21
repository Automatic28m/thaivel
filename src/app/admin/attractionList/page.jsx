"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import HorizontalRule from "../../components/HorizontalRule";
import Link from "next/link";

const AttractionsTable = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttractions = useCallback(async () => {
    try {
      const res = await axios.get("/api/attractions/getAttractions");
      setAttractions(res.data.data || []);
    } catch (error) {
      console.error("Attractions fetch failed", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttractions();
  }, [fetchAttractions]);

  // Handle Delete Action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attraction?")) {
      try {
        await axios.delete(`/api/attractions/deleteAttraction?id=${id}`);
        alert("Deleted successfully!");
        fetchAttractions();
      } catch (err) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-30 px-8">
      <div className=" mx-auto">
        <h2 className="font-serif text-2xl  uppercase tracking-widest mb-4">
          Manage Attractions
        </h2>
        <Link href="/admin/attractionForm">Add attraction</Link>
        <HorizontalRule borderColor="border-primary" />

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left border-collapse border-2 border-primary font-serif uppercase tracking-wider">
            <thead>
              <tr className="bg-primary text-secondary">
                {/* Added 'border border-primary/20' to every header cell */}
                <th className="py-4 px-3 border border-secondary/20">ID</th>
                <th className="py-4 px-3 border border-secondary/20">Name</th>
                <th className="py-4 px-3 border border-secondary/20">
                  Location
                </th>
                <th className="py-4 px-3 border border-secondary/20">
                  Geography
                </th>
                <th className="py-4 px-3 border border-secondary/20">
                  Open Hour
                </th>
                <th className="py-4 px-3 border border-secondary/20">Tel</th>
                <th className="py-4 px-3 border border-secondary/20">
                  Gmaps Url
                </th>
                <th className="py-4 px-3 border border-secondary/20 text-center">
                  IG
                </th>
                <th className="py-4 px-3 border border-secondary/20 text-center">
                  FB
                </th>
                <th className="py-4 px-3 border border-secondary/20 text-center">
                  TT
                </th>
                <th className="py-4 px-3 border border-secondary/20">
                  Category
                </th>
                <th className="py-4 px-3 border border-secondary/20 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-primary/80">
              {attractions.map((spot) => (
                <tr
                  key={spot.id}
                  className="hover:bg-primary/5 transition-colors"
                >
                  {/* Added 'border border-primary/20' to every data cell */}
                  <td className="py-4 px-3 text-left">{spot.id}</td>
                  <td className="py-4 px-3 text-left">{spot.name}</td>
                  <td className="py-4 px-3 text-left">
                    {spot.sub_district}, {spot.district}, <br /> {spot.province}
                  </td>
                  <td className="py-4 px-3 text-left">{spot.geography}</td>

                  <td className="py-4 px-3 text-left">{spot.open_hour}</td>
                  <td className="py-4 px-3 text-left">{spot.tel}</td>
                  <td className="py-4 px-3 text-left">
                    {spot.gmapsUrl ? (
                      <a
                        href={spot.gmapsUrl}
                        target="_blank"
                        className="text-pink-600 hover:opacity-70 underline"
                      >
                        gmaps
                      </a>
                    ) : (
                      <span className="opacity-20">-</span>
                    )}
                  </td>
                  <td className="py-4 px-3 text-left">
                    {spot.igUrl ? (
                      <a
                        href={spot.igUrl}
                        target="_blank"
                        className="text-pink-600 hover:opacity-70"
                      >
                        IG
                      </a>
                    ) : (
                      <span className="opacity-20">-</span>
                    )}
                  </td>
                  <td className="py-4 px-3 text-left">
                    {spot.facebookUrl ? (
                      <a
                        href={spot.facebookUrl}
                        target="_blank"
                        className="text-blue-600 hover:opacity-70"
                      >
                        FB
                      </a>
                    ) : (
                      <span className="opacity-20">-</span>
                    )}
                  </td>
                  <td className="py-4 px-3 text-left">
                    {spot.tiktokUrl ? (
                      <a
                        href={spot.tiktokUrl}
                        target="_blank"
                        className="text-black hover:opacity-70"
                      >
                        TT
                      </a>
                    ) : (
                      <span className="opacity-20">-</span>
                    )}
                  </td>

                  <td className="py-4 px-3 text-left">{spot.category}</td>

                  <td className="py-4 px-3 text-left">
                    <button
                      onClick={() =>
                        (window.location.href = `/admin/editAttraction/${spot.id}`)
                      }
                      className="text-blue-600 hover:underline px-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(spot.id)}
                      className="text-red-600 hover:underline px-3"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttractionsTable;
