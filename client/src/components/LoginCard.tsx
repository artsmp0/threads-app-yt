"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast({
          description: data.error,
          status: "error",
        });
        return;
      }
      console.log(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error: any) {
      showToast({
        description: error,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleLogin}>
      <Flex align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Login
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.dark")}
            boxShadow={"lg"}
            p={8}
            w={{
              base: "full",
              sm: "400px",
            }}
          >
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>User Name</FormLabel>
                <Input
                  type="text"
                  value={inputs.username}
                  onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={inputs.password}
                    onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={() => setShowPassword((showPassword) => !showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                  onClick={handleLogin}
                  loadingText="Logging in"
                  isLoading={loading}
                  type="submit"
                >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Don&apos;t have an account?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => {
                      setAuthScreen("signup");
                    }}
                  >
                    Sign up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}
