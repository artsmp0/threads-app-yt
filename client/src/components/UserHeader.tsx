import { Avatar, Box, Button, Flex, Menu, MenuButton, Link, MenuItem, MenuList, Portal, Text, VStack, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { User } from "../types";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

function UserHeader({ user }: { user: User | undefined }) {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const copyLink = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({ description: "Copied!", position: "top-right", status: "success" });
    });
  };

  const [following, setFollowing] = useState(user?.followers.includes(currentUser?._id ?? ""));
  const [updating, setUpdating] = useState(false);
  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast({ description: "Please login to follow", status: "error" });
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast({ description: data.error, status: "error" });
        return;
      }
      if (following) {
        showToast({ description: `Unfollowed ${user?.name} successfully`, status: "success" });
        user?.followers.pop();
      } else {
        showToast({ description: `Followed ${user?.name} successfully`, status: "success" });
        user?.followers.push(currentUser._id);
      }
      setFollowing(!following);
    } catch (error: any) {
      showToast({ description: error, status: "error" });
    } finally {
      setUpdating(false);
    }
  };
  return (
    <VStack align={"start"} gap={4}>
      <Flex justify={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"small"}> {user?.username}</Text>
            <Text fontSize={"small"} bg={"gray.dark"} color={"gray.light"} px={2} rounded={"full"}>
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePic && <Avatar name={user?.name} src={user?.profilePic} size={{ base: "md", md: "xl" }} />}
          {!user?.profilePic && (
            <Avatar
              name={user?.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user?.bio}</Text>
      {currentUser?._id === user?._id && (
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {currentUser?._id !== user?._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text>{user?.followers.length} followers</Text>
          <Box w={"1"} h="1" bg="gray.light" borderRadius={"full"}></Box>
          <Link color="gray.light">instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor="pointer" />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor="pointer" />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyLink}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
          <Text fontWeight={"bold"}> Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"}>
          <Text fontWeight={"bold"}> Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
}

export default UserHeader;
