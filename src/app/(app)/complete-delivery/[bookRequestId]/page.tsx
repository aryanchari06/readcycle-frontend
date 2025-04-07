"use client";

import { GQLMutations, GQLQueries } from "@/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { IconError404, IconLoader3 } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { bookRequestId } = useParams();
  const router = useRouter();
  const {
    loading: queryLoading,
    error,
    data: bookData,
  } = useQuery(GQLQueries.GET_BOOK_REQUEST, {
    variables: { bookRequestId },
    skip: !bookRequestId,
  });

  const [completeDelivery, { loading: mutationLoading, error: mutationError }] =
    useMutation(GQLMutations.COMPLETE_BOOK_REQUEST);

  useEffect(() => {
    console.log(bookData);
  }, [bookData]);

  const handleCompleteDelivery = async () => {
    const response = await completeDelivery({ variables: { bookRequestId } });
    if (!response || mutationError)
      toast.error("Failed to complete book delivery");
    else {
      toast.success("Book delivered successfully!");
      router.replace("/");
    }
  };
  const book = bookData?.getBookRequest;

  if (queryLoading)
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-[#5D4037]">
        <IconLoader3 className="animate-spin mr-2" />
        Loading...
      </div>
    );

  if (!book.buyer)
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-[#5D4037] gap-2">
        <IconError404 /> Book has no buyer yet.
      </div>
    );

  return (
    <div className="min-h-[90vh] p-6 md:p-20 flex flex-col md:flex-row gap-8 items-start justify-center bg-[#fdf6ec]">
      {/* Book Details Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xl text-[#5D4037] border border-gray-200 w-full md:w-3/5">
        <h2 className="text-3xl font-bold">{book?.title}</h2>

        {book?.media?.[0] && (
          <img
            src={book.media[0]}
            alt={book.title}
            className="w-full max-h-80 object-cover rounded-lg mt-4 border border-[#e0c9b6]"
          />
        )}

        <h3 className="text-xl font-semibold mt-6">
          <span className="text-[#8B4513]">Author:</span> {book?.author}
        </h3>

        <div className="inline-block bg-green-100 text-green-800 mx-2 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
          ₹{book.price}
        </div>

        <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
          {book?.description}
        </p>
      </div>

      {/* Buyer Details & Confirmation Card */}
      <div className="w-full md:w-2/5 space-y-6">
        {/* Buyer Info */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 text-[#5D4037]">
          <h3 className="text-xl font-semibold mb-4">Buyer Information</h3>
          <p className="mb-2">
            <span className="font-medium">Name:</span>{" "}
            <Link
              href={`/user/${book.buyerId}`}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {book.buyer.firstName} {book.buyer.lastName}
            </Link>
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Delivery Address:</span>
            <br />
            {book.deliverTo}
          </p>
        </div>

        {/* Order Confirmation */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 text-[#5D4037]">
          <h3 className="text-xl font-semibold mb-4">
            Confirm Order Completion
          </h3>
          <p className="mb-6 text-gray-700">
            Are you sure you want to mark this order as complete? This action
            cannot be undone.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              className={`w-full md:w-auto cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-300 ${
                mutationLoading ? "cursor-not-allowed bg-gray-500" : ""
              }`}
              onClick={handleCompleteDelivery}
            >
              {mutationLoading ? (
                <div className="flex items-center">
                  <IconLoader3 className="animate-spin" />
                  Processing...
                </div>
              ) : (
                "Yes, complete the order"
              )}
            </button>
            <button className="w-full md:w-auto bg-gray-300 cursor-pointer hover:bg-gray-400 text-[#5D4037] px-6 py-2 rounded-lg transition duration-300">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
