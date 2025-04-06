"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { GQLQueries } from "@/graphql";
import { IconLoader3 } from "@tabler/icons-react";
import AvatarComp from "@/components/AvatarComp";
import Link from "next/link";

const genres = [
  "ALL",
  "FICTION",
  "NON_FICTION",
  "MYSTERY",
  "FANTASY",
  "SCIENCE_FICTION",
  "ROMANCE",
  "THRILLER",
  "HORROR",
  "HISTORY",
  "BIOGRAPHY",
  "SELF_HELP",
  "POETRY",
  "BUSINESS",
  "RELIGION",
  "ART",
  "GRAPHIC_NOVEL",
  "CHILDREN",
  "YOUNG_ADULT",
  "EDUCATIONAL",
  "CLASSICS",
  "PHILOSOPHY",
  "HEALTH",
  "COOKING",
  "TRAVEL",
  "SPORTS",
];

export interface Owner {
  avatar: string;
  firstName: string;
  lastName: string;
  id: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  media: string[];
  status: string;
  description: string;
  owner: Owner;
  price: number;
}

const BrowseBooks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [books, setBooks] = useState<Book[]>([]);

  const { loading, error, data } = useQuery(GQLQueries.GET_ALL_BOOK_REQUESTS);

  useEffect(() => {
    if (data && data.getAllBookRequests) {
      setBooks(data.getAllBookRequests);
      console.log(data);
    }
  }, [data]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedGenre === "All" || book.genre === selectedGenre)
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <IconLoader3 className="animate-spin text-[#5D4037] w-10 h-10" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-[#5D4037] mb-8 text-center">
        Browse Books
      </h1>

      {/* Search & Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          className="w-full md:w-1/2 px-4 py-3 border rounded-lg shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="px-4 py-3 border rounded-lg shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-[#FF6700]"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => {
            if (book.status === "ONGOING" || book.status === "COMPLETED")
              return null;
            return (
              <Link
                href={`/view-book/${book.id}`}
                key={book.id}
                className={`relative bg-white border rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 overflow-hidden w-full h-[400px] ${
                  book.status === "ONGOING" ||
                  (book.status === "COMPLETED" && "cursor-not-allowed")
                }`}
              >
                {/* Genre Label */}
                <p className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 text-xs font-semibold rounded-lg bg-opacity-90 z-10 shadow-md">
                  {book.genre}
                </p>

                {/* Book Image */}
                <div className="w-full h-64 relative">
                  <Image
                    src={book.media[0]}
                    alt={book.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl"
                  />
                </div>

                {/* Book Details */}
                <div className="p-5">
                  <div className="flex items-center">
                    <h3 className="text-xl font-semibold text-[#D62828] truncate">
                      {book.title}
                    </h3>
                    <div className="inline-block bg-green-100 text-green-800 mx-2 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
                      ₹{book.price}
                    </div>
                  </div>

                  <p className="text-md text-gray-700">{book.author}</p>

                  {/* Owner Info */}
                  <div className="flex items-center gap-3 mt-4">
                    <AvatarComp data={book.owner} />
                    <span className="text-md text-gray-800 font-medium">
                      {book.owner.firstName} {book.owner.lastName}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-500 col-span-full text-center text-lg">
            No books found.
          </p>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;
