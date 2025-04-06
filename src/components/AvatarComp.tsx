"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AvatarComp = ({
  data,
  className,
}: {
  data: { firstName?: string; lastName?: string; avatar?: string };
  className?: string;
}) => {
  const avatarFallback = `${
    (data?.firstName?.[0]?.toUpperCase() || "?") +
    (data?.lastName?.[0]?.toUpperCase() || "?")
  }`;

  return (
    <div>
      <Avatar
        className={`bg-[#5C4033]  duration-300 transition-opacity ${className}`}
      >
        <AvatarImage
          src={data?.avatar || ""}
          alt="User avatar"
          className="object-cover"
        />
        <AvatarFallback className="text-[#FFEDD5] bg-[#3d2512]">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarComp;
