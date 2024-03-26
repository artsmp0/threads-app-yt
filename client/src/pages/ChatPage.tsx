import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { GiConversation } from "react-icons/gi";
import { Conversation } from "../components/Conversation";
import { MessageContainer } from "../components/MessageContainer";
import { ReactEventHandler, useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { IConversation } from "../types";

export const ChatPage = () => {
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [searchText, setSearchText] = useState("");
  const showToast = useShowToast();
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) showToast({ description: data.error, status: "error" });
        console.log(data);
        setConversations(data);
      } catch (error: any) {
        showToast({ description: error.message, status: "error" });
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, []);

  const handleConversationSearch: ReactEventHandler = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast({ description: searchedUser.error, status: "error" });
        return;
      }
      const messagingYourself = searchedUser._id === currentUser?._id;
      if (messagingYourself) {
        showToast({ description: "You cannot message yourself", status: "error" });
        return;
      }

      const conversationAlreadyExists = conversations.find((conversation) => conversation.participants[0]._id === searchedUser._id);

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation: IConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now().toString(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConversation) => [...prevConversation, mockConversation]);
    } catch (error: any) {
      showToast({ description: error.message, status: "error" });
    } finally {
      setSearchingUser(false);
    }
  };
  return (
    <Box position={"absolute"} left={"50%"} transform={"translateX(-50%)"} w={{ base: "100%", md: "80%", lg: "750px" }} p={4}>
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search for a user" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {!loadingConversations &&
            conversations.map((conversation) => <Conversation key={conversation._id} conversation={conversation} />)}
        </Flex>
        {!selectedConversation?._id ? (
          <Flex flex={70} borderRadius={"md"} p={2} flexDir={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        ) : (
          <MessageContainer />
        )}
      </Flex>
    </Box>
  );
};
