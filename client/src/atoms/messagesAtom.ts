import { atom } from "recoil";

export const conversationsAtom = atom<any[]>({
  key: "conversationsAtom",
  default: [],
});
