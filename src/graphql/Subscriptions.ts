import { gql } from "@apollo/client";

const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription NewMessage($roomId: String!) {
    newMessage(roomId: $roomId) {
      id
      sender {
        firstName
        id
        avatar
        email
      }
      content
      timestamp
      isRead
      roomId
      senderId
      recieverId
    }
  }
`;

export const GQLSubscriptions = { NEW_MESSAGE_SUBSCRIPTION };
