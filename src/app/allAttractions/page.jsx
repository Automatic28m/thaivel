"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import HorizontalRule from "../components/HorizontalRule";
import Pagination from "../components/Pagination";
import AttractionGrid from "../components/AttractionGrid";
import axios from "axios";

// 1. Expanded Mock Data (6 items per page)
// const allAttractions = [
// 	// --- CENTRAL THAILAND ---
// 	{
// 		id: 1,
// 		name: "Baan Thong Krub",
// 		location: "Pathum Thani",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "cafe",
// 	},
// 	{
// 		id: 2,
// 		name: "Song Wat Road",
// 		location: "Bangkok",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 3,
// 		name: "Wat Arun",
// 		location: "Bangkok",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 4,
// 		name: "The Grand Palace",
// 		location: "Bangkok",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 5,
// 		name: "Damnoen Saduak",
// 		location: "Ratchaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 6,
// 		name: "Chatuchak Market",
// 		location: "Bangkok",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "street food",
// 	},
// 	{
// 		id: 7,
// 		name: "Maeklong Railway",
// 		location: "Samut Songkhram",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 8,
// 		name: "Ayutthaya Ruins",
// 		location: "Ayutthaya",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},

// 	// --- NORTHERN THAILAND ---
// 	{
// 		id: 9,
// 		name: "Wat Phra That Doi Suthep",
// 		location: "Chiang Mai",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 10,
// 		name: "Mae Kampong Village",
// 		location: "Chiang Mai",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 11,
// 		name: "The White Temple",
// 		location: "Chiang Rai",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 12,
// 		name: "Pai Canyon",
// 		location: "Mae Hong Son",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 13,
// 		name: "Doi Inthanon Peak",
// 		location: "Chiang Mai",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 14,
// 		name: "Sukhothai Park",
// 		location: "Sukhothai",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 15,
// 		name: "Golden Triangle",
// 		location: "Chiang Rai",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 16,
// 		name: "Sunday Walking Street",
// 		location: "Chiang Mai",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "street food",
// 	},

// 	// --- SOUTHERN THAILAND ---
// 	{
// 		id: 17,
// 		name: "Railay Beach",
// 		location: "Krabi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 18,
// 		name: "Koh Phi Phi",
// 		location: "Krabi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 19,
// 		name: "Phromthep Cape",
// 		location: "Phuket",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 20,
// 		name: "Phang Nga Bay",
// 		location: "Phang Nga",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 21,
// 		name: "Cheow Lan Lake",
// 		location: "Surat Thani",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 22,
// 		name: "Ang Thong Marine Park",
// 		location: "Surat Thani",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 23,
// 		name: "Similan Islands",
// 		location: "Phang Nga",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 24,
// 		name: "Full Moon Party Beach",
// 		location: "Koh Phangan",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},

// 	// --- NORTHEAST (ISAN) ---
// 	{
// 		id: 25,
// 		name: "Phanom Rung",
// 		location: "Buriram",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 26,
// 		name: "Red Lotus Lake",
// 		location: "Udon Thani",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 27,
// 		name: "Phu Kradueng Peak",
// 		location: "Loei",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 28,
// 		name: "Wat Sirindhorn Wararam",
// 		location: "Ubon Ratchathani",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 29,
// 		name: "Sam Phan Bok",
// 		location: "Ubon Ratchathani",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 30,
// 		name: "Sala Keoku",
// 		location: "Nong Khai",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 31,
// 		name: "Khao Yai National Park",
// 		location: "Nakhon Ratchasima",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 32,
// 		name: "Isan Street Market",
// 		location: "Khon Kaen",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "street food",
// 	},

// 	// --- EASTERN THAILAND ---
// 	{
// 		id: 33,
// 		name: "Bangsean Fish Market",
// 		location: "Chonburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "restaurant",
// 	},
// 	{
// 		id: 34,
// 		name: "Koh Samet",
// 		location: "Rayong",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 35,
// 		name: "Tung Prong Thong",
// 		location: "Rayong",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 36,
// 		name: "Sanctuary of Truth",
// 		location: "Pattaya",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 37,
// 		name: "Koh Larn",
// 		location: "Chonburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 38,
// 		name: "Chanthaburi Waterfront",
// 		location: "Chanthaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 39,
// 		name: "Koh Kood",
// 		location: "Trat",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},
// 	{
// 		id: 40,
// 		name: "Rayong Fruit Orchard",
// 		location: "Rayong",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "street food",
// 	},

// 	// --- WESTERN THAILAND ---
// 	{
// 		id: 41,
// 		name: "Erawan Falls",
// 		location: "Kanchanaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 42,
// 		name: "River Kwai Bridge",
// 		location: "Kanchanaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 43,
// 		name: "Phra Nakhon Khiri",
// 		location: "Phetchaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "temple",
// 	},
// 	{
// 		id: 44,
// 		name: "Sangkhlaburi Bridge",
// 		location: "Kanchanaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 45,
// 		name: "Death Railway",
// 		location: "Kanchanaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 46,
// 		name: "Mallika City",
// 		location: "Kanchanaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 47,
// 		name: "Huay Mae Khamin",
// 		location: "Kanchanaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// 	{
// 		id: 48,
// 		name: "Cha-am Beach",
// 		location: "Phetchaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "beach",
// 	},

// 	// --- EXTRA GEMS ---
// 	{
// 		id: 49,
// 		name: "Jodd Fairs Market",
// 		location: "Bangkok",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "street food",
// 	},
// 	{
// 		id: 50,
// 		name: "Srinakarin Dam",
// 		location: "Kanchanaburi",
// 		src: "/images/urbanThumbnail.jpeg",
// 		category: "urban",
// 	},
// ];

const categoryItems = [
	"temple",
	"beach",
	"cafe",
	"restaurant",
	"street food",
	"urban",
];

function Attractions() {

	const [allAttractions, setAttractions] = useState([]);

	useEffect(() => {
		axios
			.get('/api/attractions/getAttractions')
			.then((res) => setAttractions(res.data.data))
			.catch((err) => console.error('Error fetching attractions:', err));
	}, []);

	const router = useRouter();
	const searchParams = useSearchParams();

	// 1. DERIVE state directly from URL (No useState needed for currentPage)
	const currentPage = Number(searchParams.get("page")) || 1;

	const itemsPerPage = 6;
	const totalPages = Math.ceil(allAttractions.length / itemsPerPage);

	// 2. Optimized change handler
	const handlePageChange = (page) => {
		// This updates the URL, which triggers a re-render with the new 'currentPage'
		router.push(`/attractions?page=${page}`, { scroll: false });

		// Custom smooth scroll as per your design
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const currentItems = allAttractions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	return (
		<div>
			<section id="attractions" className="bg-secondary min-h-screen">
				<div className="max-w-5xl px-3 m-auto py-30">
					<div className="pb-10">
						<span className="text-4xl md:text-6xl text-primary font-serif uppercase">
							Category attraction
						</span>
						<HorizontalRule borderColor="border-primary" />
					</div>

					<div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-12 pb-10">
						{categoryItems.map((item) => (
							<Link
								key={item}
								href={`/category/${item}`}
								className="group col-span-4"
							>
								<h3 className="font-serif text-lg text-primary uppercase tracking-widest transition-all group-hover:pl-2 group-hover:opacity-70">
									{item}
								</h3>
							</Link>
						))}
					</div>

					{/* Search Section */}
					<section id="search" className="pb-10">
						<div className="grid grid-cols-12 md:gap-x-12 gap-y-3">
							<input
								type="text"
								placeholder="attraction, location..."
								className="col-span-12 md:col-span-8 text-primary text-lg font-serif border-3 border-primary py-3 uppercase px-3 outline-none"
							/>
							<button className="col-span-12 md:col-span-4 w-full uppercase text-primary text-lg font-serif border-3 border-primary py-3 hover:bg-primary hover:text-secondary transition-colors cursor-pointer">
								search
							</button>
						</div>
					</section>

					{/* 3. Paginated Attraction Grid */}
					<AttractionGrid attractions={currentItems} />

					{/* 4. Pagination Buttons (image_0c1564.jpg style) */}
					<div className="mt-16">
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Attractions;
