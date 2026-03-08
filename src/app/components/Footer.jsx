"use client";
import { faInstagram, faGithub, faGit } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-secondary p-8 md:p-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand & Nav */}
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-3xl uppercase tracking-wider">
              Thaivel
            </h2>
            <nav className="flex flex-col gap-2">
              <a
                href="/about"
                className="uppercase text-sm hover:opacity-80 transition-opacity"
              >
                About
              </a>
              <a
                href="/attractions"
                className="uppercase text-sm hover:opacity-80 transition-opacity"
              >
                attractions
              </a>
              <a
                href="/aboutThailand"
                className="uppercase text-sm hover:opacity-80 transition-opacity"
              >
                regions
              </a>
            </nav>
          </div>

          {/* Contact Section - New */}
          <div className="flex flex-col gap-3 md:text-right">
            <h3 className="font-serif text-xs uppercase font-bold tracking-wider mb-1">
              Connect
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/Automatic28m"
                className="uppercase text-sm tracking-wider hover:opacity-80 transition-opacity"
              >
                github <FontAwesomeIcon icon={faGithub} className="text-md" />
              </a>
              <a
                href="https://instagram.com/automatic.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase text-sm tracking-wider hover:opacity-80 transition-opacity"
              >
                Instagram <FontAwesomeIcon icon={faInstagram} className="text-md" />
              </a>
              <a
                href="tel:+66990150026"
                className="uppercase text-sm tracking-wider hover:opacity-80 transition-opacity"
              >
                +66 99 015 0026 <FontAwesomeIcon icon={faPhone} className="text-md" />
              </a>
              <a
                href="mailto:phanlop.auto@gmail.com"
                className="uppercase text-sm tracking-wider hover:opacity-80 transition-opacity"
              >
                phanlop.auto@gmail.com <FontAwesomeIcon icon={faEnvelope} className="text-md" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="border-t border-secondary opacity-30 mb-6" />

        {/* Bottom Bar */}
        <div className="flex justify-between items-center text-xs uppercase tracking-widest">
          <p>Copyright © Thaivel</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            Back to Top ^
          </button>
        </div>
      </div>
    </footer>
  );
}
