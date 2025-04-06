import { GQLSubscriptions } from "@/graphql";
import { useSubscription } from "@apollo/client";
import { useEffect } from "react";

export const useNewMessageSubscription = (
  roomId: string,
  onMessageReceived: (message: any) => void
) => {
  const { data, error } = useSubscription(
    GQLSubscriptions.NEW_MESSAGE_SUBSCRIPTION,
    {
      variables: { roomId },
      skip: !roomId,
    }
  );

  useEffect(() => {
    console.log("subscriptiondata:", data, roomId);
  }, [data]);

  useEffect(() => {
    if (data?.newMessage) {
      onMessageReceived(data);
    }
  }, [data?.newMessage]);

  if (error) console.error(`❌ Subscription error in room ${roomId}:`, error);
};
