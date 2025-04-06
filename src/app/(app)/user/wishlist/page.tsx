"use client";

import { GQLQueries } from "@/graphql";
import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import Image from "next/image";
import AvatarComp from "@/components/AvatarComp";
import Link from "next/link";

const WishlistPage = () => {
  const { loading, error, data } = useQuery(GQLQueries.VIEW_WISHLIST);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (loading) return <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>;
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl font-semibold text-center text-[#5D4037] mb-8">My Wishlist</h1>
      {data?.viewWishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.viewWishlist.map((book: any) => (
            <Link
              href={`/view-book/${book.id}`}
              key={book.id}
              className="relative border rounded-xl p-5 shadow-lg bg-white hover:shadow-xl transition-shadow flex flex-col items-center"
            >
              {/* Genre Label */}
              <span className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-md">
                {book.genre}
              </span>

              {/* Book Image */}
              <img
                src={book.media[0] || "/default-book.jpg"}
                alt={book.title}
                className="rounded-lg mb-4 object-cover h-80"
              />

              {/* Book Details */}
              <h2 className="text-lg font-semibold text-center text-gray-900">{book.title}</h2>

              {/* Owner Info */}
              <div className="mt-4 flex items-center gap-3">
                <AvatarComp
                  data={{
                    avatar: book.owner.avatar,
                    firstName: book.owner.firstName,
                    lastName: book.owner.lastName,
                  }}
                />
                <p className="text-sm text-gray-600">
                  {book.owner.firstName} {book.owner.lastName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
