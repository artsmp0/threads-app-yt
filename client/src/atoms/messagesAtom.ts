import { atom } from "recoil";
import { IConversation, ISelectedConversation } from "../types";

export const conversationsAtom = atom<IConversation[]>({
  key: "conversationsAtom",
  default: [],
});

export const selectedConversationAtom = atom<ISelectedConversation>({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
});
