"use client";

import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect, useRef } from "react";
import AvatarComp from "./AvatarComp";
import { useMutation } from "@apollo/client";
import { GQLMutations } from "@/graphql";
import { useRouter } from "next/navigation";

export default function FixedHeader() {
  const user = useUserStore((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [signOut, { loading }] = useMutation(GQLMutations.SIGN_OUT);
  const { logout } = useUserStore();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/home");
      logout();
    } catch (error) {
      console.log(error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-5 left-5 z-50 flex justify-between items-center w-[95vw]">
      <Link
        href="/home"
        className="font-bold text-lg text-[#3d2512] opacity-50 hover:opacity-100 duration-300"
      >
        ReadCycle
      </Link>
      {user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="cursor-pointer"
          >
            <AvatarComp
              data={{
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
              }}
              className="opacity-80 hover:opacity-100 h-10 w-10"
            />
          </button>
          <div
            className={`absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 shadow-lg rounded-xl border border-neutral-200 dark:border-neutral-700 transition-all duration-300 ease-in-out transform ${
              dropdownOpen
                ? "opacity-80 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <Link
                  href={`/user/${user.id}`}
                  className="block px-4 py-2 hover:text-[#3d2512] hover:font-bold hover:duration-300 dark:hover:bg-neutral-700 transition"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href={`/messages/${user.id}`}
                  className="block px-4 py-2 hover:text-[#3d2512] hover:font-bold hover:duration-300 dark:hover:bg-neutral-700 transition"
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/user/wishlist"
                  className="block px-4 py-2 hover:text-[#3d2512] hover:font-bold hover:duration-300 dark:hover:bg-neutral-700 transition"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:text-red-600 hover:font-bold hover:duration-300 dark:hover:bg-neutral-700 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Link href="/signin" className="ml-3 text-[#5C4033]">
          Sign In
        </Link>
      )}
    </div>
  );
}
