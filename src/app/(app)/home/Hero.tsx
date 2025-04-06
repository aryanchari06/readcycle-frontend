"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const zoomFactor = 1 + scrollY * 0.0005; // Adjust zoom speed
      setScale(zoomFactor);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6">
      {/* Background Image with Zoom Effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center -z-20"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2')",
          opacity: 0.2, // Reduced opacity
          transform: `scale(${scale})`,
        }}
        animate={{ scale: scale }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />

      {/* Text Content */}
      <motion.div
        className="max-w-2xl z-10 mt-10 md:mt-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-[#3d2512]">
          Welcome to ReadCycle
        </h1>
        <p className="text-lg md:text-xl text-[#3d2512] mt-4 leading-relaxed">
          ReadCycle is a platform where book lovers can exchange second-hand
          books, making reading more affordable and sustainable. Find, share,
          and give books a second life!
        </p>

        {/* Browse Books Button */}
        <Link
          href="/browse-books"
          className="inline-block bg-[#3d2512] text-white text-base md:text-lg font-medium rounded-md px-5 py-2.5 mt-6 transition duration-300 hover:bg-[#2b1a0d]"
        >
          Browse Books
        </Link>
        <Link
          href="/sell-books"
          className="inline-block ml-4 bg-[#3d2512] text-white text-base md:text-lg font-medium rounded-md px-5 py-2.5 mt-6 transition duration-300 hover:bg-[#2b1a0d]"
        >
          Sell Books
        </Link>
      </motion.div>
    </div>
  );
};

export default Hero;
