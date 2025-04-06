"use client";

import { GQLMutations, GQLQueries } from "@/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AvatarComp from "@/components/AvatarComp";
import { useUserStore } from "@/store/useUserStore";
import FileUploader from "@/components/FileUploader";

const UserProfilePage = () => {
  const { userId } = useParams();
  const user = useUserStore((state) => state.user);
  const sortedUserIds = [userId, user?.id].sort();

  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    const roomId = `${sortedUserIds[0]}_${sortedUserIds[1]}`;
    setRoomId(roomId);
  }, [user]);

  useEffect(() => {
    console.log(roomId);
  }, [roomId]);

  const { loading, error, data } = useQuery(GQLQueries.GET_USER_BY_ID, {
    variables: { userId },
    skip: !userId,
  });
  const [updateAvatar] = useMutation(GQLMutations.UPDATE_AVATAR);

  const handleAvatarUpdate = async (response: string) => {
    console.log("response", response);
    if (response) {
      const result = await updateAvatar({
        variables: {
          imgUrl: response,
        },
      });
      console.log(result);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">
          Error loading profile: {error.message}
        </p>
      </div>
    );

  const fetched_user = data?.getUserById;
  if (!fetched_user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">User not found.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-transparent rounded-lg my-10 min-h-screen">
      {/* User Info Section */}
      <div className="flex flex-col md:flex-row items-center justify-center  gap-8 ">
        <div className="h-20 w-20">
          <AvatarComp
            data={{
              firstName: fetched_user.firstName,
              lastName: fetched_user.lastName,
              avatar: fetched_user.avatar,
            }}
            className="h-20 w-20"
          />
        </div>

        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#5D4037]">
            {fetched_user.firstName} {fetched_user.lastName}
          </h1>
          <p className="text-gray-600 text-sm">{fetched_user.email}</p>
          {userId !== user?.id ? (
            <Link
              href={`/chat/${roomId}`}
              className="inline-block bg-[#5D4037] hover:bg-[#4F3A2F] text-white px-4 py-2 rounded-md mt-3 transition"
              target="_blank"
            >
              Message
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>

      {userId === user?.id ? (
        <div>
          <h2 className="text-2xl font-semibold mt-4 text-[#5D4037]">
            Update Avatar
          </h2>
          <FileUploader
            onUpload={(response) => {
              console.log("response onupload: ", response);
              handleAvatarUpdate(response);
            }}
            className="border-none "
          />
        </div>
      ) : (
        <></>
      )}

      {/* Listed Books */}
      <h2 className="text-2xl font-semibold mt-8 text-[#5D4037]">
        Listed Books
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {fetched_user.bookrequests?.length > 0 ? (
          fetched_user.bookrequests.map((book: any) => (
            <Link
              href={`/view-book/${book.id}`}
              key={book.id}
              className="p-4 border rounded-lg shadow-sm bg-[#fff7ee]"
            >
              <img
                src={book.media[0] || "/default-book.png"}
                alt={book.title}
                width={150}
                height={200}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="mt-2 text-lg font-semibold text-[#D62828]">
                {book.title}
              </h3>
              <p className="text-gray-700">{book.genre}</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No books listed yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
