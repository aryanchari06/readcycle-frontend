"use client";
import ChatListener from "@/components/ChatListener";
import { useUserStore } from "@/store/useUserStore";
import toast from "react-hot-toast";

const ChatListenerWrapper = () => {
  const user = useUserStore((state) => state.user);
  const handleNewMessage = (message: any) => {
    console.log("New message received (from wrapper):", message);
    if (message.newMessage.senderId !== user?.id) {
      toast(`New message from ${message.newMessage.sender.firstName}`);
    }
  };

  return <ChatListener onNewMessage={handleNewMessage} />;
};

export default ChatListenerWrapper;
