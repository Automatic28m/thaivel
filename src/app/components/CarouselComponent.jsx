'use client'
import React, { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
// import AutoScroll from 'embla-carousel-auto-scroll'
import Autoplay from 'embla-carousel-autoplay'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { faHand } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Fade } from '@/components/animate-ui/primitives/effects/fade'

export default function CarouselComponent() {
    const [attractions, setAttractions] = useState([])
    const [loading, setLoading] = useState(true)

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        dragFree: false,
        focus: true,
        duration: 40,
        skipSnaps: true,
    }, [
        Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true
        })
    ]);

    useEffect(() => {
        if (emblaApi) emblaApi.reInit();
    }, [emblaApi, attractions]);

    // 2. Data Fetching with Infinite Duplication Fix
    useEffect(() => {
        axios.get('/api/attractions/getRecommendAttractions')
            .then((res) => {
                // Accessing the 'data' array from your MySQL response object
                const data = (res.data.data || []).filter(item => item.thumbnail);

                // Auto-fill logic: Duplicates slides to ensure the track covers the viewport twice
                // This prevents the "blank end" gap on wider screens
                const infiniteData = data.length > 0 && data.length < 10
                    ? [...data, ...data, ...data]
                    : data;

                setAttractions(infiniteData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Carousel fetch failed:", err);
                setLoading(false);
            });
    }, []);

    // 3. Conditional Rendering: Prevents Embla initialization on empty nodes
    if (loading) return <div className="h-[600px] bg-secondary animate-pulse" />

    return (
        <section className="bg-secondary overflow-hidden min-h-[600px]">
            {/* FIX: Instead of 'if (loading) return...', we render the container first 
               and ONLY render the embla content once loading is done.
            */}
            {loading ? (
                <div className="h-[600px] w-full animate-pulse bg-primary/5 rounded-3xl" />
            ) : (
                <>
                    <div className="embla w-full flex justify-start" ref={emblaRef}>
                        <div className="embla__container flex gap-4 px-0">
                            {attractions.map((item, index) => (
                                <Fade delay={0 + (index * 100)}
                                    inView={true}
                                    inViewOnce={true}
                                    key={`${item.id}-${index}`}
                                    className="embla__slide flex-[0_0_85%] md:flex-[0_0_32%] relative"
                                >
                                    <Link href={`/attractionPage/${item.id}`} className="block group">
                                        <div className="relative aspect-[9/16] max-h-[75vh] overflow-hidden rounded shadow-xl transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:z-20 border border-primary/10">
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 85vw, 32vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8">
                                                <h2 className="text-secondary font-serif text-2xl uppercase leading-tight">
                                                    {item.name}
                                                </h2>
                                                <span className='text-secondary font-serif text-md uppercase opacity-80'>
                                                    {item.category} | {item.province}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </Fade>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 max-w-5xl justify-center mx-auto uppercase pt-10">
                        Drag to slide <FontAwesomeIcon icon={faHand} />
                    </div>
                </>
            )}
        </section>
    )
}