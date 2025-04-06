"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";


export default function Footer() {
  return (
    <footer className="bg-[#26170b] text-[#FDF6EC] py-8 px-6 md:px-12 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Section */}
        <p className="text-sm md:text-base font-light">&copy; {new Date().getFullYear()} ReadCycle. All rights reserved.</p>
        
        {/* Right Section */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-[#FFB703] transition duration-300">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#FFB703] transition duration-300">Terms of Service</Link>
          <Link href="#" className="hover:text-[#FFB703] transition duration-300">Contact</Link>
        </div>
      </div>

      {/* Social Icons */}
      <div className="mt-6 flex justify-center space-x-6">
        <Link href="#" className="text-[#FDF6EC] hover:text-[#FF6700] transition duration-300">
          <Facebook size={20} />
        </Link>
        <Link href="#" className="text-[#FDF6EC] hover:text-[#FF6700] transition duration-300">
          <Twitter size={20} />
        </Link>
        <Link href="#" className="text-[#FDF6EC] hover:text-[#FF6700] transition duration-300">
          <Instagram size={20} />
        </Link>
      </div>
    </footer>
  );
}
