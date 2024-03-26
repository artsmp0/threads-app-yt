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
