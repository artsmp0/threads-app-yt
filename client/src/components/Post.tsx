import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { IPost, User } from "../types";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

interface PostProps {
  post: IPost;
  postedBy: string;
}

const Post = ({ post, postedBy }: PostProps) => {
  const [user, setUser] = useState<User>();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast({ status: "error", description: data.error });
        }
        setUser(data);
      } catch (error: any) {
        showToast({ status: "error", description: error });
        setUser(undefined);
      }
    };
    getUser();
  }, [postedBy, showToast]);
  const handleDeletePost = async (e: any) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast({ description: data.error, status: "error" });
        return;
      }
      showToast({ description: "Post deleted", status: "success" });
    } catch (error: any) {
      showToast({ description: error.message, status: "error" });
    }
  };
  if (!user) return null;
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name={user.name} src={user.profilePic} />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex align={"center"} justifyContent={"space-between"} w={"full"}>
            <Flex alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.name}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"xs"} color={"gray.light"}>
                {formatDistanceToNow(post.createdAt)} ago
              </Text>
              {currentUser?._id === user._id && <DeleteIcon onClick={handleDeletePost} />}
              <BsThreeDots />
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
