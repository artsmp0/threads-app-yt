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

export interface Post {
  _id: string;
  text: string;
  img?: string;
  likes: number[];
  createdAt: string;
  replies: {
    userId: string;
    text: string;
    userProfilePic: string;
    username: string;
  }[];
}
