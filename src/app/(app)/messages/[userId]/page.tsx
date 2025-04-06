"use client";

import AvatarComp from "@/components/AvatarComp";
import { GQLQueries } from "@/graphql";
import { useUserStore } from "@/store/useUserStore";
import { useQuery } from "@apollo/client";
import { IconError404, IconLoader3, IconMessage } from "@tabler/icons-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";

const MessagesPage = () => {
  const user = useUserStore((state) => state.user);

  const {
    loading,
    error,
    data: queryData,
  } = useQuery(GQLQueries.GET_USER_MESSAGES, {
    variables: { userId: user?.id },
  });

  const userRooms = useMemo(() => {
    if (!queryData?.getUserMessages) return [];

    return queryData.getUserMessages.map((room: any) => {
      const messages = room.messages;
      const lastMessage = messages[0];

      const otherUser =
        lastMessage.sender.id === user?.id
          ? lastMessage.receiver
          : lastMessage.sender;

      return {
        roomId: room.roomId,
        lastMessage: lastMessage.content,
        timestamp: Number(lastMessage.timestamp),
        otherUser,
      };
    });
  }, [queryData, user?.id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-center text-lg text-gray-700">
        <IconError404 size={40} />
        <p className="ml-2">User not authorised.</p>
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center gap-2 text-gray-600 text-lg">
        <IconLoader3 className="animate-spin" />
        Loading messages...
      </div>
    );

  if (error)
    return (
      <div className="min-h-[80vh] flex items-center justify-center gap-2 text-red-600 text-lg">
        Error loading messages.
      </div>
    );

  return (
    <div className="py-20 max-w-2xl mx-auto min-h-[80vh] px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Chats</h1>
      <div className="flex flex-col gap-4">
        {userRooms.map((chat: any) => (
          <Link
            key={chat.roomId}
            href={`/chat/${chat.roomId}`}
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200"
            target="_blank"
          >
            <AvatarComp
              data={{
                avatar: chat.otherUser.avatar,
                firstName: chat.otherUser.firstName,
                lastName: chat.otherUser.lastName,
              }}
              className="w-14 h-14"
            />
            <div className="flex-1 overflow-hidden">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {chat.otherUser.firstName}
                </p>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-700 truncate flex items-center gap-1 mt-1">
                <IconMessage size={16} className="text-gray-500" />
                {chat.lastMessage}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;
