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
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Map, MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";
import { MapPin, RotateCcw } from "lucide-react";
import RecommendAttractions from "@/app/components/RecommendAttractions";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";

function AttractionPage() {
	const { id } = useParams();
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	const [isOpen, setIsOpen] = useState(false);
	const galleryRef = useRef(null);
	const mapRef = useRef(null);
	const [attraction, setAttraction] = useState({});
	const [album, setAlbum] = useState([]);

	const [mapCoords, setMapCoords] = useState(null);

	const handleResetMap = () => {
		if (mapRef.current && mapCoords) {
			mapRef.current.flyTo({
				center: [mapCoords.lng, mapCoords.lat],
				zoom: 14,
				duration: 1500
			});
		}
	};

	useEffect(() => {
		if (!id) return;

		axios
			.get(`/api/attractions/getAttractionById?id=${id}`)
			.then((res) => {
				const result = res.data.data;
				setAttraction(result);
				setAlbum(result.album || []);

				// 2. Safely parse coordinates from the database
				// MySQL Decimal types are often returned as strings, so we use parseFloat
				const lat = parseFloat(result.lat || result.latitude);
				const lon = parseFloat(result.lon || result.longitude);

				// Only set the map if we have valid numbers
				if (!isNaN(lat) && !isNaN(lon)) {
					setMapCoords({ lat: lat, lng: lon });
				}

				setLoading(false);
			})
			.catch((err) => console.error("Failed to fetch attraction:", err));
	}, [id]);

	const handlePreviewClick = (index) => {
		setIsOpen(true);
		setTimeout(() => {
			galleryRef.current?.slideToIndex(index);
		}, 50);
	};

	if (loading) {
		return (
			<div className="bg-secondary min-h-screen flex items-center justify-center">
				<p className="text-primary font-serif animate-pulse">LOADING THAIVELS...</p>
			</div>
		);
	}

	return (
		<div>
			<section className="bg-secondary min-h-screen">
				<div className="max-w-5xl px-4 m-auto py-20 md:py-30">
					{/* Header Section */}
					<div className="grid grid-cols-12 gap-3 md:gap-4">
						<div className="col-span-12 md:col-span-6 space-y-4 font-serif text-primary uppercase tracking-widest">
							<h1 className="text-4xl md:text-6xl leading-tight">
								{attraction.name}
							</h1>
							<HorizontalRule borderColor="border-primary" />
							<p className="text-sm">Location: {attraction.location}, {attraction.sub_district}, {attraction.district}, {attraction.province}</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{attraction.open_hour && (
									<p className="text-sm">Open: {attraction.open_hour}</p>
								)}
								{attraction.tel && (
									<p className="text-sm">Tel: {attraction.tel}</p>
								)}
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
						<div className="col-span-12 md:col-span-6 relative h-[400px] overflow-hidden transition-all">
							<Image
								src={attraction.thumbnail || "/images/placeholder.jpg"}
								alt={attraction.name}
								fill
								className="object-cover hover:scale-110 cursor-pointer transition-transform"
								priority
								onClick={() => handlePreviewClick(0)}
							/>
						</div>
					</div>

					{/* Compact Grid Preview */}
					{album.length > 0 && (
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
									{i === 3 && album.length > 4 && (
										<div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
											<span className="text-secondary font-serif text-4xl uppercase">
												+ {album.length - 4}
											</span>
											<span className="text-secondary font-serif text-xl uppercase opacity-80">
												More
											</span>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Description Section */}
					{attraction.description && (
						<div id="description" className="max-w-5xl mt-10">
							<h2 className="text-3xl md:text-4xl text-primary font-serif uppercase tracking-widest">
								About {attraction.name}
							</h2>
							<HorizontalRule borderColor="border-primary" />
							<p className="text-primary font-serif leading-relaxed whitespace-pre-line text-lg opacity-90">
								{attraction.description}
							</p>
						</div>
					)}

					{/* 3. Render Map only if coordinates successfully loaded */}
					{mapCoords && (
						<div className="mt-16">
							<h2 className="text-2xl md:text-3xl text-primary font-serif uppercase tracking-widest mb-4">
								Location Map
							</h2>
							<HorizontalRule borderColor="border-primary" />
							<div className="h-[400px] w-full border border-primary relative group">
								<Map
									ref={mapRef} // Attach the ref
									center={[mapCoords.lng, mapCoords.lat]}
									zoom={14}
								>
									<MapMarker
										longitude={mapCoords.lng}
										latitude={mapCoords.lat}
									>
										<MarkerContent>
											<div className="cursor-pointer">
												<MapPin
													className="fill-primary stroke-secondary"
													size={36}
												/>
											</div>
										</MarkerContent>
										<MarkerPopup>
											<div className="space-y-1 font-serif uppercase text-primary">
												<p className="font-bold tracking-widest">{attraction.name}</p>
												<p className="text-[10px] opacity-70">
													{mapCoords.lat.toFixed(5)}, {mapCoords.lng.toFixed(5)}
												</p>
											</div>
										</MarkerPopup>
									</MapMarker>
								</Map>

								{/* 4. Floating Reset Button */}
								<button
									onClick={handleResetMap}
									className="absolute bottom-4 left-4 z-10 bg-secondary/90 hover:bg-secondary text-primary p-2 border border-primary/20 backdrop-blur-sm shadow-md flex items-center gap-2 uppercase font-serif text-[10px] tracking-widest transition-all"
									aria-label="Reset Map View"
								>
									<RotateCcw size={14} />
									<span>Reset View</span>
								</button>
							</div>
						</div>
					)}
					<div className="flex flex-col md:flex-row gap-5 md:gap-10 font-serif my-4">
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
				</div>

				<div
					className={
						isOpen
							? "fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-fade-blur-in "
							: "hidden"
					}
				>
					<div className="relative w-full max-w-5xl h-full flex flex-col justify-center">
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-4 right-4 md:top-0 md:-right-10 text-secondary font-serif uppercase tracking-widest hover:opacity-70 transition-opacity z-[60] text-lg"
						>
							<FontAwesomeIcon icon={faXmark} />
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
									<div className="flex justify-center items-center h-[50vh] md:h-[70vh] ">
										{/* Use standard img here to ensure it loads within the gallery wrapper */}
										<img
											src={item.original}
											alt="Gallery Image"
											className="max-h-full max-w-full object-contain mx-auto"
										/>
									</div>
								)}
							/>
						</div>
					</div>
				</div>

				<RecommendAttractions />
			</section>
		</div>
	);
}

export default AttractionPage;