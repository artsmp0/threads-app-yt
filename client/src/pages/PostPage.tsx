import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Commnet";
import { useGetUserProfile } from "../hooks/useGetUserProfile";
import { IPost } from "../types";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";

function PostPage() {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState<IPost | null>(null);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast({ description: data.error, status: "error" });
          return;
        }
        console.log(data);
        setPost(data);
      } catch (error: any) {
        showToast({ description: error.message, status: "error" });
      }
    };
    getPost();
  }, [showToast, pid]);
  const handleDeletePost = async (e: any) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast({ description: data.error, status: "error" });
        return;
      }
      showToast({ description: "Post deleted", status: "success" });
      navigate(`/${user?.username}`);
    } catch (error: any) {
      showToast({ description: error.message, status: "error" });
    }
  };
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!post) return null;
  return (
    <>
      <Flex>
        <Flex justifyContent={"space-between"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.name} />
          <Flex align={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex flex={1} gap={4} alignItems={"center"} justifyContent={"end"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {formatDistanceToNow(post.createdAt)} ago
          </Text>
          {currentUser?._id === user?._id && <DeleteIcon onClick={handleDeletePost} />}
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>{post.text}</Text>

      <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
        <Image src={post.img} w={"full"} />
      </Box>

      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {post.replies.map((reply) => (
        <Comment key={reply._id} reply={reply} lastReply={reply._id === post.replies[post.replies.length - 1]._id} />
      ))}
    </>
  );
}

export default PostPage;
