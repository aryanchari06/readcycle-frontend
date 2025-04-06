import { gql } from "@apollo/client";

const GET_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      firstName
    }
  }
`;

const GET_USER_TOKEN = gql`
  query Query($email: String!, $password: String!) {
    getUserToken(email: $email, password: $password)
  }
`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      firstName
      lastName
      email
      avatar
      bookrequests {
        allowMessages
        genre
        id
        media
        status
        title
        author
      }
    }
  }
`;

const GET_BOOK_REQUEST = gql`
  query GetBookRequest($bookRequestId: String!) {
    getBookRequest(bookRequestId: $bookRequestId) {
      id
      title
      author
      description
      owner {
        avatar
        email
        firstName
        id
        lastName
      }
      media
      status
      genre
      createdAt
      buyer {
        avatar
        email
        firstName
        id
        lastName
      }
      buyerId
      allowMessages
      otp
      deliverTo
      price
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      firstName
      id
      lastName
      avatar
      email
      createdAt
      bookrequests {
        author
        media
        id
        genre
        title
        description
      }
    }
  }
`;

const GET_ALL_BOOK_REQUESTS = gql`
  query GetAllBookRequests {
    getAllBookRequests {
      author
      genre
      id
      media
      owner {
        avatar
        firstName
        lastName
        id
      }
      title
      status
      price
    }
  }
`;

const VIEW_WISHLIST = gql`
  query ViewWishlist {
    viewWishlist {
      title
      status
      owner {
        id
        lastName
        email
        firstName
        avatar
      }
      genre
      id
      media
    }
  }
`;

const GET_USER_MESSAGES = gql`
  query GetUserMessages($userId: String!) {
    getUserMessages(userId: $userId) {
      messages {
        id
        sender {
          avatar
          email
          firstName
          id
          lastName
        }
        receiver {
          avatar
          email
          firstName
          id
          lastName
        }
        content
        timestamp
        isRead
        roomId
        senderId
        recieverId
      }
      roomId
    }
  }
`;

const GET_USER_ROOM_IDS = gql`
  query GetUserRoomIds {
    getUserRoomIds {
      roomId
    }
  }
`;

const GET_ROOM_MESSAGES = gql`
  query GetRoomMessages($roomId: String!, $page: Int!) {
    getRoomMessages(roomId: $roomId, page: $page) {
      id
      sender {
        firstName
        email
        id
        avatar
      }
      receiver {
        firstName
        email
        id
        avatar
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

export const GQLQueries = {
  GET_USERS,
  GET_USER_TOKEN,
  GET_CURRENT_USER,
  GET_BOOK_REQUEST,
  GET_USER_BY_ID,
  GET_ALL_BOOK_REQUESTS,
  VIEW_WISHLIST,
  GET_USER_MESSAGES,
  GET_USER_ROOM_IDS,
  GET_ROOM_MESSAGES,
};
