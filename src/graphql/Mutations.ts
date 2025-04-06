import { gql } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    )
  }
`;

const VERIFY_USER = gql`
  mutation VerifyUser($email: String!, $verifyCode: String!) {
    verifyUser(email: $email, verifyCode: $verifyCode)
  }
`;

const MAKE_BOOK_REQUEST = gql`
  mutation CreateBookRequest(
    $title: String!
    $author: String!
    $media: [String!]!
    $genre: String!
    $price: Int!
    $description: String
  ) {
    createBookRequest(
      title: $title
      author: $author
      media: $media
      genre: $genre
      price: $price
      description: $description
    )
  }
`;

const SIGN_OUT = gql`
  mutation Mutation {
    signOut
  }
`;

const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($bookRequestId: String!) {
    addToWishlist(bookRequestId: $bookRequestId)
  }
`;

const UPDATE_AVATAR = gql`
  mutation UpdateUserAvatar($imgUrl: String!) {
    updateUserAvatar(imgUrl: $imgUrl)
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage(
    $content: String!
    $senderId: String!
    $receiverId: String!
    $roomId: String!
  ) {
    sendMessage(
      content: $content
      senderId: $senderId
      receiverId: $receiverId
      roomId: $roomId
    ) {
      id
      sender {
        id
        firstName
        lastName
        email
        createdAt
      }
      receiver {
        id
        firstName
        lastName
        email
        createdAt
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

const APPROVE_BOOK_REQUEST = gql`
  mutation ApproveBookRequest(
    $bookRequestId: String!
    $deliverTo: String!
    $otp: String!
  ) {
    approveBookRequest(
      bookRequestId: $bookRequestId
      deliverTo: $deliverTo
      otp: $otp
    )
  }
`;

const CONFIRM_BOOK_REQUEST = gql`
  mutation ConfirmBookRequest($bookRequestId: String!, $otp: String!) {
    confirmBookRequest(bookRequestId: $bookRequestId, otp: $otp)
  }
`;

const COMPLETE_BOOK_REQUEST = gql`
  mutation CompleteDelivery($bookRequestId: String!) {
    completeDelivery(bookRequestId: $bookRequestId)
  }
`;

export const GQLMutations = {
  CREATE_USER,
  VERIFY_USER,
  MAKE_BOOK_REQUEST,
  SIGN_OUT,
  ADD_TO_WISHLIST,
  UPDATE_AVATAR,
  SEND_MESSAGE,
  APPROVE_BOOK_REQUEST,
  CONFIRM_BOOK_REQUEST,
  COMPLETE_BOOK_REQUEST
};
