import Link from "next/link";
import Image from "next/image";

export default function AttractionGrid({attractions = "attraction"}) {

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-12">
      {/* 2. Map through your data */}
      {attractions.map((item) => (
        <Link
          key={item.id}
          href={`/attractionPage/${item.id}`}
          className="aspect-9/16 w-full col-span-6 md:col-span-4 relative flex flex-col justify-end p-3 md:p-6 overflow-hidden group shadow-lg"
        >
          <Image
            src={item.thumbnail}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Elegant Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/60 transition-colors" />

          {/* Text Content */}
          <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
            <span className="block uppercase font-serif text-lg md:text-2xl text-secondary leading-tight">
              {item.name}
            </span>
            <span className="block uppercase font-serif text-sm text-secondary/80 tracking-widest mt-1">
              {item.province}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}