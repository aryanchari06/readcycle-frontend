"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AvatarComp from "./AvatarComp";
import { useUserStore } from "@/store/useUserStore";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    //@ts-ignore
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        setVisible(direction < 0);
      }
    }
  });


  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
          scaleX: 1, // Start normal size
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
          scaleX: visible ? 1 : 1.5, // Expands when disappearing
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto rounded-full bg-[#FF6700] shadow-md z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4 origin-center opacity-70 hover:opacity-100",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className="relative text-[#FDF6EC] flex items-center space-x-1 hover:text-[#FFB703]"
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}
        <Link
          className="text-sm font-medium relative  text-[#FDF6EC] rounded-full "
          href="/home"
        >
          {/* <AvatarComp
            data={{
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar,
            }}
          /> */}
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
