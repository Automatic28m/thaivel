'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";
import { Map, MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { MapPin } from "lucide-react";
import Link from "next/link";


function AttractionCount() {
    const [count, setCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [attractions, setAttractions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/attractions/getAttractions')
                // Using the specific nested path from your logs
                const dataArray = response.data.data;
                setAttractions(dataArray);
                setCount(dataArray.length);
            } catch (error) {
                console.error("Error fetching attractions:", error);
                setCount(19);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])

    return (
        <section id="number" className="bg-primary border-y border-secondary/10">
            <div className="m-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-16 items-center">

                    {/* Map Container */}
                    <div className="col-span-1 md:col-span-7 h-[500px]">
                        {!isLoading && (
                            <Map
                                // Zoomed out to 6 to see markers across all of Thailand
                                center={[100.5018, 13.7563]}
                                zoom={4}
                            >
                                {attractions
                                    .filter(item => {
                                        const lat = parseFloat(item.lat);
                                        const lng = parseFloat(item.lon);
                                        return !isNaN(lat) && !isNaN(lng);
                                    })
                                    .map((item) => (
                                        <MapMarker
                                            key={item.id}
                                            longitude={parseFloat(item.lon)}
                                            latitude={parseFloat(item.lat)}
                                        >
                                            <MarkerContent>
                                                <div className="group cursor-pointer transition-transform hover:scale-110">
                                                    <MapPin
                                                        className="fill-secondary stroke-primary"
                                                        size={28}
                                                    />
                                                </div>
                                            </MarkerContent>
                                            <MarkerPopup>
                                                <div className="p-1 space-y-1 font-serif text-primary uppercase min-w-[120px]">
                                                    <p className="font-bold tracking-widest text-xs">{item.name}</p>
                                                    <p className="text-[9px] opacity-70">
                                                        {parseFloat(item.lat).toFixed(4)}, {parseFloat(item.lon).toFixed(4)}
                                                    </p>
                                                </div>
                                            </MarkerPopup>
                                        </MapMarker>
                                    ))}
                            </Map>
                        )}
                    </div>

                    {/* Stats Section */}
                    <div className="col-span-1 md:col-span-5 flex pb-4 flex-col items-center md:items-start gap-4 animate-fade-in scroll-reveal">
                        <div className="flex items-baseline gap-1 text-secondary">
                            <span className="text-8xl md:text-9xl font-serif tracking-tighter">
                                {!isLoading && (
                                    <SlidingNumber
                                        number={count}
                                        inView={true}
                                        inViewOnce={true}
                                        transition={{ stiffness: 100, damping: 20, mass: 1 }}
                                    />
                                )}
                            </span>
                            <span className="text-4xl md:text-6xl font-light text-secondary/40">+</span>
                        </div>

                        <p className="text-secondary font-serif text-2xl max-w-md uppercase leading-tight">
                            Destinations across Thailand.
                        </p>
                        <Link
                            href="/attractions"
                            className="w-fit px-16 block text-center uppercase text-secondary text-lg font-serif border-3 border-secondary py-3 hover:bg-secondary hover:text-primary transition-colors"
                        >
                            all attractions
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default AttractionCount