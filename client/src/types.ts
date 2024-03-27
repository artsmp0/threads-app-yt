export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic: string;
  password?: string;
  bio: string;
  followers: string[];
  following: string[];
}

export interface IPost {
  _id: string;
  text: string;
  img?: string;
  likes: string[];
  createdAt: string;
  postedBy: string;
  replies: {
    _id: string;
    userId: string;
    text: string;
    userProfilePic: string;
    username: string;
  }[];
}

export interface IConversation {
  _id: string;
  participants: { profilePic: string; username: string; _id: string }[];
  lastMessage: {
    text: string;
    sender: string;
    seen: boolean;
  };
  mock?: boolean;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  seen: boolean;
  img: string;
}

export interface ISelectedConversation {
  _id: string;
  userId: string;
  userProfilePic: string;
  username: string;
  mock?: boolean;
}
