import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { IPost } from "../types";

const HomePage = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/feed`);
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
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [showToast]);
  return (
    <>
      {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}
      {loading && (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;
