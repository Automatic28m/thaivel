import React from "react";

function about() {
  return (
    <div>
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
    </div>
  );
}

export default about;
