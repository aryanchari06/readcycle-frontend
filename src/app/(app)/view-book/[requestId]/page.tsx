"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { GQLMutations, GQLQueries } from "@/graphql";
import { useUserStore } from "@/store/useUserStore";
import { useMutation, useQuery } from "@apollo/client";
import { IconLoader3 } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnimatedModal } from "@/components/CustomModal";

const BookRequestPage = () => {
  const { requestId } = useParams();
  console.log("Request ID:", requestId);

  const user = useUserStore((state) => state.user);
  const [isBookWishlisted, setIsBookWishlisted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const {
    loading: wishlistLoading,
    error: wishlistError,
    data: wishlistData,
  } = useQuery(GQLQueries.VIEW_WISHLIST);

  useEffect(() => {
    if (wishlistData?.viewWishlist) {
      const isWishlisted = wishlistData.viewWishlist.some(
        (book: any) => book.id === requestId
      );
      setIsBookWishlisted(isWishlisted);
      console.log("this book is wishlisted:", isWishlisted);
    } else {
      setIsBookWishlisted(false);
    }
  }, [wishlistData, requestId]);

  const {
    loading: queryLoading,
    error,
    data,
  } = useQuery(GQLQueries.GET_BOOK_REQUEST, {
    variables: { bookRequestId: requestId },
    skip: !requestId,
  });

  useEffect(() => {
    if (data) {
      setIsOwner(user?.id === data.getBookRequest?.owner?.id);
      // console.log(data)
    }
  }, [data]);

  const [addToWishlist, { loading: mutationLoading }] = useMutation(
    GQLMutations.ADD_TO_WISHLIST
  );

  if (!user)
    return (
      <div className="flex min-h-[90vh] items-center justify-center text-[#5D4037]">
        <span>Access denied. Please</span>
        <span className="font-bold text-[#D62828]">
          <Link href="/signin">&nbsp;sign in&nbsp;</Link>
        </span>{" "}
        <span>to continue.</span>
      </div>
    );

  if (queryLoading || wishlistLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading book details...</p>
      </div>
    );

  if (error || wishlistError)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">
          {/* @ts-ignore */}
          Error fetching book request: {error.message}
        </p>
      </div>
    );

  const bookRequest = data?.getBookRequest;
  const avatarFallback = `${bookRequest.owner.firstName[0].toUpperCase()}${bookRequest.owner.lastName[0].toUpperCase()}`;

  const handleWishlist = async () => {
    try {
      const response = await addToWishlist({
        variables: { bookRequestId: requestId },
      });
      const result = await response.data;
      console.log(result);
    } catch (error) {
      console.log("Error while trying to add book to wishlist : ", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-2xl mt-10 mb-16 min-h-[90vh]">
      <div className="flex flex-col md:flex-row gap-10">
        {bookRequest.media?.length > 0 && (
          <div className="md:w-1/2 space-y-4 flex flex-col items-center">
            <img
              src={bookRequest.media[0]}
              alt="Book media"
              className="w-full max-w-xs h-[22rem] object-cover rounded-xl shadow-md border"
            />

            {bookRequest.media.length > 1 && (
              <div className="flex gap-3 flex-wrap justify-center">
                {bookRequest.media
                  .slice(1)
                  .map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Book media ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm border hover:scale-105 transition-transform duration-200"
                    />
                  ))}
              </div>
            )}

            {user?.id === bookRequest.owner.id && (
              <div className="w-full bg-gray-100 border-l-4 border-orange-500 rounded-lg p-4 mt-4">
                <p className="text-gray-800 font-medium">
                  <span className="font-semibold text-[#5D4037]">Status:</span>{" "}
                  {bookRequest.status}
                </p>
                {bookRequest.buyer && (
                  <p className="text-gray-800">
                    <span className="font-semibold text-[#5D4037]">
                      Book bought by:
                    </span>{" "}
                    <Link
                      href={`/user/${bookRequest.buyerId}`}
                      className="text-orange-600 hover:underline"
                    >
                      {bookRequest.buyer.firstName} {bookRequest.buyer.lastName}
                    </Link>
                  </p>
                )}
                {bookRequest.owner.id === user.id &&
                  bookRequest.status === "ONGOING" && (
                    <div className="pt-4">
                      <Link
                        href={`/complete-delivery/${requestId}`}
                        className="px-6 py-2 bg-green-600 text-white cursor-pointer rounded-lg hover:bg-green-700 transition"
                      >
                        Complete delivery
                      </Link>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold text-[#5D4037]">
            {bookRequest.title}
          </h1>

          <span className="inline-block bg-[#FFB703] text-white px-4 py-1 rounded-full text-sm font-semibold">
            {bookRequest.genre}
          </span>

          <div className="inline-block bg-green-100 text-green-800 mx-2 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
            ₹{bookRequest.price}
          </div>

          <p className="text-lg text-gray-700">
            <span className="font-semibold text-[#5D4037]">Author:</span>{" "}
            {bookRequest.author}
          </p>

          <Link
            href={`/user/${bookRequest.owner.id}`}
            className="flex items-center gap-3 group"
          >
            <Avatar className="bg-[#5C4033] group-hover:opacity-100 opacity-90 duration-300">
              <AvatarImage
                src={bookRequest.owner.avatar}
                className="object-cover"
              />
              <AvatarFallback className="text-[#FFEDD5] bg-[#3d2512]">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <p className="text-[#5D4037] font-medium group-hover:underline">
              {bookRequest.owner.firstName} {bookRequest.owner.lastName}
            </p>
          </Link>

          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            {bookRequest.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {isBookWishlisted ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    disabled
                    className="bg-gray-300 text-white px-6 py-2 rounded-lg w-full sm:w-auto cursor-not-allowed"
                  >
                    Add to Wishlist
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="text-sm bg-white border rounded-md p-2 shadow-md">
                  Book already wishlisted!
                </HoverCardContent>
              </HoverCard>
            ) : (
              <button
                disabled={isOwner || mutationLoading}
                className={`px-6 py-2 rounded-lg w-full sm:w-auto transition ${
                  isOwner
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
                onClick={handleWishlist}
              >
                {mutationLoading ? (
                  <div className="flex items-center gap-2">
                    <IconLoader3 className="animate-spin" size={20} />
                    Adding...
                  </div>
                ) : (
                  "Add to Wishlist"
                )}
              </button>
            )}

            <AnimatedModal
              className={`px-6 py-2 rounded-lg w-full sm:w-auto transition ${
                isOwner
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              sellerId={bookRequest.owner.id}
              bookId={bookRequest.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRequestPage;
