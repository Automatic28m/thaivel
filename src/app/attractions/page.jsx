"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HorizontalRule from "../components/HorizontalRule";
import Pagination from "../components/Pagination";
import AttractionGrid from "../components/AttractionGrid";
import axios from "axios";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";

function Attractions() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// 1. Core State
	const [allAttractions, setAllAttractions] = useState([]);
	const [categories, setCategories] = useState([]);
	const [geographies, setGeographies] = useState([]); // Dynamic regions from DB
	const [loading, setLoading] = useState(true);

	// 2. URL-Derived State
	const currentRegion = searchParams.get("region") || "all";
	const currentCategory = searchParams.get("category") || "all";
	const currentSearch = searchParams.get("search") || "";
	const currentPage = Number(searchParams.get("page")) || 1;

	const [searchInput, setSearchInput] = useState(currentSearch);

	// 3. Fetch Master Data
	useEffect(() => {
		axios.get('/api/getCategories').then((res) => setCategories(res.data || []));
		axios.get('/api/regions/getRegions').then((res) => setGeographies(res.data || []));

		// Fetch All Attractions
		axios.get('/api/attractions/getAttractions')
			.then((res) => {
				setAllAttractions(res.data.data || []);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Error fetching attractions:', err);
				setLoading(false);
			});
	}, []);

	// 4. Multi-Filter Logic
	const filteredAttractions = allAttractions.filter((item) => {
		const matchesRegion = currentRegion === "all" ||
			item.geography?.toLowerCase() === currentRegion.toLowerCase();

		const matchesCategory = currentCategory === "all" ||
			item.category_id.toString() === currentCategory;

		const term = currentSearch.toLowerCase();
		const matchesSearch = !term ||
			item.name?.toLowerCase().includes(term) ||
			item.location?.toLowerCase().includes(term) ||
			item.province?.toLowerCase().includes(term) ||
			item.district?.toLowerCase().includes(term) ||
			item.sub_district?.toLowerCase().includes(term);

		return matchesRegion && matchesCategory && matchesSearch;
	});

	// 5. Pagination Math
	const itemsPerPage = 6;
	const totalPages = Math.ceil(filteredAttractions.length / itemsPerPage);
	const currentItems = filteredAttractions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// 6. Universal URL Handler (Preserves all filters)
	const updateURL = (newParams) => {
		const params = new URLSearchParams(searchParams.toString());

		// Update only the keys provided, keeping others
		Object.keys(newParams).forEach(key => {
			if (newParams[key] === null || newParams[key] === "") {
				params.delete(key);
			} else {
				params.set(key, newParams[key]);
			}
		});

		// Always reset to page 1 when changing filters
		if (!newParams.page) params.set("page", "1");

		router.push(`/attractions?${params.toString()}`, { scroll: false });
	};

	if (loading) {
		return (
			<div className="bg-secondary min-h-screen flex items-center justify-center">
				<p className="text-primary font-serif animate-pulse uppercase tracking-widest">Loading Destinations...</p>
			</div>
		);
	}

	return (
		<div>
			<section id="attractions" className="bg-secondary min-h-screen">
				<div className="max-w-5xl px-3 m-auto py-30">

					{/* Page Header */}
					<Fade delay={100}>
						<div className="">
							<span className="text-4xl md:text-6xl text-primary font-serif uppercase tracking-widest">
								{currentCategory === "all" && currentRegion === "all" ? "Explore Thailand" : "Filtered Results"}
							</span>
							<HorizontalRule borderColor="border-primary" />
						</div>
					</Fade>

					{/* Region Selection Block (Dynamic) */}
					<Fade delay={200}>
						<div className="mb-10">
							<p className="text-primary font-serif text-xs uppercase tracking-[0.3em] mb-4">Select Region</p>
							<div className="flex flex-wrap gap-x-8 gap-y-4">
								<button
									onClick={() => updateURL({ region: "all" })}
									className={`font-serif text-lg uppercase tracking-widest transition-all ${currentRegion === "all" ? "text-primary border-b-2 border-primary" : "text-primary/60 hover:text-primary"}`}
								>
									All Regions
								</button>
								{geographies.map((geo) => (
									<button
										key={geo.id}
										onClick={() => updateURL({ region: geo.name_eng })}
										className={`font-serif text-lg uppercase tracking-widest transition-all ${currentRegion.toLowerCase() === geo.name_eng.toLowerCase() ? "text-primary border-b-2 border-primary" : "text-primary/60 hover:text-primary"}`}
									>
										{geo.name_eng}
									</button>
								))}
							</div>
						</div>
					</Fade>

					<Fade delay={300}>
						{/* Category Selection Block */}
						<div className="pb-4 md:pb-10">
							<p className="text-primary font-serif text-xs uppercase tracking-[0.3em] mb-4">Select Category</p>
							<div className="flex flex-wrap gap-x-8 gap-y-4">
								<button
									onClick={() => updateURL({ category: "all" })}
									className={`font-serif text-lg uppercase tracking-widest transition-all ${currentCategory === "all" ? "text-primary border-b-2 border-primary" : "text-primary/60 hover:text-primary"}`}
								>
									All Category
								</button>
								{categories.map((cat) => (
									<button
										key={cat.id}
										onClick={() => updateURL({ category: cat.id.toString() })}
										className={`font-serif text-lg uppercase tracking-widest transition-all ${currentCategory === cat.id.toString() ? "text-primary border-b-2 border-primary" : "text-primary/60 hover:text-primary"}`}
									>
										{cat.name}
									</button>
								))}
							</div>
						</div>
					</Fade>

					<Fade delay={400}>
						{/* Search Section */}
						<section id="search" className="py-4 md:py-10 border-t border-primary/10">
							<div className="grid grid-cols-12 md:gap-x-12 gap-y-3">
								<input
									type="text"
									placeholder="SEARCH BY NAME OR LOCATION..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && updateURL({ search: searchInput })}
									className="col-span-12 md:col-span-8 text-primary bg-transparent text-lg font-serif border-3 border-primary py-3 uppercase px-3 outline-none"
								/>
								<button
									onClick={() => updateURL({ search: searchInput })}
									className="col-span-12 md:col-span-4 w-full uppercase text-primary text-lg font-serif border-3 border-primary py-3 hover:bg-primary hover:text-secondary transition-colors"
								>
									search
								</button>
							</div>
						</section>
					</Fade>

					<Fade delay={500}>
						{/* Active Filter Badges */}
						{(currentSearch || currentCategory !== "all" || currentRegion !== "all") && (
							<div className="mb-10 flex justify-between items-center border-b border-primary/10 pb-4">
								<div className="flex gap-4 items-center font-serif text-xs uppercase tracking-widest text-primary/60">
									<span>Active:</span>
									{currentRegion !== "all" && <span className="bg-primary text-secondary px-2 py-1">{currentRegion}</span>}
									{currentCategory !== "all" && (
										<span className="bg-primary text-secondary px-2 py-1">{categories.find(cat => cat.id.toString() === currentCategory)?.name || "Unknown"}</span>
									)}								{currentSearch && <span className="bg-primary text-secondary px-2 py-1">keyword : {currentSearch}</span>}
								</div>
								<button
									onClick={() => router.push('/attractions')}
									className="font-serif text-xs uppercase underline tracking-widest text-primary hover:opacity-50"
								>
									Reset All
								</button>
							</div>
						)}
					</Fade>


					<Fade delay={600}>
						{/* Paginated Grid */}
						{filteredAttractions.length > 0 ? (
							<div>
								<AttractionGrid attractions={currentItems} />
								{totalPages > 1 && (
									<div className="mt-16">
										<Pagination
											currentPage={currentPage}
											totalPages={totalPages}
											onPageChange={(page) => updateURL({ page: page.toString() })}
										/>
									</div>
								)}
							</div>
						) : (
							<div className="py-20 text-center border-2 border-dashed border-primary/20">
								<p className="text-primary font-serif text-2xl uppercase tracking-widest">No matching destinations.</p>
							</div>
						)}
					</Fade>
				</div>
			</section>
		</div>
	);
}

export default Attractions;