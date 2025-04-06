"use client";

import { useQuery } from "@apollo/client";
import { useEffect, useState, useRef } from "react";
import RoomSubscription from "./RoomSubscription";
import { GQLQueries } from "@/graphql";

const ChatListener = ({ onNewMessage }: { onNewMessage: (message: any) => void }) => {
  const [roomIds, setRoomIds] = useState<string[]>([]);
  const activeRoomSubscriptions = useRef(new Set<string>());

  const { data, loading, error } = useQuery(GQLQueries.GET_USER_ROOM_IDS, {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-only", // prevent re-fetching unless you manually trigger
  });
  
  useEffect(() => {
    console.log("Fetched Room IDs:", data?.getUserRoomIds);
  }, [data]);

  useEffect(() => {
    if (data?.getUserRoomIds) {
      const fetchedIds: string[] = data.getUserRoomIds.map((room: any) => room.roomId);

      // Filter out rooms already subscribed to
      const newRoomIds = fetchedIds.filter(id => !activeRoomSubscriptions.current.has(id));
      if (newRoomIds.length > 0) {
        // Update active subscriptions
        newRoomIds.forEach(id => activeRoomSubscriptions.current.add(id));
        // Append to state to trigger re-render
        setRoomIds(prev => [...prev, ...newRoomIds]);
      }
    }
  }, [data]);

  if (loading) return null;
  if (error) {
    console.error("Error fetching user room IDs:", error);
    return null;
  }

  return (
    <>
      {roomIds.map((roomId) => (
        <RoomSubscription
          key={roomId}
          roomId={roomId}
          onNewMessage={onNewMessage}
        />
      ))}
    </>
  );
};

export default ChatListener;
