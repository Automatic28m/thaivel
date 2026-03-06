'use client'
import Image from "next/image";
import Link from "next/link";
import HorizontalRule from "./components/HorizontalRule";
import CategoryGrid from "./components/CategoryGrid";
import AttractionGrid from "./components/AttractionGrid";
import RegionGrid from "./components/RegionGrid";
import { EmblaCarousel } from "./components/Carousel";
import CarouselComponent from "./components/CarouselComponent";
import { useState, useEffect } from "react";
import axios from "axios";
import RecommendAttractions from "./components/RecommendAttractions";
import { Effect } from "./components/animate/Effect";
import { TypingText } from "@/components/animate-ui/primitives/texts/typing";
import { Slides } from "@/components/animate-ui/primitives/effects/slide";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faTurnDown } from "@fortawesome/free-solid-svg-icons";
import { faCat } from '@fortawesome/free-solid-svg-icons';
import AttractionCount from "./components/AttractionCount";

export default function Home() {

    return (
        <main>
            <section
                id="banner"
                className="relative h-fit min-h-600px w-full overflow-hidden pt-13"
            >
                <Image
                    src="/images/templeBanner.JPG"
                    alt="Ancient Thai Temple"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 max-w-5xl px-6 m-auto min-h-screen flex flex-col justify-center">
                    <Fade delay={200}>
                        <span className="text-secondary font-serif text-5xl md:text-6xl lg:text-9xl leading-tight uppercase">
                            Experience the Vibrant Soul of Thailand
                        </span>
                    </Fade>
                    <Fade delay={500}>
                        <p className="text-xl md:text-2xl text-secondary font-serif py-10 max-w-2xl">
                            From the serene grandeur of ancient temples to the sophisticated
                            pulse of modern cafes and malls, discover a journey that resonates
                            with every traveler.
                        </p>
                    </Fade>
                </div>
                <Fade delay={1000} slide={{ direction: 'up', offset: 20 }}>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                        <span className="text-secondary font-serif text-sm uppercase">
                            Scroll Down
                        </span>
                        <div className="text-secondary/80 animate-bounce">
                            {/* Reusing the Hand icon or a standard Arrow */}
                            <FontAwesomeIcon icon={faArrowDown} className="text-lg" />
                        </div>
                    </div>
                </Fade>
            </section>

            <EmblaCarousel />

            <AttractionCount />

            <section id="category" className="bg-secondary h-fit">
                <div className="max-w-5xl px-3 m-auto pt-30 pb-10 animate-fade-in scroll-reveal">
                    <div className="">
                        <span className="text-4xl md:text-6xl text-primary font-serif">
                            EXPLORE ATTRACTIONS IN THAIVEL
                        </span>
                    </div>
                    <HorizontalRule borderColor="border-primary" />
                    <CategoryGrid />
                </div>
            </section>

            <section>
                <div className="px-4 max-w-5xl m-auto py-30">
                    <div className="pt-10">
                        <span className="text-4xl md:text-6xl text-primary font-serif">
                            A JOURNEY THROUGH 6 REGIONS
                        </span>
                    </div>
                    <HorizontalRule borderColor="border-primary" />
                    <RegionGrid />
                </div>
            </section>

            <section id="about" className="h-fit bg-primary">
                <div className="max-w-5xl px-3 m-auto py-30">
                    <span className="text-4xl md:text-6xl text-secondary uppercase font-serif">
                        ABOUT THAIVEL
                    </span>
                    <hr className="my-8 border-t-2 border-secondary" />
                    <div className="grid grid-cols-12 md:gap-12 gap-3">
                        <div id="message" className="md:col-span-6 col-span-12">
                            <p className="font-serif text-secondary text-lg">
                                Welcome to Thaivel, your ultimate starting point for exploring
                                the breathtaking diversity of the Land of Smiles. If you’re
                                dreaming of a trip to Thailand but feel overwhelmed by the
                                endless possibilities, you’ve come to the right place.
                                <br />
                                <br />
                                Our mission is to simplify your adventure by gathering the very
                                best of Thailand into one comprehensive guide. We bridge the gap
                                between your curiosity and the countrys most captivating
                                destinations, spanning every corner from the misty mountains of
                                the North to the turquoise waters of the South, and from the
                                hidden gems of the West to the sun-kissed coasts of the East.
                                <br />
                                <br />
                                Whether you are looking for:
                                <br />
                                Cultural Immersion: Discover ancient Lanna traditions or the
                                vibrant festivals of the Northeast.
                                <br />
                                <br />
                                Natural Wonders: Explore lush national parks, serene waterfalls,
                                and world-class beaches.
                                <br />
                                <br />
                                Hidden Gems: Find those off-the-beaten-path locations that only
                                locals know about.
                                <br />
                                <br />
                                At Thaivel, we believe that every traveler deserves to
                                experience the authentic charm and warmth of Thai hospitality.
                                Let us help you find where to begin your journey and uncover the
                                unique identity of each region.
                            </p>
                        </div>
                        <div id="image"
                            className="md:h-full col-span-12 md:col-span-6 relative w-full aspect-square md:aspect-video"
                        >
                            <Image
                                src="/images/watchai.jpg"
                                alt="watchai"
                                fill
                                className="object-contain"
                                priority={true}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4 flex justify-center">
                            {/* Added w-full and block to make the button fill the container */}
                            <Link
                                href="/about"
                                className="w-full block text-center uppercase text-secondary text-lg font-serif border-3 border-secondary py-3 hover:bg-secondary hover:text-primary transition-colors"
                            >
                                Learn more
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="ai" className="h-fit bg-secondary">
                <div className="max-w-5xl px-3 m-auto py-30">
                    <div className="grid grid-cols-12 gap-3">
                        <div id="image"
                            className="md:h-full col-span-12 md:col-span-4 relative w-full aspect-square md:aspect-video"
                        >
                            <Image
                                src="/images/stickers/siamese_cat_happy.png"
                                alt="happy cat"
                                fill
                                className="object-contain"
                                priority={true}
                            />
                        </div>
                        <div className="col-span-8 flex flex-col gap-4">
                            <span className="text-4xl md:text-6xl text-primary uppercase font-serif">
                                <span className="text-2xl!">say hello to</span><br />Nong Wichian
                            </span>
                            <HorizontalRule borderColor="border-primary" />
                            <p className="text-lg">Your adorable and knowledgeable guide for exploring Thailand on the THAIVEL platform. Inspired by the revered Wichien Maat, or Siamese cat, this friendly AI, also known as &apos;Nong Wichian&apos;, is dedicated to assisting travelers with a personal touch.</p>
                            <div className="flex items-center gap-2 flex-wrap text-lg">
                                <p>Don&apos;t be shy! Nong Wichian is waiting to help you plan your adventure.</p>
                                <br></br><p>Click the</p>
                                {/* The Icon Container */}
                                <span className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 backdrop-blur-md bg-primary text-secondary shrink-0">
                                    <FontAwesomeIcon icon={faCat} />
                                </span>

                                <p>down on the right to say &apos;Sawasdee!&apos;</p>
                            </div>                        </div>
                    </div>
                </div>
            </section>

            <Effect fade slide>
                <RecommendAttractions />
            </Effect>

            <section id="about" className="h-fit bg-primary">
                <div className="max-w-5xl px-6 m-auto py-30">
                    <span className="text-4xl md:text-6xl text-secondary uppercase font-serif">
                        learn more about thailand
                    </span>
                    <HorizontalRule borderColor="border-secondary" />
                    <div className="grid grid-cols-12 gap-y-3 md:gap-12">
                        <div
                            id="image"
                            className="md:h-150 col-span-12 md:col-span-6 relative w-full aspect-square md:aspect-video"
                        >
                            <Image
                                src="/images/ThailandRegion.png"
                                alt="Map of Thailand 6 Regions"
                                fill
                                className="object-contain"
                                priority={true}
                            />
                        </div>
                        <div
                            id="message"
                            className="col-span-12 md:col-span-6 flex flex-col justify-center"
                        >
                            <p className="font-serif text-secondary text-lg">
                                Thailand awaits with open arms and a world of wonders.
                                Experience a land where glittering temples stand as testaments
                                to a rich history, and colorful festivals ignite the senses.
                                Whether you seek adventure in lush jungles, relaxation on
                                sun-kissed beaches, or a culinary voyage through exquisite local
                                dishes, your perfect escape is here. Uncover the secrets of the
                                Kingdom, connect with its friendly people, and let the unique
                                charm of Thailand enchant you.
                            </p>
                        </div>
                        <div className="md:col-span-4"></div>
                        <div className="col-span-12 md:col-span-4 flex justify-center">
                            {/* Added w-full and block to make the button fill the container */}
                            <Link
                                href="/aboutThailand"
                                className="w-full block text-center uppercase text-secondary text-lg font-serif border-3 border-secondary py-3 hover:bg-secondary hover:text-primary transition-colors"
                            >
                                Learn more
                            </Link>
                        </div>
                        <div className="md:col-span-4"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}
