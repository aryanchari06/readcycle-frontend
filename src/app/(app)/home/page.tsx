"use client";

import React from "react";
import { BookListing } from "./BookListing";
import Hero from "./Hero";
import { useUserStore } from "@/store/useUserStore";

const Page = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div>
      <Hero />
      <div className="flex items-center text-2xl font-bold">
        <BookListing />
      </div>
    </div>
  );
};

export default Page;
