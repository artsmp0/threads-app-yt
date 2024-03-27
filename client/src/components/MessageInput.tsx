import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactEventHandler, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedConversationAtom, conversationsAtom } from "../atoms/messagesAtom";
import useShowToast from "../hooks/useShowToast";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

export const MessageInput = ({ setMessages }: { setMessages: any }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const { fileRef, handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { onClose } = useDisclosure();
  const [isSending, setIsSending] = useState(false);
  const handleSendMessage: ReactEventHandler = async (e) => {
    try {
      e.preventDefault();
      if (!messageText && !imgUrl) return;
      if (isSending) return;
      setIsSending(true);
      const res = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({ message: messageText, recipientId: selectedConversation.userId, img: imgUrl }),
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
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
      setImgUrl("");
      if (data.error) return showToast({ description: data.error, status: "error" });
    } catch (error: any) {
      showToast({ description: error.message, status: "error" });
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input w={"full"} placeholder="Type a message" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => fileRef.current?.click()} />
        <Input type={"file"} hidden ref={fileRef} onChange={handleImageChange} />
      </Flex>
      <Modal
        isOpen={!!imgUrl}
        onClose={() => {
          onClose();
          setImgUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgUrl ?? ""} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} /> : <Spinner size={"md"} />}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
