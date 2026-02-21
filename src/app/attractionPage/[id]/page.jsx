"use client"; // Required for useState and ref hooks

import React, { useState, useRef, useEffect } from "react";
import HorizontalRule from "../../components/HorizontalRule";
import Image from "next/image";
import ImageGallery from "react-image-gallery";
import AttractionGrid from "../../components/AttractionGrid";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faInstagram, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

// FIX: Capitalized name to satisfy React Hook requirements
function AttractionPage() {
	const { id } = useParams();
	const router = useRouter();
	console.log("Parameter id:", id);
	const [loading, setLoading] = useState(true);

	const [isOpen, setIsOpen] = useState(false);
	const galleryRef = useRef(null);
	const [attraction, setAttraction] = useState([]);
	const [album, setAlbum] = useState([]);

	useEffect(() => {
		if (!id) return;

		axios
			.get(`/api/attractions/getAttractionById?id=${id}`)
			.then((res) => {
				const result = res.data.data;
				setAttraction(result);
				setAlbum(result.album || []);
				setLoading(false);
			})
			.catch((err) => console.error("Failed to fetch attraction:", err));
	}, [id]);

	const suggestionPlace = [
		{
			id: "baan-thong-krub",
			name: "Baan Thong Krub",
			location: "Pathum Thani",
			src: "/images/urbanThumbnail.jpeg",
		},
		{
			id: "song-wat",
			name: "Song Wat",
			location: "Bangkok",
			src: "/images/urbanThumbnail.jpeg",
		},
		{
			id: "bangsean-fish-market",
			name: "Bangsean Fish Market",
			location: "Chonburi",
			src: "/images/urbanThumbnail.jpeg",
		},
	];

	const handlePreviewClick = (index) => {
		setIsOpen(true);
		setTimeout(() => {
			galleryRef.current?.slideToIndex(index);
			//   galleryRef.current?.fullScreen();
		}, 50);
	};

	if (loading) {
		return (
			<div className="bg-secondary min-h-screen flex items-center justify-center">
				<p className="text-primary font-serif animate-pulse">LOADING THAIVEL...</p>
			</div>
		);
	}

	return (
		<div>
			<section className="bg-secondary min-h-screen">
				<div className="max-w-5xl px-4 m-auto py-20 md:py-30">
					{/* Header Section */}
					<div className="grid grid-cols-12 gap-3 md:gap-10">
						<div className="col-span-12 md:col-span-6 space-y-4 font-serif text-primary uppercase tracking-widest">
							<h1 className="text-4xl md:text-6xl leading-tight">
								{attraction.name}
							</h1>
							<HorizontalRule borderColor="border-primary" />
							<p className="text-sm">Location: {attraction.location}, {attraction.sub_district}, {attraction.district}, {attraction.province}</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<p className="text-sm">Open: {attraction.open_hour}</p>
								<p className="text-sm">Tel: {attraction.tel}</p>
							</div>
							{attraction.igUrl && (
								<div>
									<a href={attraction.igUrl} target="_blank" className="text-sm flex items-center gap-3">
										<FontAwesomeIcon icon={faInstagram} /> Instagram
									</a>
								</div>
							)}

							{attraction.facebookUrl && (
								<div>
									<a href={attraction.facebookUrl} target="_blank" className="text-sm flex items-center gap-3">
										<FontAwesomeIcon icon={faFacebook} /> Facebook
									</a>
								</div>
							)}

							{attraction.tiktokUrl && (
								<div>
									<a href={attraction.tiktokUrl} target="_blank" className="text-sm flex items-center gap-3">
										<FontAwesomeIcon icon={faTiktok} /> Tiktok
									</a>
								</div>
							)}

							{attraction.gmapsUrl && (
								<div>
									<a href={attraction.gmapsUrl} target="_blank" className="text-sm flex items-center gap-3">
										<FontAwesomeIcon icon={faGoogle} /> Google Maps
									</a>
								</div>
							)}
						</div>
						<div className="col-span-12 md:col-span-6 relative min-h-[400px]">
							<Image
								src={attraction.thumbnail}
								alt={attraction.name}
								fill
								className="object-cover shadow-lg"
								priority
							/>
						</div>
					</div>

					{/* Compact Grid Preview */}
					<div className="my-3 grid grid-cols-2 md:grid-cols-4 gap-4">
						{album.slice(0, 4).map((item, i) => (
							<div
								key={i}
								onClick={() => handlePreviewClick(i)}
								className="relative aspect-square overflow-hidden group cursor-pointer border-transparent hover:border-primary transition-all"
							>
								<Image
									src={item.file_path}
									alt=""
									fill
									className="object-cover transition-transform group-hover:scale-110"
								/>
								{i === 3 && (
									<div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
										<span className="text-secondary font-serif text-2xl uppercase">
											+ {album.length - 3}
										</span>
										<span className="text-secondary font-serif text-[10px] uppercase opacity-80">
											More
										</span>
									</div>
								)}
							</div>
						))}
					</div>

					{/* Description Section */}
					<div id="description" className="max-w-5xl mt-10">
						<h2 className="text-3xl md:text-4xl text-primary font-serif uppercase tracking-widest">
							{attraction.name}
						</h2>
						<HorizontalRule borderColor="border-primary" />
						<p className="text-primary font-serif leading-relaxed whitespace-pre-line text-lg opacity-90">
							{attraction.description}
						</p>
					</div>
				</div>

				<div
					className={
						isOpen
							? "fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
							: "hidden"
					}
				>
					<div className="relative w-full max-w-5xl h-full flex flex-col justify-center">
						{/* Close Button - Placed at the top right of the modal */}
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-4 right-4 md:top-0 md:-right-10 text-secondary font-serif uppercase tracking-widest hover:opacity-70 transition-opacity z-[60] text-lg"
						>
							Close [X]
						</button>

						<div className="w-full overflow-hidden">
							<ImageGallery
								ref={galleryRef}
								items={album.map((img) => ({
									original: img.file_path,
									thumbnail: img.file_path,
								}))}
								showPlayButton={false}
								showFullscreenButton={false}
								useBrowserFullscreen={false}
								thumbnailPosition="bottom"
								renderItem={(item) => (
									<div className="flex justify-center items-center h-[55vh] md:h-[65vh]">
										<div className="relative w-full h-full">
											<Image
												src={item.original}
												alt="Gallery Image"
												fill
												className="object-contain"
											/>
										</div>
									</div>
								)}
							/>
						</div>
					</div>
				</div>
			</section>

			<section id="suggestion" className="bg-secondary">
				<div className="max-w-5xl px-4 m-auto py-20 md:py-30">
					<h1 className="text-4xl md:text-6xl leading-tight uppercase font-serif text-primary">
						you may also like
					</h1>
					<HorizontalRule borderColor="border-primary" />
					<AttractionGrid attractions={suggestionPlace} />
				</div>
			</section>
		</div>
	);
}

export default AttractionPage;
