import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { IMessage } from "../types";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

export const Message = ({ ownMessage, message }: { ownMessage: boolean; message: IMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message.text && (
            <Flex bg={"green.800"} color={"white"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text>{message.text}</Text>
              <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} hidden onLoad={() => setImgLoaded(true)} alt="Message image" borderRadius={4} />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"} position={"relative"} borderRadius={4} pl={2} pr={4} py={2} bg={"green.800"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
              <Box alignSelf={"flex-end"} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />

          {message.text && (
            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
              {message.text}
            </Text>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} hidden onLoad={() => setImgLoaded(true)} alt="Message image" borderRadius={4} />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};
