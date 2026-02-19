"use client"; // Required for useState and ref hooks

import React, { useState, useRef } from "react";
import HorizontalRule from "../components/HorizontalRule";
import Image from "next/image";
import ImageGallery from "react-image-gallery";
import AttractionGrid from "../components/AttractionGrid";

// FIX: Capitalized name to satisfy React Hook requirements
function AttractionPage() {
  const [isOpen, setIsOpen] = useState(false);
  const galleryRef = useRef(null);

  const attraction = {
    id: "baan-thong-krub",
    name: "baan thong krub",
    location: "PACHANIYOM, TAMBON BANG PROK, PATHUM THANI",
    openHour: "wed-sun 10:00-17:00",
    tel: "0620974073",
    ig: "@baanthongkrub",
    googleMapsUrl: "https://maps.app.goo.gl/Ru6EvgeHhXmG6rGe6",
    thumbnail: "/images/baan-thong-krub/thumbnail.JPG",
    // Preserves 3-paragraph structure
    description: `My visit to Baan Thong Krub felt like a nostalgic journey back to a simpler time. This traditional Thai wooden house, nestled gracefully along the banks of the Chao Phraya River in Pathum Thani, offers a serene atmosphere that feels more like visiting a beloved relative’s home than a typical commercial cafe.

I highly recommend exploring their selection of desserts and beverages. The Carrot Cake and Dirty Coffee were particularly impressive—refreshing and skillfully prepared with a balanced sweetness that perfectly complemented the scenic riverside view.

For the best experience, I recommend visiting in the late afternoon to enjoy the sunset over the river and to avoid the midday sun. Due to its popularity on weekends, arriving early is advisable to secure a coveted seat by the water where you can relax and even feed the local fish.`,
  };

  // Gallery items matching your local file structure
  const galleryItems = [
    {
      original: "/images/baan-thong-krub/gallery/IMG_0700.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0700.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0706.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0706.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0707.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0707.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0718.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0718.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0721.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0721.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0723.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0723.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0727.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0727.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0766.jpg",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0766.jpg",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0771.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0771.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0879.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0879.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0893.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0893.JPG",
    },
    {
      original: "/images/baan-thong-krub/gallery/IMG_0939.JPG",
      thumbnail: "/images/baan-thong-krub/gallery/IMG_0939.JPG",
    },
  ];

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
              <p className="text-sm">Location: {attraction.location}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="text-sm">Open: {attraction.openHour}</p>
                <p className="text-sm">Tel: {attraction.tel}</p>
              </div>
              <p className="text-sm">Instagram: {attraction.ig}</p>
              <div className="pt-10">
                <a
                  href={attraction.googleMapsUrl}
                  target="_blank"
                  className="w-full md:w-fit block text-center py-3 px-8 border-3 border-primary hover:bg-primary hover:text-secondary transition-colors"
                >
                  Google Maps
                </a>
              </div>
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
            {galleryItems.slice(0, 4).map((item, i) => (
              <div
                key={i}
                onClick={() => handlePreviewClick(i)}
                className="relative aspect-square overflow-hidden group cursor-pointer border-transparent hover:border-primary transition-all"
              >
                <Image
                  src={item.original}
                  alt=""
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                {i === 3 && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                    <span className="text-secondary font-serif text-2xl uppercase">
                      + {galleryItems.length - 3}
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
                items={galleryItems}
                showPlayButton={false}
                showFullscreenButton={false}
                useBrowserFullscreen={false} // Keeps thumbnails and nav inside our frame
                thumbnailPosition="bottom"
                renderItem={(item) => (
                  <div className="flex justify-center items-center h-[55vh] md:h-[65vh]">
                    <div className="relative w-full h-full">
                      <Image
                        src={item.original}
                        alt="Gallery Image"
                        fill
                        className="object-contain" // Prevents image from pushing thumbnails off-screen
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
          <AttractionGrid attractions={suggestionPlace}/>
        </div>
      </section>
    </div>
  );
}

export default AttractionPage;
