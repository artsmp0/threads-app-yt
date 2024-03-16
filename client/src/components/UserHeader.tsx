import { Avatar, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";

function UserHeader() {
  const toast = useToast();
  const copyLink = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({ description: "Copied!", position: "top-right", status: "success" });
    });
  };
  return (
    <VStack align={"start"} gap={4}>
      <Flex justify={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            Mark Zuckberg
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"small"}>markzuckberg</Text>
            <Text fontSize={"small"} bg={"gray.dark"} color={"gray.light"} px={2} rounded={"full"}>
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar name="Mark Zuckberg" src="/zuck-avatar.png" size={{ base: "md", md: "xl" }} />
        </Box>
      </Flex>
      <Text>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus</Text>
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text>3.2k followers</Text>
          <Box w={"1"} h="1" bg="gray.light" borderRadius={"full"}></Box>
          <Link color="gray.light" to={"/"}>
            instagram.com
          </Link>
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
