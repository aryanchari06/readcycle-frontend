"use client";

import AvatarComp from "@/components/AvatarComp";
import { GQLMutations, GQLQueries } from "@/graphql";
import { useUserStore } from "@/store/useUserStore";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { IconLoader3 } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { roomId } = useParams();
  const currentUser = useUserStore((state) => state.user);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [chatPagination, setChatPagination] = useState(1);

  //@ts-ignore
  const [userId1, userId2] = roomId?.split("_") || [];
  const currentUserId = currentUser?.id;
  const recipientId = userId1 === currentUserId ? userId2 : userId1;

  const [sendMessage, { loading: messageSending }] = useMutation(
    GQLMutations.SEND_MESSAGE
  );

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
      const response = await sendMessage({
        variables: {
          roomId,
          content: messageInput,
          senderId: currentUser?.id,
          receiverId: recipientId,
        },
      });
      setMessages((prev) => [...prev, response.data.sendMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const { loading, data } = useQuery(GQLQueries.GET_USER_BY_ID, {
    variables: { userId: recipientId },
    skip: !recipientId,
  });

  const [loadMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GQLQueries.GET_ROOM_MESSAGES);

  const loadMoreMessages = async () => {
    const nextPage = chatPagination + 1;
    setChatPagination(nextPage);
    const res = await loadMessages({ variables: { roomId, page: nextPage } });

    const newMsgs = res.data.getRoomMessages;
    if (!newMsgs || newMsgs.length === 0) {
      toast("No more messages to load");
      return;
    }

    setMessages((prev) => [...newMsgs, ...prev]);
  };

  useEffect(() => {
    const getRoomMessages = async () => {
      const result = await loadMessages({
        variables: { roomId, page: chatPagination },
      });
      if (result.data?.getRoomMessages) {
        setMessages([...result.data.getRoomMessages].reverse());
      }
    };
    getRoomMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading || messagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-gray-600">
        <IconLoader3 className="animate-spin text-gray-500" size={32} />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-red-500 mt-10">User not found.</p>;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC]">
        <p className="text-lg text-[#4D4037] p-6 rounded-lg">
          You are unauthorized to send messages, please{" "}
          <span className="text-[#5D4037] font-bold hover:underline">
            <Link href="/signin">signin</Link>
          </span>{" "}
          to continue. Or check your internet connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#FDF6EC] text-gray-800 p-6">
      <div className="bg-white/60 backdrop-blur-lg max-w-4xl w-full shadow-md mb-8 rounded-xl p-8 min-h-[75vh] flex flex-col items-center">
        {/* Profile */}
        <div className="flex flex-col items-center space-y-1">
          <AvatarComp
            data={{
              firstName: data.getUserById.firstName,
              lastName: data.getUserById.lastName,
              avatar: data.getUserById.avatar,
            }}
            className="h-24 w-24 rounded-full shadow-lg"
          />
          <h1 className="text-3xl font-semibold text-gray-900 tracking-wide">
            {data.getUserById.firstName} {data.getUserById.lastName}
          </h1>
          <p className="text-gray-600 text-sm">{data.getUserById.email}</p>
        </div>

        {/* Chat */}
        <div className="w-full max-w-3xl bg-white rounded-xl p-5 mt-6 flex flex-col space-y-3 overflow-y-auto min-h-[300px] max-h-[400px] shadow-sm">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center">
              No messages yet. Start a conversation to discuss book details.
            </p>
          ) : (
            <>
              <button
                className="text-sm self-center text-[#5D4037] underline hover:opacity-80"
                onClick={loadMoreMessages}
              >
                Load more
              </button>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`px-4 py-2 rounded-xl max-w-xs w-fit ${
                    msg.sender.id === currentUser?.id
                      ? "bg-[#5D4037] text-white self-end shadow"
                      : "bg-gray-100 text-gray-800 self-start shadow"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center w-full max-w-3xl mt-6">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:shadow-xl outline-none transition-all duration-200"
            value={messageInput}
            onChange={(e) => setMessageInput(e.currentTarget.value)}
          />

          <button
            className="ml-3 bg-[#5D4037] text-white px-6 py-2 rounded shadow-md hover:bg-[#4F3A2F] transition-transform transform hover:scale-105 duration-200"
            onClick={handleSendMessage}
            disabled={messageSending}
          >
            {messageSending ? (
              <div className="flex items-center gap-1">
                <IconLoader3 className="animate-spin" />
                Sending...
              </div>
            ) : (
              "Send Message"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
