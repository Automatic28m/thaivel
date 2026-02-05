import Image from "next/image";
import Link from "next/link";
import HorizontalRule from "./components/HorizontalRule";
import CategoryGrid from "./components/CategoryGrid";
import AttractionGrid from "./components/AttractionGrid";
import RegionGrid from "./components/RegionGrid";

const closeBangkokAttractions = [
    {
      id: "baan-thong-krub",
      name: "Baan Thong Krub",
      location: "Pathum Thani",
      src: "/images/urbanThumbnail.jpeg"
    },
    {
      id: "song-wat",
      name: "Song Wat",
      location: "Bangkok",
      src: "/images/urbanThumbnail.jpeg"
    },
    {
      id: "bangsean-fish-market",
      name: "Bangsean Fish Market",
      location: "Chonburi",
      src: "/images/urbanThumbnail.jpeg"
    }
  ];

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

        <div className="relative z-10 max-w-5xl px-6 py-25 m-auto h-full flex flex-col justify-center">
          <h1 className="text-secondary font-serif text-5xl md:text-6xl lg:text-9xl leading-tight uppercase">
            Experience the Vibrant Soul of Thailand
          </h1>
          <p className="text-xl md:text-2xl text-secondary font-serif py-10 max-w-2xl">
            From the serene grandeur of ancient temples to the sophisticated
            pulse of modern cafes and malls, discover a journey that resonates
            with every traveler.
          </p>
        </div>
      </section>

      <section id="category" className="bg-secondary h-fit">
        <div className="max-w-5xl px-3 m-auto py-30">
          <div className="">
            <span className="text-4xl md:text-6xl text-primary font-serif">
              EXPLORE ATTRACTIONS IN THAIVELS
            </span>
          </div>
          <HorizontalRule borderColor="border-primary" />
          <CategoryGrid />
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
            ABOUT THAIVELS
          </span>
          <hr className="my-8 border-t-2 border-secondary" />
          <div className="grid grid-cols-12 md:gap-12 gap-3">
            <div id="message" className="md:col-span-6 col-span-12">
              <p className="font-serif text-secondary text-lg">
                Welcome to Thaivels, your ultimate starting point for exploring
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
                At Thaivels, we believe that every traveler deserves to
                experience the authentic charm and warmth of Thai hospitality.
                Let us help you find where to begin your journey and uncover the
                unique identity of each region.
              </p>
            </div>
            <div id="image" className="md:col-span-6 col-span-12"></div>
          </div>
        </div>
      </section>

      <section id="close_to_bangkok_place" className="h-fit bg-secondary">
        <div className="max-w-5xl m-auto px-3 py-30">
          <div className="pb-10">
            <span className="text-4xl md:text-6xl text-primary uppercase font-serif">
              WONDERFUL PLACES CLOSE TO BANGKOK
            </span>
          </div>
          <AttractionGrid attractions={closeBangkokAttractions}/>
        </div>
      </section>

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
