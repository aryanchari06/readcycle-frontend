"use client";

import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { ShoppingBagIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export function AnimatedModal({
  className,
  sellerId,
  bookId
}: {
  className?: string;
  sellerId: string;
  bookId:string
}) {
  const user = useUserStore((state) => state.user);
  const sorted_ids = [user?.id, sellerId].sort();
  const roomId = sorted_ids[0] + "_" + sorted_ids[1];
  return (
    <div className="flex items-center justify-center">
      <Modal>
        {/* Buy Now Button */}
        <ModalTrigger
          className={`relative px-6 py-3 text-md min-w-[160px] h-12  text-white rounded-lg overflow-hidden flex items-center justify-center gap-2 group transition-all duration-500 active:scale-95 shadow-md  ${className}`}
        >
          <span className="absolute left-1/2 -translate-x-1/2 transition-transform duration-500 group-hover:translate-x-30">
            Buy Now
          </span>
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 transform -translate-x-30 group-hover:translate-x-0">
            <ShoppingBagIcon className="w-5 h-5" />
          </div>
        </ModalTrigger>

        {/* Modal Content */}
        <ModalBody>
          <ModalContent className="text-center bg-[#FDF6EC] text-[#5D4037] p-6 rounded-xl shadow-2xl border border-[#E0C2A2] w-full ">
            <h4 className="text-lg md:text-2xl font-semibold">
              Contact the seller before making a purchase?
            </h4>

            <p className="mt-4 text-[#5D4037] text-sm leading-relaxed">
              Messaging the seller allows you to{" "}
              <span className="font-bold">
                negotiate pricing, ask about the book's condition, and confirm
                availability
              </span>{" "}
              before purchasing.
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
              {/* Continue to Buy */}
              <Link href={`/purchase-book/${bookId}`} className="px-5 py-2.5 bg-white text-[#5D4037] border border-[#5D4037] rounded-lg text-sm font-medium transition-all hover:bg-[#F5E5D5] hover:border-[#6D4C41] active:scale-95 shadow-sm">
                Continue to Buy
              </Link>

              {/* Message Seller */}
              <Link
              target="_blank"
                href={`/chat/${roomId}`}
                className="px-5 py-2.5 bg-[#5D4037] text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:bg-[#6D4C41] active:scale-95 shadow-md border border-[#4E342E]"
              >
                <MessageCircleIcon className="w-4 h-4" />
                Message Seller
              </Link>
            </div>
          </ModalContent>
        </ModalBody>
      </Modal>
    </div>
  );
}
