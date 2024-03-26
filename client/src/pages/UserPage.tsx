import { useParams } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { IPost } from "../types";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useGetUserProfile } from "../hooks/useGetUserProfile";

function UserPage() {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  useEffect(() => {
    const getFeedPosts = async () => {
      if (fetchingPosts) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast({ status: "error", description: data.error });
        }
        setPosts(data);
        console.log("data: ", data);
      } catch (error: any) {
        console.log("error: ", error);
        showToast({ status: "error", description: error });
      } finally {
        setFetchingPosts(false);
      }
    };
    getFeedPosts();
  }, [username, showToast]);

  if (!user && !loading) return <h1>User not found</h1>;

  if (!user && loading)
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
}

export default UserPage;
