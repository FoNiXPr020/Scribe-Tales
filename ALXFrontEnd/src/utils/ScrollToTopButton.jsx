"use client";

import React, { useState, useEffect } from 'react';
import { MoveUp } from "lucide-react"

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to a certain height
  const toggleVisibility = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-14 right-5">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center w-10 h-10 bg-orange-300 text-white rounded-full shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <MoveUp />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
