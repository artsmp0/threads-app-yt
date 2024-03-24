declare interface IUser {
  name: string;
  username: string;
  email: string;
  profilePic: string;
  password?: string;
  bio: string;
  followers: string[];
  following: string[];
}
