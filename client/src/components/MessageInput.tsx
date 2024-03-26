import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { MouseEventHandler, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedConversationAtom, conversationsAtom } from "../atoms/messagesAtom";
import useShowToast from "../hooks/useShowToast";

export const MessageInput = ({ setMessages }: { setMessages: any }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  const handleSendMessage: MouseEventHandler = async (e) => {
    e.preventDefault();
    if (!messageText) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ message: messageText, recipientId: selectedConversation.userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setMessages((prev: any) => [...prev, data]);
    setConversations((prevConversation) => {
      const updatedConversations = prevConversation.map((conversation) => {
        if (conversation._id === selectedConversation._id) {
          return {
            ...conversation,
            lastMessage: {
              text: messageText,
              sender: data.sender,
            },
          };
        }
        return conversation;
      });
      return updatedConversations;
    });
    setMessageText("");
    if (data.error) return showToast({ description: data.error, status: "error" });
  };
  return (
    <form>
      <InputGroup>
        <Input w={"full"} placeholder="Type a message" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};
