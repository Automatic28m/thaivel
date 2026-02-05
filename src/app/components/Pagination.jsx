import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Logic to determine which page numbers to show
  const getPageRange = () => {
    const delta = 1; // Number of pages to show before/after current
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-10 px-4">
      {/* PREVIOUS */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="order-1 md:order-none w-fit md:w-auto h-12 md:h-14 px-6 border-3 border-primary text-sm md:text-lg text-primary font-serif uppercase tracking-widest hover:bg-primary hover:text-secondary transition-colors disabled:opacity-30"
      >
        Previous
      </button>

      {/* NUMBERS WITH ELLIPSIS */}
      <div className="flex justify-center gap-2 order-2 md:order-none flex-wrap">
        {getPageRange().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`w-12 h-12 md:w-14 md:h-14 border-3 border-primary text-base md:text-lg font-serif flex items-center justify-center transition-colors
              ${page === currentPage ? "bg-primary text-secondary" : "bg-secondary text-primary hover:bg-primary/10"}
              ${page === "..." ? "border-none cursor-default" : "cursor-pointer"}
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* NEXT */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="order-3 md:order-none w-fit md:w-auto h-12 md:h-14 px-6 border-3 border-primary text-sm md:text-lg text-primary font-serif uppercase tracking-widest hover:bg-primary hover:text-secondary transition-colors disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
