"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Carousel, Card } from "./Cards";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useQuery } from "@apollo/client";
import { GQLQueries } from "@/graphql";
import { IconLoader3 } from "@tabler/icons-react";
import { Book } from "../browse-books/page";
import AvatarComp from "@/components/AvatarComp";

export function BookListing() {
  const { loading, data } = useQuery(GQLQueries.GET_ALL_BOOK_REQUESTS);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (data && data.getAllBookRequests) {
      const temp_data = data.getAllBookRequests.filter(
        (book: any) => (book.status !== "ONGOING" && book.status !== "COMPLETED")
      );
      console.log("temp", temp_data);
      setBooks(temp_data);
    }
  }, [data]);

  const cards = books.map((card: any, index) => {
    return (
      <Card
        key={card.id || index}
        card={{ ...card, content: <DummyContent bookRequestId={card.id} /> }}
        index={index}
      />
    );
  });

  return (
    <div className="w-full min-h-screen py-20 bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center">
      <h2 className="max-w-7xl px-6 text-center text-2xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">
        Browse Your Favourite Collections
      </h2>
      <div className="w-full max-w-7xl flex justify-center">
        {loading ? (
          <IconLoader3 className="text-primary animate-spin w-10 h-10 my-10" />
        ) : (
          <Carousel items={cards} />
        )}
      </div>
    </div>
  );
}

const DummyContent = ({ bookRequestId }: { bookRequestId: string }) => {
  const [book, setBook] = useState<Book | null>(null);
  const { loading, error, data } = useQuery(GQLQueries.GET_BOOK_REQUEST, {
    variables: { bookRequestId },
    skip: !bookRequestId,
  });

  useEffect(() => {
    console.log("Book Data: ", data);
    if (data?.getBookRequest) {
      setBook(data.getBookRequest);
    }
  }, [data]);

  useEffect(() => {
    console.log("Updated Book:", book);
  }, [book]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <IconLoader3 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#2b1a0d] p-5 md:p-6 rounded-2xl ">
      {/* Product Image */}
      <div className="flex justify-center">
        <Image
          src={book?.media?.[0] || "/fallback-image.jpg"} // Provide fallback
          alt={book?.title || "Book Image"}
          height={500}
          width={500}
          className="w-full max-w-[250px] md:max-w-[350px] object-contain rounded-lg"
        />
      </div>

      {/* Product Description */}
      <p className="text-[#2b1a0d] dark:text-[#f5f0eb]  leading-relaxed mt-4 text-center font-medium text-lg">
        {book?.description || "No description available"}
      </p>

      {/* User Info */}
      {book?.owner && (
        <div className="flex items-center gap-3 mt-6 justify-center">
          <AvatarComp
            data={{
              firstName: book.owner.firstName,
              lastName: book.owner.lastName,
              avatar: book.owner.avatar,
            }}
            className="h-12 w-12"
          />
          <HoverCard>
            <HoverCardTrigger className="text-[#2b1a0d] dark:text-[#f5f0eb] font-semibold cursor-pointer hover:underline text-[15pt]">
              {book.owner.firstName} {book.owner.lastName}
            </HoverCardTrigger>
            <HoverCardContent>
              <Link href={`/user/${book.owner.id}`} className="text-sm m-0">
                View {book.owner.firstName}
              </Link>
            </HoverCardContent>
          </HoverCard>
        </div>
      )}

      <div className="flex items-center justify-center my-4 text-[18pt]  ">
        <Link
          href={`/view-book/${book?.id}`}
          className="p-2 rounded-sm text-white bg-[#2b1a0d] opacity-90 hover:opacity-100"
        >
          View Book
        </Link>
      </div>
    </div>
  );
};
