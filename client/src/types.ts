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
