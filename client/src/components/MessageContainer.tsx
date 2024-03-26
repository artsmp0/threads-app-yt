import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import userAtom from "../atoms/userAtom";
import { IMessage } from "../types";
export const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation] = useRecoilState(selectedConversationAtom);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const currentUser = useRecoilValue(userAtom);
  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoadingMsgs(true);
        if (selectedConversation?.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation?.userId}`);
        const data = await res.json();
        if (data.error) return showToast({ description: data.error, status: "error" });
        setMessages(data);
      } catch (error: any) {
        showToast({ description: error.message, status: "error" });
      } finally {
        setLoadingMsgs(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation?.userId]);
  return (
    <Flex flex="70" bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={"md"} p={2} flexDirection={"column"}>
      {/* Message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation?.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation?.username} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
        {loadingMsgs &&
          [...Array(5)].map((_, i) => (
            <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"} alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}>
              {i % 2 === 0 && <SkeletonCircle size={"7"} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={"7"} />}
            </Flex>
          ))}
        {messages.map((message) => (
          <Message key={message._id} message={message} ownMessage={currentUser?._id === message.sender} />
        ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};
