import { Box, Container } from "@chakra-ui/react";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import { ChatPage } from "./pages/ChatPage";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <Box position={"relative"}>
      <Container maxW={640}>
        <Header />
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />

          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
