"use client";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-secondary p-8 md:p-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col gap-4 mb-10">
          <h2 className="font-serif text-3xl uppercase tracking-wider">
            Thaivels
          </h2>
          <nav className="flex flex-col gap-2">
            <a
              href="/about"
              className="uppercase text-sm hover:opacity-80 transition-opacity"
            >
              About Us
            </a>
            <a
              href="/contact"
              className="uppercase text-sm hover:opacity-80 transition-opacity"
            >
              Contact
            </a>
          </nav>
        </div>

        {/* Divider Line */}
        <hr className="border-t border-secondary opacity-30 mb-6" />

        {/* Bottom Bar */}
        <div className="flex justify-between items-center text-xs uppercase tracking-widest">
          <p>Copyright © Thaivels</p>
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
