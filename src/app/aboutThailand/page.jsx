import React from "react";
import HorizontalRule from "../components/HorizontalRule";
import Image from "next/image";
import RegionGrid from "../components/RegionGrid";

function AboutThailand() {
  const regionData = [
    {
      id: "Northen-Thailand",
      name: "Northen-Thailand",
      content:
        "Experience the enchanting Lanna culture through traditional attire and the breathtaking Yi Peng festival. This region offers a perfect blend of spiritual and natural beauty, featuring the sacred Wat Phra That Doi Suthep, the cozy Mae Kampong Village, and the misty green hills of Mae Hong Son. For food lovers, the North is a paradise of unique flavors, including the iconic Khao Soi curry noodles, savory Sai Ua (northern sausage), and spicy Nam Prik Noom (chili dip) served with crispy pork rinds.",
    },
    {
      id: "Northeast (Isan)",
      name: "Northeast (Isan)",
      content:
        "Immerse yourself in the vibrant energy of the Phi Ta Khon festival and the grand Rocket Festival (Bun Bang Fai). This region is a treasure trove of heritage, from the intricate artistry of Mudmee silk weaving to the ancient ruins of Phanom Rung Historical Park and the natural wonders of Khao Yai National Park. The culinary scene is equally bold, featuring the world-famous Som Tum (papaya salad), Larb Moo, and Wichian Buri grilled chicken paired with warm sticky rice.",
    },
    {
      id: "Central Thailand",
      name: "Central Thailand",
      content:
        "As the historic heart of the nation, Central Thailand showcases a unique riverside lifestyle and deep cultural roots. You can explore the architectural splendor of the Grand Palace and Wat Arun, or dive into the bustling, colorful atmosphere of the Damnoen Saduak Floating Market. The food here defines Thai cuisine globally, with must-try classics like the spicy Tom Yum Goong, the beloved Pad Thai, and the aromatic Green Curry.",
    },
    {
      id: "Eastern Thailand",
      name: "Eastern Thailand",
      content:
        "Discover the simple charm of local fishing communities and the bounty of the region's famous fruit festivals. This area is a haven for beach lovers, offering the lively shores of Pattaya, the crystal-clear waters of Koh Samet, and the serene Tung Prong Thong mangrove forest. Indulge in incredibly fresh seafood, unique local specialties like Chamuang Leaf Pork Curry, and premium tropical fruits such as durian and mangosteen.",
    },
    {
      id: "Western Thailand",
      name: "Western Thailand",
      content:
        "Western Thailand offers a compelling mix of World War II history and diverse ethnic heritage. Nature enthusiasts can marvel at the stunning Erawan Waterfall and the vast Srinakarin Dam, while history buffs can walk across the famous Bridge over the River Kwai. The local palate is adventurous, featuring spicy Jungle Curry, tangy Sour Soup with Bamboo Shoots, and the famous Thong Yod (sweet golden drops) from Phetchaburi.",
    },
    {
      id: "Southern Thailand",
      name: "Southern Thailand",
      content:
        "Explore a beautiful fusion of Thai-Buddhist and Muslim cultures, highlighted by the sacred Hae Pha Khun That festival. The South is a world-class destination for island hopping, featuring the iconic limestone cliffs of Phang Nga Bay, the shores of Railay Beach, and the paradise of Koh Phi Phi. Savor the intense heat of authentic Gaeng Tai Pla and Khua Kling, and finish your meal with a sweet Roti and frothy pulled tea.",
    },
  ];
  return (
    <div>
      <section id="aboutThailand" className="h-fit bg-secondary">
        <div>
          <section id="aboutThailand" className="h-fit bg-secondary">
            <div className="max-w-5xl px-6 m-auto py-30">
              <span className="text-4xl md:text-6xl text-primary uppercase font-serif">
                THAILAND, A JOURNEY THROUGH 6 REGIONS
              </span>
              <HorizontalRule borderColor="border-primary" />

              {/* FIX 1: Add 'relative' and a specific height so 'fill' knows its boundaries */}
              <div className="relative w-full h-75 md:h-125 my-10">
                <Image
                  src="/images/aboutThailand.png"
                  alt="Map of Thailand 6 Regions"
                  fill
                  className="object-contain"
                  priority={true}
                />
              </div>

              <div className="grid grid-cols-12 gap-x-6 gap-y-12">
                {regionData.map((item) => (
                  /* FIX 2: Change item.key to item.id to match your data structure */
                  <div key={item.id} className="md:col-span-6 col-span-12">
                    <span className="text-xl uppercase font-serif text-primary">
                      {item.name}
                    </span>
                    <HorizontalRule borderColor="border-primary" />
                    <p className="text-primary font-serif leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section id="discover" className="h-fit bg-secondary">
        <div className="max-w-5xl px-6 m-auto py-30">
          <span className="text-4xl md:text-6xl text-primary uppercase font-serif">
            Discover each thailand region
          </span>
          <HorizontalRule borderColor="border-primary" />
          <RegionGrid />
        </div>
      </section>
    </div>
  );
}

export default AboutThailand;
