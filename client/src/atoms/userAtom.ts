import { atom } from "recoil";

const userAtom = atom<{
  bio: string;
  email: string;
  name: string;
  password: string;
  profilePic: string;
  username: string;
} | null>({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user-threads")!),
});

export default userAtom;
