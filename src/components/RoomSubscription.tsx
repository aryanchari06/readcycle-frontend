"use client";

import { useNewMessageSubscription } from "@/hooks/userNewMessageSubscription";

const RoomSubscription = ({
  roomId,
  onNewMessage,
}: {
  roomId: string;
  onNewMessage: (message: any) => void;
}) => {
  useNewMessageSubscription(roomId, onNewMessage);

  return null;
};

export default RoomSubscription;
