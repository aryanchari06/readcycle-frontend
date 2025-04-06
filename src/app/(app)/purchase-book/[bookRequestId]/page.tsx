"use client";

import OTPInput from "@/components/OTPInput";
import { Button } from "@/components/ui/button";
import { GQLMutations, GQLQueries } from "@/graphql";
import { useUserStore } from "@/store/useUserStore";
import { useMutation, useQuery } from "@apollo/client";
import { IconLoader3 } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const Page = () => {
  const { bookRequestId } = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { loading: loadingBook, data: bookData } = useQuery(
    GQLQueries.GET_BOOK_REQUEST,
    { variables: { bookRequestId } }
  );

  const [isUserBuyer, setIsUserBuyer] = useState(false);
  useEffect(() => {
    if (user && bookData?.getBookRequest?.buyerId) {
      console.log(bookData);
      setIsUserBuyer(bookData.getBookRequest.buyerId === user.id);
    }
  }, [bookData, user]);

  useEffect(() => {
    console.log(bookData);
  }, [bookData]);

  const [approveRequest] = useMutation(GQLMutations.APPROVE_BOOK_REQUEST);
  const [confirmRequest] = useMutation(GQLMutations.CONFIRM_BOOK_REQUEST);

  const handleAddressFormSubmit = async (formData: FormData) => {
    let addressValue;
    console.log("Form Data:");
    for (const [key, value] of formData.entries()) {
      addressValue = value;
    }
    console.log("address: ", addressValue);

    const result = await approveRequest({
      variables: {
        bookRequestId,
        deliverTo: addressValue,
        otp: bookData?.getBookRequest?.otp,
      },
    });

    if (!result) toast.error("Failed to approve request");
    else {
      toast.success("Request approved! Please verify your otp.");
      router.refresh();
    }
  };

  const handleOTPSubmit = async (otp: String) => {
    const result = await confirmRequest({
      variables: {
        bookRequestId,
        otp,
      },
    });

    if (!result) toast.error("Failed to place order");
    else {
      toast.success("Order placed!");
      router.refresh();
    }
  };

  if (loadingBook)
    return (
      <div className="flex min-h-[90vh] items-center justify-center gap-2 text-[#5D4037]">
        <IconLoader3 className="animate-spin" size={24} />
        <span>Loading book details...</span>
      </div>
    );

  if (!user)
    return (
      <div className="flex min-h-[90vh] items-center justify-center text-[#5D4037]">
        <span>Access denied. Please </span>
        <span className="font-bold text-[#D62828]">
          <Link href="/signin"> sign in </Link>
        </span>{" "}
        <span>to continue.</span>
      </div>
    );

  const renderContent = () => {
    const status = bookData?.getBookRequest?.status;

    switch (status) {
      case "PENDING":
        return <AddressForm onFormSubmit={handleAddressFormSubmit} />;
      case "APPROVED":
        return isUserBuyer ? (
          <OTPInput onOTPSubmit={handleOTPSubmit} />
        ) : (
          <AddressForm onFormSubmit={handleAddressFormSubmit} />
        );
      case "ONGOING":
        return (
          <div className="p-4 text-lg text-[#5D4037] bg-[#FDF6EC] rounded-lg shadow-md">
            {isUserBuyer
              ? "Your order has been successfully placed and will be delivered soon."
              : "This book has already been sold."}
          </div>
        );
      case "COMPLETED":
        return (
          <div className="flex min-h-screen justify-center items-center">
            This book has been bought already by someone.
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center md:px-10 p-20">
      <h1 className="text-3xl text-[#5D4037] mb-6 font-bold">
        Confirm Your Order
      </h1>
      <div className="flex flex-col items-start md:flex-row gap-8 w-full max-w-6xl">
        {/* Left Content Section */}
        <div className="flex-1 flex items-center justify-center">
          {renderContent()}
        </div>

        {/* Book Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-[#5D4037] border border-gray-200 w-full md:w-3/5">
          <h2 className="text-2xl font-bold">
            {bookData?.getBookRequest?.title}
          </h2>
          {bookData?.getBookRequest?.media?.[0] && (
            <img
              src={bookData.getBookRequest.media[0]}
              alt={bookData.getBookRequest.title}
              className="w-full max-h-80 object-cover rounded-lg mt-4 border border-[#5D4037]"
            />
          )}
          <h3 className="text-lg font-semibold mt-4">
            Author: {bookData?.getBookRequest?.author}
          </h3>

          <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold shadow-sm mt-2">
            ₹{bookData?.getBookRequest?.price}
          </div>

          <p className="mt-4 text-gray-700 leading-relaxed">
            {bookData?.getBookRequest?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

const AddressForm = ({
  onFormSubmit,
}: {
  onFormSubmit: (formData: FormData) => void;
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onFormSubmit(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 w-full">
      <h1 className="text-xl font-bold text-[#5D4037] mb-4">
        Enter Shipping Details
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          name="address"
          className="border border-[#5D4037] focus:ring-[#D62828] focus:border-[#D62828]"
          placeholder="Your Address"
        />
        <p className="text-sm text-gray-600">
          * Payment is currently available via <strong>Cash on Delivery</strong>{" "}
          only.
        </p>
        <Button
          type="submit"
          className="bg-[#D62828] hover:bg-[#A61B1B] text-white font-bold py-2 px-4 rounded-lg"
        >
          Place Order
        </Button>
      </form>
    </div>
  );
};
