import Image from "next/image";
import React from "react";
import { faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function about() {
  return (
    <div>
      <section id="creator" className="h-fit bg-secondary">
        <div className="max-w-5xl px-4 mx-auto grid grid-cols-12 gap-8 md:gap-16 items-center pt-30 pb-20">

          {/* Left Side: Editorial Image Container */}
          <div id="image" className="col-span-12 md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded shadow-lg border border-primary/10">
              <Image
                src="/images/profile1.jpg"
                alt="Auto - Computer Engineer"
                fill
                className="object-cover"
                priority={true}
              />
              {/* Subtle decorative element to add that "scent of legacy" */}
              <div className="absolute inset-0 border-[15px] border-secondary/10 pointer-events-none" />
            </div>
          </div>

          {/* Right Side: Professional Narrative */}
          <div id="content" className="col-span-12 md:col-span-7 space-y-8">

            {/* Heading Section */}
            <div className="space-y-2">
              <span className="text-primary/50 font-serif text-xs uppercase tracking-[0.4em]">
                Engineering the Future
              </span>
              <h2 className="text-4xl md:text-5xl text-primary font-serif uppercase leading-tight">
                The Vision Behind <br /> <span className="italic">Thaivel</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-serif text-primary leading-relaxed">
              {/* Professional Column 1 */}
              <div className="space-y-4">
                <h3 className="text-md font-bold uppercase tracking-widest border-b border-primary/20 pb-2">The Mission</h3>
                <p className="text-md opacity-90">
                  Hello, my name is Phanlop Boonluea. As a Computer Engineering student at <span className="font-bold">RMUTT</span>, I build with purpose.
                  Thaivel is the culmination of my primary objective: to secure victory in the <span className="font-bold text-primary">International Web Design Contest (iWDC)</span> and represent Thailand at the ICT Workshop 2026 in <span className="font-bold">Hokkaido, Japan</span>.
                </p>
              </div>

              {/* Professional Column 2 */}
              <div className="space-y-4">
                <h3 className="text-md font-bold uppercase tracking-widest border-b border-primary/20 pb-2">The Architecture</h3>
                <p className="text-md opacity-90">
                  To achieve this, I engineered a full-stack environment utilizing <span className="font-bold">Next.js</span> for a responsive user experience and <span className="font-bold">MySQL</span> for sophisticated relational data management. My focus remains on technical excellence and real-world scalability.
                </p>
              </div>
            </div>

            {/* Design Philosophy & Connect Section */}
            <div className="pt-6 border-t border-primary/10 space-y-6">
              <p className="font-serif italic text-lg text-primary/80 leading-relaxed">
                “If your dreams do not scare you, they are not big enough.” - Ellen Johnson Sirleaf
              </p>

              <div className="flex items-center gap-10 pt-4">
                {/* Instagram - Using your handle */}
                <a
                  href="https://www.instagram.com/automatic.pb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/40 hover:text-primary hover:scale-125 transition-all duration-300 ease-in-out"
                  title="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-md" /> Instagram
                </a>

                {/* GitHub - Representing your Next.js and MySQL craft */}
                <a
                  href="https://github.com/Automatic28m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/40 hover:text-primary hover:scale-125 transition-all duration-300 ease-in-out"
                  title="GitHub"
                >
                  <FontAwesomeIcon icon={faGithub} className="text-md" /> Github
                </a>

                {/* Mail - For professional inquiries regarding Hokkaido iWDC */}
                <a
                  href="mailto:phanlop.auto@gmail.com"
                  className="text-primary/40 hover:text-primary hover:scale-125 transition-all duration-300 ease-in-out"
                  title="Email"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="text-md" /> Gmail
                </a>

                {/* Personal Website/Portfolio Link */}
                <a
                  href="https://phanlop-portfolio.netlify.app/"
                  className="text-primary/40 hover:text-primary hover:scale-125 transition-all duration-300 ease-in-out"
                  title="Website"
                >
                  <FontAwesomeIcon icon={faGlobe} className="text-md" /> Website
                </a>
              </div>
            </div>
          </div>
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
          </div>
        </div>
      </section>

      

    </div>
  );
}

export default about;
