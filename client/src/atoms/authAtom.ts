import { atom } from "recoil";

const authScreenAtom = atom<"login" | "signup">({
  key: "authScreenAtom",
  default: "login",
});

export default authScreenAtom;
