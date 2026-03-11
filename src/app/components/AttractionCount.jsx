'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";
import { Map, MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { MapPin, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Fade } from '@/components/animate-ui/primitives/effects/fade'

function AttractionCount() {
    const [count, setCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [attractions, setAttractions] = useState([]);
    const mapRef = useRef(null);

    const initialCenter = [100.5018, 13.7563];
    const initialZoom = 4;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/attractions/getAttractions')
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

    const handleReset = () => {
        if (mapRef.current) {
            mapRef.current.flyTo({
                center: initialCenter,
                zoom: initialZoom,
                duration: 1500
            });
        }
    };

    return (
        <section id="number" className="bg-primary border-y border-secondary/10">
            <div className="m-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-16 items-center">

                    {/* Map Container */}
                    <div className="col-span-1 md:col-span-7 h-[500px] relative">
                        {!isLoading && (
                            <>
                                <Map
                                    ref={mapRef}
                                    center={initialCenter}
                                    zoom={initialZoom}
                                >
                                    {attractions
                                        .filter(item => {
                                            const lat = parseFloat(item.lat);
                                            const lng = parseFloat(item.lon);
                                            return !isNaN(lat) && !isNaN(lng);
                                        })
                                        .map((item, i) => (
                                            <MapMarker
                                                key={item.id}
                                                longitude={parseFloat(item.lon)}
                                                latitude={parseFloat(item.lat)}
                                            >
                                                <MarkerContent>
                                                    <Fade
                                                        delay={100 + (i * 100)}
                                                        inView={true}
                                                        inViewOnce={true}
                                                    >

                                                        <div className="group cursor-pointer transition-transform hover:scale-110">
                                                            <MapPin
                                                                className="fill-secondary stroke-primary"
                                                                size={28}
                                                            />
                                                        </div>
                                                    </Fade>
                                                </MarkerContent>
                                                <MarkerPopup>
                                                    <Link href={`/attractionPage/${item.id}`}>
                                                        <div className="p-1 space-y-1 font-serif text-primary uppercase min-w-[120px]">
                                                            <p className="font-bold tracking-widest text-xs">{item.name}</p>
                                                            <p className="text-xs">{item.sub_district}, {item.district}, {item.province}</p>
                                                            {/* <p className="text-[9px] opacity-70">
                                                                {parseFloat(item.lat).toFixed(4)}, {parseFloat(item.lon).toFixed(4)}
                                                            </p> */}
                                                        </div>
                                                    </Link>
                                                </MarkerPopup>
                                            </MapMarker>
                                        ))}
                                </Map>

                                {/* Floating Reset Button */}
                                <button
                                    onClick={handleReset}
                                    className="absolute bottom-4 left-4 z-10 bg-secondary/80 hover:bg-secondary text-primary p-2 transition-all border border-primary/20 backdrop-blur-sm shadow-lg flex items-center gap-2 uppercase font-serif text-[10px] tracking-widest"
                                    aria-label="Reset Map View"
                                >
                                    <RotateCcw size={14} />
                                    <span>Reset View</span>
                                </button>
                            </>
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