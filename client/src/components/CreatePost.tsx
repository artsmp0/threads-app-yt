import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import postsAtom from "../atoms/postsAtom";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const handleTextChange = (e: any) => {
    const inputText: string = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  const user = useRecoilValue(userAtom);
  const { fileRef, handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: postText,
          img: imgUrl,
          postedBy: user?._id,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast({ status: "error", description: data.error });
      }
      showToast({ status: "success", description: "Post created successfully!" });
      if (username === user?.username) {
        setPosts([data, ...posts]);
      }
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error: any) {
      console.log("error: ", error);
      showToast({ status: "error", description: error });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalBody pb={6}>
            <FormControl>
              <Textarea value={postText} onChange={handleTextChange} placeholder="Post content goes here..." />
              <Text fontSize="xs" fontWeight="bold" textAlign={"right"} m={"1"} color={"gray.800"}>
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
              <BsFillImageFill style={{ marginLeft: "5px", cursor: "pointer" }} size={16} onClick={() => fileRef.current?.click()} />
            </FormControl>
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreatePost;
